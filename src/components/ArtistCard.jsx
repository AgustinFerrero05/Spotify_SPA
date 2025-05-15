import { useNavigate } from 'react-router-dom';

function ArtistCard({ artist }) {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`/artist/${artist.id}`);
  };

  return (
    <div
      className="artist-card"
      onClick={handleClick}
      onKeyPress={(e) => e.key === 'Enter' && handleClick()}
      role="button"
      tabIndex={0}
      aria-label={`Ir a la página de ${artist.name}`}
    >
      {artist.images?.[0]?.url && (
        <img
          src={artist.images[0].url}
          alt={`Imagen del artista ${artist.name}`}
          className="artist-image"
        />
      )}
      <h4>{artist.name}</h4>
    </div>
  );
}

export default ArtistCard;
