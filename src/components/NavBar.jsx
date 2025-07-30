import React, { useState, useEffect, useCallback, useRef } from 'react';
import { BsSunFill, BsMoonFill } from 'react-icons/bs';
import { GiHamburgerMenu } from 'react-icons/gi';
import { IoClose } from 'react-icons/io5';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import './NavBar.css';
import { useDebounce } from '../hooks/useDebounce';
import { useSupabaseAuth } from '../context/AuthContext'; // 1. 인증 컨텍스트 import
import useWindowSize from '../hooks/useWindowSize';

// --- 자식 컴포넌트 분리 및 최적화 ---

// Logo 컴포넌트: 클릭 이벤트를 prop으로 받음
const Logo = React.memo(({ onClick }) => (
  <Link to="/" className="navbar-logo" onClick={onClick}>
    <span>QT</span>
    <span className="logo-text">무비</span>
    <span className="logo-dot">.</span>
  </Link>
));

// SearchBar 컴포넌트: value와 onChange를 prop으로 받음
const SearchBar = React.memo(({ value, onChange }) => (
  <div className="navbar-center">
    <input
      type="text"
      className="search-bar"
      placeholder="영화를 검색해보세요."
      value={value}
      onChange={onChange}
    />
  </div>
));

// AuthButtons 컴포넌트: 로그인/회원가입 및 테마 토글 버튼
// AuthButtons 컴포넌트: 로그인/회원가입 및 테마 토글 버튼
const AuthButtons = React.memo(({ isDarkMode, onToggleTheme }) => {
  const { user, logout } = useSupabaseAuth();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null); // 1. 드롭다운 DOM 요소를 위한 ref 생성

  const toggleDropdown = () => {
    setIsDropdownOpen(prev => !prev);
  };

  const handleLogout = () => {
    logout();
    setIsDropdownOpen(false);
  };

  // 2. "바깥 클릭 시 닫기" 로직
  useEffect(() => {
    const handleClickOutside = (event) => {
      // ref가 있고, 클릭한 곳이 드롭다운 메뉴의 자식 요소가 아니라면
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false); // 드롭다운 닫기
      }
    };

    // 드롭다운이 열려 있을 때만 이벤트 리스너 추가
    if (isDropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    // 3. 클린업 함수: 컴포넌트가 사라지거나, 업데이트 되기 전에 리스너 제거
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isDropdownOpen]); // isDropdownOpen 상태가 바뀔 때마다 이 효과를 재실행

  return (
    <div className="navbar-right">
      {user ? (
        <div className="profile-container" ref={dropdownRef}> {/* 4. 컨테이너에 ref 연결 */}
          <img 
            src={user.user_metadata.avatar_url || `https://api.dicebear.com/8.x/identicon/svg?seed=${user.email}`} 
            alt="profile" 
            className="profile-img" 
            onClick={toggleDropdown}
          />
          {isDropdownOpen && (
            <div className="profile-dropdown">
              <Link to="/mypage" className="auth-button dropdown-item">마이페이지</Link>
              <button onClick={handleLogout} className="auth-button dropdown-item logout">로그아웃</button>
            </div>
          )}
        </div>
      ) : (
        // --- 로그아웃 상태: 로그인/회원가입 버튼 ---
        <>
          <Link to="/login" className="auth-button login">로그인</Link>
          <Link to="/signup" className="auth-button signup">회원가입</Link>
        </>
      )}
      <button className="theme-toggle-btn" onClick={onToggleTheme}>
        {isDarkMode ? <BsSunFill /> : <BsMoonFill />}
      </button>
    </div>
  )
});

// MobileMenu 컴포넌트: 모바일 화면의 메뉴
const MobileMenu = React.memo(({ isOpen, onClose, isDarkMode, onToggleTheme }) => {
  const { user, logout } = useSupabaseAuth(); // 모바일 메뉴에서도 user 정보와 logout 함수 가져오기
  if (!isOpen) return null;

  return (
    <>
      <div className="overlay" onClick={onClose}></div>
      <div className="mobile-menu">
        <button className="close-btn" onClick={onClose}>
          <IoClose />
        </button>
        <div className="mobile-menu-content">
          <div className="mobile-auth-buttons">
            {user ? (
              <>
                <img src={user.user_metadata.avatar_url || `https://api.dicebear.com/8.x/identicon/svg?seed=${user.email}`} alt="profile" className="profile-img" />
                <button onClick={logout} className="auth-button logout">로그아웃</button>
              </>
            ) : (
              <>
                <Link to="/login" className="auth-button login" onClick={onClose}>로그인</Link>
                <Link to="/signup" className="auth-button signup" onClick={onClose}>회원가입</Link>
              </>
            )}
          </div>
          <div className="mobile-theme-toggle">
            <span>테마</span>
            <button className="theme-toggle-btn" onClick={onToggleTheme}>
              {isDarkMode ? <BsSunFill /> : <BsMoonFill />}
            </button>
          </div>
        </div>
      </div>
    </>
  );
});

function NavBar({ isDarkMode, toggleTheme }) {
  const [isScrolled, setIsScrolled] = useState(false); // 스크롤 상태 추가
  const [searchTerm, setSearchTerm] = useState('');
  const debouncedSearchTerm = useDebounce(searchTerm, 500);
  const navigate = useNavigate();
  const location = useLocation();

  const { width } = useWindowSize();
  const isMobile = width <= 768;
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // 스크롤 이벤트 핸들러
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  // debouncedSearchTerm이 변경될 때마다 URL을 업데이트합니다.
  useEffect(() => {
    // 검색어가 있고, 현재 상세 페이지가 아닐 때만 검색 페이지로 이동
    if (debouncedSearchTerm && !location.pathname.startsWith('/movie/')) {
      navigate(`/search?q=${debouncedSearchTerm}`);
    } 
    // 검색어가 없고, 현재 페이지가 검색 페이지일 때만 메인으로 이동
    else if (!debouncedSearchTerm && location.pathname === '/search') {
      navigate('/');
    }
  }, [debouncedSearchTerm, location.pathname, navigate]);

  useEffect(() => {
    document.body.style.overflow = isMenuOpen ? 'hidden' : 'auto';
  }, [isMenuOpen]);

  // --- 함수들을 useCallback으로 감싸 불필요한 재생성을 방지 ---
  const handleChange = useCallback((e) => {
    setSearchTerm(e.target.value);
  }, []);

  const toggleMenu = useCallback(() => {
    setIsMenuOpen(prev => !prev);
  }, []);

  const handleLogoClick = useCallback(() => {
    if (isMenuOpen) {
      toggleMenu();
    }
  }, [isMenuOpen, toggleMenu]);

  // --- 모바일/데스크탑 렌더링 분기 ---
  if (isMobile) {
    return (
      <nav className={`navbar navbar-mobile ${isScrolled ? 'scrolled' : ''}`}>
        <div className="navbar-mobile-top">
          <div className="navbar-left">
            <Logo onClick={handleLogoClick} />
          </div>
          <div className="navbar-right">
            <button className="hamburger-btn" onClick={toggleMenu}>
              <GiHamburgerMenu />
            </button>
          </div>
        </div>
        <div className="navbar-mobile-bottom">
          <SearchBar value={searchTerm} onChange={handleChange} />
        </div>
        <MobileMenu 
          isOpen={isMenuOpen} 
          onClose={toggleMenu} 
          isDarkMode={isDarkMode} 
          onToggleTheme={toggleTheme} 
        />
      </nav>
    );
  }

  return (
    <nav className={`navbar ${isScrolled ? 'scrolled' : ''}`}>
      <div className="navbar-content">
        <div className="navbar-left">
          <Logo />
        </div>
        <SearchBar value={searchTerm} onChange={handleChange} />
        <AuthButtons isDarkMode={isDarkMode} onToggleTheme={toggleTheme} />
      </div>
    </nav>
  );
}

export default React.memo(NavBar);


