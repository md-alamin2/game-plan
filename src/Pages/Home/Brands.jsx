import React, { useEffect, useState } from "react";
import Marquee from "react-fast-marquee";
import Loading from "../../Components/Sheared/Loading";

const Brands = () => {
    const [brands, setBrands] = useState([]);
    const [loading, setLoading]= useState(false);
    useEffect(()=>{
        setLoading(true)
        fetch('/brands.json')
        .then(response => response.json())
        .then(data => {
            setBrands(data);
            setLoading(false);
        })
    },[])
  return (
    <div className="w-11/12 lg:container mx-auto my-18 md:my-40">
      <Marquee speed={40} pauseOnHover={true}>
        {loading ? (
          <Loading></Loading>
        ) : (
          brands.map(brand => (
            <img className="w-32 h-32 mr-40 object-contain" key={brand.id} src={brand.image} alt={`Brand ${brand.id}`} />
          ))
        )}
      </Marquee>
    </div>
  );
};

export default Brands;
