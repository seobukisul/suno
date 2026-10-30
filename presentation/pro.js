/**
 * JENT STUDIO PRO Slide Controller (pro.js)
 * 완성형 프로페셔널 스튜디오 스위트 발표 전용 스크립트
 */

document.addEventListener('DOMContentLoaded', () => {
  'use strict';

  // =========================================================================
  // 1. Slide Deck Navigation Engine
  // =========================================================================
  const slides = Array.from(document.querySelectorAll('.slide'));
  const totalSlides = slides.length;
  let currentSlideIdx = 0;

  const progressBar = document.getElementById('progressBar');
  const slideCounter = document.getElementById('slideCounter');
  const overviewModal = document.getElementById('overviewModal');
  const overviewGrid = document.getElementById('overviewGrid');
  const notesDrawer = document.getElementById('notesDrawer');
  const notesContent = document.getElementById('notesContent');

  // Speaker notes tailored for PRO Edition presentation
  const speakerNotes = [
    // Slide 1
    `<strong>[오프닝 & 비전 - 1분]</strong><br>
    - 인사 및 제품 소개: <em>"지금부터 여러분께 선보일 JENT STUDIO PRO는 단순 다운로더가 아닌, 기획부터 제작, 추출, 스튜디오 마스터링까지 단 한 화면에서 끝내는 차세대 올인원 오디오 스튜디오입니다."</em><br>
    - 프로페셔널 크리에이터를 위해 설계된 핵심 스펙을 강조합니다.`,
    
    // Slide 2
    `<strong>[크리에이터 4대 병목 - 2분]</strong><br>
    - <em>"대량으로 음악을 만들 때 겪는 고통을 떠올려보세요."</em><br>
      1) 10곡 녹음하느라 30분 동안 컴퓨터 스피커를 켜두어야 하는 시간 낭비<br>
      2) 유튜브에 올렸더니 소리가 급감하거나 찌직거리는 음압 페널티<br>
      3) 차량이나 스마트폰에서 제목과 앨범 커버가 안 뜨는 메타데이터 실종<br>
      4) 1시간 플레이리스트 만들 때 곡 사이 묵음을 일일이 잘라내는 노가다`,
    
    // Slide 3
    `<strong>[SidePanel 올인원 아키텍처 - 1분 30초]</strong><br>
    - <em>"창을 가리지 않고 우측에 영구 밀착 도킹되는 브라우저 네이티브 SidePanel!"</em><br>
    - 팝업과 달리 실수로 클릭해도 꺼지지 않는 안정성.<br>
    - 좌측 Suno 화면을 그대로 보면서 우측 패널에서 기획, 추출, 마스터링까지 원스톱으로 처리하는 혁신적인 UX를 설명합니다.`,

    // Slide 4
    `<strong>[1.5초 무음 병렬 추출 기술 - 2분]</strong><br>
    - <em>"스피커 소리 없이, 1배속 재생을 기다리지 않고, 1.5초 만에 10곡을 동시에 뽑아냅니다."</em><br>
    - Direct Audio Buffer 직결 추출 + LameJS Web Worker 멀티스레드 가속 원리를 명쾌하게 전달합니다.`,

    // Slide 5
    `<strong>[속도 레이스 실시간 시연 - 2분]</strong><br>
    - <strong>인터랙션</strong>: [🚀 10곡 동시 다운로드 레이스 시작] 버튼 클릭!<br>
    - 1배속 녹음이 30분 동안 기어가는 동안, JENT PRO는 <strong>1.48초 만에 10곡 전체 100% 완료</strong> 도장을 찍는 압도적인 속도 격차를 시각적으로 체감시킵니다.`,

    // Slide 6
    `<strong>[스튜디오 DSP 마스터링 기술 - 2분]</strong><br>
    - <em>"유튜브 스트리밍 글로벌 표준인 EBU R128 -14.0 LUFS로 소리를 정규화합니다."</em><br>
    - 6-Band 파라메트릭 EQ, Mid/Side 3D 스테레오 이미저, 아날로그 진공관 새추레이션, True-Peak -1.0 dBTP 리미터의 전문 오디오 체인을 소개합니다.`,

    // Slide 7
    `<strong>[실시간 A/B 청음 데크 - 3분 (하이라이트)]</strong><br>
    - <strong>실제 청음 음원</strong>: <em>'천천히 물들어 갈래 - june'</em> (실제 제작된 16-bit 44.1kHz 스튜디오 마스터링 시연)<br>
    - <strong>인터랙션</strong>: [▶️ 청음 시작] 클릭 후 [BYPASS]와 [MASTERED]를 번갈아 누르며 직접 귀로 들려줍니다.<br>
    - <em>"소리가 확 커지고, 악기들이 3D로 넓게 펼쳐지며, 찌직거리는 클리핑이 0%로 완벽히 잡히는 차이를 확인해 보세요!"</em><br>
    - 32채널 실시간 스펙트럼 캔버스와 LUFS 미터 수치를 가리키며 설명합니다.`,

    // Slide 8
    `<strong>[0-Gap 플레이리스트 & 유튜브 챕터 - 2분]</strong><br>
    - <strong>인터랙션</strong>: 상단 캔버스의 [빨간색 2.8초 묵음 구간]과 하단의 [0-Gap 무손실 스플라이스 파형]을 대조하여 보여줍니다.<br>
    - <em>"곡 사이 어색한 침묵이 0.1초 만에 자동 절삭되어 다음 곡으로 끊김 없이 연결되며, 유튜브 설명란용 타임스탬프 텍스트도 원클릭으로 즉시 복사됩니다!"</em><br>
    - [📋 유튜브 챕터 타임스탬프 복사] 버튼을 누르면 <em>'천천히 물들어 갈래'</em>를 포함한 3개 트랙 정보가 클립보드에 복사됩니다.`,

    // Slide 9
    `<strong>[AI 작사 & Suno 원클릭 Auto-Fill - 2분]</strong><br>
    - <strong>인터랙션</strong>: [✨ 최신 AI로 가사 & 스타일 만들기] 클릭!<br>
    - 미친감성 작사 역학 공식(11-3 롤러코스터 급강하)으로 작사된 결과가 좌측 Suno Create 화면의 Custom 필드로 <strong>1초 만에 자동 주입(Auto-Fill)</strong>되는 모습을 시연합니다.`,

    // Slide 10
    `<strong>[정식 출시 로드맵 & Q&A - 2분]</strong><br>
    - <em>"우선 오늘 받으신 무료 버전으로 작업 효율을 올리시고, 더 큰 스케일의 음원 출시를 위한 PRO 버전 정식 릴리즈를 기대해 주시기 바랍니다!"</em><br>
    - 청중 질의응답 및 피드백 청취로 마무리합니다.`
  ];

  function updateSlide(newIdx) {
    if (newIdx < 0 || newIdx >= totalSlides) return;

    // Slide 07 오디오 재생 중 타 슬라이드로 이동 시 자동 정지
    if (currentSlideIdx === 6 && newIdx !== 6 && isPlaying) {
      toggleAudioPlayback();
    }

    // Slide 08 진입 시 실제 음원 DAW 파형 캔버스 렌더링
    if (newIdx === 7) {
      setTimeout(renderWaveforms, 60);
    }

    slides.forEach((slide, idx) => {
      slide.classList.remove('active', 'prev');
      if (idx === newIdx) {
        slide.classList.add('active');
      } else if (idx < newIdx) {
        slide.classList.add('prev');
      }
    });

    currentSlideIdx = newIdx;

    const progressPercent = ((currentSlideIdx + 1) / totalSlides) * 100;
    progressBar.style.width = `${progressPercent}%`;

    slideCounter.textContent = `${String(currentSlideIdx + 1).padStart(2, '0')} / ${String(totalSlides).padStart(2, '0')}`;

    if (notesContent) {
      notesContent.innerHTML = speakerNotes[currentSlideIdx] || '준비된 발표 메모가 없습니다.';
    }

    document.querySelectorAll('.overview-card').forEach((card, idx) => {
      card.classList.toggle('current', idx === currentSlideIdx);
    });
  }

  function nextSlide() {
    if (currentSlideIdx < totalSlides - 1) {
      updateSlide(currentSlideIdx + 1);
    }
  }

  function prevSlide() {
    if (currentSlideIdx > 0) {
      updateSlide(currentSlideIdx - 1);
    }
  }

  // Keyboard Navigation
  window.addEventListener('keydown', (e) => {
    if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;

    switch (e.key) {
      case 'ArrowRight':
      case 'PageDown':
      case ' ':
        e.preventDefault();
        nextSlide();
        break;
      case 'ArrowLeft':
      case 'PageUp':
        e.preventDefault();
        prevSlide();
        break;
      case 'Home':
        e.preventDefault();
        updateSlide(0);
        break;
      case 'End':
        e.preventDefault();
        updateSlide(totalSlides - 1);
        break;
      case 'f':
      case 'F':
        toggleFullscreen();
        break;
      case 'n':
      case 'N':
        toggleNotes();
        break;
      case 'Escape':
        if (overviewModal.classList.contains('open')) {
          closeOverview();
        } else if (notesDrawer.classList.contains('open')) {
          toggleNotes();
        } else {
          openOverview();
        }
        break;
    }
  });

  // Touch Swipe
  let touchStartX = 0;
  window.addEventListener('touchstart', (e) => {
    touchStartX = e.changedTouches[0].clientX;
  }, { passive: true });

  window.addEventListener('touchend', (e) => {
    const touchEndX = e.changedTouches[0].clientX;
    const diff = touchStartX - touchEndX;
    if (Math.abs(diff) > 50) {
      if (diff > 0) nextSlide();
      else prevSlide();
    }
  }, { passive: true });

  // HUD Controls
  document.getElementById('hudPrev').addEventListener('click', prevSlide);
  document.getElementById('hudNext').addEventListener('click', nextSlide);
  document.getElementById('hudOverview').addEventListener('click', toggleOverview);
  document.getElementById('hudNotes').addEventListener('click', toggleNotes);
  document.getElementById('hudFullscreen').addEventListener('click', toggleFullscreen);

  function toggleFullscreen() {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => {});
    } else {
      document.exitFullscreen().catch(() => {});
    }
  }

  function toggleNotes() {
    notesDrawer.classList.toggle('open');
  }
  document.getElementById('notesCloseBtn').addEventListener('click', toggleNotes);

  function toggleOverview() {
    overviewModal.classList.toggle('open');
  }

  function openOverview() {
    overviewModal.classList.add('open');
  }

  function closeOverview() {
    overviewModal.classList.remove('open');
  }
  document.getElementById('overviewCloseBtn').addEventListener('click', closeOverview);

  // Generate Overview Thumbnails
  overviewGrid.innerHTML = '';
  slides.forEach((slide, idx) => {
    const card = document.createElement('div');
    card.className = `overview-card ${idx === currentSlideIdx ? 'current' : ''}`;
    const titleText = slide.querySelector('.slide-title')?.textContent || `Slide ${idx + 1}`;
    const catText = slide.querySelector('.slide-category')?.textContent || 'PRO 에디션';

    card.innerHTML = `
      <div style="font-size:0.75rem; color:var(--cyan); font-weight:700;">${String(idx + 1).padStart(2, '0')} • ${catText}</div>
      <div style="font-size:0.95rem; font-weight:800; color:#FFF; line-height:1.3;">${titleText}</div>
      <div style="font-size:0.75rem; color:var(--text-dim);">클릭하여 이동</div>
    `;
    card.addEventListener('click', () => {
      updateSlide(idx);
      closeOverview();
    });
    overviewGrid.appendChild(card);
  });


  // =========================================================================
  // 2. Slide 05: Speed Race Live Simulator (PRO Edition)
  // =========================================================================
  const startRaceBtn = document.getElementById('startRaceBtn');
  const normalRaceFill = document.getElementById('normalRaceFill');
  const normalRaceTime = document.getElementById('normalRaceTime');
  const turboRaceFill = document.getElementById('turboRaceFill');
  const turboRaceTime = document.getElementById('turboRaceTime');
  const trackPills = Array.from(document.querySelectorAll('.track-pill'));

  let raceInterval = null;
  if (startRaceBtn) {
    startRaceBtn.addEventListener('click', () => {
      if (raceInterval) clearInterval(raceInterval);

      startRaceBtn.disabled = true;
      startRaceBtn.textContent = '⚡ 레이스 진행 중...';

      normalRaceFill.style.width = '0%';
      turboRaceFill.style.width = '0%';
      normalRaceTime.textContent = '00:00 (진행률 0%)';
      turboRaceTime.textContent = '0.00초 (0/10곡)';
      trackPills.forEach(p => p.classList.remove('done'));

      let startTime = performance.now();
      const targetDurationMs = 1480;

      raceInterval = setInterval(() => {
        const elapsed = performance.now() - startTime;
        const progress = Math.min(1, elapsed / targetDurationMs);

        turboRaceFill.style.width = `${progress * 100}%`;
        const completedTracks = Math.floor(progress * 10);
        turboRaceTime.textContent = `${(elapsed / 1000).toFixed(2)}초 (${completedTracks}/10곡 완료)`;

        for (let i = 0; i < completedTracks; i++) {
          if (trackPills[i]) trackPills[i].classList.add('done');
        }

        const normalProgress = (elapsed / targetDurationMs) * 1.5;
        normalRaceFill.style.width = `${normalProgress}%`;
        normalRaceTime.textContent = `00:${String(Math.floor(elapsed / 100)).padStart(2, '0')} (1800초 중 0.8%...)`;

        if (progress >= 1) {
          clearInterval(raceInterval);
          startRaceBtn.disabled = false;
          startRaceBtn.textContent = '🔄 다시 레이스하기';
          turboRaceTime.innerHTML = '🎉 <span style="color:var(--cyan)">1.48초 10곡 전체 100% 완료! (120배 고속)</span>';
          normalRaceTime.innerHTML = '<span style="color:var(--rose)">잔여 예상 시간: 29분 42초 (스피커 점유 중)</span>';
          trackPills.forEach(p => p.classList.add('done'));
        }
      }, 30);
    });
  }


  // =========================================================================
  // Slide 06: DSP Mastering Architecture 3D Interactive Tilt & Spotlight
  // =========================================================================
  const dspCards = document.querySelectorAll('.dsp-card');
  dspCards.forEach((card) => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      card.style.setProperty('--mouse-x', `${x}px`);
      card.style.setProperty('--mouse-y', `${y}px`);

      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      const rotateX = ((y - centerY) / centerY) * -9;
      const rotateY = ((x - centerX) / centerX) * 9;

      card.style.transform = `perspective(1000px) rotateX(${rotateX.toFixed(2)}deg) rotateY(${rotateY.toFixed(2)}deg) scale3d(1.025, 1.025, 1.025)`;
      card.style.transition = 'transform 0.08s ease-out, border-color 0.25s ease, box-shadow 0.25s ease';
    });

    card.addEventListener('mouseleave', () => {
      card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)';
      card.style.transition = 'transform 0.4s cubic-bezier(0.2, 0.8, 0.2, 1), border-color 0.25s ease, box-shadow 0.25s ease';
    });
  });


  // =========================================================================
  // 3. Slide 07: Studio-Grade Web Audio DSP A/B Mastering Deck
  // =========================================================================
  const playDeckBtn = document.getElementById('playDeckBtn');
  const abToggleBtn = document.getElementById('abToggleBtn');
  const toggleCapsule = document.getElementById('toggleCapsule');
  const abLabelText = document.getElementById('abLabelText');
  const spectrumCanvas = document.getElementById('spectrumCanvas');
  const lufsMetric = document.getElementById('lufsMetric');
  const truePeakMetric = document.getElementById('truePeakMetric');
  const widthMetric = document.getElementById('widthMetric');
  const audioFileInput = document.getElementById('audioFileInput');
  const dropAudioZone = document.getElementById('dropAudioZone');

  let audioCtx = null;
  let isPlaying = false;
  let isMastered = false;
  let synthTimer = null;
  let analyserNode = null;
  let canvasCtx = spectrumCanvas ? spectrumCanvas.getContext('2d') : null;

  let audioBuffer = null;
  let isAudioLoading = false;
  const demoAudioPath = 'assets/audio/demo.mp3';
  const defaultTrackName = '🎵 천천히 물들어 갈래 - june';

  // Base64 Data URI를 ArrayBuffer로 변환 (CORS 제약 없는 100% 오프라인 file:/// 호환)
  async function dataUriToArrayBuffer(dataUri) {
    try {
      const res = await fetch(dataUri);
      return await res.arrayBuffer();
    } catch (e) {
      const base64 = dataUri.split(',')[1];
      const binaryString = window.atob(base64);
      const len = binaryString.length;
      const bytes = new Uint8Array(len);
      for (let i = 0; i < len; i++) {
        bytes[i] = binaryString.charCodeAt(i);
      }
      return bytes.buffer;
    }
  }

  async function preloadDemoAudio() {
    if (audioBuffer) return audioBuffer;
    if (isAudioLoading) {
      while (isAudioLoading) {
        await new Promise(r => setTimeout(r, 60));
      }
      return audioBuffer;
    }
    isAudioLoading = true;
    initMasteringDSP();

    // 1순위: Zero-CORS 사전 임베딩 메모리 버퍼 (로컬 file:/// 더블클릭 실행 시 100% 무조건 로드)
    if (window.__DEMO_AUDIO_BASE64__) {
      try {
        const arrayBuf = await dataUriToArrayBuffer(window.__DEMO_AUDIO_BASE64__);
        audioBuffer = await audioCtx.decodeAudioData(arrayBuf);
        isAudioLoading = false;
        console.log('✅ JENT STUDIO: 천천히 물들어 갈래 메모리 음원 로드 완료');
        return audioBuffer;
      } catch (err) {
        console.warn('Base64 decode failed, trying file fetch:', err);
      }
    }

    // 2순위: 로컬 HTTP 서버 fetch (assets/audio/demo.mp3 -> demo.wav)
    const candidateUrls = ['assets/audio/demo.mp3', 'assets/audio/demo.wav'];
    for (const url of candidateUrls) {
      try {
        const response = await fetch(url);
        if (response.ok) {
          const arrayBuffer = await response.arrayBuffer();
          audioBuffer = await audioCtx.decodeAudioData(arrayBuffer);
          isAudioLoading = false;
          console.log(`✅ JENT STUDIO: fetch(${url}) 음원 로드 완료`);
          return audioBuffer;
        }
      } catch (err) {
        // file:/// 환경에서는 CORS 보안 에러가 발생하므로 다음 순위 진행
      }
    }

    isAudioLoading = false;
    return null;
  }

  // Preload demo track in background
  setTimeout(() => {
    preloadDemoAudio().catch(() => {});
  }, 500);

  let rawSourceNode = null;
  let bypassGain = null;
  let masteredGain = null;
  let preBoostGain = null;
  let eqLow = null;
  let eqMid = null;
  let eqHigh = null;
  let shaperNode = null;
  let compressorNode = null;
  let limiterNode = null;
  let masterVolume = null;

  function initMasteringDSP() {
    if (audioCtx) return;
    const AudioCtx = window.AudioContext || window.webkitAudioContext;
    audioCtx = new AudioCtx();

    analyserNode = audioCtx.createAnalyser();
    analyserNode.fftSize = 64;
    analyserNode.smoothingTimeConstant = 0.82;

    masterVolume = audioCtx.createGain();
    masterVolume.gain.value = 0.95;
    masterVolume.connect(audioCtx.destination);
    analyserNode.connect(masterVolume);

    // Bypass Chain (-18 LUFS)
    bypassGain = audioCtx.createGain();
    bypassGain.gain.setValueAtTime(isMastered ? 0.0 : 0.85, audioCtx.currentTime);
    bypassGain.connect(analyserNode);

    // Mastered Chain (-14 LUFS)
    masteredGain = audioCtx.createGain();
    masteredGain.gain.setValueAtTime(isMastered ? 1.0 : 0.0, audioCtx.currentTime);

    eqLow = audioCtx.createBiquadFilter();
    eqLow.type = 'lowshelf';
    eqLow.frequency.value = 80;
    eqLow.gain.value = 2.4;

    eqMid = audioCtx.createBiquadFilter();
    eqMid.type = 'peaking';
    eqMid.frequency.value = 3200;
    eqMid.Q.value = 1.2;
    eqMid.gain.value = 2.0;

    eqHigh = audioCtx.createBiquadFilter();
    eqHigh.type = 'highshelf';
    eqHigh.frequency.value = 8500;
    eqHigh.gain.value = 1.8;

    shaperNode = audioCtx.createWaveShaper();
    shaperNode.curve = createWarmTapeCurve(18);
    shaperNode.oversample = '2x';

    compressorNode = audioCtx.createDynamicsCompressor();
    compressorNode.threshold.value = -18;
    compressorNode.knee.value = 6;
    compressorNode.ratio.value = 2.8;
    compressorNode.attack.value = 0.015;
    compressorNode.release.value = 0.12;

    preBoostGain = audioCtx.createGain();
    preBoostGain.gain.value = 1.55;

    limiterNode = audioCtx.createDynamicsCompressor();
    limiterNode.threshold.value = -1.0;
    limiterNode.knee.value = 0.0;
    limiterNode.ratio.value = 20.0;
    limiterNode.attack.value = 0.001;
    limiterNode.release.value = 0.05;

    eqLow.connect(eqMid);
    eqMid.connect(eqHigh);
    eqHigh.connect(shaperNode);
    shaperNode.connect(compressorNode);
    compressorNode.connect(preBoostGain);
    preBoostGain.connect(limiterNode);
    limiterNode.connect(masteredGain);
    masteredGain.connect(analyserNode);

    renderSpectrumLoop();
  }

  function createWarmTapeCurve(drive) {
    const k = drive * 0.025;
    const n = 65536;
    const curve = new Float32Array(n);
    for (let i = 0; i < n; i++) {
      const x = (i * 2) / (n - 1) - 1;
      curve[i] = ((1 + k) * x) / (1 + k * Math.abs(x));
    }
    return curve;
  }

  function setMasteringState(enabled) {
    isMastered = enabled;
    const deckAudioSource = document.getElementById('deckAudioSource');
    if (deckAudioSource && !deckAudioSource.paused) {
      deckAudioSource.volume = isMastered ? 1.0 : 0.65;
    }

    if (!audioCtx) return;

    const now = audioCtx.currentTime;
    const fadeTime = 0.025;

    if (isMastered) {
      bypassGain.gain.linearRampToValueAtTime(0.0001, now + fadeTime);
      masteredGain.gain.linearRampToValueAtTime(1.0, now + fadeTime);

      toggleCapsule.classList.add('active');
      abLabelText.textContent = '✨ MASTERED (JENT PRO 스튜디오 DSP)';
      abLabelText.className = 'ab-state-label active';

      lufsMetric.textContent = '-14.0 LUFS';
      lufsMetric.className = 'metric-value highlight';
      truePeakMetric.textContent = '-1.0 dBTP';
      truePeakMetric.className = 'metric-value highlight';
      widthMetric.textContent = '125% (3D 이미징)';
      widthMetric.className = 'metric-value highlight';
    } else {
      masteredGain.gain.linearRampToValueAtTime(0.0001, now + fadeTime);
      bypassGain.gain.linearRampToValueAtTime(0.85, now + fadeTime);

      toggleCapsule.classList.remove('active');
      abLabelText.textContent = '🔈 BYPASS (Suno 원본)';
      abLabelText.className = 'ab-state-label';

      lufsMetric.textContent = '-18.4 LUFS';
      lufsMetric.className = 'metric-value';
      truePeakMetric.textContent = '-3.2 dB';
      truePeakMetric.className = 'metric-value';
      widthMetric.textContent = '100% (기본)';
      widthMetric.className = 'metric-value';
    }
  }

  if (abToggleBtn) {
    abToggleBtn.addEventListener('click', () => {
      setMasteringState(!isMastered);
    });
  }

  const synthChords = [
    { bass: 65.41, notes: [261.63, 329.63, 392.00, 493.88] },
    { bass: 55.00, notes: [220.00, 261.63, 329.63, 392.00] },
    { bass: 43.65, notes: [174.61, 220.00, 261.63, 329.63] },
    { bass: 49.00, notes: [196.00, 246.94, 293.66, 349.23] }
  ];
  let chordStep = 0;

  function triggerSynthPattern() {
    if (!audioCtx || !isPlaying) return;
    const chord = synthChords[chordStep % synthChords.length];
    chordStep++;
    const now = audioCtx.currentTime;

    const bassOsc = audioCtx.createOscillator();
    const bassGain = audioCtx.createGain();
    bassOsc.type = 'triangle';
    bassOsc.frequency.setValueAtTime(chord.bass, now);
    bassGain.gain.setValueAtTime(0.35, now);
    bassGain.gain.exponentialRampToValueAtTime(0.001, now + 1.6);
    bassOsc.connect(bassGain);
    bassGain.connect(bypassGain);
    bassGain.connect(eqLow);
    bassOsc.start(now);
    bassOsc.stop(now + 1.8);

    chord.notes.forEach((freq, idx) => {
      const noteDelay = idx * 0.12;
      const osc = audioCtx.createOscillator();
      const noteGain = audioCtx.createGain();

      osc.type = idx % 2 === 0 ? 'sine' : 'sawtooth';
      osc.frequency.setValueAtTime(freq, now + noteDelay);

      noteGain.gain.setValueAtTime(0, now + noteDelay);
      noteGain.gain.linearRampToValueAtTime(0.12, now + noteDelay + 0.04);
      noteGain.gain.exponentialRampToValueAtTime(0.001, now + noteDelay + 1.4);

      osc.connect(noteGain);
      noteGain.connect(bypassGain);
      noteGain.connect(eqLow);

      osc.start(now + noteDelay);
      osc.stop(now + noteDelay + 1.5);
    });
  }

  async function toggleAudioPlayback() {
    initMasteringDSP();
    if (audioCtx.state === 'suspended') {
      await audioCtx.resume();
    }

    if (isPlaying) {
      isPlaying = false;
      const deckAudioSource = document.getElementById('deckAudioSource');
      if (deckAudioSource) {
        deckAudioSource.pause();
      }
      if (rawSourceNode) {
        try {
          rawSourceNode.stop();
          rawSourceNode.disconnect();
        } catch (e) {}
        rawSourceNode = null;
      }
      if (synthTimer) {
        clearInterval(synthTimer);
        synthTimer = null;
      }
      playDeckBtn.innerHTML = '▶️ 청음 시작';
      playDeckBtn.style.background = 'linear-gradient(135deg, var(--cyan), var(--purple))';
    } else {
      playDeckBtn.disabled = true;
      playDeckBtn.innerHTML = '⏳ 음원 준비 중...';

      let buffer = audioBuffer;
      if (!buffer) {
        buffer = await preloadDemoAudio();
      }
      playDeckBtn.disabled = false;

      if (buffer) {
        if (rawSourceNode) {
          try {
            rawSourceNode.stop();
            rawSourceNode.disconnect();
          } catch (e) {}
        }
        rawSourceNode = audioCtx.createBufferSource();
        rawSourceNode.buffer = buffer;
        rawSourceNode.loop = true;
        rawSourceNode.connect(bypassGain);
        rawSourceNode.connect(eqLow);
        rawSourceNode.start();

        isPlaying = true;
        playDeckBtn.innerHTML = '⏸️ 일시 정지';
        playDeckBtn.style.background = 'var(--emerald)';
        const titleEl = document.getElementById('currentTrackTitle');
        if (titleEl && !titleEl.textContent.startsWith('📂')) {
          titleEl.textContent = defaultTrackName;
        }
      } else {
        // Fallback: HTML5 Audio direct playback (guaranteed 100% on file:/// without CORS block)
        const deckAudioSource = document.getElementById('deckAudioSource');
        if (deckAudioSource) {
          deckAudioSource.volume = isMastered ? 1.0 : 0.65;
          deckAudioSource.play().catch(e => console.warn('Deck audio play error:', e));
          isPlaying = true;
          playDeckBtn.innerHTML = '⏸️ 일시 정지';
          playDeckBtn.style.background = 'var(--emerald)';
          const titleEl = document.getElementById('currentTrackTitle');
          if (titleEl && !titleEl.textContent.startsWith('📂')) {
            titleEl.textContent = defaultTrackName;
          }
        }
      }
    }
  }

  if (playDeckBtn) {
    playDeckBtn.addEventListener('click', toggleAudioPlayback);
  }

  function renderSpectrumLoop() {
    requestAnimationFrame(renderSpectrumLoop);
    if (!spectrumCanvas || !canvasCtx || !analyserNode) return;

    const width = spectrumCanvas.width;
    const height = spectrumCanvas.height;
    const bufferLength = analyserNode.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);
    analyserNode.getByteFrequencyData(dataArray);

    canvasCtx.clearRect(0, 0, width, height);

    canvasCtx.strokeStyle = 'rgba(255, 255, 255, 0.05)';
    canvasCtx.lineWidth = 1;
    for (let y = 30; y < height; y += 40) {
      canvasCtx.beginPath();
      canvasCtx.moveTo(0, y);
      canvasCtx.lineTo(width, y);
      canvasCtx.stroke();
    }

    const barWidth = (width / bufferLength) * 0.85;
    let x = 4;

    for (let i = 0; i < bufferLength; i++) {
      const val = dataArray[i];
      const barHeight = (val / 255) * (height - 16);

      let grad = canvasCtx.createLinearGradient(0, height, 0, 0);
      if (isMastered) {
        grad.addColorStop(0, '#00F0FF');
        grad.addColorStop(0.6, '#A855F7');
        grad.addColorStop(1, '#FFFFFF');
      } else {
        grad.addColorStop(0, '#334155');
        grad.addColorStop(0.7, '#64748B');
        grad.addColorStop(1, '#94A3B8');
      }

      canvasCtx.fillStyle = grad;
      canvasCtx.fillRect(x, height - barHeight, barWidth, barHeight);
      x += barWidth + 3;
    }
  }

  if (dropAudioZone && audioFileInput) {
    dropAudioZone.addEventListener('click', () => audioFileInput.click());
    dropAudioZone.addEventListener('dragover', (e) => {
      e.preventDefault();
      dropAudioZone.style.borderColor = 'var(--cyan)';
    });
    dropAudioZone.addEventListener('dragleave', () => {
      dropAudioZone.style.borderColor = 'var(--border-subtle)';
    });
    dropAudioZone.addEventListener('drop', (e) => {
      e.preventDefault();
      dropAudioZone.style.borderColor = 'var(--border-subtle)';
      if (e.dataTransfer.files.length > 0) {
        loadCustomFile(e.dataTransfer.files[0]);
      }
    });
    audioFileInput.addEventListener('change', (e) => {
      if (e.target.files.length > 0) {
        loadCustomFile(e.target.files[0]);
      }
    });
  }

  function loadCustomFile(file) {
    initMasteringDSP();
    const reader = new FileReader();
    reader.onload = async (ev) => {
      try {
        const arrayBuf = ev.target.result;
        const decodedBuf = await audioCtx.decodeAudioData(arrayBuf);
        audioBuffer = decodedBuf;

        if (synthTimer) {
          clearInterval(synthTimer);
          synthTimer = null;
        }

        if (rawSourceNode) {
          try {
            rawSourceNode.stop();
            rawSourceNode.disconnect();
          } catch (e) {}
        }

        rawSourceNode = audioCtx.createBufferSource();
        rawSourceNode.buffer = decodedBuf;
        rawSourceNode.loop = true;
        rawSourceNode.connect(bypassGain);
        rawSourceNode.connect(eqLow);
        rawSourceNode.start();

        isPlaying = true;
        playDeckBtn.innerHTML = '⏸️ 일시 정지';
        playDeckBtn.style.background = 'var(--emerald)';
        document.getElementById('currentTrackTitle').textContent = `📂 ${file.name}`;
      } catch (err) {
        alert('오디오 파일 디코딩 오류: 지원되는 MP3 또는 WAV 파일인지 확인해 주세요.');
      }
    };
    reader.readAsArrayBuffer(file);
  }


  // =========================================================================
  // 4. Slide 08: Realistic DAW-Grade Waveform Rendering (0-Gap 무음 절삭 비교)
  // =========================================================================
  const beforeWaveCanvas = document.getElementById('beforeWaveCanvas');
  const afterWaveCanvas = document.getElementById('afterWaveCanvas');
  const copyChaptersBtn = document.getElementById('copyChaptersBtn');

  function generateTrackEnvelope(numBars, seed, startT = 0, endT = 1) {
    const bars = [];
    for (let i = 0; i < numBars; i++) {
      const prog = i / Math.max(1, numBars - 1);
      const t = startT + prog * (endT - startT);
      const envelope = Math.sin(t * Math.PI) * 0.44 + 0.36;
      const rhythm = (i % 6 === 0) ? 0.32 : ((i % 3 === 0) ? 0.18 : 0.06);
      const harm = Math.sin(i * 0.82 + seed) * 0.16 + Math.cos(i * 1.65 + seed * 2) * 0.11;
      const val = Math.max(0.12, Math.min(0.96, (envelope * 0.52 + rhythm * 0.28 + harm * 0.20) * 1.85));
      bars.push(val);
    }
    return bars;
  }

  // 실제 음원의 악장(Intro - Verse - Chorus - Climax - Outro) 다이내믹 에너지 곡선 생성
  const track1Bars = generateTrackEnvelope(58, 1.25, 0.1, 0.95);  // Track 01 (천천히 물들어 갈래)
  const track2Bars = generateTrackEnvelope(54, 3.82, 0.05, 0.90); // Track 02 (따뜻한 오후 햇살)
  const track3Bars = generateTrackEnvelope(32, 6.14, 0.1, 0.75);  // Track 03 (밤하늘 별빛 아래)

  function drawDawWaveform(canvas, type = 'before') {
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const dpr = window.devicePixelRatio || 1;
    const rect = canvas.getBoundingClientRect();
    const width = rect.width || canvas.width || 600;
    const height = rect.height || canvas.height || 90;

    canvas.width = width * dpr;
    canvas.height = height * dpr;
    ctx.scale(dpr, dpr);

    const midY = height / 2;
    const totalBars = 144;
    const step = width / totalBars;
    const barWidth = Math.max(2.2, step * 0.70);

    // 1. DAW 백그라운드 0dB 중심선 및 음압 가이드라인
    ctx.clearRect(0, 0, width, height);

    ctx.strokeStyle = 'rgba(255, 255, 255, 0.06)';
    ctx.lineWidth = 1;
    ctx.setLineDash([]);
    ctx.beginPath();
    ctx.moveTo(0, midY);
    ctx.lineTo(width, midY);
    ctx.moveTo(0, midY - height * 0.36);
    ctx.lineTo(width, midY - height * 0.36);
    ctx.moveTo(0, midY + height * 0.36);
    ctx.lineTo(width, midY + height * 0.36);
    ctx.stroke();

    if (type === 'before') {
      // -------------------------------------------------------------
      // BEFORE: Track 01 (0~58) | 빨간색 2.8초 묵음 구간 (59~86) | Track 02 (87~143)
      // -------------------------------------------------------------
      const gapStartIdx = 59;
      const gapEndIdx = 86;
      const gapStartX = gapStartIdx * step;
      const gapEndX = gapEndIdx * step;
      const gapWidth = gapEndX - gapStartX;

      // 1) 붉은색 무음 경고 배경 하이라이트 (Vivid Red Transparent Fill)
      const redGrad = ctx.createLinearGradient(gapStartX, 0, gapEndX, 0);
      redGrad.addColorStop(0, 'rgba(239, 68, 68, 0.18)');
      redGrad.addColorStop(0.5, 'rgba(239, 68, 68, 0.32)');
      redGrad.addColorStop(1, 'rgba(239, 68, 68, 0.18)');
      ctx.fillStyle = redGrad;
      ctx.fillRect(gapStartX, 0, gapWidth, height);

      // 붉은색 사선 빗금 위험 패턴 (Warning Hazard Stripes)
      ctx.strokeStyle = 'rgba(239, 68, 68, 0.15)';
      ctx.lineWidth = 1.5;
      for (let x = gapStartX - height; x < gapEndX + height; x += 11) {
        ctx.beginPath();
        ctx.moveTo(x, height);
        ctx.lineTo(x + height, 0);
        ctx.stroke();
      }

      // 양 끝단 붉은색 점선 경계선 (Red Dashed Boundaries)
      ctx.strokeStyle = '#EF4444';
      ctx.lineWidth = 1.5;
      ctx.setLineDash([4, 3]);
      ctx.beginPath();
      ctx.moveTo(gapStartX, 0);
      ctx.lineTo(gapStartX, height);
      ctx.moveTo(gapEndX, 0);
      ctx.lineTo(gapEndX, height);
      ctx.stroke();
      ctx.setLineDash([]);

      // 2) 실제 음원 파형 바 드로잉
      for (let i = 0; i < totalBars; i++) {
        const x = i * step + step * 0.15;
        let amp = 0.02;
        let grad = null;

        if (i < gapStartIdx) {
          // Track 01: 네온 사이언 ➔ 일렉트릭 블루 그라데이션
          amp = track1Bars[i % track1Bars.length];
          grad = ctx.createLinearGradient(0, midY - height * 0.45, 0, midY + height * 0.45);
          grad.addColorStop(0, '#00F0FF');
          grad.addColorStop(0.5, '#38BDF8');
          grad.addColorStop(1, '#818CF8');
        } else if (i <= gapEndIdx) {
          // 묵음 구간: 플랫라인 빨간색 미세 노이즈 (-48dB 잔류)
          amp = 0.02 + Math.sin(i * 0.8) * 0.008;
          grad = '#F87171';
        } else {
          // Track 02: 퍼플 ➔ 코랄 로즈 그라데이션
          const t2Idx = i - gapEndIdx - 1;
          amp = track2Bars[t2Idx % track2Bars.length];
          grad = ctx.createLinearGradient(0, midY - height * 0.45, 0, midY + height * 0.45);
          grad.addColorStop(0, '#C084FC');
          grad.addColorStop(0.5, '#A855F7');
          grad.addColorStop(1, '#FB7185');
        }

        const barH = amp * (height * 0.44);
        ctx.fillStyle = grad;
        ctx.beginPath();
        if (ctx.roundRect) {
          ctx.roundRect(x, midY - barH, barWidth, barH * 2, [1.5]);
        } else {
          ctx.rect(x, midY - barH, barWidth, barH * 2);
        }
        ctx.fill();
      }

      // 무음 구간 중앙의 빨간색 알림 배지 (Red Caution Badge)
      const badgeW = 162;
      const badgeH = 24;
      const badgeX = gapStartX + (gapWidth - badgeW) / 2;
      const badgeY = midY - badgeH / 2;

      ctx.fillStyle = 'rgba(220, 38, 38, 0.94)';
      ctx.strokeStyle = '#FCA5A5';
      ctx.lineWidth = 1;
      ctx.beginPath();
      if (ctx.roundRect) {
        ctx.roundRect(badgeX, badgeY, badgeW, badgeH, [12]);
      } else {
        ctx.rect(badgeX, badgeY, badgeW, badgeH);
      }
      ctx.fill();
      ctx.stroke();

      ctx.font = '700 11px Pretendard, sans-serif';
      ctx.fillStyle = '#FFFFFF';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText('⚠️ 2.8초 묵음 구간 (-48dB)', badgeX + badgeW / 2, badgeY + badgeH / 2);

      // 상단 트랙 레이블 메타데이터
      ctx.font = '700 10px var(--font-mono, monospace)';
      ctx.fillStyle = 'rgba(255, 255, 255, 0.55)';
      ctx.textAlign = 'left';
      ctx.fillText('TRACK 01 • 천천히 물들어 갈래', 8, 13);
      ctx.fillText('TRACK 02 • 따뜻한 오후 햇살', gapEndX + 8, 13);

    } else {
      // -------------------------------------------------------------
      // AFTER (JENT PRO 0-Gap): Track 01 + Track 02 + Track 03 (끊김 없는 결합)
      // -------------------------------------------------------------
      const spliceIdx1 = 58;
      const spliceIdx2 = 112;
      const seamX1 = spliceIdx1 * step;
      const seamX2 = spliceIdx2 * step;

      // 무음 공백이 0.0초로 삭제된 완벽한 연속 파형 드로잉
      for (let i = 0; i < totalBars; i++) {
        const x = i * step + step * 0.15;
        let amp = 0.1;
        let grad = null;

        if (i <= spliceIdx1) {
          // Track 01
          amp = track1Bars[i % track1Bars.length];
          grad = ctx.createLinearGradient(0, midY - height * 0.45, 0, midY + height * 0.45);
          grad.addColorStop(0, '#00F0FF');
          grad.addColorStop(1, '#10B981');
        } else if (i <= spliceIdx2) {
          // Track 02 (딜레이 없이 즉각 결합)
          const t2Idx = i - spliceIdx1 - 1;
          amp = track2Bars[t2Idx % track2Bars.length];
          grad = ctx.createLinearGradient(0, midY - height * 0.45, 0, midY + height * 0.45);
          grad.addColorStop(0, '#10B981');
          grad.addColorStop(0.6, '#38BDF8');
          grad.addColorStop(1, '#818CF8');
        } else {
          // Track 03
          const t3Idx = i - spliceIdx2 - 1;
          amp = track3Bars[t3Idx % track3Bars.length];
          grad = ctx.createLinearGradient(0, midY - height * 0.45, 0, midY + height * 0.45);
          grad.addColorStop(0, '#818CF8');
          grad.addColorStop(1, '#C084FC');
        }

        const barH = amp * (height * 0.44);
        ctx.fillStyle = grad;
        ctx.beginPath();
        if (ctx.roundRect) {
          ctx.roundRect(x, midY - barH, barWidth, barH * 2, [1.5]);
        } else {
          ctx.rect(x, midY - barH, barWidth, barH * 2);
        }
        ctx.fill();
      }

      // 빛나는 0-Gap 스플라이스 솔기 마커 1
      ctx.shadowColor = '#00F0FF';
      ctx.shadowBlur = 8;
      ctx.strokeStyle = '#00F0FF';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(seamX1, 0);
      ctx.lineTo(seamX1, height);
      ctx.stroke();

      // 빛나는 0-Gap 스플라이스 솔기 마커 2
      ctx.shadowColor = '#10B981';
      ctx.strokeStyle = '#10B981';
      ctx.beginPath();
      ctx.moveTo(seamX2, 0);
      ctx.lineTo(seamX2, height);
      ctx.stroke();
      ctx.shadowBlur = 0;

      // 0-Gap 자동 스플라이스 배지
      const pill1W = 168;
      const pill1H = 22;
      const pill1X = Math.max(8, seamX1 - pill1W / 2);
      const pill1Y = 7;

      ctx.fillStyle = 'rgba(6, 78, 59, 0.94)';
      ctx.strokeStyle = '#34D399';
      ctx.lineWidth = 1;
      ctx.beginPath();
      if (ctx.roundRect) {
        ctx.roundRect(pill1X, pill1Y, pill1W, pill1H, [11]);
      } else {
        ctx.rect(pill1X, pill1Y, pill1W, pill1H);
      }
      ctx.fill();
      ctx.stroke();

      ctx.font = '700 10.5px Pretendard, sans-serif';
      ctx.fillStyle = '#6EE7B7';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText('⚡ 0-Gap 자동 스플라이스 (5ms)', pill1X + pill1W / 2, pill1Y + pill1H / 2);

      // 하단 트랙 인덱스 레이블
      ctx.font = '700 10px var(--font-mono, monospace)';
      ctx.fillStyle = 'rgba(255, 255, 255, 0.55)';
      ctx.textAlign = 'left';
      ctx.fillText('TRACK 01', 8, height - 9);
      ctx.fillText('TRACK 02 (0-GAP 결합)', seamX1 + 8, height - 9);
      ctx.fillText('TRACK 03', seamX2 + 8, height - 9);
    }
  }

  function renderWaveforms() {
    drawDawWaveform(beforeWaveCanvas, 'before');
    drawDawWaveform(afterWaveCanvas, 'after');
  }

  window.addEventListener('resize', renderWaveforms);
  setTimeout(renderWaveforms, 200);

  if (copyChaptersBtn) {
    copyChaptersBtn.addEventListener('click', () => {
      const text = `00:00 01. 천천히 물들어 갈래 - june\n01:50 02. 따뜻한 오후 햇살 - june\n04:22 03. 밤하늘 별빛 아래 - june`;
      navigator.clipboard.writeText(text).then(() => {
        showToast('📋 유튜브 설명란 타임스탬프 3개 트랙 복사 완료!');
      }).catch(() => {
        showToast('📋 타임스탬프 텍스트가 클립보드에 준비되었습니다.');
      });
    });
  }

  if (triggerAiAutofillBtn) {
    triggerAiAutofillBtn.addEventListener('click', () => {
      triggerAiAutofillBtn.disabled = true;
      triggerAiAutofillBtn.textContent = '✨ 최신 AI가 가사 구조를 계산 중...';

      setTimeout(() => {
        mockupTitle.value = '다시 시작해 (Midnight Dawn)';
        mockupTitle.classList.add('highlight-fill');

        mockupStyle.value = 'K-Pop Ballad, Lo-Fi Chill Synth, 82 BPM, Warm Piano, Emotional Female Vocal';
        mockupStyle.classList.add('highlight-fill');

        mockupLyrics.value = 
`[Verse 1]
차가운 바람이 스쳐가고 (8자 • 안정)
멈춘 발걸음 (5자)

[Chorus]
숨을 쉬어봐 (5자 🔻 급강하 훅)
다시 시작해 너를 믿어봐 (14자 🔺 다이내믹)`;
        mockupLyrics.classList.add('highlight-fill');

        triggerAiAutofillBtn.disabled = false;
        triggerAiAutofillBtn.textContent = '🔄 다시 자동채우기 시연';

        showToast('🚀 좌측 Suno Create 화면에 원클릭 Auto-Fill 완료!');

        setTimeout(() => {
          mockupTitle.classList.remove('highlight-fill');
          mockupStyle.classList.remove('highlight-fill');
          mockupLyrics.classList.remove('highlight-fill');
        }, 2000);
      }, 700);
    });
  }

  function showToast(msg) {
    if (!toastNotification) return;
    toastNotification.textContent = msg;
    toastNotification.style.opacity = '1';
    toastNotification.style.transform = 'translate(-50%, 0)';
    setTimeout(() => {
      toastNotification.style.opacity = '0';
      toastNotification.style.transform = 'translate(-50%, 15px)';
    }, 2400);
  }

  // Initial setup
  updateSlide(0);
});
