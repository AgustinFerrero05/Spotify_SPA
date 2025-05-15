import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

function FavoritesView() {
  const [favoriteArtists, setFavoriteArtists] = useState([]);
  const [favoriteTracks, setFavoriteTracks] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const savedArtists = JSON.parse(localStorage.getItem('favoriteArtists')) || [];
    setFavoriteArtists(savedArtists.filter(item => item.id && item.name));

    const savedTracks = JSON.parse(localStorage.getItem('favorite_tracks')) || [];
    setFavoriteTracks(savedTracks.filter(track => track.id && track.name));
  }, []);

  const handleArtistDetails = (id) => {
    navigate(`/artist/${id}`);
  };

  const handleTrackDetails = (albumId) => {
    navigate(`/album/${albumId}`);
  };

  const toggleTrackFavorite = (track) => {
    const isFav = favoriteTracks.some(t => t.id === track.id);
    let updatedTracks;
    if (isFav) {
      updatedTracks = favoriteTracks.filter(t => t.id !== track.id);
    } else {
      updatedTracks = [...favoriteTracks, track];
    }
    setFavoriteTracks(updatedTracks);
    localStorage.setItem('favorite_tracks', JSON.stringify(updatedTracks));
  };

  const isTrackFavorite = (trackId) => favoriteTracks.some(t => t.id === trackId);

  return (
    <div className="favorites-view-container" style={{ padding: '1rem' }}>
      <h2>Artistas Favoritos</h2>
      {favoriteArtists.length === 0 ? (
        <p>No tienes artistas favoritos guardados.</p>
      ) : (
        <ul>
          {favoriteArtists.map((artist) => (
            <li key={artist.id} style={{ marginBottom: '0.5rem' }}>
              <span>{artist.name}</span>
              <button
                onClick={() => handleArtistDetails(artist.id)}
                aria-label={`Ver detalles de ${artist.name}`}
                style={{ marginLeft: '10px' }}
              >
                Ver Detalles
              </button>
            </li>
          ))}
        </ul>
      )}

      <h2 style={{ marginTop: '2rem' }}>Canciones Favoritas</h2>
      {favoriteTracks.length === 0 ? (
        <p>No tienes canciones favoritas guardadas.</p>
      ) : (
        <ul>
          {favoriteTracks.map((track) => (
            <li key={track.id} className="favorite-track-item">
              <span
                onClick={() => handleTrackDetails(track.albumId)}
                className="track-text"
                title={`Ir al álbum: ${track.album}`}
              >
                🎵 {track.name} - {track.artist} ({track.album})
              </span>
              <button
                onClick={() => toggleTrackFavorite(track)}
                aria-label={isTrackFavorite(track.id) ? 'Quitar de favoritos' : 'Agregar a favoritos'}
                className={`favorite-btn ${isTrackFavorite(track.id) ? 'favorited' : ''}`}
                type="button"
              >
                <span className="heart-icon" />
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default FavoritesView;
