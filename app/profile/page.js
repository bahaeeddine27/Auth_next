'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function ProfilePage() {
  // 1. Définir un état pour le "user" (null au départ)
  const [user, setUser] = useState(null);
  // 2. Définir un état pour le "isRefreshing" (false au départ)
  const [isRefreshing, setIsRefreshing] = useState(false);
  // 3. Définir le "router"
  const router = useRouter();

  const handleLogout = () => {
    // Supprimer le "token" et le "refreshToken" du localStorage
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    // Rediriger vers la page "/login"
    router.push('/login');
  };

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        // 4. Récupérer le "token" et le "refreshToken" du localStorage
        const token = localStorage.getItem('accessToken');
        const refreshToken = localStorage.getItem('refreshToken');

        // 5. Vérifier si le token est présent
        if (!token) {
          handleLogout();
          return;
        }

        // 6. Faire la requête vers "/api/protected"
        const response = await fetch('/api/protected', {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        // 7. Si la réponse a un status 401, qu'on a un "refreshToken" et qu'on n'est pas déjà en train de rafraîchir
        if (!response.ok && response.status === 403 && refreshToken && !isRefreshing) {
          // 8. Passer isRefreshing à "true"
          setIsRefreshing(true);

          // 9. Faire la requête vers "/api/refresh"
          const refreshResponse = await fetch('/api/refresh', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ refreshToken }),
          });

          // 10. Si la réponse est bonne
          if (refreshResponse.ok) {
            // 11. Récupérer le nouveau token dans la réponse
            const data = await refreshResponse.json();
            const { accessToken } = data;

            // 12. Stocker ce token dans le localStorage
            localStorage.setItem('accessToken', accessToken);

            // 13. Passer isRefreshing à "false"
            setIsRefreshing(false);

            // 14. Appeler à nouveau "fetchProfile"
            fetchProfile();
          } else {
            // 15. Passer isRefreshing à "false" et déconnecter l'utilisateur
            setIsRefreshing(false);
            handleLogout();
          }
        } else if (response.ok) {
          // 16. Récupérer les données de la réponse
          const data = await response.json();

          // 17. Mettre à jour l'utilisateur avec "setUser"
          setUser(data.user);
        }
      } catch (error) {
        // 19. Déconnecter l'utilisateur en cas d'erreur
        handleLogout();
      }
    };

    // 20. Appeler la fonction "fetchProfile"
    fetchProfile();
  }, []);

  return (
    <div>
      <h1>Profile Page</h1>
      {isRefreshing ? (
        <p>Refreshing token...</p>
      ) : user ? (
        <p>Welcome, {user.username}!</p>
      ) : (
        <p>Loading...</p>
      )}
      <button onClick={handleLogout}>Logout</button>
    </div>
  );
}
