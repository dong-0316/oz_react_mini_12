import React from 'react';
import { useSupabaseAuth } from '../context/AuthContext';
import './MyPage.css';

function MyPage() {
  const { user } = useSupabaseAuth();

  // user 객체가 로딩 중일 수 있으므로, 로딩 상태를 표시하는 것이 좋습니다.
  if (!user) {
    return (
      <div className="mypage-container">
        <h1 className="mypage-title">마이페이지</h1>
        <div className="user-info-box">
          <p>사용자 정보를 불러오는 중입니다...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="mypage-container">
      <h1 className="mypage-title">마이페이지</h1>
      <div className="user-info-box">
        <p className="user-info-label">이메일</p>
        <p className="user-info-content">{user.email}</p>
      </div>
    </div>
  );
}

export default MyPage;
