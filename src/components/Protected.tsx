import { ReactNode, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import shallow from 'zustand/shallow';
import useUser from '@/lib/store/user';

interface Props {
  children: ReactNode;
  redirectOnFail?: boolean;
}

export default function Protected({ children, redirectOnFail = true }: Props) {
  const navigate = useNavigate();
  const [id, isAdmin] = useUser((state) => [state.id, state.is_admin], shallow);

  useEffect(() => {
    if (!id && redirectOnFail) navigate('/login');
  }, [id]);

  if (!id || !isAdmin) return null;

  return <>{children}</>;
}