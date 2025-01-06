'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  // 1. Définir un état pour le "username"
  const [username, setUsername] = useState('');
  // 2. Définir un état pour le "password"
  const [password, setPassword] = useState('');
  // 3. Définir un état pour le "error"
  const [error, setError] = useState('');
  // 4. Définir le "router"
  const router = useRouter();

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      // 5. Faire la requête vers "/api/login"
      const response = await fetch('/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });

      // 6. Vérifier si la réponse est une erreur
      if (!response.ok) {
        const errorMessage =
          response.status === 401
            ? 'Invalid credentials'
            : 'An error occurred. Please try again.';
        throw new Error(errorMessage);
      }

      // 7. Récupérer le "token" et le "refreshToken" dans la réponse
      const data = await response.json();
      const { accessToken, refreshToken } = data;

      // 8. Stocker le "token" et le "refreshToken" dans le localStorage
      localStorage.setItem('accessToken', accessToken);
      localStorage.setItem('refreshToken', refreshToken);

      // 9. Rediriger vers la page protégée
      router.push('/profile');
    } catch (err) {
      // 10. Mettre à jour l'état "error" avec le message approprié
      setError(err.message);
    }
  };

  return (
    <div>
      <h1>Login</h1>
      <form onSubmit={handleLogin}>
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button type="submit">Login</button>
      </form>
      {error && <p style={{ color: 'red' }}>{error}</p>}
    </div>
  );
}
