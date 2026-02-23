function StarRating({ rating }) {
  const stars = [];

  for (let value = 1; value <= 5; value += 1) {
    if (value <= rating) {
      stars.push(
        <span key={value} style={{ color: '#7b2ff7' }}>
          *
        </span>
      );
      continue;
    }

    if (value - 0.5 <= rating) {
      stars.push(
        <span key={value} style={{ color: '#7b2ff7' }}>
          1/2
        </span>
      );
      continue;
    }

    stars.push(
      <span key={value} style={{ color: '#444' }}>
        *
      </span>
    );
  }

  return (
    <div className="stars" style={{ fontSize: '1.2rem' }}>
      {stars}
    </div>
  );
}

export default StarRating;
