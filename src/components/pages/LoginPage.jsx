import { useState } from 'react';
import { Eye, EyeOff, Layers, Loader2 } from 'lucide-react';
import { useAuth } from '../../context/useAuth.js';

const BRAND_NAME = 'XAVALUX';
const DEMO_EMAIL = 'xav.aholou@xavalux.com';
const DEMO_PASSWORD = 'admin123';

export default function LoginPage({ t }) {
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!email.trim() || !password.trim()) {
      setError(t('login_error_empty'));
      return;
    }

    setIsLoading(true);

    // Simulate network delay for realistic feel
    await new Promise((resolve) => setTimeout(resolve, 800));

    const result = login(email, password);
    if (!result.success) {
      const errorKey = result.error === 'email_not_found'
        ? 'login_error_email'
        : 'login_error_password';
      setError(t(errorKey));
      setIsLoading(false);
    }
  };

  return (
    <div className="login-page">
      {/* Animated background */}
      <div className="login-bg">
        <div className="login-bg-orb login-bg-orb--1" />
        <div className="login-bg-orb login-bg-orb--2" />
        <div className="login-bg-orb login-bg-orb--3" />
      </div>

      <div className="login-container animate-in fade-in duration-300">
        {/* Logo / Brand */}
        <div className="login-brand">
          <div className="login-logo">
            <Layers className="login-logo-icon" />
          </div>
          <h1 className="login-title">{BRAND_NAME}</h1>
          <p className="login-subtitle">{t('login_subtitle')}</p>
        </div>

        {/* Card */}
        <div className="login-card">
          <div className="login-card-header">
            <h2 className="login-card-title">{t('login_heading')}</h2>
            <p className="login-card-desc">{t('login_description')}</p>
          </div>

          {error && (
            <div className="login-error animate-in slide-in-from-top-4 duration-200">
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="login-form">
            <div className="login-field">
              <label htmlFor="login-email" className="login-label">
                {t('email_address')}
              </label>
              <input
                id="login-email"
                type="email"
                autoComplete="email"
                placeholder={t('login_email_placeholder')}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="login-input"
                disabled={isLoading}
              />
            </div>

            <div className="login-field">
              <label htmlFor="login-password" className="login-label">
                {t('login_password_label')}
              </label>
              <div className="login-password-wrapper">
                <input
                  id="login-password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="current-password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="login-input login-input--password"
                  disabled={isLoading}
                />
                <button
                  type="button"
                  className="login-password-toggle"
                  onClick={() => setShowPassword((v) => !v)}
                  tabIndex={-1}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div className="login-options">
              <label className="login-remember">
                <input type="checkbox" className="login-checkbox" />
                <span>{t('login_remember')}</span>
              </label>
              <a href="#" className="login-forgot" onClick={(e) => e.preventDefault()}>
                {t('login_forgot')}
              </a>
            </div>

            <button type="submit" className="login-submit" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 login-spinner" />
                  <span>{t('login_signing_in')}</span>
                </>
              ) : (
                <span>{t('login_sign_in')}</span>
              )}
            </button>
          </form>

          <div className="login-divider">
            <span>{t('login_demo_hint')}</span>
          </div>

          <div className="login-demo-credentials">
            <div className="login-demo-row">
              <span className="login-demo-label">{t('email_address')}:</span>
              <code className="login-demo-value">{DEMO_EMAIL}</code>
            </div>
            <div className="login-demo-row">
              <span className="login-demo-label">{t('login_password_label')}:</span>
              <code className="login-demo-value">{DEMO_PASSWORD}</code>
            </div>
          </div>
        </div>

        <p className="login-footer">
          © {new Date().getFullYear()} {BRAND_NAME.charAt(0) + BRAND_NAME.slice(1).toLowerCase()} — {t('login_footer')}
        </p>
      </div>
    </div>
  );
}
