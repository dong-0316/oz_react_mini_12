import { createClient } from '@supabase/supabase-js';

// .env 파일에서 Supabase URL과 anon key를 가져온다.
// Vite를 사용하므로 'import.meta.env'를 통해 환경 변수에 접근해야 한다.
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Supabase 클라이언트를 생성한다.
// 이 클라이언트를 통해 Supabase의 다양한 기능(인증, 데이터베이스 등)을 사용할 수 있다.
export const supabase = createClient(supabaseUrl, supabaseAnonKey);
