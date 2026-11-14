import { useNavigate } from 'react-router-dom';
import { useWeather } from './UseWeather';

//현재 날씨를 보여주고 목록/ 주문 페이지로 이동
export default function MainPage() {
  const navigate = useNavigate();
  const { weather, error } = useWeather();

  return (
    <main className="page main-page">
      <div className="weather-icons" aria-hidden>
        ☀️ ☁️ 🌧️ ❄️
      </div>
      <h1 className="title">비가 오나 눈이 오나 냠냠</h1>

      {error && <p className="notice">{error}</p>}
      {!weather && !error && <p className="notice">날씨 확인 중…</p>}
      {weather && (
        <p className="weather-box">
          <span className="weather-emoji">{weather.emoji}</span>
          지금 {weather.temperature}°C · {weather.message}
        </p>
      )}

      <div className="btn-row">
        <button className="btn" onClick={() => navigate('/order')}>
          주문하기
        </button>
        <button className="btn ghost" onClick={() => navigate('/list')}>
          목록보기
        </button>
      </div>
    </main>
  );
}