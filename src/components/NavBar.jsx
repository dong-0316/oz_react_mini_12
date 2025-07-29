import React, { useState, useEffect } from 'react';
import { BsSunFill, BsMoonFill } from 'react-icons/bs'; // [추가] 해/달 아이콘 import
import { Link, useNavigate, useLocation } from 'react-router-dom';
import './NavBar.css';
import { useDebounce } from '../hooks/useDebounce';

function NavBar({ isDarkMode, toggleTheme }) {
    const [searchTerm, setSearchTerm] = useState('');
  const debouncedSearchTerm = useDebounce(searchTerm, 500); // 500ms 지연
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (debouncedSearchTerm) {
      // 디바운스된 검색어가 있으면 검색 페이지로 이동
      navigate(`/search?q=${debouncedSearchTerm}`);
    } else {
      // 검색어가 없고, 현재 위치가 검색 페이지일 때만 메인으로 이동
      if (location.pathname === '/search') {
        navigate('/');
      }
    }
  }, [debouncedSearchTerm, navigate, location.pathname]);

  const handleChange = (e) => {
    setSearchTerm(e.target.value);
  };

  return (
    <nav className="navbar">
      <div className="navbar-left">
        <Link to="/" className="navbar-logo">
          <span>OZ</span>
          <span className="logo-text">무비</span>
          <span className="logo-dot">.</span>
        </Link>
      </div>
      <div className="navbar-center">
        <input 
          type="text" 
          className="search-bar" 
          placeholder="영화를 검색해보세요." 
          value={searchTerm}
          onChange={handleChange}
        />
      </div>
      <div className="navbar-right">
        <button className="auth-button login">로그인</button>
                <button className="auth-button signup">회원가입</button>
        {/* [수정] 테마 토글 아이콘 버튼 */}
        <button className="theme-toggle-btn" onClick={toggleTheme}>
          {isDarkMode ? <BsSunFill /> : <BsMoonFill />}
        </button>
      </div>
    </nav>
  );
}

export default NavBar;

