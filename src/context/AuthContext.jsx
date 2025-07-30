import { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../api/supabaseClient';

// 1. AuthContext 생성
// 이 Context는 앱 전체에 인증 상태와 함수들을 전파하는 역할을 한다.
const AuthContext = createContext();

// 2. SupabaseProvider 컴포넌트
// Context의 Provider. 인증과 관련된 모든 로직을 이 안에서 처리한다.
export function SupabaseProvider({ children }) {
  const [user, setUser] = useState(null); // 로그인된 사용자 정보를 담을 state

  // 페이지 로드 시 또는 인증 상태 변경 시 사용자 정보를 가져와 state를 업데이트하고
  // localStorage에도 저장/삭제 한다.
  useEffect(() => {
    // 현재 세션 정보를 가져온다. 새로고침해도 로그인 상태를 유지하기 위함.
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        const currentUser = session.user;
        // 추가 사용자 정보(예: userName)가 user_metadata에 있을 수 있다.
        const fullUser = { ...currentUser, userName: currentUser.user_metadata?.userName };
        setUser(fullUser);
        localStorage.setItem('userInfo', JSON.stringify(fullUser));
      }
    });

    // 인증 상태 변경(로그인, 로그아웃 등)을 감지하는 리스너 설정
    const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
      if (session) {
        const currentUser = session.user;
        const fullUser = { ...currentUser, userName: currentUser.user_metadata?.userName };
        setUser(fullUser);
        localStorage.setItem('userInfo', JSON.stringify(fullUser));
      } else {
        setUser(null);
        localStorage.removeItem('userInfo');
      }
    });

    // 컴포넌트가 언마운트될 때 리스너를 정리한다.
    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  // 회원가입 함수
  const signUp = async ({ email, password, userName }) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { userName } } // 추가 정보는 options.data에 담아 보낸다.
    });
    if (error) console.error('Error signing up:', error);
    return { user: data.user, error };
  };

  // 로그인 함수
  const login = async ({ email, password }) => {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) console.error('Error logging in:', error);
    return { user: data.user, error };
  };

  // 로그아웃 함수
  const logout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) console.error('Error logging out:', error);
  };

  // 구글 소셜 로그인 함수
  const loginWithGoogle = async () => {
    const { error } = await supabase.auth.signInWithOAuth({ provider: 'google' });
    if (error) console.error('Error with Google login:', error);
  };

  // getUserInfo 함수 (요구사항에 따라 LocalStorage에서 정보를 가져오는 역할로 정의)
  const getUserInfo = () => {
    try {
      const userInfo = localStorage.getItem('userInfo');
      return userInfo ? JSON.parse(userInfo) : null;
    } catch (error) {
      console.error('Failed to get user info from localStorage:', error);
      return null;
    }
  };

  // Context Provider를 통해 전달할 값들
  const value = {
    user,
    signUp,
    login,
    logout,
    loginWithGoogle,
    getUserInfo
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

// 3. useSupabaseAuth 커스텀 훅
// 다른 컴포넌트에서 쉽게 Context의 값들을 사용할 수 있게 해준다.
export const useSupabaseAuth = () => {
  return useContext(AuthContext);
};
