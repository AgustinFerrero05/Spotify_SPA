import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

function AlbumDetail({ token }) {
  const { id } = useParams();
  const [album, setAlbum] = useState({});
  const [tracks, setTracks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [favoriteTracks, setFavoriteTracks] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const savedFavorites = JSON.parse(localStorage.getItem('favorite_tracks') || '[]');
    setFavoriteTracks(savedFavorites);
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError('');
      try {
        const [albumRes, tracksRes] = await Promise.all([
          fetch(`https://api.spotify.com/v1/albums/${id}`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
          fetch(`https://api.spotify.com/v1/albums/${id}/tracks`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
        ]);

        if (!albumRes.ok || !tracksRes.ok) {
          throw new Error('Error al obtener datos del álbum o las pistas');
        }

        const albumData = await albumRes.json();
        const tracksData = await tracksRes.json();

        setAlbum(albumData);
        setTracks(tracksData.items);
      } catch (error) {
        setError('No se pudieron cargar los detalles del álbum o las pistas');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id, token]);

  const isFavorited = (trackId) => {
    return favoriteTracks.some((t) => t.id === trackId);
  };

  const toggleFavorite = (track) => {
    let updated;
    if (isFavorited(track.id)) {
      updated = favoriteTracks.filter((t) => t.id !== track.id);
    } else {
      const newTrack = {
        id: track.id,
        name: track.name,
        album: album.name,
        albumId: album.id,
        artist: album.artists?.[0]?.name || 'Desconocido',
      };
      updated = [...favoriteTracks, newTrack];
    }

    localStorage.setItem('favorite_tracks', JSON.stringify(updated));
    setFavoriteTracks(updated); 
  };

  if (loading) return <p>Cargando detalles del álbum...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className="album-detail-container">
      <button
        onClick={() => navigate(`/artist/${album.artists?.[0]?.id}`)}
        aria-label="Volver al artista"
      >
        Volver al artista
      </button>

      <h2>{album.name}</h2>
      <img
        src={album.images?.[0]?.url || 'path/to/default-image.jpg'}
        alt={`Portada del álbum ${album.name} de ${album.artists?.[0]?.name}`}
        className="album-cover"
      />

      <h3>Tracks:</h3>
      <ul className="tracks-list">
        {tracks.length > 0 ? (
          tracks.map((track) => (
            <li key={track.id} className="track-item">
              {track.name}
              <button
                className="favorite-btn"
                onClick={() => toggleFavorite(track)}
                aria-label={`Marcar ${track.name} como favorito`}
              >
                {isFavorited(track.id) ? '❤️' : '🤍'}
              </button>
            </li>
          ))
        ) : (
          <p>No hay pistas disponibles para este álbum.</p>
        )}
      </ul>
    </div>
  );
}

export default AlbumDetail;
