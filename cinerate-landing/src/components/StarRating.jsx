const StarRating = ({ rating }) => {
  const stars = [];
  for (let i = 1; i <= 5; i++) {
    if (i <= rating) {
      stars.push(<span key={i} style={{ color: '#7b2ff7' }}>★</span>);
    } else if (i - 0.5 <= rating) {
      stars.push(<span key={i} style={{ color: '#7b2ff7' }}>½</span>);
    } else {
      stars.push(<span key={i} style={{ color: '#444' }}>★</span>);
    }
  }
  return <div className="stars" style={{ fontSize: '1.2rem' }}>{stars}</div>;
};

export default StarRating;