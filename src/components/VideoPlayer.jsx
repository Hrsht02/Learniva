const VideoPlayer = ({ video }) => {
  const videoId = video.id.videoId
  const embedUrl = `https://www.youtube.com/embed/${videoId}?autoplay=1`

  return (
    <div className="video-player">
      <iframe
        width="100%"
        height="500"
        src={embedUrl}
        frameBorder="0"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
        title={video.snippet.title}
      />
      <div className="video-details">
        <h2>{video.snippet.title}</h2>
        <p>{video.snippet.description}</p>
      </div>
    </div>
  )
}

export default VideoPlayer