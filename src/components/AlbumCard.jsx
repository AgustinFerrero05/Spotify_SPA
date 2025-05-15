import { useNavigate } from 'react-router-dom';

function AlbumCard({ album }) {
  const navigate = useNavigate();

  if (!album || !album.id) return null;

  const handleClick = () => {
    navigate(`/album/${album.id}`);
  };

  return (
    <div
      className="album-card"
      onClick={handleClick}
      onKeyPress={(e) => e.key === 'Enter' && handleClick()}
      role="button"
      tabIndex={0}
      aria-label={`Ir a la página del álbum ${album.name}`}
    >
      {album.images?.[0]?.url && (
        <img
          src={album.images[0].url}
          alt={`Portada del álbum ${album.name}`}
          className="album-card-img"
        />
      )}
      <h4>{album.name}</h4>
    </div>
  );
}

export default AlbumCard;
