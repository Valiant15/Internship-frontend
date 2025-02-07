import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom"; // Import Router here
import VideoGrid from "./VideoGrid";
import VideoSwiper from "./VideoSwiper";
import { ConnectPage } from "./ConnectPage";
import Grid from "./Grid";
import "./App.css";

const App = () => {
  const [videos, setVideos] = useState([]);
  const [currentPost, setCurrentPost] = useState(null);

  useEffect(() => {
    const fetchVideos = async () => {
      try {
        const response = await fetch("http://localhost:4000/api/videos");
        const data = await response.json();
        setVideos(data);
      } catch (err) {
        console.error("Error:", err);
      }
    };

    fetchVideos();
  }, []);

  const handleVideoClick = (video) => {
    setCurrentPost(video);
  };

  const closeSlider = () => {
    setCurrentPost(null);
  };

  return (
    <Router>
      <Routes>
        <Route path="/videoGrid" element={<VideoGrid videos={videos} handleVideoClick={handleVideoClick} />} />
        <Route path="/" element={<ConnectPage />} />
      </Routes>
      <div>
        {currentPost && (
          // <VideoSwiper
          //     currentPost={currentPost}
          //     closeSlider={closeSlider}
          //     videos={videos} // Pass videos prop
          // />

          <Grid
            closeSlider={closeSlider}
            currentPost={currentPost}
            videos={videos}
          />
        )}
      </div>
    </Router>
  );
};

export default App;
