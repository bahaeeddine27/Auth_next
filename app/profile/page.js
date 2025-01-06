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

  useEffect(() => {
    const fetchProfile = async () => {
      try {    
        // 4. Récupérer le "token" et le "refreshToken" du localStorage
        const token = localStorage.getItem('accessToken');
        const refreshToken = localStorage.getItem('refreshToken');
        // 5. Faire la requête vers "/api/protected"
        const response = await fetch('/api/protected', {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });
        // 6. Si la réponse n'est pas bonne, a un status 401, que "isRefreshing" est "false" et qu'on a bien un "refreshToken"
        if (response.status === 401 && refreshToken) {
          // 7. Passer isRefreshing à "true"
          setIsRefreshing(true);
          // 8. Faire la requête vers "'/api/refresh"
          const refreshResponse = await fetch('/api/refresh', {
            method: 'POST',
            header: {
              'Content-Type': 'application/json', 
            },
            body :JSON.stringify({ refreshToken }),
          });
          // 9. Si la réponse est bonne
          if (refreshToken.ok) {
            // 10. Récupérer le token dans la réponse
            const data = await refreshResponse.json();
            const { accessToken } = data;
            // 11. Stocker ce token dans le localStorage
            localStorage.setItem('accessToken', accessToken);
            // 12. Passer isRefreshing à "false"
            setIsRefreshing(false);
            // 13. Appeler la fonction "fetchProfile"
            fetchProfile();
          } else {
            // 14. Passer isRefreshing à "false"
            setIsRefreshing(false);
            // 15. Déconnecter l'utilisateur
            localStorage.removeItem('accessToken');
            localStorage.removeItem('refreshToken');
            router.push('/login');
          }
        } else if (response.ok) {
          // 16. Récupérer les données de la réponse
          const data = await response.json();
          // 17. Utiliser "setUser" pour mettre à jour l'utilisateur avec les données récupérées.
          setUser(data);
        }
      } catch (error) {
        // 18. Rediriger vers la page "/login"
        router.push('/login'); 
      }
    };

    // 19. Récupérer le "token"
    if (!token) {
      // 20. Rediriger vers la page "/login"
      router.push('/login');
    } else {
      // 21. Appeler la fonction "fetchProfile
      fetchProfile();
    }
  }, [router]);

  const handleLogout = () => {
    // 22. Supprimer le "token" et le "refreshToken" du localStorage
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    // 23. Rediriger vers la page "/login"
    router.push('/login');
  };

  return (
    <div>
      <h1>Profile Page</h1>
      {isRefreshing ? (
        <p>Refreshing tokenn...</p>
      ) : user ? (
        <p>Welcome, {user.username}!</p>
      ) : (
        <p>Loading...</p>
      )}
      <button onClick={handleLogout}>Logout</button>
    </div>
  );
}
