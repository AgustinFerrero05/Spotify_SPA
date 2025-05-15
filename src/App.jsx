import { Routes, Route, Navigate } from "react-router-dom";
import { useEffect, useState, useCallback } from "react";
import SearchView from "./views/SearchView";
import ArtistDetail from "./views/ArtistDetail";
import AlbumDetail from "./views/AlbumDetail";
import LoginView from "./views/LoginView";
import FavoritesView from "./views/FavoritesView";
import "./App.css";

function App() {
  const [token, setToken] = useState(localStorage.getItem("access_token") || "");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [tokenExpireAt, setTokenExpireAt] = useState(
    Number(localStorage.getItem("token_expire_at")) || 0
  );

  
  const fetchToken = useCallback(async () => {
    const clientId = localStorage.getItem("client_id");
    const clientSecret = localStorage.getItem("client_secret");
    if (!clientId || !clientSecret) {
      setError("No hay Client ID o Client Secret guardados.");
      return;
    }
    setLoading(true);
    setError("");

    try {
      const res = await fetch("https://accounts.spotify.com/api/token", {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
          Authorization: "Basic " + btoa(`${clientId}:${clientSecret}`),
        },
        body: "grant_type=client_credentials",
      });

      if (!res.ok) {
        throw new Error("Error al obtener token");
      }

      const data = await res.json();

      if (data.access_token) {
        setToken(data.access_token);
        localStorage.setItem("access_token", data.access_token);

        const expiresIn = data.expires_in || 3600; 
        const expireAt = Date.now() + expiresIn * 1000;
        setTokenExpireAt(expireAt);
        localStorage.setItem("token_expire_at", expireAt.toString());
      } else {
        setError("No se recibió token válido");
      }
    } catch (error) {
      console.error(error);
      setError("Error al obtener token. Ver consola.");
    } finally {
      setLoading(false);
    }
  }, []);

  
  useEffect(() => {
    const storedToken = localStorage.getItem("access_token");
    const expireAtStored = Number(localStorage.getItem("token_expire_at")) || 0;
    const now = Date.now();

    if (storedToken && expireAtStored && expireAtStored > now + 60000) {
      
      setToken(storedToken);
      setTokenExpireAt(expireAtStored);
    } else {
      
      fetchToken();
    }
  }, [fetchToken]);

  
  const getValidToken = async () => {
    if (Date.now() > tokenExpireAt - 60000) {
      
      await fetchToken();
      return localStorage.getItem("access_token") || "";
    }
    return token;
  };

  return (
    <div className="app-container">
      {loading && <div className="loading-message">Cargando...</div>}
      {error && <div className="error-message">{error}</div>}

      <Routes>
        <Route
          path="/"
          element={token ? <SearchView token={token} getValidToken={getValidToken} /> : <Navigate to="/login" />}
        />
        <Route path="/artist/:id" element={<ArtistDetail token={token} getValidToken={getValidToken} />} />
        <Route path="/album/:id" element={<AlbumDetail token={token} getValidToken={getValidToken} />} />
        <Route path="/login" element={<LoginView setToken={setToken} />} />
        <Route path="/favorites" element={<FavoritesView />} />
      </Routes>
    </div>
  );
}

export default App;
