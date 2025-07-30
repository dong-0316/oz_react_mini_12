import { useState, useEffect } from 'react';

// 화면 크기를 감지하는 커스텀 훅
export default function useWindowSize() {
  const [windowSize, setWindowSize] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
  });

  useEffect(() => {
    // 창 크기가 변경될 때마다 호출될 함수
    const handleResize = () => {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };

    // 리사이즈 이벤트 리스너 추가
    window.addEventListener('resize', handleResize);

    // 컴포넌트가 언마운트될 때 이벤트 리스너 제거 (메모리 누수 방지)
    return () => window.removeEventListener('resize', handleResize);
  }, []); // 이 useEffect는 마운트될 때 한 번만 실행됨

  return windowSize;
};
