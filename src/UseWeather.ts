import { useEffect, useState } from 'react';
import type { WeatherInfo } from './Types';

function mapWttrWeather(code: number, temp: number): Omit<WeatherInfo, 'temperature'> {
  // wttr.in 날씨 코드(WWO 코드) 기준 분류
  if ([179, 182, 185, 227, 230, 323, 326, 329, 332, 335, 338, 350, 368, 371, 374, 377, 392, 395].includes(code)) {
    return { type: 'snow', emoji: '❄️', message: '눈 오는 날엔 따뜻한 국물이나 간식! 냠냠!' };
  }
  if ([176, 200, 263, 266, 281, 284, 293, 296, 299, 302, 305, 308, 311, 314, 317, 320, 353, 356, 359, 362, 365, 386, 389].includes(code)) {
    return { type: 'rain', emoji: '🌧️', message: '비 오는 날엔 역시 전이나 뜨끈한 면 요리! 냠냠!' };
  }
  if (temp >= 28) {
    return { type: 'hot', emoji: '🥵', message: '더운 날씨엔 시원한 메뉴로 더위를 날리기! 냠냠!' };
  }
  if (temp <= 5) {
    return { type: 'cold', emoji: '🧣', message: '추우니까 따듯한 음식! 냠냠!!' };
  }
  if ([116, 119, 122, 143, 248, 260].includes(code)) {
    return { type: 'cloudy', emoji: '☁️', message: '흐리니까 맛있는 걸로 기분 전환! 냠냠!' };
  }
  return { type: 'clear', emoji: '☀️', message: '화창한 날씨! 냠냠!' };
}

export function useWeather() {
    // weather: 가져온 날씨(로딩 중엔 null), error: 에러 문구(현재는 fallback을 쓰므로 항상 null)
    const [weather, setWeather] = useState<WeatherInfo | null>(null);
    const [error, setError] = useState<string | null>(null);
  
    // 처음 렌더링될 때 한 번만 날씨를 가져옴
    useEffect(() => {
      let cancelled = false;
  
      // API 키 없이 서울 날씨를 JSON으로 반환하는 wttr.in 사용 (위치는 서울 고정)
      const url = 'https://wttr.in/Seoul?format=j1';
  
      // 4초 안에 응답이 없으면 요청을 중단하고 catch로 넘어감
      fetch(url, { signal: AbortSignal.timeout(4000) })
        .then((res) => {
          if (!res.ok) throw new Error(`HTTP 오류: ${res.status}`);
          return res.json();
        })
        .then((data) => {
          if (cancelled) return;
  
          const current = data?.current_condition?.[0];
          if (!current) throw new Error('날씨 데이터 형식 오류');
  
          const temp = Number(current.temp_C);
          const code = Number(current.weatherCode);
          const info = mapWttrWeather(code, temp);
  
          setWeather({ ...info, temperature: temp });
          setError(null);
        })
        .catch(() => {
          if (cancelled) return;
  
          // API가 네트워크 문제로 실패해도 화면이 비지 않도록 하는 안전장치
          // 기본값으로 비 오는 날 추천을 보여줌
          setWeather({
            type: 'rain',
            temperature: 18,
            emoji: '🌧️',
            message: '비 오는 날엔 역시 전이나 뜨끈한 면 요리! (기본 추천)',
          });
          setError(null);
        });
  
      // cleanup: 컴포넌트가 사라지면 이후 응답은 무시함
      return () => {
        cancelled = true;
      };
    }, []);
  
    return { weather, error };
}  