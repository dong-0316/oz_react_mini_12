import React, { useState } from 'react';
import { useSupabaseAuth } from '../context/AuthContext'; // 1. 인증 컨텍스트 import
import { Link, useNavigate } from 'react-router-dom';
import Input from '../components/common/Input';
import './Form.css'; // 로그인/회원가입 폼을 위한 공통 스타일

const LoginPage = () => {
  const { login, loginWithGoogle } = useSupabaseAuth(); // loginWithGoogle 함수 추가 // 2. login 함수 가져오기
  const [form, setForm] = useState({ email: '', password: '' });
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

    const handleSubmit = async (e) => {
    e.preventDefault();
    // 3. login 함수 호출
    const { error } = await login(form);

    if (error) {
      alert(error.message);
    } else {
      alert('로그인 되었습니다.');
      navigate('/'); // 4. 로그인 성공 시 메인 페이지로 이동
    }
  };

  return (
    <div className="form-container">
      <form onSubmit={handleSubmit} className="form">
        <h2>로그인</h2>
        <Input
          id="email"
          label="이메일"
          type="email"
          value={form.email}
          onChange={handleChange}
          placeholder="이메일 주소를 입력하세요"
        />
        <Input
          id="password"
          label="비밀번호"
          type="password"
          value={form.password}
          onChange={handleChange}
          placeholder="비밀번호를 입력하세요"
        />
        <button type="submit" className="submit-button">이메일로 로그인</button>
        <div className="divider"><span>또는</span></div>
        <button type="button" onClick={loginWithGoogle} className="social-button google">구글로 로그인</button>
        <p className="switch-form">
          계정이 없으신가요? <Link to="/signup">회원가입</Link>
        </p>
      </form>
    </div>
  );
};

export default LoginPage;
