import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './PageLogin.css';

const USER_STORAGE_KEY = 'user_name';

function PageLogin() {
  const [name, setName] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (event) => {
    event.preventDefault();

    const trimmedName = name.trim();
    if (!trimmedName) {
      setErrorMessage('Enter your name to continue.');
      return;
    }

    localStorage.setItem(USER_STORAGE_KEY, trimmedName);
    window.dispatchEvent(new Event('hmdb:user-change'));
    setErrorMessage('');
    navigate('/filmes');
  };

  return (
    <main className="login-page">
      <section className="login-card">
        <h1>Welcome to HMDb</h1>
        <p>Use a display name to continue.</p>

        <form onSubmit={handleSubmit} className="login-form">
          <label htmlFor="displayName">Display name</label>
          <input
            id="displayName"
            type="text"
            value={name}
            onChange={(event) => setName(event.target.value)}
            placeholder="Your name"
            autoComplete="off"
          />

          {errorMessage ? <span className="login-error">{errorMessage}</span> : null}

          <button type="submit">Continue</button>
        </form>
      </section>
    </main>
  );
}

export default PageLogin;
