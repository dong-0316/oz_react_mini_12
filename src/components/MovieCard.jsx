import React from 'react';
import { useNavigate } from 'react-router-dom';
import './MovieCard.css';

/**
 * 영화 한 개의 정보를 표시하는 카드 컴포넌트
 * 클릭 시 해당 영화의 상세 페이지로 이동합니다.
 * @param {{movie: object}} props - 표시할 영화 정보 객체
 */
function MovieCard({ movie, onClick }) {
  return (
    <div className="movie-card" onClick={onClick}>
      <img
        src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
        alt={movie.title}
        className="movie-poster"
      />
      <div className="movie-info">
        <h3 className="movie-title">{movie.title}</h3>
        <p className="movie-rating">★ {movie.vote_average.toFixed(1)}</p>
      </div>
    </div>
  );
}

export default MovieCard;
