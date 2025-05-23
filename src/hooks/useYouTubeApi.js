import { useState } from 'react';

const useYouTubeApi = () => {
  const API_KEY = 'AIzaSyDqtgz5dWl6UVZ9jhwNyV9U99J2fZzrflQ';
  const [isFiltering, setIsFiltering] = useState(false);

  const searchEducationalVideos = async (query) => {
    try {
      // First search for videos matching the query
      const searchUrl = `https://www.googleapis.com/youtube/v3/search?part=snippet&type=video&maxResults=25&q=${encodeURIComponent(query + " education|learning|study|lecture|tutorial")}&key=${API_KEY}`;
      
      const searchResponse = await fetch(searchUrl);
      const searchData = await searchResponse.json();
      
      if (!searchData.items) return [];

      // Filter for educational content using Gemini API
      setIsFiltering(true);
      const educationalVideos = await filterEducationalContent(searchData.items);
      setIsFiltering(false);
      
      return educationalVideos;
    } catch (error) {
      console.error('Error fetching videos:', error);
      setIsFiltering(false);
      return [];
    }
  };

  const filterEducationalContent = async (videos) => {
    try {
      // Use Gemini API to filter educational content
      const geminiUrl = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=AIzaSyAIXLpmM9ngkK0hKkH9SeA6DD6Wo9dFWjo';
      
      // Prepare data for Gemini
      const videoData = videos.map(v => ({
        title: v.snippet.title,
        description: v.snippet.description,
        channel: v.snippet.channelTitle
      }));
      
      const prompt = `
        Analyze these YouTube videos and return only the ones that are clearly educational 
        (related to studying, learning, courses, tutorials, lectures, or academic subjects).
        Return the indices of educational videos in a JSON array like [0, 2, 5].
        
        Consider these factors:
        - Title containing educational keywords
        - Description indicating educational content
        - Channel name suggesting educational purpose
        
        Videos: ${JSON.stringify(videoData)}
      `;
      
      const response = await fetch(geminiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [{
            parts: [{
              text: prompt
            }]
          }]
        })
      });
      
      const data = await response.json();
      const textResponse = data.candidates[0].content.parts[0].text;
      
      // Extract the array from the response
      const startIdx = textResponse.indexOf('[');
      const endIdx = textResponse.indexOf(']');
      const arrayText = textResponse.slice(startIdx, endIdx + 1);
      
      let eduIndices = [];
      try {
        eduIndices = JSON.parse(arrayText);
      } catch (e) {
        console.error('Error parsing Gemini response:', e);
        return videos; // Return all if parsing fails
      }
      
      return eduIndices.map(idx => videos[idx]).filter(Boolean);
    } catch (error) {
      console.error('Error filtering with Gemini:', error);
      return videos; // Return all if filtering fails
    }
  };

  // Make sure to return an object with all needed properties
  return { 
    searchEducationalVideos, 
    isFiltering 
  };
};

export default useYouTubeApi;