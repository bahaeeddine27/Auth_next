import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';

export async function GET(request) {
  // 1. Extraire le "Authorization" header dans une variable "authHeader"
  const authHeader = request.headers.get('Authorization');

  // 2. Extraire le token du "Authorization" header
  const token = authHeader?.split(' ')[1]; // Le token se trouve après "Bearer"

  // 3. Vérifier la présence du token
  if (!token) {
    return NextResponse.json(
      { message: 'Token is required' },
      { status: 401 }
    );
  }

  try {
    // 4. Vérifier le JWT avec la clé secrète pour l'access token
    const decoded = jwt.verify(token, process.env.JWT_SECRET); // Utilisation de la clé secrète pour l'access token

    // 5. Renvoyer la réponse avec les données décodées
    return NextResponse.json({ decoded });
  } catch (error) {
    // 6. Renvoyer une erreur si le token est invalide ou expiré
    return NextResponse.json(
      { message: 'Invalid or expired token' },
      { status: 403 }
    );
  }
}
