"use client";

import { useUser } from '../context/UserContext'; // Importer le hook de contexte pour obtenir l'utilisateur
import { useRouter } from 'next/navigation'; // Importer useRouter pour la redirection
import { Box, Typography, Avatar } from "@mui/material";

const Profile = () => {
  const { user, isProcessing, error } = useUser(); // Récupérer l'utilisateur depuis le contexte
  const router = useRouter();

  if (isProcessing) {
    return <Typography>Loading...</Typography>; // Si l'état de traitement est en cours, afficher "Loading..."
  }

  if (!user) {
    router.push('/login'); // Si l'utilisateur n'est pas authentifié, rediriger vers la page de login
    return null; // Ne pas afficher le contenu si l'utilisateur n'est pas authentifié
  }

  return (
    <Box
      sx={{
        maxWidth: 600,
        margin: "0 auto",
        padding: 3,
        backgroundColor: "#ffffff",
        borderRadius: 2,
        boxShadow: 2,
        textAlign: "center",
      }}
    >
      <Typography variant="h4" gutterBottom>
        User Profile
      </Typography>

      <Avatar
        src={user?.avatar_url || "https://example.com/default-profile.jpg"} // Image par défaut si pas d'avatar
        alt={user?.name || "User"}
        sx={{
          width: 100,
          height: 100,
          marginBottom: 2,
          marginX: "auto",
        }}
      />

      <Typography variant="h6" gutterBottom>
        {user?.name || "Anonymous User"}
      </Typography>

      <Typography variant="body1" color="textSecondary">
        Email: {user?.email || "Not provided"}
      </Typography>
    </Box>
  );
};

export default Profile;
