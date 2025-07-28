import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import instance from '../api/axios';
import './SearchPage.css';

const POSTER_BASE_URL = "https://image.tmdb.org/t/p/w500";

function SearchPage() {
  const [searchResults, setSearchResults] = useState([]);
  const location = useLocation();
  const navigate = useNavigate();

  // URL 쿼리 스트링에서 'q' 값을 가져옵니다.
  const query = new URLSearchParams(location.search).get('q');

  useEffect(() => {
    const fetchSearchResults = async () => {
      if (query) {
        try {
          const response = await instance.get(`/search/movie`, {
            params: { query: query, include_adult: 'false' },
          });
          setSearchResults(response.data.results);
        } catch (error) {
          console.error('Error fetching search results:', error);
        }
      } else {
        setSearchResults([]); // 검색어가 없으면 결과를 비웁니다.
      }
    };

    fetchSearchResults();
  }, [query]); // query가 바뀔 때마다 검색을 다시 실행합니다.

  const handleMovieClick = (movieId) => {
    navigate(`/movie/${movieId}`);
  };

  return (
    <div className="search-page-container">
      <h2 className="search-term-title">'{query}' 검색 결과</h2>
      <div className="search-results-grid">
        {searchResults.length > 0 ? (
          searchResults.map((movie) => (
            movie.poster_path && (
              <div key={movie.id} className="search-result-item" onClick={() => handleMovieClick(movie.id)}>
                <img
                  src={`${POSTER_BASE_URL}${movie.poster_path}`}
                  alt={movie.title}
                  className="search-result-poster"
                />
              </div>
            )
          ))
        ) : (
          <p className="no-results-message">검색 결과가 없습니다.</p>
        )}
      </div>
    </div>
  );
}

export default SearchPage;
