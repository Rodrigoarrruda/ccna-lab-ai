'use client';

import { useState } from 'react';

export default function LogoutButton() {
  const [error, setError] = useState('');

  async function logout() {
    setError('');
    try {
      const response = await fetch('/api/auth/logout', { method: 'POST' });
      if (!response.ok) throw new Error('Não foi possível encerrar a sessão. Tente novamente.');
      window.location.replace('/login');
    } catch (cause) {
      setError(
        cause instanceof Error
          ? cause.message
          : 'Não foi possível encerrar a sessão. Tente novamente.',
      );
    }
  }

  return (
    <div className="logout-control">
      <button type="button" onClick={logout}>Sair</button>
      {error && <span role="alert">{error}</span>}
    </div>
  );
}
