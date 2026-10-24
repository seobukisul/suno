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
    document.querySelectorAll('.feature-card, .studio-mockup-wrapper, .step-card, .download-master-card').forEach(card => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      card.style.setProperty('--mouse-x', `${x}px`);
      card.style.setProperty('--mouse-y', `${y}px`);
    });
  });

  // 3D Tilt Effect on Feature Cards and Mockup Window
  const tiltElements = document.querySelectorAll('.feature-card, .studio-mockup-wrapper, .step-card');
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
  const revealElements = document.querySelectorAll('.feature-card, .step-card, .comp-table, .pipe-step, .download-master-card');
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
      a.download = `${title} - june (Suno Pure Audio).${ext}`;
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

    // 8. GitHub Repo Mega Button
    const dlBtnRepo = document.getElementById('btn-download-repo');
    if (dlBtnRepo) {
      dlBtnRepo.addEventListener('click', () => {
        showToast('🚀 GitHub 공식 저장소로 이동합니다!');
      });
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
