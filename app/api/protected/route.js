import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';

export async function GET(request) {
  // 1. Récupérer "authorization" dans les "headers" et le stocker dans un variable "authHeader"
  const authHeader = request.headers.get('Authorization');

  // 2. Récupérer le token dans le "authHeader"
  if (!authHeader) {
    // 3. S'il n'y a pas de token alors renvoyer une erreur
    return NextResponse.json(
      { message: 'Token is required' },
      { status: 401 }
    );
  }
  const token = authHeader.split(' ')[1];

  try {
    // 4. Vérifier le JWT
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    // 5. Renvoyer la réponse avec le "decoded"
    return NextResponse.json({ decoded });
  } catch (error) {
    // 6. Renvoyer une erreur
    return NextResponse.json(
      { message: 'Invalid or expired token' },
      { status: 403 }
    );
  }
}
