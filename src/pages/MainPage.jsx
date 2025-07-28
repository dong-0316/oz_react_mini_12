import React, { useState, useEffect } from 'react';
import MovieSlider from '../components/MovieSlider';
import instance from '../api/axios';

function MainPage() {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPopularMovies = async () => {
      try {
        // 'popular' 영화 목록 API 호출
        const response = await instance.get('/movie/popular');
        
        // adult: false 인 영화만 필터링
        const nonAdultMovies = response.data.results.filter(movie => !movie.adult);
        
        setMovies(nonAdultMovies);
      } catch (error) {
        console.error('Error fetching popular movies:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchPopularMovies();
  }, []); // 컴포넌트가 마운트될 때 한 번만 실행

  return (
    <div>
      <header className="main-page-header">
        <h2>인기순</h2>
      </header>
      {loading ? (
        <div>loading...</div>
      ) : (
        movies.length > 0 && <MovieSlider movies={movies} />
      )}
    </div>
  );
}

export default MainPage;
