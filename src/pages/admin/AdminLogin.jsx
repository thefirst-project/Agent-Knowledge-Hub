import { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';

function AdminLogin() {
  const { isAuthenticated, isLoading, login } = useAuth();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!isLoading && isAuthenticated) window.location.hash = '#/admin';
  }, [isAuthenticated, isLoading]);

  async function submit(event) {
    event.preventDefault();
    setError('');
    setSubmitting(true);
    try {
      await login(username, password);
      window.location.hash = '#/admin';
    } catch (loginError) {
      setError(loginError.message);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <main className="admin-login-page">
      <section className="admin-login-card" aria-labelledby="admin-login-title">
        <a className="admin-brand admin-login-brand" href="#/">
          <span className="admin-brand-mark">H&amp;P</span>
          <span><strong>Handsome &amp; Pretty</strong><small>Admin Panel</small></span>
        </a>
        <h1 id="admin-login-title">Sign in</h1>
        <p>Sign in to manage the Knowledge Hub.</p>
        <form className="admin-form" onSubmit={submit}>
          <label className="admin-field" htmlFor="admin-login-username">
            <span>Username</span>
            <input
              autoComplete="username"
              autoFocus
              id="admin-login-username"
              onChange={(event) => setUsername(event.target.value)}
              required
              value={username}
            />
          </label>
          <label className="admin-field" htmlFor="admin-login-password">
            <span>Password</span>
            <div className="admin-login-password">
              <input
                autoComplete="current-password"
                id="admin-login-password"
                onChange={(event) => setPassword(event.target.value)}
                required
                type={showPassword ? 'text' : 'password'}
                value={password}
              />
              <button type="button" onClick={() => setShowPassword((visible) => !visible)}>
                {showPassword ? 'Hide' : 'Show'}
              </button>
            </div>
          </label>
          {error && <p className="admin-login-error" role="alert">{error}</p>}
          <button className="admin-button primary admin-login-submit" disabled={submitting || isLoading} type="submit">
            {submitting ? <><span className="admin-spinner" aria-hidden="true" />Signing in…</> : 'Sign In'}
          </button>
        </form>
      </section>
    </main>
  );
}

export default AdminLogin;
