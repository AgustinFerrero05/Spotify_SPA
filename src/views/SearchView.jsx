import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

function SearchView({ token, getValidToken }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [artists, setArtists] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [favoriteTracks, setFavoriteTracks] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const storedArtists = JSON.parse(localStorage.getItem('favoriteArtists')) || [];
    setFavorites(storedArtists);

    const storedTracks = JSON.parse(localStorage.getItem('favorite_tracks')) || [];
    setFavoriteTracks(storedTracks);
  }, []);

  
  const toggleFavorite = (artist) => {
    const isFav = favorites.find(fav => fav.id === artist.id);
    let updatedFavorites;
    if (isFav) {
      updatedFavorites = favorites.filter(fav => fav.id !== artist.id);
    } else {
      updatedFavorites = [...favorites, artist];
    }
    setFavorites(updatedFavorites);
    localStorage.setItem('favoriteArtists', JSON.stringify(updatedFavorites));
  };

  
  const isFavorite = (artistId) => favorites.some(fav => fav.id === artistId);

  
  const handleTrackDetails = (albumId) => {
    navigate(`/album/${albumId}`);
  };

  
  const handleSearch = async () => {
    if (!searchTerm.trim()) return;

    const validToken = await getValidToken();

    const res = await fetch(
      `https://api.spotify.com/v1/search?q=${encodeURIComponent(searchTerm)}&type=artist`,
      {
        headers: { Authorization: `Bearer ${validToken}` },
      }
    );

    if (res.status === 401) {
      alert('Tu token expiró, por favor vuelve a iniciar sesión.');
      setArtists([]);
      return;
    }

    const data = await res.json();
    setArtists(data.artists?.items || []);
  };

  return (
    <>
      
      <header className="navbar">
        <div className="navbar-title">Spotify SPA</div>
      </header>

      
      <div className="search-content container">
        
        <div className="main" style={{ flex: 1 }}>
          <div className="search-bar-container">
            <input
              type="text"
              placeholder="Buscar artista"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleSearch()}
              aria-label="Buscar artista"
            />
            <button onClick={handleSearch} aria-label="Buscar">
              Buscar
            </button>
          </div>

          <div className="artist-list">
            {artists.map((artist) => (
              <div key={artist.id} className="artist-card">
                <div
                  style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}
                  onClick={() => navigate(`/artist/${artist.id}`)}
                >
                  <h4>{artist.name}</h4>
                  {artist.images?.[0]?.url && (
                    <img
                      src={artist.images[0].url}
                      alt={`Imagen de ${artist.name}`}
                      draggable={false}
                      style={{ width: 60, height: 60, borderRadius: '8px' }}
                    />
                  )}
                </div>
                <button
                  aria-label={isFavorite(artist.id) ? 'Quitar de favoritos' : 'Agregar a favoritos'}
                  className={`favorite-btn ${isFavorite(artist.id) ? 'favorited' : ''}`}
                  onClick={() => toggleFavorite(artist)}
                  type="button"
                >
                  <span className="heart-icon" />
                </button>
              </div>
            ))}
          </div>
        </div>

        
        <aside className="favorites-panel" style={{ overflowY: 'auto', maxHeight: '80vh', paddingRight: '1rem' }}>
          <h3>Lista de artistas favoritos</h3>
          <div className="favorites-list" style={{ marginBottom: '2rem' }}>
            {favorites.length === 0 && <p>No hay artistas favoritos.</p>}
            {favorites.map((fav) => (
              <div
                key={fav.id}
                className="favorite-artist"
                onClick={() => navigate(`/artist/${fav.id}`)}
                style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}
              >
                {fav.images?.[0]?.url ? (
                  <img src={fav.images[0].url} alt={fav.name} draggable={false} style={{ width: 40, height: 40, borderRadius: '50%' }} />
                ) : (
                  <div
                    style={{
                      width: 40,
                      height: 40,
                      backgroundColor: '#555',
                      borderRadius: '50%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: '#fff',
                      fontWeight: 'bold',
                      userSelect: 'none',
                    }}
                  >
                    {fav.name[0].toUpperCase()}
                  </div>
                )}
                <span>{fav.name}</span>
              </div>
            ))}
          </div>

          
          <h3>Canciones favoritas</h3>
          <div className="favorites-tracks-list" style={{ maxHeight: '40vh', overflowY: 'auto' }}>
            {favoriteTracks.length === 0 ? (
              <p>No tienes canciones favoritas.</p>
            ) : (
              favoriteTracks.map((track) => (
                <div
                  key={track.id}
                  onClick={() => handleTrackDetails(track.albumId)}
                  style={{ cursor: 'pointer', marginBottom: '0.5rem', color: 'blue', textDecoration: 'underline' }}
                  title={`Ir al álbum: ${track.album}`}
                >
                  🎵 {track.name} - {track.artist} ({track.album})
                </div>
              ))
            )}
          </div>
        </aside>
      </div>
    </>
  );
}

export default SearchView;
