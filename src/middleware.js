import { createServerClient } from '@supabase/ssr';

import { NextResponse } from 'next/server';

export async function middleware(request) {
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    {
      cookies: {
        get: (name) => request.cookies.get(name)?.value,
        set: (name, value, options) => request.cookies.set(name, value, options),
        remove: (name) => request.cookies.delete(name),
      },
    }
  );

  // Vérifier la session utilisateur
  const { data: session, error: sessionError } = await supabase.auth.getSession();
  const { data: { user }, error: userError } = await supabase.auth.getUser();

  // Déterminer si l'utilisateur est connecté
  const isLoggedIn = session || user;

  // Définir les pages publiques
  const publicPages = [
    '/login', // Page de connexion
    '/signup', // Page d'inscription
    '/forget-password', // Page de réinitialisation du mot de passe
     // Page d'erreur
  ];
  
  // Vérifier si la page actuelle est publique
  const isPublicPage = publicPages.some((page) => request.nextUrl.pathname.startsWith(page));

  // Si l'utilisateur est connecté ou si la page est publique, autoriser l'accès
  if (isLoggedIn || isPublicPage) {
    return NextResponse.next();
  }

  // Si l'utilisateur n'est pas connecté et tente d'accéder à une page protégée, rediriger vers /login
  const url = request.nextUrl.clone();
  url.pathname = '/login';
  return NextResponse.redirect(url);
}

// Configuration du matcher pour exclure les fichiers statiques
export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|robots.txt|sitemap.xml|.*\\.(?:svg|png|jpg|jpeg|gif|webp|css|js|woff|woff2|ttf|eot)$).*)',
  ],
};
