import { useState } from 'react'
import SearchBar from './components/SearchBar'
import VideoList from './components/VideoList'
import VideoPlayer from './components/VideoPlayer'
import './App.css'
import Instant_exp from './components/instant_exp'

function App() {
  const [videos, setVideos] = useState([])
  const [selectedVideo, setSelectedVideo] = useState(null)
  const [isSearching, setIsSearching] = useState(false)

  return (
    <div className="app">
      <h1>Educational Video Finder</h1>
      <SearchBar 
        setVideos={setVideos}
        setSelectedVideo={setSelectedVideo}
        setIsSearching={setIsSearching}
      />
      
      <div className="content">
        {selectedVideo ? (
          <div className="video-container">
            <VideoPlayer video={selectedVideo} />
            <button 
              className="back-button"
              onClick={() => setSelectedVideo(null)}
            >
              Back to Results
            </button>
          </div>
        ) : (
          <VideoList 
            videos={videos} 
            onVideoSelect={setSelectedVideo}
            isLoading={isSearching}
          />
        )}
      </div>

      <div>
        <Instant_exp/>
      </div>
    </div>
  )
}

export default App