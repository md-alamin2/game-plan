import axios from "axios";
import { useEffect, useState } from "react";
import CountUp from "react-countup";
import { toast } from "react-toastify";
import Loading from "../../Components/Sheared/Loading";

const StatsSection = () => {
  const [stats, setStats] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    axios
      .get("/stats.json")
      .then((res) => {
        setStats(res.data);
        setLoading(false);
      })
      .catch((error) => {
        setLoading(false);
        toast.error("Failed to load stats data", error.message);
      });
  }, []);

  if (loading) {
    return <Loading></Loading>;
  }

  return (
    <div className="py-4 bg-base-200">
      <div className="w-11/12 lg:container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-2 md:gap-8">
          {stats.map((stat) => (
            <div key={stat.id} className="card">
              <div className="card-body items-center text-center">
                <div className="mb-4 p-4 rounded-full bg-base-300">
                  <img className="w-10" src={stat.icon} alt="" />
                </div>
                <div className="flex items-center justify-center">
                  <CountUp
                    end={stat.count}
                    duration={2.5}
                    decimals={stat.id === 4 ? 1 : 0}
                    className="text-4xl font-bold"
                    enableScrollSpy={true}
                  />
                  {stat.suffix && (
                    <span className="text-4xl font-bold">{stat.suffix}</span>
                  )}
                </div>
                <h3 className="text-xl font-semibold mt-2">{stat.title}</h3>
                <p className="text-gray-500">{stat.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default StatsSection;
