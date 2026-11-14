export type WeatherType = 'clear' | 'cloudy' | 'rain' | 'snow' | 'hot' | 'cold';

export interface Menu {
  id: number;
  name: string;
  emoji: string;
  price: number;
  tags: WeatherType[];
}

export type Cart = Record<number, number>;

export interface WeatherInfo {
  type: WeatherType;
  temperature: number;
  emoji: string;
  message: string;
}