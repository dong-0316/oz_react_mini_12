import React, { useState, useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import NavBar from './NavBar';

/**
 * 공통 레이아웃을 정의하는 컴포넌트
 * NavBar를 상단에 렌더링하고, 페이지의 실제 내용은 Outlet을 통해 렌더링
 */
function Layout() {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const location = useLocation(); // 현재 경로 정보를 가져옴

  // 메인 페이지 여부에 따라 동적으로 클래스 이름을 결정
  const containerClassName = 
    location.pathname === '/'
      ? 'main-content-container netflix-style'
      : 'main-content-container';

  // isDarkMode 상태가 변경될 때마다 body 태그에 클래스를 토글합니다.
  useEffect(() => {
    if (isDarkMode) {
      document.body.classList.add('dark-mode');
    } else {
      document.body.classList.remove('dark-mode');
    }
  }, [isDarkMode]);

  const toggleTheme = () => {
    setIsDarkMode(prevMode => !prevMode);
  };
  return (
    <div className="layout-container">
      <NavBar isDarkMode={isDarkMode} toggleTheme={toggleTheme} />
      <main className={containerClassName}>
        {/* 이 Outlet 부분에 Route에 설정된 자식 컴포넌트(MainPage, DetailPage 등)가 렌더링됨 */}
        <Outlet />
      </main>
    </div>
  );
}

export default Layout;
