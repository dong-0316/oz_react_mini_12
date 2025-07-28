import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Layout from './components/Layout'; // Layout 컴포넌트 import
import MainPage from './pages/MainPage';
import DetailPage from './pages/DetailPage';
import SearchPage from './pages/SearchPage';

/**
 * 앱의 메인 라우팅을 설정하는 컴포넌트
 * Layout Route를 사용하여 모든 페이지에 공통 NavBar를 적용
 */
function App() {
  return (
    <Routes>
      {/* Layout 컴포넌트를 부모 Route로 설정 */}
      {/* 이 Route 안에 있는 자식 Route들은 모두 Layout의 Outlet에 렌더링됨 */}
      <Route element={<Layout />}>
        <Route path="/" element={<MainPage />} />
        <Route path="/movie/:movieId" element={<DetailPage />} />
        <Route path="/search" element={<SearchPage />} />
      </Route>
    </Routes>
  );
}

export default App;
