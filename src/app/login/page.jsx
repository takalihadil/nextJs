// login/page.jsx
"use client";

import { useState, useEffect } from "react";
import { getSupabaseClient } from "../utils/supabase/browser-client"; // Importer la fonction
import { login } from "../action/actions";
import { AiOutlineMail, AiOutlineLock } from "react-icons/ai";
import Link from "next/link";
import styles from "../styles/auth.module.css";

export default function LoginPage() {
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const supabase = getSupabaseClient(); // Utiliser le client Supabase centralisé

  const handleFormLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");
    const formData = new FormData(e.target);
    const errorMessage = await login(formData);

    if (errorMessage) {
      setError(errorMessage);
      setLoading(false);
    } else {
      setTimeout(() => {
        window.location.href = "/";
      }, 2000);
    }
  };

  const handleOAuthLogin = async (provider) => {
    try {
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: provider,
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
        },
      });

      if (error) {
        setError(`Error: ${error.message}`);
        return;
      }

      // OAuth login is initiated
    } catch (error) {
      setError(`Error: ${error.message}`);
    }
  };

  useEffect(() => {
    const hash = window.location.hash;
    if (hash.includes("access_token")) {
      const params = new URLSearchParams(hash.slice(1));
      const accessToken = params.get("access_token");
      const refreshToken = params.get("refresh_token");

      supabase.auth.setSession({
        access_token: accessToken,
        refresh_token: refreshToken,
      }).then(() => {
        window.location.href = "/";
      }).catch((error) => {
        setError(`Error setting session: ${error.message}`);
      });
    }
  }, [supabase]);

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <h1 className={styles.title}>Welcome Back</h1>
        <p className={styles.subtitle}>Please login to your account</p>

        <form onSubmit={handleFormLogin} className={styles.form}>
          <div className={styles.inputGroup}>
            <div className={styles.inputWrapper}>
              <AiOutlineMail className={styles.icon} />
              <input type="email" name="email" placeholder="Email" required className={styles.input} />
            </div>
            <div className={styles.inputWrapper}>
              <AiOutlineLock className={styles.icon} />
              <input type="password" name="password" placeholder="Password" required className={styles.input} />
            </div>
            <p className={styles.forgotPassword}>
            <Link href="/forget-password"className={styles.link} >
             Mot de passe oublié ?
             </Link>
            </p>
          </div>
          <div className={styles.buttonGroup}>
            <button type="submit" className={styles.button} disabled={loading}>
              {loading ? "Logging In..." : "Login"}
            </button>
          </div>
        </form>

        <p className={styles.switch}>
          Don't have an account?{" "}
          <Link href="/signup" className={styles.llink}>
            Signup Here
          </Link>
        </p>

        <div className={styles.socialButtons}>
          <div className={styles.socialButton} onClick={() => handleOAuthLogin("google")}>
            <img className={styles.googleImage} src="https://cdn1.iconfinder.com/data/icons/google-s-logo/150/Google_Icons-09-512.png" alt="Google Login" />
          </div>
          <div className={styles.socialButton} onClick={() => handleOAuthLogin("facebook")}>
            <img className={styles.facebookImage} src="https://upload.wikimedia.org/wikipedia/commons/5/51/Facebook_f_logo_%282019%29.svg" alt="Facebook Login" />
          </div>
          <div className={styles.socialButton} onClick={() => handleOAuthLogin("github")}>
            <img className={styles.githubImage} src="https://upload.wikimedia.org/wikipedia/commons/9/91/Octicons-mark-github.svg" alt="GitHub Login" />
          </div>
        </div>
      </div>

      {success && (
        <div className={styles.successMessage}>
          <span className={styles.icon}>✅</span>
          <p>{success}</p>
        </div>
      )}
      {error && (
        <div className={styles.errorMessage}>
          <span className={styles.icon}>❌</span>
          <p>{error}</p>
        </div>
      )}
    </div>
  );
}
