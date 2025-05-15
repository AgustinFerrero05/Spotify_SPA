function TrackItem({ track }) {
  return (
    <li className="track-item" role="listitem" aria-label={`Track: ${track.name}`}>
      <p className="track-name">{track.name}</p>
      <button 
        className="play-button" 
        aria-label={`Play ${track.name}`} 
        onClick={() => alert(`Reproduciendo ${track.name}`)} 
      >
        Play
      </button>
    </li>
  );
}

export default TrackItem;
