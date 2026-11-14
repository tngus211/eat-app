import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MENUS } from './Menus';
import { useWeather } from './UseWeather';
import type { Cart } from './Types';
import MenuCard from './MenuCard';

interface Props {
    cart: Cart;
    onAdd: (id: number) => void;
  }
  
const PAGE_SIZE = 16; // 4 x 4
const TOP_N = 8; // 오늘의 추천으로 강조할 개수

//메뉴 목록 페이지
export default function MenuList({ cart, onAdd }: Props) {
    const navigate = useNavigate();
    const { weather } = useWeather();
    const [keyword, setKeyword] = useState('');
    const [page, setPage] = useState(0);

    //총 수량
    const cartCount = Object.values(cart).reduce((a, b) => a + b, 0);

    // 날씨에 맞는 메뉴 전체 (모든 페이지에서 강조 표시)
    const matchIds = useMemo(
        () => new Set(weather ? MENUS.filter((m) => m.tags.includes(weather.type)).map((m) => m.id) : []),
        [weather],
    );

    // 맨 윗줄에 올릴 메뉴
    const topIds = useMemo(() => {
        const matched = MENUS.filter((m) => matchIds.has(m.id));
        const day = Math.floor(Date.now() / 86400000);
        const start = matched.length ? day % matched.length : 0;
        const rotated = [...matched.slice(start), ...matched.slice(0, start)];
        return new Set(rotated.slice(0, TOP_N).map((m) => m.id));
    }, [matchIds]);

    // 검색 후 정렬
    const sorted = useMemo(
        () =>
        MENUS.filter((m) => m.name.includes(keyword.trim()))
            .map((m) => ({ menu: m, rec: matchIds.has(m.id), top: topIds.has(m.id) }))
            .sort((a, b) => Number(b.top) - Number(a.top)),
        [matchIds, topIds, keyword],
    );

    //페이지 계산
    //검색 결과 수로 전체 페이지를 구하고 현재 페이지 분량만 잘라냄
    const totalPages = Math.max(1, Math.ceil(sorted.length / PAGE_SIZE));
    const current = Math.min(page, totalPages - 1);
    const pageItems = sorted.slice(current * PAGE_SIZE, (current + 1) * PAGE_SIZE);

    return (
        <main className="page list-page">
        <section className="today-box">
            <strong>오늘의 날씨 추천</strong>
            <span>{weather ? `${weather.emoji} ${weather.message}` : '날씨 확인 중…'}</span>
        </section>

        <div className="toolbar">
            <input
            className="search"
            type="search"
            placeholder="🔍 메뉴 검색"
            value={keyword}
            onChange={(e) => {
                setKeyword(e.target.value);
                setPage(0);
            }}
            />
            <button className="btn small" onClick={() => navigate('/order')}>
            🛒 장바구니 {cartCount > 0 && `(${cartCount})`}
            </button>
        </div>

        <div className="grid">
            {pageItems.map(({ menu, rec }) => (
            <MenuCard key={menu.id} menu={menu} recommended={rec} onAdd={onAdd} />
            ))}
        </div>
        {sorted.length === 0 && <p className="notice">검색 결과가 없어요.</p>}

        {totalPages > 1 && (
            <nav className="pager" aria-label="페이지 이동">
            <button disabled={current === 0} onClick={() => setPage(current - 1)}>
                이전
            </button>
            {Array.from({ length: totalPages }, (_, i) => (
                <button
                key={i}
                className={i === current ? 'active' : ''}
                onClick={() => setPage(i)}
                aria-current={i === current ? 'page' : undefined}
                >
                {i + 1}
                </button>
            ))}
            <button disabled={current === totalPages - 1} onClick={() => setPage(current + 1)}>
                다음
            </button>
            </nav>
        )}
        </main>
    );
}
