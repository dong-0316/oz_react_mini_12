import React from 'react';
import './Input.css'; // 공통 Input 컴포넌트를 위한 스타일 파일

// id, label, type, value, onChange, errorMessage 등 다양한 props를 받아 유연하게 작동하는 공통 컴포넌트
const Input = ({ id, label, type = 'text', value, onChange, placeholder, errorMessage }) => {
  return (
    <div className="input-group">
      <label htmlFor={id}>{label}</label>
      <input
        id={id}
        name={id} // form 제출 시 값을 구별하기 위해 name 속성 추가
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
      />
      {/* 에러 메시지가 있을 경우에만 p 태그를 렌더링한다. */}
      {errorMessage && <p className="error-message">{errorMessage}</p>}
    </div>
  );
};

export default Input;
