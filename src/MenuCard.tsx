import type {Menu} from './Types'

//추천 상태이면 그라데이션 테두리로 강조
interface Props {
  menu: Menu;
  recommended: boolean;
  onAdd: (id: number) => void;
}

export default function MenuCard({ menu, recommended, onAdd }: Props) {
  return (
    <div className={`card-wrap ${recommended ? 'glow' : ''}`}>
      <div className="card">
        {recommended && <span className="badge">오늘의 추천</span>}
        <div className="card-img">{menu.emoji}</div>
        <div className="card-name">{menu.name}</div>
        <div className="card-price">{menu.price.toLocaleString()}원</div>
        <button className="btn small" onClick={() => onAdd(menu.id)}>
          담기
        </button>
      </div>
    </div>
  );
}
