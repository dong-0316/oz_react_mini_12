import React, { useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import { useSupabaseAuth } from './context/AuthContext';
import Layout from './components/Layout'; // Layout 컴포넌트 import
import MainPage from './pages/MainPage';
import DetailPage from './pages/DetailPage';
import SearchPage from './pages/SearchPage';
import MyPage from './pages/MyPage';
import ProtectedRoute from './components/ProtectedRoute';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';


/**
 * 앱의 메인 라우팅을 설정하는 컴포넌트
 * Layout Route를 사용하여 모든 페이지에 공통 NavBar를 적용
 */
function App() {
  const { getUserInfo } = useSupabaseAuth();

  // 앱이 처음 로드될 때 사용자 정보를 가져와서 로그인 상태를 복원
  useEffect(() => {
    getUserInfo();
  }, [getUserInfo]);
  return (
    <Routes>
      {/* Layout 컴포넌트를 부모 Route로 설정 */}
      {/* 이 Route 안에 있는 자식 Route들은 모두 Layout의 Outlet에 렌더링됨 */}
      <Route element={<Layout />}>
                <Route path="/" element={<MainPage />} />
        <Route 
          path="/mypage" 
          element={
            <ProtectedRoute>
              <MyPage />
            </ProtectedRoute>
          }
        />
        <Route path="/movie/:movieId" element={<DetailPage />} />
        <Route path="/search" element={<SearchPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
      </Route>
    </Routes>
  );
}

export default App;
