/**
 * Suno Pure Audio Studio Capture - Web Portfolio Script
 * Interactive Experience: Scroll-Driven Parallax, 3D Card Tilt, 
 * Real-time Web Audio Synthesizer & Canvas/VU Meter Simulator
 */

(function () {
  'use strict';

  // =========================================================================
  // 1. Mouse Spotlight Glow & 3D Card Tilt Actions
  // =========================================================================
  const cursorGlow = document.getElementById('cursor-glow');

  window.addEventListener('mousemove', (e) => {
    if (cursorGlow) {
      cursorGlow.style.left = `${e.clientX}px`;
      cursorGlow.style.top = `${e.clientY}px`;
    }

    // Update CSS variables on 3D tilt cards for localized spotlight
    document.querySelectorAll('.feature-card, .studio-mockup-wrapper, .step-card, .download-master-card, .pro-card').forEach(card => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      card.style.setProperty('--mouse-x', `${x}px`);
      card.style.setProperty('--mouse-y', `${y}px`);
    });
  });

  // 3D Tilt Effect on Feature Cards and Mockup Window
  const tiltElements = document.querySelectorAll('.feature-card, .studio-mockup-wrapper, .step-card, .pro-card');
  tiltElements.forEach(el => {
    el.addEventListener('mousemove', (e) => {
      const rect = el.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;

      // Subtle tilt: max 6 degrees
      const rotateX = ((y - centerY) / centerY) * -6;
      const rotateY = ((x - centerX) / centerX) * 6;

      el.style.transform = `perspective(1000px) rotateX(${rotateX.toFixed(2)}deg) rotateY(${rotateY.toFixed(2)}deg) translateY(-4px)`;
    });

    el.addEventListener('mouseleave', () => {
      el.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateY(0)';
    });
  });

  // Magnetic Button Micro-Motion
  const magneticButtons = document.querySelectorAll('.btn-primary, .btn-secondary, .btn-download-mega, .nav-cta-btn');
  magneticButtons.forEach(btn => {
    btn.addEventListener('mousemove', (e) => {
      const rect = btn.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;
      btn.style.transform = `translate(${x * 0.15}px, ${y * 0.15}px) scale(1.02)`;
    });

    btn.addEventListener('mouseleave', () => {
      btn.style.transform = 'translate(0px, 0px) scale(1)';
    });
  });

  // =========================================================================
  // 2. Mouse Wheel & Scroll-Driven Interactions
  // =========================================================================
  const siteHeader = document.getElementById('site-header');
  const scrollProgressBar = document.getElementById('scroll-progress-bar');

  window.addEventListener('scroll', () => {
    const scrollY = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const scrollPercent = docHeight > 0 ? (scrollY / docHeight) * 100 : 0;

    // 1. Update Scroll Progress Bar
    if (scrollProgressBar) {
      scrollProgressBar.style.width = `${scrollPercent}%`;
    }

    // 2. Header Style on Scroll
    if (siteHeader) {
      if (scrollY > 40) {
        siteHeader.classList.add('scrolled');
      } else {
        siteHeader.classList.remove('scrolled');
      }
    }
  }, { passive: true });

  // Scroll Reveal via IntersectionObserver
  const revealElements = document.querySelectorAll('.feature-card, .step-card, .comp-table, .pipe-step, .download-master-card, .pro-card');
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = '1';
        entry.target.style.transform = 'translateY(0)';
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15 });

  revealElements.forEach((el, index) => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(30px)';
    el.style.transition = `all 0.6s cubic-bezier(0.16, 1, 0.3, 1) ${index * 0.05}s`;
    revealObserver.observe(el);
  });

  // =========================================================================
  // 3. Web Audio API Interactive Simulator (Live Audio Engine)
  // =========================================================================
  let audioCtx = null;
  let synthGain = null;
  let masterGain = null;
  let analyserNode = null;
  let isSimPlaying = false;
  let isSimCapturing = false;
  let simCaptureFormat = 'wav';
  let simCurrentTime = 0;
  let simTargetDuration = 73; // 1:13 = 73 sec
  let simTimerInterval = null;
  let vuAnimFrame = null;
  let synthInterval = null;

  // Active track state in mockup
  const tracks = [
    { id: 'track1', title: '다시 시작해', artist: 'june', dur: 73, durStr: '1:13', bg: 'linear-gradient(135deg, #1E293B, #0F172A)' },
    { id: 'track2', title: '따뜻한 카페', artist: 'june', dur: 162, durStr: '2:42', bg: 'linear-gradient(135deg, #332014, #1F150D)' },
    { id: 'track3', title: '푹 쉬렴 오늘 밤', artist: 'june', dur: 173, durStr: '2:53', bg: 'linear-gradient(135deg, #1E293B, #172554)' }
  ];
  let currentTrack = tracks[0];

  function initWebAudio() {
    if (audioCtx) return;
    const AudioContextClass = window.AudioContext || window.webkitAudioContext;
    audioCtx = new AudioContextClass();

    analyserNode = audioCtx.createAnalyser();
    analyserNode.fftSize = 64;

    synthGain = audioCtx.createGain();
    synthGain.gain.value = 0.22;

    masterGain = audioCtx.createGain();
    masterGain.gain.value = 1.0;

    synthGain.connect(analyserNode);
    analyserNode.connect(masterGain);
    masterGain.connect(audioCtx.destination);
  }

  // Generates warm Lo-Fi Chill Synthesizer Chord Arpeggio
  const chordNotes = [
    [261.63, 329.63, 392.00, 493.88], // Cmaj7
    [220.00, 261.63, 329.63, 392.00], // Am7
    [174.61, 220.00, 261.63, 329.63], // Fmaj7
    [196.00, 246.94, 293.66, 349.23]  // G7
  ];
  let chordIdx = 0;

  function playSynthChord() {
    if (!audioCtx || !isSimPlaying) return;
    try {
      const notes = chordNotes[chordIdx % chordNotes.length];
      chordIdx++;

      notes.forEach((freq, i) => {
        const osc = audioCtx.createOscillator();
        const noteGain = audioCtx.createGain();

        osc.type = i === 0 ? 'sine' : 'triangle';
        osc.frequency.setValueAtTime(freq, audioCtx.currentTime + i * 0.08);

        noteGain.gain.setValueAtTime(0, audioCtx.currentTime + i * 0.08);
        noteGain.gain.linearRampToValueAtTime(0.08, audioCtx.currentTime + i * 0.08 + 0.06);
        noteGain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 1.8);

        osc.connect(noteGain);
        noteGain.connect(synthGain);

        osc.start(audioCtx.currentTime + i * 0.08);
        osc.stop(audioCtx.currentTime + 2.0);
      });
    } catch (e) {
      console.warn('Synth error:', e);
    }
  }

  function startSimulatorAudio() {
    initWebAudio();
    if (audioCtx.state === 'suspended') {
      audioCtx.resume();
    }
    isSimPlaying = true;
    updateSimulatorPlayUI(true);

    if (synthInterval) clearInterval(synthInterval);
    playSynthChord();
    synthInterval = setInterval(playSynthChord, 1200);

    startTimer();
    startVuMeterVisualizer();
  }

  function pauseSimulatorAudio() {
    isSimPlaying = false;
    updateSimulatorPlayUI(false);
    if (synthInterval) clearInterval(synthInterval);
    stopTimer();
  }

  function toggleSimulatorAudio() {
    if (isSimPlaying) {
      pauseSimulatorAudio();
    } else {
      startSimulatorAudio();
    }
  }

  function startTimer() {
    if (simTimerInterval) clearInterval(simTimerInterval);
    simTimerInterval = setInterval(() => {
      if (!isSimPlaying) return;
      simCurrentTime++;
      if (simCurrentTime >= simTargetDuration) {
        simCurrentTime = 0;
        if (isSimCapturing) {
          finishSimCapture();
        }
      }
      updateTimecodeUI();
    }, 1000);
  }

  function stopTimer() {
    if (simTimerInterval) clearInterval(simTimerInterval);
  }

  function formatTime(sec) {
    const m = Math.floor(sec / 60);
    const s = Math.floor(sec % 60);
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  }

  function updateTimecodeUI() {
    const curStr = formatTime(simCurrentTime);
    const durStr = formatTime(simTargetDuration);
    const percent = Math.min(100, Math.round((simCurrentTime / simTargetDuration) * 100));

    // Player bar
    const pCur = document.getElementById('sim-player-current');
    const pDur = document.getElementById('sim-player-duration');
    const pFill = document.getElementById('sim-player-fill');
    if (pCur) pCur.innerText = curStr;
    if (pDur) pDur.innerText = durStr;
    if (pFill) pFill.style.width = `${percent}%`;

    // HUD
    const hudCur = document.getElementById('sim-hud-current');
    const hudDur = document.getElementById('sim-hud-duration');
    const hudFill = document.getElementById('sim-hud-fill');
    if (hudCur) hudCur.innerText = curStr;
    if (hudDur) hudDur.innerText = durStr;
    if (hudFill) hudFill.style.width = `${percent}%`;
  }

  function updateSimulatorPlayUI(playing) {
    const mainPlayBtn = document.getElementById('sim-main-play-btn');
    if (mainPlayBtn) {
      mainPlayBtn.innerHTML = playing ? '❚❚' : '▶';
    }

    // Highlight active card
    document.querySelectorAll('.sim-song-card').forEach(card => {
      if (card.dataset.id === currentTrack.id) {
        if (playing) {
          card.classList.add('active-playing');
        } else {
          card.classList.remove('active-playing');
        }
      } else {
        card.classList.remove('active-playing');
      }
    });
  }

  // Live 14-Channel VU Meter Animation
  function startVuMeterVisualizer() {
    const vuBars = document.querySelectorAll('.vu-bar');
    if (vuAnimFrame) cancelAnimationFrame(vuAnimFrame);

    const buffer = new Uint8Array(32);

    function loop() {
      if (analyserNode && isSimPlaying) {
        analyserNode.getByteFrequencyData(buffer);
        vuBars.forEach((bar, i) => {
          const val = buffer[i % buffer.length] || 20;
          const h = Math.max(12, Math.min(100, (val / 255) * 100));
          bar.style.height = `${h}%`;
        });
      } else {
        vuBars.forEach((bar) => {
          bar.style.height = '15%';
        });
      }
      vuAnimFrame = requestAnimationFrame(loop);
    }
    loop();
  }

  // Trigger Capture Mode in Simulator
  function triggerSimCapture(format, track) {
    simCaptureFormat = format;
    currentTrack = track || currentTrack;
    simCurrentTime = 0;
    simTargetDuration = currentTrack.dur;

    // Show HUD
    const hud = document.getElementById('sim-hud-overlay');
    const hudBadge = document.getElementById('sim-hud-badge');
    const hudTitle = document.getElementById('sim-hud-title');

    if (hud) hud.classList.add('active');
    if (hudBadge) {
      hudBadge.className = `hud-format-badge ${format}`;
      hudBadge.innerText = format.toUpperCase();
    }
    if (hudTitle) {
      hudTitle.innerText = currentTrack.title;
    }

    // Start playback immediately from 0:00
    startSimulatorAudio();
    isSimCapturing = true;

    showToast(`🎙️ '${currentTrack.title}' 100% 오디오 격리 캡처를 시작합니다 (${format.toUpperCase()})`);
  }

  function finishSimCapture() {
    if (!isSimCapturing) return;
    isSimCapturing = false;
    const hud = document.getElementById('sim-hud-overlay');
    if (hud) hud.classList.remove('active');

    // Generate simulated WAV file blob & trigger download demo
    generateDemoAudioDownload(currentTrack.title, simCaptureFormat);
    showToast(`✅ '${currentTrack.title}' 캡처 완료! ${simCaptureFormat.toUpperCase()} 파일로 즉시 저장되었습니다.`);
  }

  function cancelSimCapture() {
    isSimCapturing = false;
    const hud = document.getElementById('sim-hud-overlay');
    if (hud) hud.classList.remove('active');
    showToast(`❌ 오디오 캡처가 취소되었습니다.`);
  }

  // Create real WAV Blob with 16-bit PCM header & trigger download
  function generateDemoAudioDownload(title, format) {
    try {
      const sampleRate = 44100;
      const numChannels = 2;
      const durationSec = 1.5; // Demo sample duration
      const totalSamples = Math.floor(sampleRate * durationSec);
      const dataLength = totalSamples * numChannels * 2;
      const buffer = new ArrayBuffer(44 + dataLength);
      const view = new DataView(buffer);

      function writeString(offset, string) {
        for (let i = 0; i < string.length; i++) {
          view.setUint8(offset + i, string.charCodeAt(i));
        }
      }

      writeString(0, 'RIFF');
      view.setUint32(4, 36 + dataLength, true);
      writeString(8, 'WAVE');
      writeString(12, 'fmt ');
      view.setUint32(16, 16, true);
      view.setUint16(20, 1, true); // PCM
      view.setUint16(22, numChannels, true);
      view.setUint32(24, sampleRate, true);
      view.setUint32(28, sampleRate * numChannels * 2, true);
      view.setUint16(32, numChannels * 2, true);
      view.setUint16(34, 16, true);
      writeString(36, 'data');
      view.setUint32(40, dataLength, true);

      // Generate soft musical sine wave
      let offset = 44;
      for (let i = 0; i < totalSamples; i++) {
        const t = i / sampleRate;
        const s = Math.sin(2 * Math.PI * 440 * t) * 0.2;
        const val = Math.max(-1, Math.min(1, s)) * 32767;
        view.setInt16(offset, val, true);
        view.setInt16(offset + 2, val, true);
        offset += 4;
      }

      const mime = format === 'wav' ? 'audio/wav' : 'audio/mp3';
      const ext = format === 'wav' ? 'wav' : 'mp3';
      const blob = new Blob([buffer], { type: mime });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${title} - june (JENT STUDIO Basic).${ext}`;
      document.body.appendChild(a);
      a.click();
      setTimeout(() => {
        a.remove();
        URL.revokeObjectURL(url);
      }, 1000);
    } catch (e) {
      console.warn('Demo download error:', e);
    }
  }

  // =========================================================================
  // 4. UI Event Bindings
  // =========================================================================
  document.addEventListener('DOMContentLoaded', () => {
    // 1. Play Button on bottom player bar
    const mainPlayBtn = document.getElementById('sim-main-play-btn');
    if (mainPlayBtn) {
      mainPlayBtn.addEventListener('click', toggleSimulatorAudio);
    }

    // 2. Song Card Play click & Download buttons
    document.querySelectorAll('.sim-song-card').forEach((card, idx) => {
      const trackData = tracks[idx] || tracks[0];

      // Click row to play
      card.addEventListener('click', (e) => {
        if (e.target.closest('.sim-btn-dl')) return;
        currentTrack = trackData;
        simCurrentTime = 0;
        simTargetDuration = currentTrack.dur;
        updatePlayerBarMetadata(currentTrack);
        startSimulatorAudio();
      });

      // WAV button
      const wavBtn = card.querySelector('.sim-btn-dl.wav');
      if (wavBtn) {
        wavBtn.addEventListener('click', (e) => {
          e.stopPropagation();
          currentTrack = trackData;
          updatePlayerBarMetadata(currentTrack);
          triggerSimCapture('wav', currentTrack);
        });
      }

      // MP3 button
      const mp3Btn = card.querySelector('.sim-btn-dl.mp3');
      if (mp3Btn) {
        mp3Btn.addEventListener('click', (e) => {
          e.stopPropagation();
          currentTrack = trackData;
          updatePlayerBarMetadata(currentTrack);
          triggerSimCapture('mp3', currentTrack);
        });
      }
    });

    // 3. Player Bar Inline Download Buttons
    const barWav = document.getElementById('sim-player-bar-wav');
    if (barWav) {
      barWav.addEventListener('click', (e) => {
        e.stopPropagation();
        triggerSimCapture('wav', currentTrack);
      });
    }

    const barMp3 = document.getElementById('sim-player-bar-mp3');
    if (barMp3) {
      barMp3.addEventListener('click', (e) => {
        e.stopPropagation();
        triggerSimCapture('mp3', currentTrack);
      });
    }

    // 4. HUD Control Buttons
    const hudFinishBtn = document.getElementById('sim-hud-finish-btn');
    if (hudFinishBtn) {
      hudFinishBtn.addEventListener('click', finishSimCapture);
    }

    const hudCancelBtn = document.getElementById('sim-hud-cancel-btn');
    if (hudCancelBtn) {
      hudCancelBtn.addEventListener('click', cancelSimCapture);
    }

    // 5. Silent Capture (Mute Toggle)
    const chkSilent = document.getElementById('sim-hud-mute');
    if (chkSilent) {
      chkSilent.addEventListener('change', () => {
        initWebAudio();
        if (masterGain) {
          masterGain.gain.value = chkSilent.checked ? 0.0 : 1.0;
        }
        if (chkSilent.checked) {
          showToast('🔇 스피커 소리가 음소거되었습니다 (녹음은 원음 그대로 진행)');
        } else {
          showToast('🔊 스피커 출력이 켜졌습니다');
        }
      });
    }

    // 6. Installation Tabs
    const tabWhale = document.getElementById('tab-whale');
    const tabChrome = document.getElementById('tab-chrome');
    const stepsWhale = document.getElementById('steps-whale');
    const stepsChrome = document.getElementById('steps-chrome');

    if (tabWhale && tabChrome && stepsWhale && stepsChrome) {
      tabWhale.addEventListener('click', () => {
        tabWhale.classList.add('active');
        tabChrome.classList.remove('active');
        stepsWhale.style.display = 'grid';
        stepsChrome.style.display = 'none';
      });

      tabChrome.addEventListener('click', () => {
        tabChrome.classList.add('active');
        tabWhale.classList.remove('active');
        stepsWhale.style.display = 'none';
        stepsChrome.style.display = 'grid';
      });
    }

    // 7. Copy Path to Clipboard
    const copyPathBtns = document.querySelectorAll('.copy-path-btn');
    copyPathBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        const path = btn.dataset.path || 'suno-audio-capture-extension';
        navigator.clipboard.writeText(path).then(() => {
          showToast('📋 경로가 클립보드에 복사되었습니다!');
        });
      });
    });

    // 8. ZIP Download Button Toast
    const btnDlZip = document.getElementById('btn-download-zip');
    if (btnDlZip) {
      btnDlZip.addEventListener('click', () => {
        showToast('📦 JENT STUDIO 기본 (v1.9.0.zip) 다운로드를 시작합니다!');
      });
    }

    // 9. PRO Edition Teaser Button (Coming Soon Alert)
    const btnProSoon = document.getElementById('btn-pro-coming-soon');
    if (btnProSoon) {
      btnProSoon.addEventListener('click', (e) => {
        e.preventDefault();
        showToast('👑 JENT STUDIO 프로(v2.6.0)는 현재 데모 프리젠테이션 공개 준비 중입니다. 곧 정식 오픈됩니다!');
      });
    }

    // =========================================================================
    // 10. Multi-View Page Switcher (PRO / Free / Board / Download)
    // =========================================================================
    const viewMap = {
      '#pro': 'view-pro',
      '#free': 'view-free',
      '#board': 'view-board',
      '#pricing': 'view-pro',
      '#download': 'view-download'
    };

    function switchView(targetViewId, pushHash = true) {
      const views = document.querySelectorAll('.studio-view');
      let found = false;

      views.forEach(v => {
        if (v.id === targetViewId) {
          v.classList.add('active');
          found = true;
        } else {
          v.classList.remove('active');
        }
      });

      if (!found) {
        const defaultView = document.getElementById('view-free');
        if (defaultView) defaultView.classList.add('active');
        targetViewId = 'view-free';
      }

      window.scrollTo({ top: 0, behavior: 'instant' });

      // Update active nav links
      document.querySelectorAll('.nav-links .nav-link').forEach(link => {
        if (link.dataset.targetView === targetViewId) {
          link.classList.add('active');
        } else {
          link.classList.remove('active');
        }
      });

      // Update URL hash
      if (pushHash) {
        for (const [hash, vid] of Object.entries(viewMap)) {
          if (vid === targetViewId) {
            if (window.location.hash !== hash) {
              history.pushState(null, '', hash);
            }
            break;
          }
        }
      }

      // Smooth scroll to top of view
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    // Handle all links with data-target-view
    document.addEventListener('click', (e) => {
      const link = e.target.closest('[data-target-view]');
      if (link) {
        const targetView = link.dataset.targetView;
        if (targetView) {
          e.preventDefault();
          switchView(targetView);
        }
      }
    });

    // Hash route listener
    function handleHashRoute() {
      const currentHash = window.location.hash || '#free';
      const targetVid = viewMap[currentHash] || 'view-free';
      switchView(targetVid, false);
    }
    window.addEventListener('hashchange', handleHashRoute);
    handleHashRoute();

    // =========================================================================
    // 11. Supabase Free Cloud Auth & Database Integration & User Profile / Admin
    // =========================================================================
    const AUTH_STORAGE_KEY = 'jent_auth_user';

    // 지정된 시스템 관리자 계정 목록 (지정 계정 및 Gmail 도메인 호환 처리)
    const ADMIN_EMAILS = [
      'seobukisul@gamil.com',
      'seobukisul@gmail.com'
    ];

    function isUserAdmin(email) {
      if (!email) return false;
      return ADMIN_EMAILS.includes(String(email).trim().toLowerCase());
    }

    const authModal = document.getElementById('auth-modal');
    const btnHeaderLogin = document.getElementById('btn-header-login');
    const btnCloseAuthModal = document.getElementById('btn-close-auth-modal');
    const tabAuthLogin = document.getElementById('tab-auth-login');
    const tabAuthSignup = document.getElementById('tab-auth-signup');
    const formLogin = document.getElementById('form-login');
    const formSignup = document.getElementById('form-signup');
    const userProfileBadge = document.getElementById('user-profile-badge');
    const userDisplayEmail = document.getElementById('user-display-email');
    const userDisplayPlan = document.getElementById('user-display-plan');
    const btnHeaderLogout = document.getElementById('btn-header-logout');
    const btnHeaderProfile = document.getElementById('btn-header-profile');
    const userMetaClickable = document.getElementById('user-meta-clickable');

    // Profile Edit Modal Elements
    const profileModal = document.getElementById('profile-modal');
    const btnCloseProfileModal = document.getElementById('btn-close-profile-modal');
    const btnCancelProfile = document.getElementById('btn-cancel-profile');
    const formProfileEdit = document.getElementById('form-profile-edit');
    const profileNickname = document.getElementById('profile-nickname');
    const profileEmail = document.getElementById('profile-email');
    const profileNewPassword = document.getElementById('profile-new-password');
    const profileNewPasswordConfirm = document.getElementById('profile-new-password-confirm');
    const profileRoleCard = document.getElementById('profile-role-card');
    const profileRoleText = document.getElementById('profile-role-text');
    const profileRoleBadge = document.getElementById('profile-role-badge');
    const profileRoleIcon = document.getElementById('profile-role-icon');

    function openAuthModal(mode = 'login') {
      if (!authModal) return;
      if (mode === 'signup') {
        tabAuthSignup?.click();
      } else {
        tabAuthLogin?.click();
      }
      authModal.style.display = 'flex';
    }

    function closeAuthModal() {
      if (authModal) authModal.style.display = 'none';
    }

    function getStoredUser() {
      try {
        const data = localStorage.getItem(AUTH_STORAGE_KEY);
        if (!data) return null;
        const parsed = JSON.parse(data);
        if (parsed && parsed.email) {
          parsed.isAdmin = isUserAdmin(parsed.email);
          if (parsed.isAdmin) {
            parsed.plan = 'ADMIN 🛡️';
          }
        }
        return parsed;
      } catch (e) {
        return null;
      }
    }

    function updateHeaderAuthState() {
      const user = getStoredUser();
      const optCatNotice = document.getElementById('opt-cat-notice');
      const optCatChangelog = document.getElementById('opt-cat-changelog');

      if (user && user.email) {
        const isAdmin = isUserAdmin(user.email);
        if (btnHeaderLogin) btnHeaderLogin.style.display = 'none';
        if (userProfileBadge) {
          userProfileBadge.style.display = 'flex';
          if (userDisplayEmail) userDisplayEmail.textContent = user.nickname || user.email.split('@')[0];
          if (userDisplayPlan) {
            userDisplayPlan.textContent = isAdmin ? 'ADMIN 🛡️' : (user.plan || 'PRO 👑');
            if (isAdmin) {
              userDisplayPlan.classList.add('admin');
              userDisplayPlan.title = '시스템 총괄 관리자 계정';
            } else {
              userDisplayPlan.classList.remove('admin');
              userDisplayPlan.title = 'PRO 크리에이터 회원';
            }
          }
        }

        // 관리자 전용 글쓰기 카테고리 옵션 활성화
        if (optCatNotice) optCatNotice.style.display = isAdmin ? 'block' : 'none';
        if (optCatChangelog) optCatChangelog.style.display = isAdmin ? 'block' : 'none';
      } else {
        if (btnHeaderLogin) btnHeaderLogin.style.display = 'block';
        if (userProfileBadge) userProfileBadge.style.display = 'none';
        if (optCatNotice) optCatNotice.style.display = 'none';
        if (optCatChangelog) optCatChangelog.style.display = 'none';
      }
    }

    // Profile Edit Modal Controls
    function openProfileModal() {
      const user = getStoredUser();
      if (!user || !user.email) {
        openAuthModal('login');
        return;
      }

      const isAdmin = isUserAdmin(user.email);
      if (profileNickname) profileNickname.value = user.nickname || user.email.split('@')[0];
      if (profileEmail) profileEmail.value = user.email || '';
      if (profileNewPassword) profileNewPassword.value = '';
      if (profileNewPasswordConfirm) profileNewPasswordConfirm.value = '';

      if (profileRoleCard) {
        if (isAdmin) {
          profileRoleCard.classList.add('admin');
          if (profileRoleIcon) profileRoleIcon.textContent = '🛡️';
          if (profileRoleText) profileRoleText.textContent = '시스템 총괄 관리자 (ADMIN)';
          if (profileRoleBadge) profileRoleBadge.textContent = 'SUPER ADMIN';
        } else {
          profileRoleCard.classList.remove('admin');
          if (profileRoleIcon) profileRoleIcon.textContent = '👑';
          if (profileRoleText) profileRoleText.textContent = 'PRO 크리에이터 (회원)';
          if (profileRoleBadge) profileRoleBadge.textContent = 'ACTIVE';
        }
      }

      if (profileModal) profileModal.style.display = 'flex';
    }

    function closeProfileModal() {
      if (profileModal) profileModal.style.display = 'none';
    }

    if (btnHeaderProfile) btnHeaderProfile.addEventListener('click', openProfileModal);
    if (userMetaClickable) userMetaClickable.addEventListener('click', openProfileModal);
    if (btnCloseProfileModal) btnCloseProfileModal.addEventListener('click', closeProfileModal);
    if (btnCancelProfile) btnCancelProfile.addEventListener('click', closeProfileModal);

    // Profile Edit Form Submit Handler
    if (formProfileEdit) {
      formProfileEdit.addEventListener('submit', async (e) => {
        e.preventDefault();
        const user = getStoredUser();
        if (!user) {
          closeProfileModal();
          openAuthModal('login');
          return;
        }

        const newNickname = profileNickname ? profileNickname.value.trim() : '';
        const newEmail = profileEmail ? profileEmail.value.trim() : '';
        const newPw = profileNewPassword ? profileNewPassword.value : '';
        const newPwConfirm = profileNewPasswordConfirm ? profileNewPasswordConfirm.value : '';
        const submitBtn = formProfileEdit.querySelector('button[type="submit"]');

        if (!newNickname) {
          showToast('⚠️ 닉네임을 입력해 주세요.');
          return;
        }
        if (!newEmail) {
          showToast('⚠️ 이메일 주소를 입력해 주세요.');
          return;
        }

        // 비밀번호 변경 입력 시 유효성 검사
        if (newPw || newPwConfirm) {
          if (newPw.length < 6) {
            showToast('⚠️ 비밀번호는 최소 6자리 이상이어야 합니다.');
            return;
          }
          if (newPw !== newPwConfirm) {
            showToast('⚠️ 새 비밀번호가 일치하지 않습니다. 다시 확인해 주세요.');
            return;
          }
        }

        const sb = window.getSupabase ? window.getSupabase() : null;
        let emailChanged = (newEmail.toLowerCase() !== user.email.toLowerCase());
        let nicknameChanged = (newNickname !== user.nickname);
        let passwordChanged = !!newPw;

        if (!emailChanged && !nicknameChanged && !passwordChanged) {
          showToast('ℹ️ 변경된 정보가 없습니다.');
          closeProfileModal();
          return;
        }

        try {
          if (submitBtn) submitBtn.disabled = true;

          if (sb && user.source === 'supabase') {
            const updatePayload = {};
            if (nicknameChanged) {
              updatePayload.data = { nickname: newNickname };
            }
            if (emailChanged) {
              updatePayload.email = newEmail;
            }
            if (passwordChanged) {
              updatePayload.password = newPw;
            }

            const { data, error } = await sb.auth.updateUser(updatePayload);
            if (error) {
              showToast(`⚠️ 회원정보 수정 실패: ${error.message}`);
              return;
            }
          }

          // 로컬 데이터 동기화
          user.nickname = newNickname;
          user.email = newEmail;
          user.isAdmin = isUserAdmin(newEmail);
          user.plan = user.isAdmin ? 'ADMIN 🛡️' : (user.plan || 'PRO 👑');
          localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(user));

          updateHeaderAuthState();
          closeProfileModal();

          let msg = '🎉 회원정보가 성공적으로 수정되었습니다!';
          if (emailChanged) {
            msg = `🎉 이메일 변경 요청이 접수되었습니다! (${newEmail} 인증 메일을 확인해 주세요)`;
          } else if (passwordChanged) {
            msg = '🎉 닉네임 및 비밀번호가 성공적으로 변경되었습니다!';
          } else {
            msg = `🎉 닉네임이 '${newNickname}'(으)로 변경되었습니다!`;
          }
          showToast(msg);
        } catch (err) {
          console.error('Profile update error:', err);
          showToast(`⚠️ 정보 수정 중 오류: ${err.message}`);
        } finally {
          if (submitBtn) submitBtn.disabled = false;
        }
      });
    }

    // Supabase Auth State Change Listener
    const sb = window.getSupabase ? window.getSupabase() : null;
    if (sb) {
      sb.auth.onAuthStateChange((event, session) => {
        if (session && session.user) {
          const userMeta = session.user.user_metadata || {};
          const email = session.user.email || '';
          const isAdmin = isUserAdmin(email);
          const user = {
            id: session.user.id,
            email: email,
            nickname: userMeta.nickname || userMeta.full_name || userMeta.name || email.split('@')[0],
            plan: isAdmin ? 'ADMIN 🛡️' : (userMeta.plan || 'PRO 👑'),
            isAdmin: isAdmin,
            source: 'supabase'
          };
          localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(user));
          updateHeaderAuthState();
        } else if (event === 'SIGNED_OUT') {
          localStorage.removeItem(AUTH_STORAGE_KEY);
          updateHeaderAuthState();
        }
      });
    }

    if (btnHeaderLogin) btnHeaderLogin.addEventListener('click', () => openAuthModal('login'));
    if (btnCloseAuthModal) btnCloseAuthModal.addEventListener('click', closeAuthModal);

    if (tabAuthLogin && tabAuthSignup && formLogin && formSignup) {
      tabAuthLogin.addEventListener('click', () => {
        tabAuthLogin.classList.add('active');
        tabAuthSignup.classList.remove('active');
        formLogin.style.display = 'flex';
        formSignup.style.display = 'none';
      });

      tabAuthSignup.addEventListener('click', () => {
        tabAuthSignup.classList.add('active');
        tabAuthLogin.classList.remove('active');
        formLogin.style.display = 'none';
        formSignup.style.display = 'flex';
      });
    }

    // Handle Login Submit (Supabase Cloud Auth + Local Fallback)
    if (formLogin) {
      formLogin.addEventListener('submit', async (e) => {
        e.preventDefault();
        const email = document.getElementById('login-email').value.trim();
        const password = document.getElementById('login-password').value;
        const submitBtn = formLogin.querySelector('button[type="submit"]');

        const sb = window.getSupabase ? window.getSupabase() : null;
        if (sb) {
          try {
            if (submitBtn) submitBtn.disabled = true;
            const { data, error } = await sb.auth.signInWithPassword({ email, password });
            if (error) {
              if (error.message.includes('Email not confirmed')) {
                showToast('⚠️ [이메일 미인증] 메일함을 확인하시거나 Supabase 설정에서 Confirm email을 비활성화해주세요.');
              } else if (error.message.includes('Invalid login credentials')) {
                showToast('⚠️ 이메일 또는 비밀번호가 올바르지 않습니다.');
              } else {
                showToast(`⚠️ 로그인 실패: ${error.message}`);
              }
              return;
            }
            const userMeta = data.user.user_metadata || {};
            const isAdmin = isUserAdmin(data.user.email);
            const user = {
              id: data.user.id,
              email: data.user.email,
              nickname: userMeta.nickname || userMeta.full_name || userMeta.name || email.split('@')[0],
              plan: isAdmin ? 'ADMIN 🛡️' : (userMeta.plan || 'PRO 👑'),
              isAdmin: isAdmin,
              source: 'supabase'
            };
            localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(user));
            updateHeaderAuthState();
            closeAuthModal();
            const welcomeRole = isAdmin ? '🛡️ 관리자' : '👑 크리에이터';
            showToast(`🎉 환영합니다, ${user.nickname}님! ${welcomeRole} 권한으로 로그인되었습니다.`);
            return;
          } catch (err) {
            console.error('Supabase Login error, fallback to local:', err);
          } finally {
            if (submitBtn) submitBtn.disabled = false;
          }
        }

        // Fallback: LocalStorage
        const isAdmin = isUserAdmin(email);
        const user = {
          email,
          nickname: email.split('@')[0],
          plan: isAdmin ? 'ADMIN 🛡️' : 'PRO 👑',
          isAdmin: isAdmin,
          loggedInAt: new Date().toISOString(),
          source: 'local'
        };
        localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(user));
        updateHeaderAuthState();
        closeAuthModal();
        showToast(`🎉 환영합니다, ${user.nickname}님! 성공적으로 로그인되었습니다.`);
      });
    }

    // Handle Signup Submit (Supabase Cloud Auth + Local Fallback)
    if (formSignup) {
      formSignup.addEventListener('submit', async (e) => {
        e.preventDefault();
        const nickname = document.getElementById('signup-nickname').value.trim();
        const email = document.getElementById('signup-email').value.trim();
        const pw = document.getElementById('signup-password').value;
        const pwConfirm = document.getElementById('signup-password-confirm').value;
        const submitBtn = formSignup.querySelector('button[type="submit"]');

        if (pw !== pwConfirm) {
          showToast('⚠️ 비밀번호가 일치하지 않습니다. 다시 확인해주세요.');
          return;
        }

        const isAdmin = isUserAdmin(email);
        const assignedPlan = isAdmin ? 'ADMIN 🛡️' : 'PRO 크리에이터 👑';

        const sb = window.getSupabase ? window.getSupabase() : null;
        if (sb) {
          try {
            if (submitBtn) submitBtn.disabled = true;
            const { data, error } = await sb.auth.signUp({
              email,
              password: pw,
              options: {
                data: {
                  nickname,
                  plan: assignedPlan
                }
              }
            });

            if (error) {
              showToast(`⚠️ 회원가입 실패: ${error.message}`);
              return;
            }

            if (data.user && !data.session) {
              showToast('📧 가입 완료! 인증 이메일이 발송되었습니다. (즉시 로그인은 Supabase 설정 필요)');
            } else {
              const user = {
                id: data.user.id,
                email,
                nickname,
                plan: assignedPlan,
                isAdmin: isAdmin,
                joinedAt: new Date().toISOString(),
                source: 'supabase'
              };
              localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(user));
              updateHeaderAuthState();
              showToast(`✨ 환영합니다, ${nickname}님! Supabase 회원 등록이 완료되었습니다.`);
            }
            closeAuthModal();
            return;
          } catch (err) {
            console.error('Supabase Signup error, fallback to local:', err);
          } finally {
            if (submitBtn) submitBtn.disabled = false;
          }
        }

        // Fallback: LocalStorage
        const user = {
          email,
          nickname,
          plan: assignedPlan,
          isAdmin: isAdmin,
          joinedAt: new Date().toISOString(),
          source: 'local'
        };
        localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(user));
        updateHeaderAuthState();
        closeAuthModal();
        showToast(`✨ 환영합니다, ${nickname}님! JENT STUDIO 회원 인증이 완료되었습니다.`);
      });
    }

    // Logout Action
    if (btnHeaderLogout) {
      btnHeaderLogout.addEventListener('click', async () => {
        const sb = window.getSupabase ? window.getSupabase() : null;
        if (sb) {
          try {
            await sb.auth.signOut();
          } catch (e) {}
        }
        localStorage.removeItem(AUTH_STORAGE_KEY);
        updateHeaderAuthState();
        showToast('👋 로그아웃되었습니다.');
      });
    }

    // Provider Active Check Helper (OAuth 활성화 여부 사전 검증으로 400 에러 페이지 튕김 방지)
    async function isOAuthProviderActive(providerName) {
      if (!window.SUPABASE_CONFIG || !window.SUPABASE_CONFIG.isConfigured()) return false;
      try {
        const cleanUrl = sanitizeSupabaseUrl(window.SUPABASE_CONFIG.url);
        const res = await fetch(`${cleanUrl}/auth/v1/settings`, {
          headers: { apikey: window.SUPABASE_CONFIG.anonKey }
        });
        if (res.ok) {
          const data = await res.json();
          return !!(data?.external && data.external[providerName]);
        }
      } catch (e) {}
      return false;
    }

    // Social Quick Login (OAuth / Protective Guidance)
    const btnGoogle = document.getElementById('btn-social-google');
    const btnGithub = document.getElementById('btn-social-github');
    if (btnGoogle) {
      btnGoogle.addEventListener('click', async () => {
        const sb = window.getSupabase ? window.getSupabase() : null;
        if (sb) {
          const isGoogleActive = await isOAuthProviderActive('google');
          if (!isGoogleActive) {
            showToast('⚠️ Google 로그인은 Supabase 대시보드에서 Google Client ID 등록이 필요합니다. 상단의 [이메일 가입/로그인]을 이용해 주세요!');
            tabAuthSignup?.click();
            return;
          }
          try {
            await sb.auth.signInWithOAuth({
              provider: 'google',
              options: { redirectTo: window.location.origin }
            });
            return;
          } catch (err) {
            console.warn('Supabase Google OAuth error:', err);
          }
        }
        showToast('ℹ️ 상단의 [이메일 주소/비밀번호]로 간편 가입 및 로그인을 이용해 주세요.');
      });
    }
    if (btnGithub) {
      btnGithub.addEventListener('click', async () => {
        const sb = window.getSupabase ? window.getSupabase() : null;
        if (sb) {
          const isGithubActive = await isOAuthProviderActive('github');
          if (!isGithubActive) {
            showToast('⚠️ GitHub 로그인은 Supabase 대시보드에서 GitHub OAuth 앱 등록이 필요합니다. 상단의 [이메일 가입/로그인]을 이용해 주세요!');
            tabAuthSignup?.click();
            return;
          }
          try {
            await sb.auth.signInWithOAuth({
              provider: 'github',
              options: { redirectTo: window.location.origin }
            });
            return;
          } catch (err) {
            console.warn('Supabase GitHub OAuth error:', err);
          }
        }
        showToast('ℹ️ 상단의 [이메일 주소/비밀번호]로 간편 가입 및 로그인을 이용해 주세요.');
      });
    }

    updateHeaderAuthState();

    // =========================================================================
    // 12. Community & Notice Board System (Supabase PostgreSQL + Fallback)
    // =========================================================================
    const BOARD_STORAGE_KEY = 'jent_studio_board_posts';

    const defaultPosts = [
      {
        id: 'notice-1',
        category: 'notice',
        catName: '📌 공지사항',
        title: '👑 JENT STUDIO 프로(v2.6.0) 신기능 공개 및 데모 프리젠테이션 안내',
        author: 'JENT STUDIO 공식',
        date: '2026-10-28',
        views: 1428,
        content: '안녕하세요, Suno AI 크리에이터 여러분!\n\nJENT STUDIO 프로(v2.6.0)가 마침내 공개 준비를 마쳤습니다.\n\n이번 프로 에디션의 주요 핵심 기능:\n1. 1.5초 무음 병렬 다운로드 (10곡을 단 10초 만에 3대 포맷으로 메모리 직접 추출)\n2. 스튜디오 원클릭 마스터링 (-14.0 LUFS EBU R128 글로벌 표준 음압 정규화 & True-Peak -1.0 dBTP 리미터)\n3. 정규 메타데이터 & 초고화질 커버아트 자동 각인 (ID3v2.3, iTunes Atoms)\n4. 0-Gap 무음 트리밍 플레이리스트 일괄 병합 & 유튜브 챕터 텍스트 자동 생성\n5. 프로 작사 알고리즘 + 최신 AI 연결 실시간 작사기\n\n이번 주 진행되는 사용자 대상 데모 프리젠테이션에서 전격 시연됩니다. 크리에이터 여러분의 많은 성원 부탁드립니다!'
      },
      {
        id: 'notice-2',
        category: 'notice',
        catName: '🎛️ 마스터링',
        title: '스튜디오 원클릭 마스터링(-14.0 LUFS) 유튜브 및 스포티파이 음원 제출 규격 가이드',
        author: '사운드 마스터',
        date: '2026-10-27',
        views: 892,
        content: 'Suno AI 원곡을 유튜브나 멜론, 스포티파이에 올릴 때 가장 중요한 음압 규격 안내입니다.\n\n유튜브와 스트리밍 플랫폼은 통합 음압(Integrated LUFS)이 -14.0 LUFS를 초과할 경우 음질을 강제로 감쇄(Loudness Penalty)시킵니다. 또한 인터샘플 피크가 0 dBFS를 넘으면 저가 이어폰이나 스마트폰 스피커에서 찌직거리는 클리핑 노이즈가 발생합니다.\n\nJENT STUDIO PRO의 스튜디오 마스터링 옵션을 켜두시면:\n- 자동으로 정확히 -14.0 LUFS로 정규화됩니다.\n- True-Peak 리미터가 -1.0 dBTP에서 디지털 피크를 완벽히 커팅합니다.\n- Mid/Side 스테레오 이미저가 110%~140% 확장되어 웅장한 공간감을 형성합니다.'
      },
      {
        id: 'post-3',
        category: 'changelog',
        catName: '🚀 릴리즈 노트',
        title: 'v2.6.0 릴리즈 체인지로그: M4A 지원 및 LameJS Web Worker 멀티스레드 가속',
        author: '개발팀 자비스',
        date: '2026-10-28',
        views: 654,
        content: 'v2.6.0 주요 개선 내역:\n- 순정 AAC 스트림을 재인코딩 없이 0.3초 만에 QuickTime Atom으로 직접 패키징하는 초고속 M4A 엔진 탑재\n- 320k MP3 변환 작업을 백그라운드 Web Worker로 분리하여 메인 브라우저 UI 랙 0% 및 60 FPS 유지\n- 홈페이지 최신 버전 자동 감지 알림창 및 원클릭 자동 업데이트 파이프라인 연동'
      },
      {
        id: 'post-4',
        category: 'tips',
        catName: '💡 꿀팁',
        title: '0-Gap 무음 제거 플레이리스트 병합으로 1시간 수면음악 유튜브 채널 만드는 법',
        author: 'Lo-Fi 큐레이터',
        date: '2026-10-26',
        views: 1105,
        content: '유튜브 BGM 채널을 운영하시는 분들께 드리는 꿀팁입니다!\n\n1. Suno에서 편안한 Lo-Fi 또는 수면 피아노 곡 15~20곡을 생성합니다.\n2. JENT STUDIO PRO SidePanel의 [플레이리스트 병합] 체크박스에 전곡을 체크합니다.\n3. [0-Gap 무음 병합 시작]을 누르면 곡 사이의 어색한 묵음이 0.001초 단위로 자동 삭제되고 5ms 크로스페이드로 매끄럽게 연결됩니다.\n4. 생성된 _Timestamps.txt 내용을 유튜브 설명란에 그대로 붙여넣으면 챕터 타임라인이 자동으로 완성됩니다!'
      },
      {
        id: 'post-5',
        category: 'tips',
        catName: '💡 꿀팁',
        title: 'Suno AI 보컬 전달력과 후렴구 킬링 훅을 극대화하는 작사 노하우',
        author: '작사 마스터',
        date: '2026-10-25',
        views: 940,
        content: 'Suno AI로 곡을 생성할 때 보컬이 웅얼거리거나 후렴구에서 힘이 빠지는 주된 원인은 가사의 음절 밀도와 리듬 텐션의 불균형 때문입니다.\n\nJENT STUDIO PRO의 작사 알고리즘은 130여 편의 히트곡 작곡가가 검증한 보컬 호흡 곡선을 내장하고 있습니다:\n- 절(Verse) 구간: 군더더기 없는 호흡 공간을 자동 확보하여 보컬 딕션을 살려냅니다.\n- 후렴(Chorus) 구간: 폭발적인 고음과 감정선을 이끌어내는 텐션 리듬으로 자동 변환됩니다.\n\nSidePanel 탭 1에서 원하는 무드만 한 줄 입력하시고 [스타일 & 가사 만들기]를 누르면 이 모든 최적화가 원클릭으로 자동 적용됩니다.'
      },
      {
        id: 'post-6',
        category: 'qna',
        catName: '❓ Q&A',
        title: 'M4A 포맷과 MP3 포맷 중 어떤 것을 선택해야 하나요?',
        author: '뉴비크리에이터',
        date: '2026-10-24',
        views: 430,
        content: 'Q: M4A와 320k MP3 중 어떤 포맷이 더 좋은가요?\n\n답변:\n- 아이폰, Mac, 아이패드, 애플뮤직을 주로 사용하시거나 저장 공간을 아끼면서 고음질을 원하신다면 순정 AAC 기반 M4A를 추천합니다 (다운로드 속도가 0.3초로 가장 빠릅니다).\n- 윈도우 PC, 구형 차량용 오디오, 범용 동영상 편집기 호환성을 원하신다면 320kbps MP3를 추천합니다.\n- DAW(큐베이스, 로직, 에이블톤)에서 추가 믹싱이나 리믹스를 하실 때는 16-bit 무손실 WAV를 사용하세요!'
      }
    ];

    let cloudPostsCache = null;

    // Supabase Cloud Posts Fetch
    async function fetchCloudPosts() {
      const sb = window.getSupabase ? window.getSupabase() : null;
      if (!sb) return null;
      try {
        const { data, error } = await sb
          .from('posts')
          .select('*')
          .order('created_at', { ascending: false });

        if (error) {
          console.warn('⚠️ [Supabase DB] posts 테이블 조회 실패 (RLS 정책 또는 테이블 확인 필요):', error);
          return null;
        }

        if (data && data.length > 0) {
          const catMap = {
            notice: '📌 공지사항',
            changelog: '🚀 릴리즈 노트',
            tips: '💡 꿀팁',
            qna: '❓ 질문 & Q&A',
            feedback: '💬 피드백'
          };
          cloudPostsCache = data.map(p => ({
            id: String(p.id),
            category: p.category || 'qna',
            catName: p.cat_name || catMap[p.category] || '일반',
            title: p.title || '제목 없음',
            author: p.author || '익명 크리에이터',
            date: p.created_at ? p.created_at.slice(0, 10) : new Date().toISOString().slice(0, 10),
            views: p.views || 0,
            content: p.content || '',
            userId: p.user_id || null
          }));
          return cloudPostsCache;
        }
        return [];
      } catch (e) {
        console.warn('Supabase fetch exception:', e);
        return null;
      }
    }

    function getLocalBoardPosts() {
      try {
        const data = localStorage.getItem(BOARD_STORAGE_KEY);
        if (data) return JSON.parse(data);
      } catch (e) {}
      localStorage.setItem(BOARD_STORAGE_KEY, JSON.stringify(defaultPosts));
      return defaultPosts;
    }

    function saveLocalBoardPosts(posts) {
      localStorage.setItem(BOARD_STORAGE_KEY, JSON.stringify(posts));
    }

    function getBoardPosts() {
      if (cloudPostsCache !== null && cloudPostsCache.length > 0) {
        return cloudPostsCache;
      }
      return getLocalBoardPosts();
    }

    let activeCategory = 'all';
    let searchQuery = '';

    async function renderBoardPosts() {
      const tbody = document.getElementById('board-posts-tbody');
      const emptyState = document.getElementById('board-empty-state');
      if (!tbody) return;

      // Supabase 클라우드에서 최신 글 로드 시도
      if (cloudPostsCache === null && window.getSupabase && window.getSupabase()) {
        const cloudPosts = await fetchCloudPosts();
        if (cloudPosts !== null) {
          cloudPostsCache = cloudPosts;
        }
      }

      const posts = getBoardPosts();
      const filtered = posts.filter(post => {
        const matchCat = (activeCategory === 'all') || (post.category === activeCategory);
        const matchSearch = !searchQuery || 
          post.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
          post.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
          post.author.toLowerCase().includes(searchQuery.toLowerCase());
        return matchCat && matchSearch;
      });

      if (filtered.length === 0) {
        tbody.innerHTML = '';
        if (emptyState) emptyState.style.display = 'block';
        return;
      }

      if (emptyState) emptyState.style.display = 'none';
      tbody.innerHTML = filtered.map(post => {
        return `
          <tr class="board-row" data-post-id="${post.id}">
            <td>
              <span class="post-cat-badge ${post.category}">${post.catName || '일반'}</span>
            </td>
            <td>
              <span class="post-title-link">${post.title}</span>
            </td>
            <td>${post.author}</td>
            <td>${post.date}</td>
            <td style="text-align: center; color: var(--text-dim); font-family: var(--font-mono);">${post.views || 0}</td>
          </tr>
        `;
      }).join('');
    }

    // Category filter tabs
    document.querySelectorAll('.b-cat-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        document.querySelectorAll('.b-cat-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        activeCategory = btn.dataset.category || 'all';
        renderBoardPosts();
      });
    });

    // Search input
    const searchInput = document.getElementById('board-search-input');
    if (searchInput) {
      searchInput.addEventListener('input', (e) => {
        searchQuery = e.target.value.trim();
        renderBoardPosts();
      });
    }

    // Post Detail Modal
    const postDetailModal = document.getElementById('post-detail-modal');
    const btnClosePostModal = document.getElementById('btn-close-post-modal');
    const btnConfirmPostView = document.getElementById('btn-confirm-post-view');
    const btnDeletePost = document.getElementById('btn-delete-post');

    async function openPostDetail(postId) {
      const posts = getBoardPosts();
      const post = posts.find(p => p.id === postId);
      if (!post || !postDetailModal) return;

      // Increment views
      post.views = (post.views || 0) + 1;
      
      const sb = window.getSupabase ? window.getSupabase() : null;
      if (sb && post.id && !post.id.startsWith('notice-') && !post.id.startsWith('post-')) {
        try {
          sb.from('posts').update({ views: post.views }).eq('id', post.id).then();
        } catch (e) {}
      }

      saveLocalBoardPosts(posts);
      renderBoardPosts();

      document.getElementById('post-view-category').textContent = post.catName || '공지사항';
      document.getElementById('post-view-title').textContent = post.title;
      document.getElementById('post-view-author').textContent = `작성자: ${post.author}`;
      document.getElementById('post-view-date').textContent = post.date;
      document.getElementById('post-view-views').textContent = `조회수 ${post.views}`;
      document.getElementById('post-view-body').textContent = post.content;

      // 삭제 권한 제어: 시스템 관리자이거나 글 작성자 본인일 때 삭제 버튼 활성화
      const currentUser = getStoredUser();
      const isAdmin = currentUser && currentUser.isAdmin;
      const isAuthor = currentUser && (
        (currentUser.nickname && currentUser.nickname === post.author) ||
        (currentUser.id && currentUser.id === post.userId)
      );

      if (btnDeletePost) {
        if (isAdmin || isAuthor) {
          btnDeletePost.style.display = 'inline-block';
          btnDeletePost.textContent = isAdmin ? '🛡️ 관리자 권한으로 삭제' : '🗑️ 게시글 삭제';
          btnDeletePost.onclick = async () => {
            if (!confirm(`'${post.title}' 게시글을 정말로 삭제하시겠습니까?`)) return;

            const sb = window.getSupabase ? window.getSupabase() : null;
            if (sb && post.id && !post.id.startsWith('notice-') && !post.id.startsWith('post-')) {
              try {
                const { error } = await sb.from('posts').delete().eq('id', post.id);
                if (error) {
                  showToast(`⚠️ 삭제 실패: ${error.message}`);
                  return;
                }
              } catch (e) {
                console.warn('Supabase post delete exception:', e);
              }
            }

            // 캐시 및 로컬 저장소에서 제거
            if (cloudPostsCache) {
              cloudPostsCache = cloudPostsCache.filter(p => p.id !== post.id);
            }
            const localPosts = getLocalBoardPosts().filter(p => p.id !== post.id);
            saveLocalBoardPosts(localPosts);

            closePostDetail();
            renderBoardPosts();
            showToast('🗑️ 게시글이 성공적으로 삭제되었습니다.');
          };
        } else {
          btnDeletePost.style.display = 'none';
          btnDeletePost.onclick = null;
        }
      }

      postDetailModal.style.display = 'flex';
    }

    function closePostDetail() {
      if (postDetailModal) postDetailModal.style.display = 'none';
    }

    if (btnClosePostModal) btnClosePostModal.addEventListener('click', closePostDetail);
    if (btnConfirmPostView) btnConfirmPostView.addEventListener('click', closePostDetail);

    // Click on board rows or pinned notices
    document.addEventListener('click', (e) => {
      const row = e.target.closest('.board-row, .pinned-card');
      if (row && row.dataset.postId) {
        openPostDetail(row.dataset.postId);
      }
    });

    // Write Modal
    const writeModal = document.getElementById('write-modal');
    const btnOpenWriteModal = document.getElementById('btn-open-write-modal');
    const btnCloseWriteModal = document.getElementById('btn-close-write-modal');
    const btnCancelWrite = document.getElementById('btn-cancel-write');
    const formWritePost = document.getElementById('form-write-post');

    if (btnOpenWriteModal) {
      btnOpenWriteModal.addEventListener('click', () => {
        const user = getStoredUser();
        const authorInput = document.getElementById('write-author');
        if (authorInput && user) {
          authorInput.value = user.nickname || user.email.split('@')[0];
        }
        if (writeModal) writeModal.style.display = 'flex';
      });
    }

    function closeWriteModal() {
      if (writeModal) writeModal.style.display = 'none';
    }

    if (btnCloseWriteModal) btnCloseWriteModal.addEventListener('click', closeWriteModal);
    if (btnCancelWrite) btnCancelWrite.addEventListener('click', closeWriteModal);

    if (formWritePost) {
      formWritePost.addEventListener('submit', async (e) => {
        e.preventDefault();
        const cat = document.getElementById('write-category').value;
        const author = document.getElementById('write-author').value.trim();
        const title = document.getElementById('write-title').value.trim();
        const content = document.getElementById('write-content').value.trim();
        const submitBtn = formWritePost.querySelector('button[type="submit"]');

        const catMap = {
          notice: '📌 공지사항',
          changelog: '🚀 릴리즈 노트',
          qna: '❓ 질문 & Q&A',
          tips: '💡 크리에이터 꿀팁',
          feedback: '💬 기능 건의 및 피드백'
        };

        const sb = window.getSupabase ? window.getSupabase() : null;
        let cloudSaved = false;

        if (sb) {
          try {
            if (submitBtn) submitBtn.disabled = true;
            const user = getStoredUser();
            const { data, error } = await sb.from('posts').insert([{
              category: cat,
              cat_name: catMap[cat] || '일반',
              title,
              author,
              content,
              views: 1,
              user_id: user?.id || null
            }]).select();

            if (error) {
              console.warn('Supabase post insert error (Check RLS policy):', error);
              showToast(`⚠️ 클라우드 DB 저장 경고: ${error.message} (로컬 캐시에 저장합니다)`);
            } else if (data && data[0]) {
              cloudSaved = true;
              if (cloudPostsCache) {
                cloudPostsCache.unshift({
                  id: String(data[0].id),
                  category: cat,
                  catName: catMap[cat] || '일반',
                  title,
                  author,
                  date: new Date().toISOString().slice(0, 10),
                  views: 1,
                  content,
                  userId: user?.id || null
                });
              }
            }
          } catch (err) {
            console.error('Supabase write exception:', err);
          } finally {
            if (submitBtn) submitBtn.disabled = false;
          }
        }

        if (!cloudSaved) {
          const user = getStoredUser();
          const newPost = {
            id: `post-${Date.now()}`,
            category: cat,
            catName: catMap[cat] || '일반',
            title,
            author,
            date: new Date().toISOString().slice(0, 10),
            views: 1,
            content,
            userId: user?.id || null
          };
          const posts = getLocalBoardPosts();
          posts.unshift(newPost);
          saveLocalBoardPosts(posts);
        }

        formWritePost.reset();
        closeWriteModal();
        renderBoardPosts();
        showToast(cloudSaved ? '🎉 Supabase 클라우드 DB에 게시글이 등록되었습니다!' : '🎉 게시글이 성공적으로 등록되었습니다!');
      });
    }

    renderBoardPosts();

    // Query parameter preview helpers for modals (single run)
    if (window.location.search.includes('modal=auth')) {
      setTimeout(() => openAuthModal('login'), 200);
    } else if (window.location.search.includes('modal=signup')) {
      setTimeout(() => openAuthModal('signup'), 200);
    } else if (window.location.search.includes('modal=post')) {
      setTimeout(() => openPostDetail('notice-1'), 200);
    }
  });

  function updatePlayerBarMetadata(track) {
    const titleEl = document.getElementById('sim-player-title');
    const artistEl = document.getElementById('sim-player-artist');
    const thumbEl = document.getElementById('sim-player-thumb');
    if (titleEl) titleEl.innerText = track.title;
    if (artistEl) artistEl.innerText = track.artist;
    if (thumbEl) thumbEl.style.background = track.bg;
  }

  // Toast Notification System
  function showToast(message) {
    let toast = document.getElementById('web-toast');
    if (!toast) {
      toast = document.createElement('div');
      toast.id = 'web-toast';
      toast.className = 'web-toast';
      document.body.appendChild(toast);
    }
    toast.innerHTML = `<span>✨</span> <span>${message}</span>`;
    toast.classList.add('show');

    setTimeout(() => {
      toast.classList.remove('show');
    }, 3800);
  }

})();
