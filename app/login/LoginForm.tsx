'use client';

import { FormEvent, useEffect, useState } from 'react';

export default function LoginForm() {
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [configured, setConfigured] = useState<boolean | null>(null);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    let active = true;
    fetch('/api/auth/login')
      .then(async (response) => {
        if (!response.ok) throw new Error('Não foi possível verificar a configuração de acesso.');
        return (await response.json()) as { configured: boolean };
      })
      .then((data) => {
        if (active) setConfigured(data.configured);
      })
      .catch(() => {
        if (active) setMessage('Não foi possível verificar o acesso. Atualize a página e tente novamente.');
      });
    return () => {
      active = false;
    };
  }, []);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setBusy(true);
    setMessage('');
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      });
      const result = (await response.json()) as { error?: string; ok?: boolean };
      if (!response.ok || !result.ok) {
        setMessage(result.error || 'Não foi possível entrar.');
        return;
      }
      window.location.replace('/');
    } catch {
      setMessage('Falha de conexão. Verifique a internet e tente novamente.');
    } finally {
      setBusy(false);
    }
  }

  return (
    <main className="auth-screen">
      <section className="auth-card" aria-labelledby="auth-title">
        <div className="auth-brand">◈ <span>CCNA <b>Lab AI</b></span></div>
        <p className="auth-kicker">AMBIENTE PRIVADO DE ESTUDOS</p>
        <h1 id="auth-title">Acesso protegido</h1>
        <p className="auth-description">Digite sua senha para continuar para o laboratório.</p>
        {configured === false ? (
          <p className="auth-message" role="status">
            A senha ainda não está configurada. Defina <code>APP_PASSWORD</code> na hospedagem
            com pelo menos 16 caracteres.
          </p>
        ) : (
          <form className="auth-form" onSubmit={submit}>
            <label htmlFor="site-password">Senha de acesso</label>
            <input
              id="site-password"
              type="password"
              autoComplete="current-password"
              autoFocus
              required
              maxLength={256}
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              disabled={busy || configured === null}
            />
            <button type="submit" className="primary" disabled={busy || configured !== true}>
              {busy ? 'Verificando…' : 'Entrar'}
            </button>
            {message && <p className="auth-message" role="alert">{message}</p>}
          </form>
        )}
      </section>
    </main>
  );
}
