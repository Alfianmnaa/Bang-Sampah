import React, { useState } from "react";
import Dibeli from "../components/Status/Dibeli";
import Dijual from "../components/Status/Dijual";

const Status = () => {
  const [jenisStatus, setJenisStatus] = useState(true);
  return (
    <div className="md:py-[120px] py-[50px] sm:px-10 px-2">
      <div className="flex justify-center gap-6">
        <p onClick={() => setJenisStatus(true)} className="cursor-pointer">
          Dijual
        </p>
        <p onClick={() => setJenisStatus(false)} className="cursor-pointer">
          Dibeli
        </p>
      </div>
      {jenisStatus ? <Dijual /> : <Dibeli />}
    </div>
  );
};

export default Status;
