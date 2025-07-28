import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import './NavBar.css';

function NavBar() {
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    // 디바운싱(Debouncing) 처리
    // 사용자가 입력을 멈춘 후 500ms가 지나면 검색 페이지로 이동
    const debounce = setTimeout(() => {
      if (searchTerm) {
        navigate(`/search?q=${searchTerm}`);
      } else {
        // 검색어가 없고, 현재 위치가 검색 페이지일 때만 메인으로 이동
        if (location.pathname === '/search') {
          navigate('/');
        }
      }
    }, 500);

    // 컴포넌트가 언마운트되거나 searchTerm이 변경될 때 타이머를 클리어
    return () => {
      clearTimeout(debounce);
    };
  }, [searchTerm, navigate, location.pathname]);

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
      </div>
    </nav>
  );
}

export default NavBar;

