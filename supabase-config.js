/**
 * JENT STUDIO - Supabase Free Cloud Database & Auth Configuration
 * ===============================================================
 * 무료 클라우드 PostgreSQL DB & Auth(회원가입/로그인) 연동 모듈
 * 
 * [연동 가이드]
 * 1. https://supabase.com 무료 가입 후 새 프로젝트를 생성합니다.
 * 2. Settings > API 에서 'Project URL'과 'anon public key'를 복사합니다.
 * 3. 아래 SUPABASE_CONFIG의 url과 anonKey에 입력하면 즉시 실시간 클라우드 DB로 전환됩니다.
 * 4. 설정하지 않거나 키가 유효하지 않을 경우, 안전한 LocalStorage 모드로 자동 Fallback됩니다.
 */

const SUPABASE_CONFIG = {
  // 주인님의 Supabase 프로젝트 Base URL
  url: 'https://nrrlovpoawyrdiaalbun.supabase.co',

  // 주인님의 Supabase Publishable Public Key
  anonKey: 'sb_publishable_-mC-kcM9pMHBznzj3V3c0Q_9F8km3qL',

  // 기본 활성화 플래그 (유효한 키 입력 여부 확인)
  isConfigured: function() {
    return this.url && 
           this.anonKey && 
           !this.url.includes('YOUR_PROJECT_ID') && 
           !this.anonKey.includes('YOUR_ANON_KEY');
  }
};

// URL 정규화 헬퍼 (뒤에 /rest/v1 등이 붙어 있어도 안전하게 기본 origin 추출)
function sanitizeSupabaseUrl(rawUrl) {
  if (!rawUrl) return '';
  try {
    const parsed = new URL(rawUrl);
    return `${parsed.protocol}//${parsed.host}`;
  } catch (e) {
    return rawUrl.replace(/\/rest\/v1\/?$/, '').replace(/\/+$/, '');
  }
}

// Supabase Client Instance (SDK 로드 시 생성)
let supabaseClient = null;

function initSupabase() {
  if (typeof window.supabase !== 'undefined' && SUPABASE_CONFIG.isConfigured()) {
    try {
      const cleanUrl = sanitizeSupabaseUrl(SUPABASE_CONFIG.url);
      supabaseClient = window.supabase.createClient(cleanUrl, SUPABASE_CONFIG.anonKey);
      console.log('✅ [JENT STUDIO] Supabase 클라우드 DB & Auth 연동 완료:', cleanUrl);
      return supabaseClient;
    } catch (err) {
      console.warn('⚠️ [JENT STUDIO] Supabase 초기화 실패, 로컬 모드로 동작합니다:', err);
      return null;
    }
  } else {
    console.log('ℹ️ [JENT STUDIO] Supabase 키 미설정 상태 - 안전한 로컬 데모(LocalStorage) 모드로 동작합니다.');
    return null;
  }
}

// Global Export
window.SUPABASE_CONFIG = SUPABASE_CONFIG;
window.getSupabase = function() {
  if (!supabaseClient && SUPABASE_CONFIG.isConfigured()) {
    return initSupabase();
  }
  return supabaseClient;
};
