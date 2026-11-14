import { useEffect, useState } from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Header from './Header';
import MainPage from './MainPage';
import MenuList from './MenuList';
import Order from './Order';
import type {Cart} from './Types'

type Theme = 'light' | 'dark';

//라우팅과 여러 페이지가 같이 사용하는 상태 관리_테마, 장바구니
export default function App() {
  const [theme, setTheme] = useState<Theme>(() =>
    localStorage.getItem('theme') === 'dark' ? 'dark' : 'light',
  );
  const [cart, setCart] = useState<Cart>({});

  // 테마를 <html data-theme> 에 반영
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
  }, [theme]);
  //장바구니 조작 함수
  const addToCart = (id: number) => setCart((c) => ({ ...c, [id]: (c[id] ?? 0) + 1 }));

  const changeQty = (id: number, delta: number) =>
    setCart((c) => {
      const next = Math.max(0, (c[id] ?? 0) + delta);
      const copy = { ...c, [id]: next };
      if (next === 0) delete copy[id];
      return copy;
    });

  const removeFromCart = (id: number) =>
    setCart((c) => {
      const copy = { ...c };
      delete copy[id];
      return copy;
    });

  return (
    <BrowserRouter>
      <Header theme={theme} onToggleTheme={() => setTheme((t) => (t === 'light' ? 'dark' : 'light'))} />
      <Routes>
        <Route path="/" element={<MainPage />} />
        <Route path="/list" element={<MenuList cart={cart} onAdd={addToCart} />} />
        <Route path="/order" element={<Order cart={cart} onChangeQty={changeQty} onRemove={removeFromCart} onClear={() => setCart({})} />} />
      </Routes>
    </BrowserRouter>
  );
}
