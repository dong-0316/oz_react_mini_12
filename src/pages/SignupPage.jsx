import React, { useState } from 'react';
import { useSupabaseAuth } from '../context/AuthContext'; // 1. 인증 컨텍스트에서 필요한 함수를 가져오기 위해 import
import { Link, useNavigate } from 'react-router-dom';
import Input from '../components/common/Input';
import './Form.css';

// 유효성 검사 규칙 정의
const VALIDATION_RULES = {
  userName: {
    regex: /^[a-zA-Z0-9가-힣]{2,8}$/,
    message: '이름은 2~8자 사이의 한글, 영문, 숫자만 가능합니다.'
  },
  email: {
    regex: /^\S+@\S+\.\S+$/,
    message: '올바른 이메일 형식이 아닙니다.'
  },
  password: {
    regex: /^(?=.*[a-zA-Z])(?=.*\d).{8,}$/,
    message: '비밀번호는 8자 이상, 영문과 숫자를 포함해야 합니다.'
  }
};

const SignupPage = () => {
  const { signUp, loginWithGoogle } = useSupabaseAuth(); // signUp과 loginWithGoogle 함수를 모두 가져온다. // 2. AuthContext로부터 signUp 함수를 가져온다.
  const [errors, setErrors] = useState({}); // 입력 필드별 에러 메시지를 관리할 state
  const [form, setForm] = useState({
    userName: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

    // 유효성 검사 로직
  const validate = () => {
    const newErrors = {};
    const { userName, email, password, confirmPassword } = form;

    if (!VALIDATION_RULES.userName.regex.test(userName)) {
      newErrors.userName = VALIDATION_RULES.userName.message;
    }
    if (!VALIDATION_RULES.email.regex.test(email)) {
      newErrors.email = VALIDATION_RULES.email.message;
    }
    if (!VALIDATION_RULES.password.regex.test(password)) {
      newErrors.password = VALIDATION_RULES.password.message;
    }
    if (password !== confirmPassword) {
      newErrors.confirmPassword = '비밀번호가 일치하지 않습니다.';
    }

    setErrors(newErrors);
    // 에러 객체가 비어있으면 유효성 검사 통과
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return; // 유효성 검사 실패 시 중단

    // 3. signUp 함수 호출
    const { error } = await signUp({ 
      email: form.email, 
      password: form.password, 
      userName: form.userName 
    });

    if (error) {
      // Supabase에서 반환한 에러 처리 (예: 이미 가입된 이메일)
      alert(error.message);
    } else {
      alert('회원가입이 완료되었습니다! 이메일을 확인하여 계정을 활성화해주세요.');
      navigate('/login'); // 회원가입 성공 시 로그인 페이지로 이동
    }
  };

  return (
    <div className="form-container">
      <form onSubmit={handleSubmit} className="form">
        <h2>회원가입</h2>
                <Input
          id="userName"
          label="이름"
          value={form.userName}
          onChange={handleChange}
          placeholder="이름을 입력하세요"
          errorMessage={errors.userName}
        />
                <Input
          id="email"
          label="이메일"
          type="email"
          value={form.email}
          onChange={handleChange}
          placeholder="이메일 주소를 입력하세요"
          errorMessage={errors.email}
        />
                <Input
          id="password"
          label="비밀번호"
          type="password"
          value={form.password}
          onChange={handleChange}
          placeholder="비밀번호를 입력하세요"
          errorMessage={errors.password}
        />
                <Input
          id="confirmPassword"
          label="비밀번호 확인"
          type="password"
          value={form.confirmPassword}
          onChange={handleChange}
          placeholder="비밀번호를 다시 입력하세요"
          errorMessage={errors.confirmPassword}
        />
                <button type="submit" className="submit-button">이메일로 회원가입</button>

        <div className="divider"><span>또는</span></div>

        <button type="button" onClick={loginWithGoogle} className="social-button google">구글로 회원가입</button>
        <p className="switch-form">
          이미 계정이 있으신가요? <Link to="/login">로그인</Link>
        </p>
      </form>
    </div>
  );
};

export default SignupPage;
