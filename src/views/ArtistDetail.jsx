import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

function ArtistDetail({ token }) {
  const { id } = useParams();
  const [artist, setArtist] = useState({});
  const [albums, setAlbums] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isFavorite, setIsFavorite] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError('');
      try {
        await fetchArtistDetail();
        await fetchArtistAlbums();
      } catch (error) {
        setError('No se pudieron cargar los detalles del artista');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id]);

  useEffect(() => {
    const favorites = JSON.parse(localStorage.getItem('favoriteArtists')) || [];
    setIsFavorite(favorites.some((fav) => fav.id === id));
  }, [id]);

  const toggleFavorite = () => {
    const favorites = JSON.parse(localStorage.getItem('favoriteArtists')) || [];
    if (isFavorite) {
      const updated = favorites.filter((fav) => fav.id !== id);
      localStorage.setItem('favoriteArtists', JSON.stringify(updated));
      setIsFavorite(false);
    } else {
      const newFav = { id: artist.id, name: artist.name };
      const updated = [...favorites, newFav];
      localStorage.setItem('favoriteArtists', JSON.stringify(updated));
      setIsFavorite(true);
    }
  };

  const fetchArtistDetail = async () => {
    const res = await fetch(`https://api.spotify.com/v1/artists/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!res.ok) throw new Error('Failed to fetch artist details');
    const data = await res.json();
    setArtist(data);
  };

  const fetchArtistAlbums = async () => {
    const res = await fetch(`https://api.spotify.com/v1/artists/${id}/albums`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!res.ok) throw new Error('Failed to fetch artist albums');
    const data = await res.json();
    setAlbums(data.items);
  };

  if (loading) return <p>Cargando detalles del artista...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className="artist-detail-container">
      <button onClick={() => navigate('/')} aria-label="Volver a la búsqueda">
        Volver al buscador
      </button>

      <h2>{artist.name}</h2>

      {artist.images?.[0]?.url && (
        <img src={artist.images[0].url} alt={`Imagen de ${artist.name}`} />
      )}

      <button onClick={toggleFavorite}>
        {isFavorite ? 'Quitar de favoritos' : 'Agregar a favoritos'}
      </button>

      <h3>Álbumes:</h3>
      {albums.length === 0 ? (
        <p>No hay álbumes disponibles para este artista.</p>
      ) : (
        <div className="albums-list">
          {albums.map((album) => (
            <div
              key={album.id}
              className="album-card"
              onClick={() => navigate(`/album/${album.id}`)}
            >
              <h4>{album.name}</h4>
              {album.images?.[0]?.url && (
                <img
                  src={album.images[0].url}
                  alt={`Portada de ${album.name}`}
                />
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default ArtistDetail;
