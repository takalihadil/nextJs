"use client";
import { useState } from "react";
import { createClient } from "@supabase/supabase-js";
import { TextField, Button, Typography, Box } from "@mui/material";
import { useRouter } from "next/navigation";

// Initialiser le client Supabase
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [message, setMessage] = useState("");
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsProcessing(true);

    // Envoi de la demande de réinitialisation de mot de passe
    const { error } = await supabase.auth.resetPasswordForEmail(email);

    if (error) {
      setMessage(error.message); // Afficher l'erreur si elle se produit
    } else {
      setMessage("Un e-mail de réinitialisation a été envoyé. Vérifiez votre boîte de réception.");
      router.push("/login"); // Rediriger l'utilisateur vers la page de connexion après l'envoi de l'e-mail
    }

    setIsProcessing(false);
  };

  return (
    <Box sx={{ maxWidth: 400, margin: "0 auto", padding: 3, backgroundColor: "#fff", borderRadius: 2, boxShadow: 2 }}>
      <Typography variant="h5" gutterBottom>
        Réinitialisation du mot de passe
      </Typography>

      <form onSubmit={handleSubmit}>
        <TextField
          label="Adresse e-mail"
          fullWidth
          variant="outlined"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          margin="normal"
        />
        <Button
          type="submit"
          fullWidth
          variant="contained"
          color="primary"
          disabled={isProcessing}
        >
          {isProcessing ? "En cours..." : "Envoyer"}
        </Button>
      </form>

      {message && <Typography sx={{ marginTop: 2 }}>{message}</Typography>}
    </Box>
  );
}
