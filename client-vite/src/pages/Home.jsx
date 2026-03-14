import React from 'react';
import { Link } from 'react-router-dom';
import './css/Home.css';

const Home = () => {
  return (
    <div className="home">
      <div className="video-background">
        <video 
          autoPlay 
          muted 
          loop 
          playsInline
          className="background-video"
        >
          <source src="/videos/car-background.mp4" type="video/mp4" />
          <source src="/videos/car-background.webm" type="video/webm" />
          Your browser does not support the video tag.
        </video>
        <div className="video-overlay"></div>
      </div>

      <section className="hero">
        <div className="container">
          <div className="hero-content">
            <h1>AutoCore </h1>
            <p>Качественные автозапчасти для вашего автомобиля. Широкий ассортимент, быстрая доставка, гарантия качества.</p>
            <Link to="/products" className="cta-button">
              Смотреть каталог
            </Link>
          </div>
        </div>
      </section>

      <section className="features">
        <div className="container">
          <div className="features-grid">
            <div className="feature">
              <div className="feature-icon"><img src="../../public/66841.png" alt="" /></div>
              <h3>Быстрая доставка</h3>
              <p>Доставка по Кировской области в течение дня. По всей стране - 1-3 дня</p>
            </div>
            <div className="feature">
              <div className="feature-icon"><img src="../../public/4436481.png" alt="" /></div>
              <h3>Гарантия качества</h3>
              <p>Все товары проходят строгий контроль</p>
            </div>
            <div className="feature">
              <div className="feature-icon"><img src="../../public/9186412.png" alt="" /></div>
              <h3>Профессиональная поддержка</h3>
              <p>Поможем с выбором и установкой</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;