import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './PageLogin.css';

const USER_STORAGE_KEY = 'user_name';
const USER_ID_STORAGE_KEY = 'user_id';
const BACKEND_BASE_URL = import.meta.env.VITE_BACKEND_BASE_URL || '';

const getDisplayName = (email) => {
  const [localPart] = email.split('@');
  const candidate = localPart.trim();
  return candidate || email.trim();
};

const parseApiError = (payloadData) => {
  if (typeof payloadData === 'object' && payloadData) return payloadData.message || '';
  if (typeof payloadData === 'string') return payloadData;
  return '';
};

const EyeIcon = () => (
  <svg viewBox="0 0 24 24" aria-hidden="true">
    <path d="M2 12s3.5-6 10-6 10 6 10 6-3.5 6-10 6-10-6-10-6z" />
    <circle cx="12" cy="12" r="3" />
  </svg>
);

const EyeOffIcon = () => (
  <svg viewBox="0 0 24 24" aria-hidden="true">
    <path d="M3 3l18 18" />
    <path d="M10.58 10.58a2 2 0 0 0 2.84 2.84" />
    <path d="M9.88 5.09A11.5 11.5 0 0 1 12 5c6.5 0 10 7 10 7a15.8 15.8 0 0 1-4 4.95" />
    <path d="M6.61 6.61A15.7 15.7 0 0 0 2 12s3.5 7 10 7a11.4 11.4 0 0 0 5.1-1.22" />
  </svg>
);

const AuthMode = {
  SIGN_IN: 'signin',
  SIGN_UP: 'signup',
  FORGOT: 'forgot'
};

const requestApi = async (endpoint, payload) => {
  const response = await fetch(`${BACKEND_BASE_URL}${endpoint}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(payload)
  });

  const contentType = response.headers.get('content-type') || '';
  const payloadData = contentType.includes('application/json')
    ? await response.json().catch(() => null)
    : await response.text().catch(() => '');

  if (!response.ok) {
    const message = parseApiError(payloadData);

    if (!message && response.status >= 500) {
      throw new Error('Servidor indisponivel. Confirme se o backend esta rodando na porta 3001.');
    }

    throw new Error(message || 'Nao foi possivel autenticar.');
  }

  return payloadData;
};

function PageLogin() {
  const [authMode, setAuthMode] = useState(AuthMode.SIGN_IN);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [resetCode, setResetCode] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');
  const [infoMessage, setInfoMessage] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [isRequestingResetCode, setIsRequestingResetCode] = useState(false);
  const navigate = useNavigate();

  const isSignUpMode = authMode === AuthMode.SIGN_UP;
  const isForgotMode = authMode === AuthMode.FORGOT;

  const submitLabel = isForgotMode ? 'Redefinir senha' : isSignUpMode ? 'Criar conta' : 'Entrar';
  const pendingLabel = isForgotMode
    ? 'Redefinindo senha...'
    : isSignUpMode
      ? 'Criando conta...'
      : 'Entrando...';
  const pageTitle = isForgotMode ? 'Esqueci minha senha' : isSignUpMode ? 'Criar conta' : 'Fazer login';
  const pageSubtitle = isForgotMode
    ? 'Informe seu e-mail, gere um codigo e defina sua nova senha.'
    : isSignUpMode
      ? 'Crie seu acesso com nome publico para entrar no ambiente HMDb.'
      : 'Use seu e-mail e senha para continuar.';

  const clearFields = ({ keepEmail = false } = {}) => {
    setName('');
    if (!keepEmail) setEmail('');
    setPassword('');
    setConfirmPassword('');
    setResetCode('');
    setShowPassword(false);
    setShowConfirmPassword(false);
  };

  const handleModeChange = (mode, { keepEmail = false, nextInfoMessage = '' } = {}) => {
    setAuthMode(mode);
    setErrorMessage('');
    setInfoMessage(nextInfoMessage);
    clearFields({ keepEmail });
  };

  const saveSessionUser = ({ user, fallbackEmail }) => {
    const displayName = user?.name?.trim() || getDisplayName(fallbackEmail);
    const userId = typeof user?.id === 'string' ? user.id.trim() : '';

    if (rememberMe) {
      localStorage.setItem(USER_STORAGE_KEY, displayName);
      if (userId) {
        localStorage.setItem(USER_ID_STORAGE_KEY, userId);
      } else {
        localStorage.removeItem(USER_ID_STORAGE_KEY);
      }

      sessionStorage.removeItem(USER_STORAGE_KEY);
      sessionStorage.removeItem(USER_ID_STORAGE_KEY);
      return;
    }

    sessionStorage.setItem(USER_STORAGE_KEY, displayName);
    if (userId) {
      sessionStorage.setItem(USER_ID_STORAGE_KEY, userId);
    } else {
      sessionStorage.removeItem(USER_ID_STORAGE_KEY);
    }

    localStorage.removeItem(USER_STORAGE_KEY);
    localStorage.removeItem(USER_ID_STORAGE_KEY);
  };

  const handleRequestResetCode = async () => {
    const trimmedEmail = email.trim();

    if (!trimmedEmail) {
      setErrorMessage('Informe seu e-mail para gerar o codigo de recuperacao.');
      return;
    }

    setIsRequestingResetCode(true);
    setErrorMessage('');
    setInfoMessage('');

    try {
      const payload = await requestApi('/api/auth/forgot-password', { email: trimmedEmail });
      const code = typeof payload?.resetCode === 'string' ? payload.resetCode : '';

      if (code) {
        setInfoMessage(`Codigo de recuperacao: ${code}`);
      } else {
        setInfoMessage(payload?.message || 'Se o e-mail existir, um codigo foi gerado.');
      }
    } catch (error) {
      if (error instanceof TypeError) {
        setErrorMessage('Nao foi possivel conectar ao servidor. Inicie o backend e tente novamente.');
      } else {
        setErrorMessage(error.message || 'Nao foi possivel gerar o codigo.');
      }
    } finally {
      setIsRequestingResetCode(false);
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const trimmedEmail = email.trim();
    const trimmedPassword = password.trim();
    const trimmedConfirmPassword = confirmPassword.trim();
    const trimmedName = name.trim();
    const trimmedResetCode = resetCode.trim();

    if (!trimmedEmail) {
      setErrorMessage('Informe seu e-mail para continuar.');
      return;
    }

    if (isForgotMode) {
      if (!trimmedResetCode) {
        setErrorMessage('Informe o codigo de recuperacao.');
        return;
      }

      if (trimmedPassword.length < 6) {
        setErrorMessage('A senha precisa ter pelo menos 6 caracteres.');
        return;
      }

      if (trimmedPassword !== trimmedConfirmPassword) {
        setErrorMessage('As senhas nao conferem.');
        return;
      }
    } else {
      if (!trimmedPassword) {
        setErrorMessage('Preencha e-mail e senha para continuar.');
        return;
      }

      if (isSignUpMode && trimmedName.length < 2) {
        setErrorMessage('Informe seu nome com pelo menos 2 caracteres.');
        return;
      }

      if (isSignUpMode && trimmedPassword.length < 6) {
        setErrorMessage('A senha precisa ter pelo menos 6 caracteres.');
        return;
      }

      if (isSignUpMode && trimmedPassword !== trimmedConfirmPassword) {
        setErrorMessage('As senhas nao conferem.');
        return;
      }
    }

    setIsSaving(true);
    setErrorMessage('');
    setInfoMessage('');

    try {
      if (isForgotMode) {
        await requestApi('/api/auth/reset-password', {
          email: trimmedEmail,
          code: trimmedResetCode,
          newPassword: trimmedPassword
        });

        handleModeChange(AuthMode.SIGN_IN, {
          keepEmail: true,
          nextInfoMessage: 'Senha redefinida com sucesso. Faça login com a nova senha.'
        });
        setIsSaving(false);
        return;
      }

      const endpoint = isSignUpMode ? '/api/auth/signup' : '/api/auth/login';
      const payload = isSignUpMode
        ? { name: trimmedName, email: trimmedEmail, password: trimmedPassword }
        : { email: trimmedEmail, password: trimmedPassword };

      const responsePayload = await requestApi(endpoint, payload);
      saveSessionUser({ user: responsePayload?.user, fallbackEmail: trimmedEmail });

      window.dispatchEvent(new Event('hmdb:user-change'));
      setIsSaving(false);
      navigate('/filmes');
    } catch (error) {
      if (error instanceof TypeError) {
        setErrorMessage('Nao foi possivel conectar ao servidor. Inicie o backend e tente novamente.');
      } else {
        setErrorMessage(error.message || 'Nao foi possivel autenticar.');
      }
      setIsSaving(false);
    }
  };

  return (
    <main className="login-page">
      <section className="login-shell">
        <div className="brand-strip">
          <span className="brand-mark">HMDb</span>
          <span className="brand-copy">Workspace</span>
        </div>

        <form className="auth-card" onSubmit={handleSubmit}>
          <header className="auth-header">
            <h1 className="auth-title">{pageTitle}</h1>
            <p className="auth-subtitle">{pageSubtitle}</p>
          </header>

          {isSignUpMode ? (
            <>
              <label className="field-label" htmlFor="signupName">
                Nome
              </label>
              <input
                id="signupName"
                type="text"
                className="field-input"
                placeholder="Como voce quer aparecer"
                value={name}
                onChange={(event) => setName(event.target.value)}
                autoComplete="name"
              />
            </>
          ) : null}

          <label className="field-label" htmlFor="loginEmail">
            E-mail
          </label>
          <input
            id="loginEmail"
            type="email"
            className="field-input"
            placeholder="seuemail@empresa.com"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            autoComplete="email"
          />

          {isForgotMode ? (
            <>
              <button
                type="button"
                className="secondary-btn forgot-code-btn"
                onClick={handleRequestResetCode}
                disabled={isRequestingResetCode || isSaving}
              >
                {isRequestingResetCode ? 'Gerando codigo...' : 'Gerar codigo de recuperacao'}
              </button>

              <label className="field-label" htmlFor="resetCode">
                Codigo de recuperacao
              </label>
              <input
                id="resetCode"
                type="text"
                className="field-input"
                placeholder="Digite o codigo recebido"
                value={resetCode}
                onChange={(event) => setResetCode(event.target.value)}
                autoComplete="one-time-code"
              />

              <label className="field-label" htmlFor="loginPassword">
                Nova senha
              </label>
              <div className="password-field">
                <input
                  id="loginPassword"
                  type={showPassword ? 'text' : 'password'}
                  className="field-input password-input"
                  placeholder="Digite a nova senha"
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  autoComplete="new-password"
                />
                <button
                  type="button"
                  className="password-toggle"
                  onClick={() => setShowPassword((current) => !current)}
                  aria-label={showPassword ? 'Ocultar senha' : 'Mostrar senha'}
                  aria-pressed={showPassword}
                >
                  {showPassword ? <EyeOffIcon /> : <EyeIcon />}
                </button>
              </div>

              <label className="field-label" htmlFor="confirmPassword">
                Confirmar nova senha
              </label>
              <div className="password-field">
                <input
                  id="confirmPassword"
                  type={showConfirmPassword ? 'text' : 'password'}
                  className="field-input password-input"
                  placeholder="Repita a nova senha"
                  value={confirmPassword}
                  onChange={(event) => setConfirmPassword(event.target.value)}
                  autoComplete="new-password"
                />
                <button
                  type="button"
                  className="password-toggle"
                  onClick={() => setShowConfirmPassword((current) => !current)}
                  aria-label={showConfirmPassword ? 'Ocultar confirmacao de senha' : 'Mostrar confirmacao de senha'}
                  aria-pressed={showConfirmPassword}
                >
                  {showConfirmPassword ? <EyeOffIcon /> : <EyeIcon />}
                </button>
              </div>
              <p className="auth-helper">A senha deve ter pelo menos 6 caracteres.</p>
            </>
          ) : (
            <>
              <label className="field-label" htmlFor="loginPassword">
                Senha
              </label>
              <div className="password-field">
                <input
                  id="loginPassword"
                  type={showPassword ? 'text' : 'password'}
                  className="field-input password-input"
                  placeholder="Digite sua senha"
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  autoComplete={isSignUpMode ? 'new-password' : 'current-password'}
                />
                <button
                  type="button"
                  className="password-toggle"
                  onClick={() => setShowPassword((current) => !current)}
                  aria-label={showPassword ? 'Ocultar senha' : 'Mostrar senha'}
                  aria-pressed={showPassword}
                >
                  {showPassword ? <EyeOffIcon /> : <EyeIcon />}
                </button>
              </div>

              {isSignUpMode ? (
                <>
                  <label className="field-label" htmlFor="signupConfirmPassword">
                    Confirmar senha
                  </label>
                  <div className="password-field">
                    <input
                      id="signupConfirmPassword"
                      type={showConfirmPassword ? 'text' : 'password'}
                      className="field-input password-input"
                      placeholder="Repita sua senha"
                      value={confirmPassword}
                      onChange={(event) => setConfirmPassword(event.target.value)}
                      autoComplete="new-password"
                    />
                    <button
                      type="button"
                      className="password-toggle"
                      onClick={() => setShowConfirmPassword((current) => !current)}
                      aria-label={showConfirmPassword ? 'Ocultar confirmacao de senha' : 'Mostrar confirmacao de senha'}
                      aria-pressed={showConfirmPassword}
                    >
                      {showConfirmPassword ? <EyeOffIcon /> : <EyeIcon />}
                    </button>
                  </div>
                  <p className="auth-helper">A senha deve ter pelo menos 6 caracteres.</p>
                </>
              ) : (
                <div className="auth-options">
                  <label className="remember">
                    <input
                      id="rememberMe"
                      type="checkbox"
                      checked={rememberMe}
                      onChange={(event) => setRememberMe(event.target.checked)}
                    />
                    <span>Manter conectado</span>
                  </label>
                  <button
                    type="button"
                    className="link-btn"
                    onClick={() => handleModeChange(AuthMode.FORGOT, { keepEmail: true })}
                  >
                    Esqueci minha senha
                  </button>
                </div>
              )}
            </>
          )}

          {infoMessage ? <p className="login-info">{infoMessage}</p> : null}
          {errorMessage ? <p className="login-error">{errorMessage}</p> : null}

          <button className="primary-btn" type="submit" disabled={isSaving}>
            {isSaving ? pendingLabel : submitLabel}
          </button>

          <p className="auth-terms">
            Ao continuar, voce concorda com os Termos de Uso e Politica de Privacidade.
          </p>

          {isForgotMode ? (
            <p className="switch-line">
              Lembrou sua senha?
              <button
                type="button"
                className="link-btn"
                onClick={() => handleModeChange(AuthMode.SIGN_IN, { keepEmail: true })}
              >
                Voltar para login
              </button>
            </p>
          ) : isSignUpMode ? (
            <p className="switch-line">
              Ja possui conta?
              <button type="button" className="link-btn" onClick={() => handleModeChange(AuthMode.SIGN_IN)}>
                Fazer login
              </button>
            </p>
          ) : (
            <>
              <div className="section-divider">
                <span>Novo na HMDb?</span>
              </div>
              <button type="button" className="secondary-btn" onClick={() => handleModeChange(AuthMode.SIGN_UP)}>
                Criar sua conta HMDb
              </button>
            </>
          )}
        </form>
      </section>
    </main>
  );
}

export default PageLogin;
