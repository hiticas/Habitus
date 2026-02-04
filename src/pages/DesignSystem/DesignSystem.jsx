import Navbar from '../../components/Navbar/Navbar';
// Import Swiper React components
import { Swiper, SwiperSlide } from 'swiper/react';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/pagination';

// import required modules
// import { Pagination } from 'swiper/modules';

import './DesignSystem.scss';

function DesignSystem() {
  return (
    <div>
      <Navbar />
      <h1>Design System Page</h1>
      <Swiper
        breakpoints={{
          0: {
            slidesPerView: 1.4,
          },
          786: {
            slidesPerView: 3.8,
          },
          1000: {
            slidesPerView: 5.8,
          },
          1400: {
            slidesPerView: 7,
          }
        }}
        spaceBetween={30}
        // centeredSlides={true}
        initialSlide={3} 
        // pagination={{
        //   clickable: true,
        // }}
        // modules={[Pagination]}
        className="mySwiper"
      >
        <SwiperSlide>Slide 1</SwiperSlide>
        <SwiperSlide>Slide 2</SwiperSlide>
        <SwiperSlide>Slide 3</SwiperSlide>
        <SwiperSlide>Slide 4</SwiperSlide>
        <SwiperSlide>Slide 5</SwiperSlide>
        <SwiperSlide>Slide 6</SwiperSlide>
        <SwiperSlide>Slide 7</SwiperSlide>
      </Swiper>
    </div>
  );
}

export default DesignSystem;