import React from 'react';
import { useSupabaseAuth } from '../context/AuthContext';
import './ProtectedRoute.css'; // 간단한 스타일링을 위해 CSS 파일 추가

// children 프로퍼티를 받아서, 로그인 상태에 따라 렌더링을 결정하는 컴포넌트
function ProtectedRoute({ children }) {
  const { user, loading } = useSupabaseAuth();

  // 인증 상태를 확인하는 동안 로딩 화면을 보여주는 것이 좋음
  if (loading) {
    return (
      <div className="protected-route-container">
        <p>인증 정보를 확인 중입니다...</p>
      </div>
    );
  }

  // 로딩이 끝났는데 user 객체가 없으면, 비로그인 상태로 간주
  if (!user) {
    return (
      <div className="protected-route-container">
        <h1 className="unauthorized-title">접근 불가</h1>
        <p className="unauthorized-message">이 페이지에 접근하려면 로그인이 필요합니다.</p>
      </div>
    );
  }

  // 로그인 상태라면, 자식 컴포넌트(예: MyPage)를 렌더링
  return children;
}

export default ProtectedRoute;
