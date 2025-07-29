import { useState, useEffect } from 'react';

// value: 디바운스할 값
// delay: 디바운스 지연 시간 (밀리초)
export const useDebounce = (value, delay) => {
  // 디바운스된 값을 저장할 상태
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    // value가 변경될 때마다 타이머 설정
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    // 다음 effect가 실행되기 전에 현재 타이머를 클리어
    // 컴포넌트가 언마운트될 때도 클리어됨
    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]); // value나 delay가 변경될 때만 effect를 다시 실행

  return debouncedValue; // 최종적으로 디바운스된 값을 반환
};
