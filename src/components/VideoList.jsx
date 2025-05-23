import { useState } from 'react';
import './VideoCarousel.css'; // Add this at the top of VideoList.jsx

const VideoList = ({ videos, onVideoSelect, isLoading }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const videosPerPage = 4;
  const totalPages = Math.ceil(videos.length / videosPerPage);

  const nextSlide = () => {
    setCurrentIndex((prevIndex) => 
      prevIndex < totalPages - 1 ? prevIndex + 1 : prevIndex
    );
  };

  const prevSlide = () => {
    setCurrentIndex((prevIndex) => 
      prevIndex > 0 ? prevIndex - 1 : prevIndex
    );
  };

  const visibleVideos = videos.slice(
    currentIndex * videosPerPage,
    (currentIndex + 1) * videosPerPage
  );

  if (isLoading) {
    return <div className="loading">Loading educational videos...</div>;
  }

  if (videos.length === 0) {
    return <div className="no-results">No educational videos found. Try a different search.</div>;
  }

  return (
    <div className="video-carousel">
      <div className="carousel-container">
        {visibleVideos.map((video) => (
          <div 
            key={video.id.videoId} 
            className="video-item"
            onClick={() => onVideoSelect(video)}
          >
            <div className="video-thumbnail">
              <img 
                src={video.snippet.thumbnails.medium.url} 
                alt={video.snippet.title}
              />
            </div>
            <div className="video-info">
              <h3>{video.snippet.title}</h3>
              <p>{video.snippet.channelTitle}</p>
            </div>
          </div>
        ))}
      </div>

      {totalPages > 1 && (
        <div className="carousel-nav">
          <button
            className="carousel-button prev"
            onClick={prevSlide}
            disabled={currentIndex === 0}
            aria-label="Previous videos"
          >
            &lt;
          </button>
          <span className="page-indicator">
            {currentIndex + 1} / {totalPages}
          </span>
          <button
            className="carousel-button next"
            onClick={nextSlide}
            disabled={currentIndex === totalPages - 1}
            aria-label="Next videos"
          >
            &gt;
          </button>
        </div>
      )}
    </div>
  );
};

export default VideoList;