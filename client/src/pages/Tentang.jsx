import React from "react";

const Tentang = () => {
  return (
    <div className="sm:p-10 px-4 md:py-[120px] py-[50px]">
      <h1 className="mt-12 md:text-[3rem] text-[2.5rem] mb-4 font-bold text-center">Tentang Kami</h1>
      <div className="flex flex-wrap max-w-[1000px] justify-center gap-12 font-medium mx-auto px-2">
        <div className="md:w-[30rem] w-full text-tprimary">
          Sesuai namanya Bang Sampah yang berasal dari konsep bank sampah yaitu tempat pengumpulan sampah kering yang sudah dipilah, kemudian dapat ditukarkan dengan uang atau barang kepada pengepul. Di dalam platform ini, juga tersedia
          edukasi tentang pemilahan sampah, baik sampah organik maupun anorganik, dan sampah yang layak untuk diperjual-belikan pada platform ini.
        </div>
        <div className="sm:h-[auto] h-[15rem] sm:w-[20rem] w-full bg-maingreen"></div>
      </div>
    </div>
  );
};

export default Tentang;
