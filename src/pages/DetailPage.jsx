import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import instance from '../api/axios';
import './DetailPage.css';

const BACKDROP_BASE_URL = "https://image.tmdb.org/t/p/w1280";
const POSTER_BASE_URL = "https://image.tmdb.org/t/p/w500";

function DetailPage() {
  const { movieId } = useParams();
  const [movie, setMovie] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMovieDetail = async () => {
      try {
        const response = await instance.get(`/movie/${movieId}`);
        setMovie(response.data);
      } catch (error) {
        console.error('Error fetching movie details:', error);
      } finally {
        setLoading(false);
      }
    };

    if (movieId) {
      fetchMovieDetail();
    }
  }, [movieId]); // movieId가 바뀔 때마다 API를 다시 호출

  if (loading) {
    return <div>로딩 중...</div>;
  }

  if (!movie) {
    return <div>영화 정보를 찾을 수 없습니다.</div>;
  }

  return (
    <div className="movie-detail-container">
      {movie.backdrop_path && (
        <img 
          className="backdrop-image"
          src={`${BACKDROP_BASE_URL}${movie.backdrop_path}`} 
          alt={`${movie.title} 배경`} 
        />
      )}
      <div className="movie-detail-content">
        <img 
          className="detail-poster"
          src={`${POSTER_BASE_URL}${movie.poster_path}`} 
          alt={`${movie.title} 포스터`}
        />
        <div className="detail-info">
          <h1 className="detail-title">{movie.title}</h1>
          <div className="detail-meta">
            <span>평점: {movie.vote_average ? movie.vote_average.toFixed(1) : 'N/A'}</span>
            <span>개봉일: {movie.release_date || '정보 없음'}</span>
          </div>
          <h3 className="overview-title">줄거리</h3>
          <p className="detail-overview">{movie.overview || '줄거리 정보가 없습니다.'}</p>
          {movie.tagline && <p className="detail-tagline">"{movie.tagline}"</p>}
        </div>
      </div>
    </div>
  );
}

export default DetailPage;
