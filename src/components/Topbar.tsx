import { Link } from 'react-router-dom';

export default function Topbar() {
  return (
    <nav className="border-b px-6 py-4">
      <Link to="/">
        <h1 className="text-xl font-semibold">Admin</h1>
      </Link>
    </nav>
  );
}