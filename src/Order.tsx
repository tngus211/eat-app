import { useNavigate } from 'react-router-dom';
import { MENUS } from './Menus';
import type { Cart } from './Types';

interface Props {
    cart: Cart;
    onChangeQty: (id: number, delta: number) => void;
    onRemove: (id: number) => void;
    onClear: () => void;
}

//주문 페이지
export default function Order({ cart, onChangeQty, onRemove, onClear }: Props) {
    const navigate = useNavigate();
    const items = MENUS.filter((m) => cart[m.id] > 0); //장바구니에 담긴 메뉴 총합
    const total = items.reduce((sum, m) => sum + m.price * cart[m.id], 0);

    //결제
    const handlePay = () => {
        //장바구니가 비어있는 경우 -> 음식을 담지 않고 결제창으로 넘어간 경우
        if (items.length === 0) {
        alert('장바구니가 비어 있어요. 음식을 담아주세요');
        return;
        }
        alert('결제가 완료되었습니다. 맛있게 드세요! 냠냠!');
        onClear();
        navigate('/');
    };

    //장바구니 비우기
    const handleClear = () => {
        if (window.confirm('장바구니를 모두 비울까요?')) onClear();
    };

    return (
        <main className="page order-page">
        <div className="order-head">
            <h2>장바구니</h2>
            {items.length > 0 && (
            <button className="btn small ghost" onClick={handleClear}>
                장바구니 비우기
            </button>
            )}
        </div>

        {items.length === 0 ? (
            <p className="notice">
            담은 메뉴가 없어요. <button className="link" onClick={() => navigate('/list')}>메뉴 보러 가기</button>
            </p>
        ) : (
            <ul className="order-list">
            {items.map((m) => (
                <li key={m.id} className="order-item">
                <span className="order-emoji">{m.emoji}</span>
                <span className="order-name">{m.name}</span>
                <span className="qty">
                    <button onClick={() => onChangeQty(m.id, -1)} aria-label={`${m.name} 빼기`}>−</button>
                    {cart[m.id]}
                    <button onClick={() => onChangeQty(m.id, 1)} aria-label={`${m.name} 더하기`}>＋</button>
                </span>
                <span className="order-price">{(m.price * cart[m.id]).toLocaleString()}원</span>
                <button className="remove-btn" onClick={() => onRemove(m.id)} aria-label={`${m.name} 삭제`}>
                    ✕
                </button>
                </li>
            ))}
            </ul>
        )}

        <div className="total">
            총합 <strong>{total.toLocaleString()}원</strong>
        </div>
        <button className="btn" onClick={handlePay}>
            결제하기
        </button>
        </main>
    );
}