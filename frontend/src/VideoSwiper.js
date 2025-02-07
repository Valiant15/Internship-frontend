import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/effect-coverflow';
import 'swiper/css/pagination';
import 'swiper/css/navigation';
import { EffectCoverflow, Navigation } from 'swiper/modules';
import styles from './VideoSwiper.module.css';  // Import the CSS module

function VideoSwiper({ currentPost, closeSlider, videos }) {
  const currentIndex = videos.findIndex(post => post.id === currentPost.id);
  const httpsUrlRegex = /(https:\/\/[^\s]+)/g;

  return (
    <div className={styles.outer_div}>
      <div className={styles.container}>
        <Swiper
          effect="coverflow"
          grabCursor={true}
          centeredSlides={true}
          loop={true}
          initialSlide={currentIndex}
          slidesPerView={3}
          spaceBetween={30}
          coverflowEffect={{
            rotate: 0,
            stretch: 0,
            depth: 100,
            modifier: 2.5,
          }}
          navigation={true}
          modules={[EffectCoverflow, Navigation]}
          className={styles.swiper_container}
        >
          {videos.map((video) => {
            const extractedHttpsUrl = video.caption?.match(httpsUrlRegex)?.[0];

            return(
            <SwiperSlide className={styles.swiper_slide} key={video.id}>
              <div className={styles['video-slide-container']}>
                {/* Video Frame */}
                <video className={styles.swiper_video} src={video.media_url} controls muted autoPlay>
                  Your browser does not support the video tag.
                </video>
                
                {/* Info Box */}
                <div className={styles['video-info']}>
                  <span className={styles['product-name']}>{video.name}</span>
                  <span className={styles['product-price']}>{video.price}</span>
                  {/* Buy Now Button */}
                  {extractedHttpsUrl && (
                  <a href={extractedHttpsUrl} target="_blank" rel="noopener noreferrer">
                  <button className={styles['buy-now-btn']}>BUY NOW</button>                     
                  </a>)}
                </div>
              </div>
            </SwiperSlide>
            )
         })}
          
          {/* Close Button */}
          <button className={styles.button} onClick={closeSlider}> X </button>
        </Swiper>
      </div>
    </div>
  );
}

export default VideoSwiper;
