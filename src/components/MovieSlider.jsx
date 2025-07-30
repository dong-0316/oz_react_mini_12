import React from 'react';
// Swiper.js 라이브러리에서 필요한 모듈들을 가져옵니다.
import { useNavigate } from 'react-router-dom';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination } from 'swiper/modules';

// Swiper.js의 기본 스타일과 네비게이션, 페이지네이션 스타일을 가져옵니다.
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

import MovieCard from './MovieCard';
import useWindowSize from '../hooks/useWindowSize'; // 화면 크기 감지 훅
import './MovieSlider.css'; // 슬라이더 커스텀 스타일

/**
 * 영화 목록을 슬라이드 형태로 보여주는 컴포넌트
 * @param {{movies: object[]}} props - 영화 목록 배열
 */
function MovieSlider({ movies }) {
  const navigate = useNavigate();
  const { width } = useWindowSize();
  const isMobile = width <= 768;

  // PC (Swiper)용 클릭 핸들러
  const handleSwiperClick = (swiper) => {
    const clickedIndex = swiper.clickedIndex;
    const clickedMovie = movies[clickedIndex];
    if (clickedMovie) {
      navigate(`/movie/${clickedMovie.id}`);
    }
  };

  // 카드 클릭 시 상세 페이지로 이동하는 핸들러
  const handleCardClick = (movieId) => {
    navigate(`/movie/${movieId}`);
  };

  // 로딩 중이거나 영화 목록이 없을 경우
  if (!movies || movies.length === 0) {
    return null; // 또는 로딩 스피너를 보여줄 수 있습니다.
  }

  return isMobile ? (
    // --- 모바일 레이아웃: 세로 리스트 ---
    <div className="movie-list-container-mobile">
      {movies.map((movie) => (
        <MovieCard 
          key={movie.id} 
          movie={movie} 
          onClick={() => handleCardClick(movie.id)} 
        />
      ))}
    </div>
  ) : (
    // --- 데스크탑 레이아웃: Swiper 슬라이더 ---
    <div className="movie-slider-container">
      <Swiper
        className="movie-swiper" /* [수정] CSS 적용을 위한 클래스 추가 */
        modules={[Navigation, Pagination]}
        spaceBetween={10}
        loop={true}
        navigation
        pagination={{ clickable: true }}
        grabCursor={true}
        breakpoints={{
          1378: { slidesPerView: 5, slidesPerGroup: 1 },
          998: { slidesPerView: 4, slidesPerGroup: 1 },
          625: { slidesPerView: 3, slidesPerGroup: 1 },
          0: { slidesPerView: 2, slidesPerGroup: 1 },
        }}
      >
        {movies.map((movie) => (
          <SwiperSlide key={movie.id} onClick={() => handleCardClick(movie.id)}>
            <MovieCard movie={movie} onClick={() => handleCardClick(movie.id)} />
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );

}

export default MovieSlider;
