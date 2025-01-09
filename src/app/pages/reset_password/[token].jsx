"use client";

import { useState } from "react";
import { useRouter } from "next/router";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

export default function ResetPasswordPage() {
  const router = useRouter();
  const { token } = router.query; // Récupérer le token depuis l'URL
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);

  const handleResetPassword = async (e) => {
    e.preventDefault();
    setIsProcessing(true);

    if (newPassword !== confirmPassword) {
      setError("Les mots de passe ne correspondent pas.");
      setIsProcessing(false);
      return;
    }

    try {
      // Utiliser le token pour réinitialiser le mot de passe
      const { error } = await supabase.auth.updateUser(token, {
        password: newPassword,
      });

      if (error) {
        setError("Erreur lors de la réinitialisation : " + error.message);
      } else {
        setMessage("Mot de passe réinitialisé avec succès !");
        router.push("/login"); // Rediriger vers la page de connexion
      }
    } catch (err) {
      setError("Une erreur inattendue s'est produite.");
    }

    setIsProcessing(false);
  };

  return (
    <div>
      <h1>Réinitialiser le mot de passe</h1>
      {message && <p style={{ color: "green" }}>{message}</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}
      <form onSubmit={handleResetPassword}>
        <input
          type="password"
          placeholder="Nouveau mot de passe"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Confirmer le mot de passe"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          required
        />
        <button type="submit" disabled={isProcessing}>
          {isProcessing ? "Réinitialisation en cours..." : "Réinitialiser"}
        </button>
      </form>
    </div>
  );
}
