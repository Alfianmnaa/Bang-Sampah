import React from "react";
import beliHeroImage from "../../assets/beliHero.png";

const BeliHero = () => {
  const backgroundImageStyle = {
    backgroundImage: `url(${beliHeroImage})`,
    // Add other styles as needed
  };

  return (
    <div className=" mx-auto mt-8 w-full sm:w-[610px] md:w-[720px] lg:w-[1024px] xl:w-[1125px] h-60 bg-gradient-to-l from-green-700 to-green-600 rounded-2xl relative md:translate-y-0 translate-y-[4rem]">
      <div className="right-0 absolute z-10 rounded-tr-2xl rounded-br-2xl h-60 md:w-[330.5px] object-cover sm:w-44 w-32 bg-no-repeat" style={backgroundImageStyle} />
      <div className="max-w-[800px]  text-white text-3xl sm:text-4xl md:text-4xl lg:text-5xl font-bold font-figtree lg:leading-[72.80px] md:leading-[52.80px] leading-10  p-8 ">Beli Sampah Berkualitas untuk Mewujudkan Proyek Anda</div>
    </div>
  );
};

export default BeliHero;
