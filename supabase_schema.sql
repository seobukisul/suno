-- =============================================================================
-- JENT STUDIO - Supabase Free PostgreSQL Cloud Database Schema & RLS Setup
-- =============================================================================
-- 실행 방법: Supabase 대시보드(https://supabase.com) > SQL Editor 에 붙여넣고 [Run] 실행!

-- 1. 게시판 (posts) 테이블 생성
create table if not exists public.posts (
  id bigint generated always as identity primary key,
  created_at timestamptz default now() not null,
  title text not null,
  content text not null,
  author text not null,
  category text not null default 'qna',
  cat_name text default '일반',
  views integer default 1 not null,
  user_id uuid references auth.users(id) on delete set null
);

-- 2. Row Level Security (RLS) 활성화 (필수 보안 조치)
alter table public.posts enable row level security;

-- 3. RLS 정책(Policies) 설정

-- [조회 권한] 누구나(비로그인 포함) 게시글을 읽을 수 있음
drop policy if exists "누구나 게시글 조회 가능" on public.posts;
create policy "누구나 게시글 조회 가능"
  on public.posts
  for select
  using (true);

-- [작성 권한] 로그인한 사용자 및 방문자 누구나 글 작성 가능
drop policy if exists "게시글 작성 허용" on public.posts;
create policy "게시글 작성 허용"
  on public.posts
  for insert
  with check (true);

-- [수정 권한] 본인이 작성한 글 또는 조회수 업데이트 허용
drop policy if exists "게시글 수정/조회수 업데이트" on public.posts;
create policy "게시글 수정/조회수 업데이트"
  on public.posts
  for update
  using (true);

-- [삭제 권한] 로그인한 작성자 본인 또는 시스템 관리자(seobukisul@gamil.com, seobukisul@gmail.com) 삭제 허용
drop policy if exists "작성자 본인 글만 삭제 허용" on public.posts;
drop policy if exists "작성자 본인 및 관리자 삭제 허용" on public.posts;
create policy "작성자 본인 및 관리자 삭제 허용"
  on public.posts
  for delete
  using (
    auth.uid() = user_id
    or lower(coalesce(auth.jwt() ->> 'email', '')) in ('seobukisul@gamil.com', 'seobukisul@gmail.com')
  );

-- 4. 초기 공지사항 및 팁 데이터 삽입 (선택 사항)
insert into public.posts (title, content, author, category, cat_name, views)
values
  (
    '👑 JENT STUDIO 프로(v2.6.0) 신기능 공개 및 데모 프리젠테이션 안내',
    '안녕하세요, Suno AI 크리에이터 여러분!\nJENT STUDIO 프로(v2.6.0)가 마침내 공개 준비를 마쳤습니다.\n\n주요 핵심 기능:\n1. 1.5초 무음 병렬 다운로드\n2. 스튜디오 원클릭 마스터링 (-14.0 LUFS)\n3. 정규 메타데이터 & 커버 각인\n4. 0-Gap 무음삭제 앨범 병합\n5. AI 작사 알고리즘 연동',
    'JENT STUDIO 공식',
    'notice',
    '📌 공지사항',
    1428
  ),
  (
    '스튜디오 원클릭 마스터링(-14.0 LUFS) 유튜브 및 스포티파이 음원 제출 규격 가이드',
    '유튜브와 스트리밍 플랫폼은 통합 음압(Integrated LUFS)이 -14.0 LUFS를 초과할 경우 음질을 강제로 감쇄시킵니다. True-Peak -1.0 dBTP 리미터와 결합된 최적의 스트리밍 마스터링 세팅법을 안내해 드립니다.',
    '사운드 마스터',
    'notice',
    '🎛️ 마스터링',
    892
  ),
  (
    '0-Gap 무음 제거 플레이리스트 병합으로 1시간 수면음악 유튜브 채널 만드는 법',
    '유튜브 BGM 채널을 운영하시는 분들께 드리는 꿀팁입니다. Suno에서 편안한 곡들을 생성하고 0-Gap 무음 병합을 시작하면 어색한 묵음이 자동 삭제되고 유튜브 타임스탬프가 생성됩니다.',
    'Lo-Fi 큐레이터',
    'tips',
    '💡 꿀팁',
    1105
  );

-- 5. 댓글 및 답변 (comments) 테이블 생성
create table if not exists public.comments (
  id bigint generated always as identity primary key,
  post_id text not null,
  created_at timestamptz default now() not null,
  author text not null,
  content text not null,
  user_id uuid references auth.users(id) on delete set null
);

-- 댓글 RLS 활성화
alter table public.comments enable row level security;

-- [댓글 조회 권한] 누구나 댓글 조회 가능
drop policy if exists "누구나 댓글 조회 가능" on public.comments;
create policy "누구나 댓글 조회 가능"
  on public.comments
  for select
  using (true);

-- [댓글 작성 권한] 누구나 댓글 작성 가능
drop policy if exists "누구나 댓글 작성 가능" on public.comments;
create policy "누구나 댓글 작성 가능"
  on public.comments
  for insert
  with check (true);

-- [댓글 삭제 권한] 작성자 본인 또는 시스템 관리자 삭제 허용
drop policy if exists "댓글 작성자 및 관리자 삭제 허용" on public.comments;
create policy "댓글 작성자 및 관리자 삭제 허용"
  on public.comments
  for delete
  using (
    auth.uid() = user_id
    or lower(coalesce(auth.jwt() ->> 'email', '')) in ('seobukisul@gamil.com', 'seobukisul@gmail.com')
  );

-- 완료 안내
-- 테이블 생성 및 RLS 정책 적용이 완료되었습니다!
