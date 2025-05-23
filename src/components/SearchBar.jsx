import { useState } from 'react'
import useYouTubeApi from '../hooks/useYouTubeApi'

const SearchBar = ({ setVideos, setSelectedVideo, setIsSearching }) => {
  const [searchTerm, setSearchTerm] = useState('')
  const { searchEducationalVideos } = useYouTubeApi()

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!searchTerm.trim()) return
    
    setIsSearching(true)
    try {
      const videos = await searchEducationalVideos(searchTerm)
      setVideos(videos)
      setSelectedVideo(null)
    } catch (error) {
      console.error('Error searching videos:', error)
    } finally {
      setIsSearching(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="search-bar">
      <input
        type="text"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        placeholder="Search educational videos..."
      />
      <button type="submit">Search</button>
    </form>
  )
}

export default SearchBar