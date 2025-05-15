import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

function LoginView({ setToken }) {
  const [clientId, setClientId] = useState("");
  const [clientSecret, setClientSecret] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("access_token");
    if (token) {
      setToken(token);  
      navigate("/");
    }
  }, [setToken, navigate]);

  const getToken = async () => {
    const credentials = btoa(`${clientId}:${clientSecret}`);

    try {
      setIsLoading(true);
      const response = await fetch("https://accounts.spotify.com/api/token", {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
          Authorization: `Basic ${credentials}`,
        },
        body: "grant_type=client_credentials",
      });

      if (!response.ok) {
        throw new Error("Failed to fetch token from Spotify");
      }

      const data = await response.json();

      localStorage.setItem("access_token", data.access_token);
      localStorage.setItem("client_id", clientId);
      localStorage.setItem("client_secret", clientSecret);

      setToken(data.access_token); 
      navigate("/");
    } catch (error) {
      setErrorMessage(error.message || "Unexpected error during login");
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogin = () => {
    if (!clientId || !clientSecret) {
      setErrorMessage("Both Client ID and Client Secret are required.");
      return;
    }
    setErrorMessage("");
    getToken();
  };

  return (
    <div>
      <h2>Login</h2>
      <div>
        <label htmlFor="clientId">Client ID</label>
        <input
          id="clientId"
          type="text"
          placeholder="Client ID"
          value={clientId}
          onChange={(e) => setClientId(e.target.value)}
          aria-label="Client ID"
        />
      </div>
      <div>
        <label htmlFor="clientSecret">Client Secret</label>
        <input
          id="clientSecret"
          type="password"
          placeholder="Client Secret"
          value={clientSecret}
          onChange={(e) => setClientSecret(e.target.value)}
          aria-label="Client Secret"
        />
      </div>

      {errorMessage && <p style={{ color: "red" }}>{errorMessage}</p>}

      <button onClick={handleLogin} aria-label="Login" disabled={isLoading}>
        {isLoading ? "Logging in..." : "Login"}
      </button>
    </div>
  );
}

export default LoginView;
