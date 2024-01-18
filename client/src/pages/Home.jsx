import React from "react";
import { MdOutlineArrowOutward } from "react-icons/md";
import { Link } from "react-router-dom";
import jual from "../assets/Jual.png";
import mengapa1 from "../assets/mengapa1.png";
import mengapa2 from "../assets/mengapa2.png";
import mengapa3 from "../assets/mengapa3.png";

const Home = () => {
  return (
    <div className="container sm:px-10  px-2 md:py-[120px] py-[50px] mx-auto box-sizing m-8">
      <div className="lg:flex sm:block items-center justify-between mb-40">
        <div className="p-10">
          <h1 className="md:text-[4rem] text-[2.7rem] mb-6 font-bold">
            Ubah Sampah
            <br />
            Jadi <span className="text-[#318335]">Rupiah</span>
          </h1>
          <div className="text-lg font-medium text-[#666] sm:w-80 w-72 mb-10">
            <p>Deskripsi singkat tentang bang sampah dan tujuan utama dari bang sampah</p>
          </div>
          <Link to="/jual-sampah">
            <button className="flex items-center py-4 px-6 font-semibold bg-[#318335] text-white rounded-[1.875rem]">
              <span>Jual sampah</span>
              <MdOutlineArrowOutward className="ml-2 text-subtitle font-bold" />
            </button>
          </Link>
        </div>
        <div className="p-10">
          <img src={jual} className="h-[386px] sm:w-[552px]  object-cover" />
        </div>
      </div>
      <div className="w-full  ">
        <div className="text-center text-neutral-800 md:text-[3rem] text-[2rem] font-bold font-['Figtree'] leading-[57.60px] mb-8">Mengapa Bang Sampah?</div>
        <div className=" flex flex-wrap justify-center gap-10 ">
          <div className="card w-[330px] shadow-md">
            <img src={mengapa1} className="img h-36 object-cover" />
            <div className="p-5 text-center text-stone-500 text-lg font-medium font-['Figtree']">
              <span className="text-[#222] font-semibold">Pengelolaan Sampah yang Mudah</span> <br />
              Kami bantu Anda menemukan cara yang tepat untuk mengelola sampah Anda.
            </div>
          </div>
          <div className="card w-[330px] shadow-md">
            <img src={mengapa2} className="img h-36 object-cover" />
            <div className="p-5 text-center text-stone-500 text-lg font-medium font-['Figtree']">
              <span className="text-[#222] font-semibold"> Dukungan UMKM Kreatif </span> <br />
              Jual beli sampah untuk kreativitas! Berkolaborasi dengan UMKM untuk menghasilkan karya unik dari barang bekas
            </div>
          </div>
          <div className="card w-[330px] shadow-md">
            <img src={mengapa3} className="img h-36 object-cover" />
            <div className="p-5 text-center text-stone-500 text-lg font-medium font-['Figtree']">
              <span className="text-[#222] font-semibold"> Edukasi untuk Masa Depan Bersih</span> <br />
              Informasi penting tentang pemilahan sampah dan daur ulang. Mari bersama ciptakan lingkungan yang lebih baik!
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
