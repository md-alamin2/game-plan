import { useEffect, useState } from "react";
import Loading from "../../../Components/Sheared/Loading";
import TipCard from "./TipCard";

const TipsSection=()=> {
  const [activeCategory, setActiveCategory] = useState("all");
  const [tips, setTips] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    fetch("/tips.json")
      .then((res) => res.json())
      .then((data) => {
        setTips(data);
        setLoading(false);
      });
  }, []);

  // Filter tips by category
  const filteredTips =
    activeCategory === "all"
      ? tips
      : tips.filter((tip) => tip.category === activeCategory);

  return (
    <section className="mt-18 md:mt-40 bg-base-100">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-8">
          <h2 className="text-4xl md:text-5xl font-bold mb-2">Pro Tips & Advice</h2>
          <p className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto">
            Expert advice to improve your performance
          </p>
        </div>

        {/* Category Filter Buttons */}
        <div className="flex flex-wrap justify-center gap-2 mb-8">
          <button
            onClick={() => setActiveCategory("all")}
            className={`btn ${
              activeCategory === "all" ? "btn-primary text-white" : "btn-ghost"
            }`}
          >
            All Tips
          </button>
          <button
            onClick={() => setActiveCategory("training")}
            className={`btn ${
              activeCategory === "training"
                ? "btn-primary text-white"
                : "btn-ghost"
            }`}
          >
            Training
          </button>
          <button
            onClick={() => setActiveCategory("nutrition")}
            className={`btn ${
              activeCategory === "nutrition"
                ? "btn-primary text-white"
                : "btn-ghost"
            }`}
          >
            Nutrition
          </button>
          <button
            onClick={() => setActiveCategory("recovery")}
            className={`btn ${
              activeCategory === "recovery"
                ? "btn-primary text-white"
                : "btn-ghost"
            }`}
          >
            Recovery
          </button>
          <button
            onClick={() => setActiveCategory("mental")}
            className={`btn ${
              activeCategory === "mental"
                ? "btn-primary text-white"
                : "btn-ghost"
            }`}
          >
            Mental Game
          </button>
        </div>

        {/* Tips Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {loading ? (
            <Loading></Loading>
          ) : (
            filteredTips.map((tip) => <TipCard key={tip.id} tip={tip} />)
          )}
        </div>
      </div>
    </section>
  );
}
export default TipsSection;