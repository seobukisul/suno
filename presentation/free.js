/**
 * JENT STUDIO Free Edition Slide Controller (free.js)
 * 픽미 수강생 전용 무제한 다운로더 발표 전용 스크립트 (수노 9.3 팩트 통계 반영)
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

  // Speaker notes data grounded in Argon's factual metrics
  const speakerNotes = [
    // Slide 1
    `<strong>[오프닝 충격 훅 - 1분 30초]</strong><br>
    - <em>"여러분, 지난 9월 3일 수노의 다운로드 정책이 완전히 바뀐 것 알고 계신가요?"</em><br>
    - 일반 다운로드 공급 물량이 무려 97%나 증발했습니다.<br>
    - <em>"하지만 절망할 이유가 전혀 없습니다. 자동화 스크립트로 도배하던 양산형 채널들이 전멸하고 있는 지금이, 바로 우리 픽미 수강생들에게는 역사상 가장 거대한 독점의 기회입니다!"</em><br>
    - 오늘 여러분을 위해 <strong>'플랜 상관없는 무제한 무손실 다운로더'</strong>를 전격 공개합니다.`,
    
    // Slide 2
    `<strong>[수노 정책 충격 팩트 체크 - 2분]</strong><br>
    - <strong>객관적 수치 제시 (충격 효과 극대화)</strong>:<br>
      • <strong>Free 플랜</strong>: 기존 무제한 ➔ <strong>평생 총 7곡</strong> (월 리셋 없음, 사실상 100% 차단!)<br>
      • <strong>Pro 플랜 ($10)</strong>: 월 500곡 생성 가능하나 다운로드는 <strong>월 20곡</strong> (96% 급감!)<br>
      • <strong>Premier 플랜 ($30)</strong>: 1만 크레딧을 줘도 다운로드는 <strong>월 60곡</strong> (97% 급감!)<br>
    - <em>"결과적으로, 매일 수백 곡씩 기계적으로 긁어가던 자동화 봇 파이프라인이 완전히 붕괴되었습니다."</em>`,
    
    // Slide 3
    `<strong>[유튜브 생태계 대숙청 팩트 - 2분]</strong><br>
    - <strong>플랫폼 제재 통계 공개</strong>:<br>
      • Deezer 통계: 하루 75,000곡 AI 스팸 업로드 중 85%가 사기 봇 트래픽 적발 ➔ 정산 동결!<br>
      • 유튜브의 대숙청: 무려 <strong>47억 뷰, 연간 135억 원 수익을 올리던 대형 양산 채널 16개가 일거에 영구 퇴출</strong>되었습니다.<br>
      • 10월 3일 유튜브 AI 음악 공시 의무화: 정지 이미지 1장 걸고 음악만 나열하던 채널들은 이제 수익 창출이 모조리 정지됩니다.<br>
    - <em>"스팸 채널들이 자멸하는 지금, 제대로 기획해서 고품질 음원을 만드는 우리에게 유튜브 알고리즘 트래픽이 쏠리는 완벽한 독점 판이 열렸습니다!"</em>`,

    // Slide 4
    `<strong>[현실의 마지막 족쇄 - 1분 30초]</strong><br>
    - <em>"하지만 여전히 한 가지 치명적인 문제가 있습니다. 한 달에 고작 20곡, 60곡으로는 제대로 된 플레이리스트를 만들 수 없다는 점입니다."</em><br>
    - 1시간 플리 1개 만들면 20곡 다운로드가 끝나버립니다. 게다가 일반 화면 녹음기는 카톡 소리나 컴퓨터 잡음이 섞여 음원이 오염됩니다.<br>
    - <em>"만약 유료 결제 없이도, 크레딧 차감 0으로, 무제한 100% 무손실 다운로드가 가능하다면 어떨까요?"</em>`,

    // Slide 5
    `<strong>[선물보따리 전격 공개 - 2분]</strong><br>
    - <em>"오늘 오신 픽미 수강생 여러분 모두에게 이 자리에서 100% 무료로 선물해 드립니다!"</em><br>
    - <strong>JENT STUDIO 무료 에디션 (Suno 오디오 캡처 확장프로그램)</strong> 전격 배포 발표!<br>
    - 월 20곡 제한 완전 해제, 크레딧 차감 0, 16-bit 무손실 WAV & 320k MP3 영구 소장 가능.<br>
    - 수강생들의 폭발적인 박수와 환호를 유도하세요!`,

    // Slide 6
    `<strong>[사운드 격리 기술 증명 - 2분 30초]</strong><br>
    - <em>"일반 화면 녹음기와 무엇이 다를까요? 바로 100% 사운드 격리 기술입니다."</em><br>
    - <strong>인터랙션</strong>: [💬 "카톡!" 알림음 발생] 또는 ["카카오톡!"] 버튼을 직접 누릅니다.<br>
    - 카톡 음성이 스피커로 생생하게 울려 퍼져도, OS 믹서를 우회하고 Web Audio 노드에서 직결 추출하기 때문에 JENT STUDIO의 음원에는 <strong>외부 소음이 0.0dB로 완전 차단</strong>됨을 시각적으로 입증합니다.`,

    // Slide 7
    `<strong>[1분 설치 가이드 - 2분]</strong><br>
    - <em>"오늘 강의 끝나고 1분 만에 설치해서 바로 쓰실 수 있습니다!"</em><br>
    - 1단계: 화면에 보이는 공식 웹사이트 <strong>https://sunodown.vercel.app</strong> 접속 후 ZIP 다운로드<br>
    - 2단계: whale://extensions 또는 chrome://extensions 접속 ➔ [개발자 모드] ON<br>
    - 3단계: [압축해제된 확장앱 설치] 클릭 후 압축 푼 폴더 지정하면 끝!`,

    // Slide 8
    `<strong>[실전 원클릭 다운로드 - 2분]</strong><br>
    - suno.com에서 원하는 노래 재생 ➔ 하단 플레이어 바 옆 <strong>[💾 WAV]</strong> 또는 <strong>[🎵 MP3]</strong> 클릭 한 번이면 끝!<br>
    - 복잡한 회원가입이나 인증 없이 평생 무료로 무제한 사용하라고 안내합니다.`,

    // Slide 9
    `<strong>[무손실 WAV의 가치 - 1분 30초]</strong><br>
    - 20kHz 초고역대 보존, 유튜브 재압축 시 음질 뭉개짐 방지, 정식 음원 유통사 규격 충족.<br>
    - 왜 픽미 크리에이터가 MP3가 아닌 WAV 원음을 소장해야 하는지 품질 격차를 강조합니다.`,

    // Slide 10
    `<strong>[클로징 & 지금 바로 실습 - 2분]</strong><br>
    - <em>"더 이상 수노의 월 20곡 제한에 갇히지 마세요. 지금 여러분 손에 무제한 무손실 다운로더를 쥐어드립니다!"</em><br>
    - 화면의 대형 주소 <strong>https://sunodown.vercel.app</strong>을 가리키며 지금 바로 노트북/스마트폰으로 접속하라고 안내.<br>
    - <em>"지금 바로 설치하시고, 여러분만의 멋진 첫 곡을 무제한 무손실로 뽑아보세요! 질문 있으신 분 편하게 말씀해 주세요."</em>`
  ];

  function updateSlide(newIdx) {
    if (newIdx < 0 || newIdx >= totalSlides) return;

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

    // 보물상자 오프닝 오버레이가 활성화되어 있을 때의 키 인터셉트
    const chestOverlay = document.getElementById('chestIntroOverlay');
    if (chestOverlay && !chestOverlay.classList.contains('hidden')) {
      if (e.key === ' ' || e.key === 'Enter') {
        e.preventDefault();
        if (typeof window.triggerChestOpen === 'function') {
          window.triggerChestOpen();
        }
        return;
      }
      if (e.key === 'Escape') {
        e.preventDefault();
        if (typeof window.skipChestIntro === 'function') {
          window.skipChestIntro();
        }
        return;
      }
    }

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
    const catText = slide.querySelector('.slide-category')?.textContent || '무료 에디션';

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
  // 2. Slide 06: Noise Isolation Live Simulator (실제 카톡/카카오톡 음성 데모)
  // =========================================================================
  const triggerNoiseBtn = document.getElementById('triggerNoiseBtn');
  const triggerKakaotalkBtn = document.getElementById('triggerKakaotalkBtn');
  const normalNoiseFill = document.getElementById('normalNoiseFill');
  const normalNoiseStatus = document.getElementById('normalNoiseStatus');
  const jentNoiseFill = document.getElementById('jentNoiseFill');
  const jentNoiseStatus = document.getElementById('jentNoiseStatus');

  let simAudioCtx = null;
  function getSimAudioContext() {
    if (!simAudioCtx) {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      simAudioCtx = new AudioCtx();
    }
    if (simAudioCtx.state === 'suspended') {
      simAudioCtx.resume();
    }
    return simAudioCtx;
  }

  let katalkBuffer = null;
  let kakaotalkBuffer = null;
  let isSoundsLoading = false;

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

  async function loadKakaoAudioBuffers() {
    if (katalkBuffer && kakaotalkBuffer) return;
    if (isSoundsLoading) return;
    isSoundsLoading = true;
    const ctx = getSimAudioContext();

    // 1순위: Zero-CORS window.__KATALK_AUDIO_BASE64__ (file:/// 더블클릭 환경에서도 100% 정상 작동)
    if (window.__KATALK_AUDIO_BASE64__ && window.__KAKAOTALK_AUDIO_BASE64__) {
      try {
        const [buf1, buf2] = await Promise.all([
          dataUriToArrayBuffer(window.__KATALK_AUDIO_BASE64__),
          dataUriToArrayBuffer(window.__KAKAOTALK_AUDIO_BASE64__)
        ]);
        katalkBuffer = await ctx.decodeAudioData(buf1);
        kakaotalkBuffer = await ctx.decodeAudioData(buf2);
        isSoundsLoading = false;
        return;
      } catch (err) {
        console.warn('Kakao Base64 decode error:', err);
      }
    }

    // 2순위: 로컬 HTTP 서버 fetch
    try {
      const [res1, res2] = await Promise.all([
        fetch('assets/audio/katalk.wav'),
        fetch('assets/audio/kakaotalk.wav')
      ]);
      const [buf1, buf2] = await Promise.all([
        res1.arrayBuffer(),
        res2.arrayBuffer()
      ]);
      katalkBuffer = await ctx.decodeAudioData(buf1);
      kakaotalkBuffer = await ctx.decodeAudioData(buf2);
    } catch (err) {
      console.warn('Failed to decode kakao wav buffers:', err);
    } finally {
      isSoundsLoading = false;
    }
  }

  // 슬라이드 진입 전 미리 메모리에 버퍼 디코딩 완료
  setTimeout(() => {
    loadKakaoAudioBuffers().catch(() => {});
  }, 600);

  // 고출력 마스터링 볼륨 부스터 재생 함수 (현장 발표 전용 풍성하고 또렷한 사운드)
  async function playKakaoVoiceSound(type = 'katalk') {
    const ctx = getSimAudioContext();
    if (ctx.state === 'suspended') {
      await ctx.resume();
    }

    if (!katalkBuffer || !kakaotalkBuffer) {
      await loadKakaoAudioBuffers();
    }

    const buffer = (type === 'kakaotalk') ? kakaotalkBuffer : katalkBuffer;
    if (buffer) {
      const source = ctx.createBufferSource();
      source.buffer = buffer;

      // 음량 대폭 보강: 기존 0.2 대비 2.2배 고출력 게인
      const gainNode = ctx.createGain();
      gainNode.gain.setValueAtTime(2.2, ctx.currentTime);

      // 음 왜곡 방지 및 펀치감 강화를 위한 패스트 피크 리미터
      const limiter = ctx.createDynamicsCompressor();
      limiter.threshold.setValueAtTime(-0.5, ctx.currentTime);
      limiter.knee.setValueAtTime(0.0, ctx.currentTime);
      limiter.ratio.setValueAtTime(20.0, ctx.currentTime);
      limiter.attack.setValueAtTime(0.001, ctx.currentTime);
      limiter.release.setValueAtTime(0.05, ctx.currentTime);

      source.connect(gainNode);
      gainNode.connect(limiter);
      limiter.connect(ctx.destination);
      source.start();
    } else {
      // 오프라인 / 네트워크 비상 대비 HTML5 Audio 폴백 (최대 볼륨)
      const audio = new Audio(type === 'kakaotalk' ? 'assets/audio/kakaotalk.wav' : 'assets/audio/katalk.wav');
      audio.volume = 1.0;
      audio.play().catch(() => {});
    }
  }

  function triggerNoiseSimulation(type = 'katalk') {
    playKakaoVoiceSound(type);

    const isFullVoice = (type === 'kakaotalk');
    const label = isFullVoice ? '"카카오톡!"' : '"카톡!"';

    normalNoiseFill.style.width = '92%';
    normalNoiseFill.className = 'meter-fill bad';
    normalNoiseStatus.textContent = `🚨 외부 알림음 침투 감지 (${label} +9.6 dB 잡음 혼입)`;
    normalNoiseStatus.style.color = 'var(--rose)';

    jentNoiseFill.style.width = '8%';
    jentNoiseFill.className = 'meter-fill good';
    jentNoiseStatus.textContent = '🛡️ 외부 소음 100% 완전 차단 (0.0 dB 순수 원음 유지)';
    jentNoiseStatus.style.color = 'var(--emerald)';

    const activeBtn = isFullVoice ? triggerKakaotalkBtn : triggerNoiseBtn;
    if (activeBtn) {
      activeBtn.style.transform = 'scale(0.96)';
      setTimeout(() => { activeBtn.style.transform = ''; }, 150);
    }

    setTimeout(() => {
      normalNoiseFill.style.width = '35%';
      normalNoiseStatus.textContent = '스피커 출력 소음 잔류 대기';
      normalNoiseStatus.style.color = 'var(--text-dim)';
    }, isFullVoice ? 2200 : 1600);
  }

  if (triggerNoiseBtn) {
    triggerNoiseBtn.addEventListener('click', () => triggerNoiseSimulation('katalk'));
  }
  if (triggerKakaotalkBtn) {
    triggerKakaotalkBtn.addEventListener('click', () => triggerNoiseSimulation('kakaotalk'));
  }

  // =========================================================================
  // 4. Cinematic NanoBanana Treasure Chest Opening Engine
  // =========================================================================
  function initChestIntro() {
    const overlay = document.getElementById('chestIntroOverlay');
    const godRays = document.getElementById('chestGodRays');
    const flashBurst = document.getElementById('chestFlashBurst');
    const canvas = document.getElementById('chestParticleCanvas');
    const skipBtn = document.getElementById('skipChestBtn');
    const stage = document.getElementById('chestStageContainer');
    const closedImg = document.getElementById('chestClosedImg');
    const openImg = document.getElementById('chestOpenImg');
    const ctaWrap = document.getElementById('chestCtaWrap');
    const openBtn = document.getElementById('openChestBtn');
    const replayBtn = document.getElementById('replayOpeningBtn');

    if (!overlay || !canvas) return;

    let isOpening = false;
    let isFinished = false;
    const ctx = canvas.getContext('2d');
    let particles = [];
    let animId = null;

    function resizeCanvas() {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    }
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // Dynamic Star & Gem Particle Creator
    function spawnParticles() {
      const rect = stage ? stage.getBoundingClientRect() : { left: window.innerWidth / 2, top: window.innerHeight / 2, width: 0, height: 0 };
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height * 0.45;

      particles = [];
      const colors = ['#FEE500', '#F59E0B', '#00F0FF', '#A855F7', '#FFFFFF', '#FF3B81', '#38BDF8'];
      const totalParticles = 220;

      for (let i = 0; i < totalParticles; i++) {
        const angle = Math.random() * Math.PI * 2;
        const speed = 4 + Math.random() * 24;
        particles.push({
          x: cx,
          y: cy,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed - (Math.random() * 4), // upward bias
          color: colors[Math.floor(Math.random() * colors.length)],
          radius: 2.5 + Math.random() * 5.5,
          alpha: 1.0,
          decay: 0.01 + Math.random() * 0.018,
          gravity: 0.12,
          drag: 0.968,
          shape: Math.random() > 0.35 ? 'star' : 'circle',
          rotation: Math.random() * Math.PI * 2,
          rotSpeed: (Math.random() - 0.5) * 0.25
        });
      }

      if (!animId) {
        animateParticles();
      }
    }

    function drawStar(c, cx, cy, spikes, outerRadius, innerRadius) {
      let rot = Math.PI / 2 * 3;
      let x = cx;
      let y = cy;
      const step = Math.PI / spikes;

      c.beginPath();
      c.moveTo(cx, cy - outerRadius);
      for (let i = 0; i < spikes; i++) {
        x = cx + Math.cos(rot) * outerRadius;
        y = cy + Math.sin(rot) * outerRadius;
        c.lineTo(x, y);
        rot += step;

        x = cx + Math.cos(rot) * innerRadius;
        y = cy + Math.sin(rot) * innerRadius;
        c.lineTo(x, y);
        rot += step;
      }
      c.lineTo(cx, cy - outerRadius);
      c.closePath();
      c.fill();
    }

    function animateParticles() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      let aliveCount = 0;

      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        if (p.alpha <= 0) continue;

        aliveCount++;
        p.x += p.vx;
        p.y += p.vy;
        p.vy += p.gravity;
        p.vx *= p.drag;
        p.vy *= p.drag;
        p.alpha -= p.decay;
        p.rotation += p.rotSpeed;

        ctx.save();
        ctx.globalAlpha = Math.max(0, p.alpha);
        ctx.fillStyle = p.color;
        ctx.shadowColor = p.color;
        ctx.shadowBlur = 12;

        if (p.shape === 'star') {
          ctx.translate(p.x, p.y);
          ctx.rotate(p.rotation);
          drawStar(ctx, 0, 0, 4, p.radius * 1.8, p.radius * 0.6);
        } else {
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
          ctx.fill();
        }
        ctx.restore();
      }

      if (aliveCount > 0) {
        animId = requestAnimationFrame(animateParticles);
      } else {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        animId = null;
      }
    }

    // Synthesized "PANG!" Sound Effect (Sub-bass impact + noise air-blast + cascading crystal bells)
    function playChestExplosionSound() {
      try {
        const AudioContext = window.AudioContext || window.webkitAudioContext;
        if (!AudioContext) return;
        const actx = new AudioContext();
        if (actx.state === 'suspended') {
          actx.resume();
        }
        const now = actx.currentTime;

        // 1. Sub-bass Punch ("PANG!" 묵직한 타격음)
        const boomOsc = actx.createOscillator();
        const boomGain = actx.createGain();
        boomOsc.type = 'sine';
        boomOsc.frequency.setValueAtTime(190, now);
        boomOsc.frequency.exponentialRampToValueAtTime(32, now + 0.45);

        boomGain.gain.setValueAtTime(1.9, now);
        boomGain.gain.exponentialRampToValueAtTime(0.001, now + 0.55);

        boomOsc.connect(boomGain);
        boomGain.connect(actx.destination);
        boomOsc.start(now);
        boomOsc.stop(now + 0.6);

        // 2. Whoosh / Air Burst Noise (폭발 풍압음)
        const bufferSize = Math.floor(actx.sampleRate * 0.25);
        const noiseBuffer = actx.createBuffer(1, bufferSize, actx.sampleRate);
        const output = noiseBuffer.getChannelData(0);
        for (let i = 0; i < bufferSize; i++) {
          output[i] = Math.random() * 2 - 1;
        }
        const noiseSource = actx.createBufferSource();
        noiseSource.buffer = noiseBuffer;

        const noiseFilter = actx.createBiquadFilter();
        noiseFilter.type = 'bandpass';
        noiseFilter.frequency.setValueAtTime(950, now);
        noiseFilter.Q.setValueAtTime(1.3, now);

        const noiseGain = actx.createGain();
        noiseGain.gain.setValueAtTime(1.4, now);
        noiseGain.gain.exponentialRampToValueAtTime(0.001, now + 0.32);

        noiseSource.connect(noiseFilter);
        noiseFilter.connect(noiseGain);
        noiseGain.connect(actx.destination);
        noiseSource.start(now);
        noiseSource.stop(now + 0.35);

        // 3. Radiant Crystal Gem Chimes (영롱한 보석 쏟아지는 소리)
        const chimeFreqs = [1046.5, 1318.5, 1567.9, 2093.0, 2637.0, 3135.9]; // C6 ~ G7
        chimeFreqs.forEach((freq, idx) => {
          const chimeOsc = actx.createOscillator();
          const chimeGain = actx.createGain();
          const startTime = now + 0.03 + (idx * 0.05);

          chimeOsc.type = 'triangle';
          chimeOsc.frequency.setValueAtTime(freq, startTime);

          chimeGain.gain.setValueAtTime(0, startTime);
          chimeGain.gain.linearRampToValueAtTime(0.35, startTime + 0.025);
          chimeGain.gain.exponentialRampToValueAtTime(0.0001, startTime + 1.8);

          chimeOsc.connect(chimeGain);
          chimeGain.connect(actx.destination);
          chimeOsc.start(startTime);
          chimeOsc.stop(startTime + 1.9);
        });
      } catch (err) {
        console.warn('Audio impact fallback:', err);
      }
    }

    function triggerChestOpen() {
      if (isOpening || isFinished) return;
      isOpening = true;

      // 1. CTA 버튼 즉시 페이드아웃
      if (ctaWrap) ctaWrap.classList.add('fade-out');

      // 2. 사운드 및 입자 폭발
      playChestExplosionSound();
      spawnParticles();

      // 3. 카메라 진동 + 상자 열림 전환 + 후광 빛줄기
      if (stage) stage.classList.add('shake');
      if (closedImg) closedImg.classList.add('opened');
      if (openImg) openImg.classList.add('burst');
      if (godRays) godRays.classList.add('active');

      // 4. 화면 백색 플래시 폭발
      if (flashBurst) {
        flashBurst.classList.add('flash');
        setTimeout(() => {
          flashBurst.classList.remove('flash');
          flashBurst.classList.add('fade');
        }, 70);
      }

      // 5. 1.4초 후: 보석상자와 빛줄기가 점점 희미하게 사라짐 (스케일업 + 블러 + 페이드)
      setTimeout(() => {
        if (stage) stage.classList.add('dissolving');
      }, 1400);

      // 6. 2.2초 후: 오버레이 완전 투명화 및 클릭 통과 ➔ 슬라이드 1 완전 공개
      setTimeout(() => {
        if (overlay) overlay.classList.add('hidden');
        isFinished = true;
        isOpening = false;
      }, 2200);
    }

    function skipChestIntro() {
      if (overlay) overlay.classList.add('hidden');
      isFinished = true;
      isOpening = false;
    }

    function replayChestIntro() {
      isFinished = false;
      isOpening = false;
      if (overlay) overlay.classList.remove('hidden');
      if (stage) stage.classList.remove('dissolving', 'shake');
      if (closedImg) closedImg.classList.remove('opened');
      if (openImg) openImg.classList.remove('burst');
      if (godRays) godRays.classList.remove('active');
      if (flashBurst) flashBurst.classList.remove('flash', 'fade');
      if (ctaWrap) ctaWrap.classList.remove('fade-out');
      updateSlide(0);
    }

    // Expose to window for keyboard listener
    window.triggerChestOpen = triggerChestOpen;
    window.skipChestIntro = skipChestIntro;

    // Click triggers
    if (openBtn) {
      openBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        triggerChestOpen();
      });
    }
    if (stage) {
      stage.addEventListener('click', triggerChestOpen);
    }
    if (skipBtn) {
      skipBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        skipChestIntro();
      });
    }
    if (replayBtn) {
      replayBtn.addEventListener('click', replayChestIntro);
    }
  }

  // Initialize Chest Opening
  initChestIntro();

  // Initial setup
  updateSlide(0);
});
