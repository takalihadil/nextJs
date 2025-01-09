"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { setCookie } from "cookies-next";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

const AuthCallbackPage = () => {
  const router = useRouter();
  const [error, setError] = useState("");
  const [isProcessing, setIsProcessing] = useState(true);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const processCallback = async () => {
      try {
        // Récupérer la session actuelle de l'utilisateur
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();
        console.log("Session Data:", session);
        console.log("Session Error:", sessionError);

        if (sessionError || !session) {
          setError("Failed to retrieve session or tokens.");
          setIsProcessing(false);
          return;
        }

        const { access_token, refresh_token } = session;

        if (access_token && refresh_token) {
          // Sauvegarder les tokens dans les cookies
          setCookie("access_token", access_token, { maxAge: 3600, path: "/" });
          setCookie("refresh_token", refresh_token, { maxAge: 3600, path: "/" });

          // Récupérer les informations de l'utilisateur
          const userResponse = await supabase.auth.getUser();
          if (userResponse.error) {
            setError("Failed to fetch user details.");
            setIsProcessing(false);
            return;
          }

          setUser(userResponse.data.user);
          console.log("User Data:", userResponse.data.user);

          setError("");
          setIsProcessing(false);
          router.push("/"); // Rediriger vers la page d'accueil après une connexion réussie
        } else {
          setError("Failed to extract tokens.");
          setIsProcessing(false);
        }
      } catch (err) {
        console.error("Unexpected error during callback processing:", err.message);
        setError("Unexpected error occurred.");
        setIsProcessing(false);
      }
    };

    processCallback();
  }, [router]);

  return (
    <div>
      <h1>Authentication Callback</h1>
      {isProcessing ? (
        <p>Processing your authentication...</p>
      ) : error ? (
        <p style={{ color: "red" }}>{error}</p>
      ) : (
        <div style={{ textAlign: "center", marginTop: "50px" }}>
          <h1>Login Successful!</h1>
        </div>
      )}
    </div>
  );
};

export default AuthCallbackPage;
