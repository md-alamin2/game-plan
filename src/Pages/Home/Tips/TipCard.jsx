// Individual Tip Card Component
const TipCard = ({ tip }) => {
  const categoryColors = {
    training: "bg-blue-100 text-blue-800",
    nutrition: "bg-green-100 text-green-800",
    recovery: "bg-purple-100 text-purple-800",
    mental: "bg-yellow-100 text-yellow-800",
  };

  return (
    <div className="card bg-base-200 shadow-md hover:shadow-lg transition-shadow">
      <div className="card-body">
        <div className={`badge ${categoryColors[tip.category]} mb-2`}>
          {tip.category.charAt(0).toUpperCase() + tip.category.slice(1)}
        </div>
        <h3 className="card-title text-xl">{tip.title}</h3>
        <p className="text-base-content/80">{tip.description}</p>
        <div className="mt-4 text-sm text-base-content/60">
          {tip.author && <p>By {tip.author}</p>}
          {tip.date && <p>Posted on {tip.date}</p>}
        </div>
      </div>
    </div>
  );
};

export default TipCard;
