import { Link } from 'react-router-dom';

interface Props {
  theme: 'light' | 'dark';
  onToggleTheme: () => void;
}

export default function Header({ theme, onToggleTheme }: Props) {
  return (
    <header className="header">
      <Link to="/" className="logo" aria-label="메인 페이지로 이동">
        🌙
      </Link>
      <button className="theme-btn" onClick={onToggleTheme}>
        {theme === 'light' ? '🌙 다크' : '☀️ 라이트'}
      </button>
    </header>
  );
}