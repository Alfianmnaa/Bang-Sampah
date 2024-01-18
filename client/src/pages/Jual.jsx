import React, { useContext, useEffect, useState } from "react";
import { MdOutlineAddAPhoto, MdOutlineArrowOutward } from "react-icons/md";
// import oneSvg from "../assets/1.svg";
import { FaPlus } from "react-icons/fa6";
import kertas from "../assets/kertas.png";
import plastik from "../assets/plastik.png";
import logam from "../assets/logam.png";
import kaca from "../assets/kaca.png";
import tekstil from "../assets/tekstil.png";
import elektronik from "../assets/elektronik.png";
import karet from "../assets/karet.png";
import lain from "../assets/lain.png";
import { auth, db, storage } from "../firebase";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { addDoc, collection, doc, getDoc, serverTimestamp, setDoc } from "firebase/firestore";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import Swal from "sweetalert2";

const Jual = () => {
  const [file, setFile] = useState(null);
  const [selectedType, setSelectedType] = useState(null);
  const [judul, setJudul] = useState("");
  const [deskripsi, setDeskripsi] = useState("");
  const [berat, setBerat] = useState("");
  const [harga, setHarga] = useState(0);
  const [nomor, setNomor] = useState("");
  const [kota, setKota] = useState("");
  const [domisili, setDomisili] = useState("");
  const { currentUser } = useContext(AuthContext);
  const [loading, setLoading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [username, setUsername] = useState("");
  const [kotaKecamatan, setKotaKecamatan] = useState("");
  const [whatsapp, setWhatsapp] = useState("");
  const [alamat, setAlamat] = useState();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUsername = async () => {
      try {
        // Fetch the username from the "users" collection based on the current user's UID
        const userDocRef = doc(db, "users", currentUser.uid);
        const userDocSnapshot = await getDoc(userDocRef);

        if (userDocSnapshot.exists()) {
          const userData = userDocSnapshot.data();
          setUsername(userData.username);
        } else {
          console.error("User document not found.");
        }
      } catch (error) {
        console.error("Error fetching username: ", error);
      }
    };

    const fetchUserData = async () => {
      try {
        const userDocRef = doc(db, "userDetail", currentUser.uid);
        const userDocSnapshot = await getDoc(userDocRef);

        if (userDocSnapshot.exists()) {
          const userData = userDocSnapshot.data();
          setAlamat(userData.alamat);
          setKotaKecamatan(userData.kotaKecamatan);
          setWhatsapp(userData.nomor);
        } else {
          alert("Lengkapi data Profil terlebih dahulu!");
          navigate("/profile-settings");
        }
      } catch (error) {
        console.error("Error fetching user data: ", error);
      }
    };

    fetchUserData();

    // Call the function to fetch the username
    fetchUsername();
  }, [currentUser.uid]);

  const handleWasteClick = (type) => {
    setSelectedType(type === selectedType ? null : type);
  };

  const wasteTypes = [
    { type: "Kertas", image: kertas },
    { type: "Plastik", image: plastik },
    { type: "Logam", image: logam },
    { type: "Kaca", image: kaca },
    { type: "Tekstil", image: tekstil },
    { type: "Elektronik", image: elektronik },
    { type: "Karet", image: karet },
    { type: "Lainnya", image: lain },
  ];

  const transformNumber = (inputNumber) => {
    // Check if the number starts with "0"
    if (inputNumber.startsWith("0")) {
      // Remove the leading "0" and prepend "62"
      return "62" + inputNumber.slice(1);
    } else {
      // If the number doesn't start with "0," return it as is
      return inputNumber;
    }
  };

  const formatRupiah = (angka) => {
    let numberString = angka.replace(/[^,\d]/g, "").toString();
    let split = numberString.split(",");
    let sisa = split[0].length % 3;

    let rupiah = split[0].substr(0, sisa);
    let ribuan = split[0].substr(sisa).match(/\d{3}/gi);

    if (ribuan) {
      let separator = sisa ? "." : "";
      rupiah += separator + ribuan.join(".");
    }

    rupiah = split[1] !== undefined ? rupiah + "," + split[1] : rupiah;

    return rupiah;
  };

  const handleHargaChange = (e) => {
    setHarga(formatRupiah(e.target.value));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);
      const transformedNomor = transformNumber(nomor);
      const date = new Date().getTime();
      const storageRef = ref(storage, `${judul + date}`);
      const uploadTask = uploadBytesResumable(storageRef, file);

      uploadTask.on(
        "state_changed",
        (snapshot) => {
          const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          setUploadProgress(progress);
        },
        (error) => {
          console.error("Error uploading file: ", error);
          setLoading(false);
        },
        async () => {
          const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);

          // Save data to Firestore with the download URL
          const docRef = await addDoc(collection(db, "userSales"), {
            userId: currentUser.uid,
            namaPenjual: username,
            type: selectedType,
            judul,
            deskripsi,
            berat,
            harga,
            nomor: transformedNomor,
            kota: kotaKecamatan,
            domisili: alamat,
            imageUrl: downloadURL,
            timestamp: serverTimestamp(),
          });

          console.log("Document written with ID: ", docRef.id);
          setLoading(false);
          Swal.fire({
            icon: "success",
            title: "Berhasil!",
            text: `${judul} berhasil ditambahkan.`,
          }).then(() => {
            navigate("/beli-sampah");
          });
        }
      );
    } catch (error) {
      console.error("Error adding document: ", error);
      setLoading(false);
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Barang gagal ditambahkan!",
      }).then(() => {
        navigate("/");
      });
    }
  };

  return (
    <div className="md:py-[120px] py-[50px] sm:px-10 px-2 ">
      <form onSubmit={handleSubmit} className="md:px-24 px-2 ">
        <div>
          <h1 className="text-neutral-800 text-[40px] font-bold font-['Figtree'] mb-4 leading-[48px]">Masukkan Informasi Sampah</h1>
          <div className="sm:w-[413px] text-stone-500 text-lg font-medium font-['Figtree'] leading-[27px]">Masukkan detail informasi sampahmu dan lorem ipsum dolor sit amet copywriting belum jadi</div>
        </div>
        <br />
        <br />
        <h2 className="text-neutral-800 text-[32px] font-bold font-['Figtree'] mb-4 leading-[38.40px]">Pilih Jenis Sampah</h2>
        <p className="sm:w-[504px] text-stone-500 text-lg font-medium font-['Figtree']">Pilih jenis sampah/barang bekas yang akan kamu jual</p>
        <div className="mt-8 mb-12 flex flex-wrap justify-center gap-5">
          {wasteTypes.map((waste, index) => (
            <div
              key={index}
              style={{
                boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
                cursor: "pointer",
                transition: "brightness 150ms",
                width: "auto",
                height: "195px",
                backgroundColor: selectedType === waste.type ? "#D0FFD2" : "white", // Light green for selected, white for others
                borderRadius: selectedType === waste.type ? "16px 16px 0px 0px" : "0", // Apply border-radius to the top corners for selected card
              }}
              onClick={() => handleWasteClick(waste.type)}
            >
              <img src={waste.image} alt="jenis-sampah" style={{ width: "100%" }} />
              <div style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
                <p className="text-subtitle font-semibold py-6">{waste.type}</p>
              </div>
            </div>
          ))}
        </div>
        <div className="flex flex-wrap justify-between ">
          <div className="w-[504px] mt-12  ">
            <h2 className="text-neutral-800 text-[32px] font-bold font-['Figtree'] mb-4 leading-[38.40px]">Judul</h2>
            <p className=" text-stone-500 text-lg font-medium font-['Figtree']">Masukkan judul dari sampah/barang bekas yang akan dijual dengan singkat dan jelas</p>
            <input type="text" required placeholder="Contoh: Plastik Botol Bekas 5 Liter - 10 Buah" className="border mt-2 rounded-md border-[#222] w-full py-3 px-4 text-tprimary" onChange={(e) => setJudul(e.target.value)} />
          </div>
          <div className="w-[504px] mt-12 md:mb-12 mb-4 ">
            <h2 className="text-neutral-800 text-[32px] font-bold font-['Figtree'] mb-4 leading-[38.40px]">Deskripsi</h2>
            <p className=" text-stone-500 text-lg font-medium font-['Figtree']">Masukkan deskripsi dari sampah yang akan dijual dengan jelas dan rinci</p>
            <textarea
              type="text"
              required
              placeholder="Contoh: Plastik botol bekas dengan kapasitas 5 liter, cocok untuk daur ulang. Kondisi bersih dan tidak terpakai, dapat digunakan kembali atau didaur ulang untuk berbagai kreasi kreatif."
              className="border mt-2 rounded-md border-[#222] w-full py-3 px-4 text-tprimary h-32"
              onChange={(e) => setDeskripsi(e.target.value)}
            />
          </div>
        </div>
        <div className="lg:mt-0 mt-12">
          <h2 className="text-neutral-800 text-[32px] font-bold font-['Figtree'] mb-4 leading-[38.40px]">Foto</h2>
          <p className="max-w-[400px] text-stone-500 text-lg font-medium font-['Figtree']">Masukkan foto sampah yang akan dijual. Ambil foto menggunakan kamera atau ambil dari galeri. Unggah maksimal 1 foto sampah</p>
          {file ? (
            <img src={URL.createObjectURL(file)} alt="pic" className="sm:w-[264px] w-full object-cover h-48 rounded-2xl border border-neutral-500 mt-6" />
          ) : (
            <label htmlFor="fileInput" className="hover:brightness-95 duration-150 cursor-pointer flex flex-col items-center justify-center gap-2 w-[264px] h-48 bg-neutral-100 rounded-2xl border border-neutral-500 mt-6">
              <MdOutlineAddAPhoto className="text-[32px]" />
              <p className="text-smtprimary">Maksimal 1 foto sampah</p>
            </label>
          )}
          <input type="file" id="fileInput" className="hidden" onChange={(e) => setFile(e.target.files[0])} />
        </div>
        <div className="flex flex-wrap justify-between py-12">
          <div className="w-[504px] md:mb-12 mb-4 ">
            <h2 className="text-neutral-800 text-[32px] font-bold font-['Figtree'] mb-4 leading-[38.40px]">Berat</h2>
            <p className=" text-stone-500 text-lg font-medium font-['Figtree']">Masukkan berat sampah/barang yang akan dijual (dalam Kg)</p>
            <input type="text" required placeholder="Contoh: 0,2" className="border mt-2 rounded-md border-[#222] w-full py-3 px-4 text-tprimary" onChange={(e) => setBerat(e.target.value)} />
          </div>
          <div className="w-[504px] lg:mt-0 mt-12">
            <h2 className="text-neutral-800 text-[32px] font-bold font-['Figtree'] mb-4 leading-[38.40px]">Harga</h2>
            <p className=" text-stone-500 text-lg font-medium font-['Figtree']">Masukkan harga sampah/barang yang akan dijual (dalam Rupiah)</p>
            <input type="text" required placeholder="Contoh: 10000" className="border mt-2 rounded-md border-[#222] w-full py-3 px-4 text-tprimary " value={harga} onChange={handleHargaChange} />
          </div>
        </div>

        <div className="max-w-[504px] mt-12">
          <h2 className="text-neutral-800 text-[32px] font-bold font-['Figtree'] mb-4 leading-[38.40px]">Alamat Tempat Tinggal</h2>
          <p className=" text-stone-500 text-lg font-medium font-['Figtree']">Masukkan alamat lengkap Anda sehingga pembeli tahu dimana Anda berada</p>
        </div>
        <div className="flex flex-wrap justify-between items-end">
          <div className="w-[504px]">
            <div className="mt-8 mb-8">
              <label htmlFor="nomorhp" className="text-neutral-800 text-xl font-bold font-['Figtree'] leading-normal">
                Nomor HP
              </label>
              <input id="nomorhp" type="text" value={whatsapp} required placeholder="Contoh: 08212345678" className="border mt-2 rounded-md border-[#222] w-full py-3 px-4 text-tprimary " onChange={(e) => setNomor(e.target.value)} />
            </div>
            <div>
              <label htmlFor="domisili" className="text-neutral-800 text-xl font-bold font-['Figtree'] leading-normal">
                Kota & Kecamatan
              </label>
              <input
                id="domisili"
                type="text"
                required
                value={kotaKecamatan}
                placeholder="Contoh: Depok, Kab. Sleman, Daerah Istimewa Yogyakarta"
                className="border mt-2 rounded-md border-[#222] w-full py-3 px-4 text-tprimary "
                onChange={(e) => setKota(e.target.value)}
              />
            </div>
          </div>
          <div className="w-[504px] lg:mt-0 mt-12">
            <label htmlFor="domisili" className="text-neutral-800 text-xl font-bold font-['Figtree'] leading-normal">
              Alamat Lengkap
            </label>
            <textarea
              type="text"
              value={alamat}
              required
              placeholder="Contoh: Jl BangSampah III , rumah no 123"
              className="border mt-2 rounded-md border-[#222] w-full py-3 px-4 text-tprimary h-32 "
              onChange={(e) => setDomisili(e.target.value)}
            />
          </div>

          {/* <button className="flex mt-9 items-center py-4 px-6 font-semibold bg-[#318335] text-white rounded-[1.875rem]">
            <FaPlus className="mr-2 text-subtitle font-bold" />
            <span>Tambah Alamat Baru</span>
          </button> */}
        </div>
        {loading ? (
          <div className="flex mt-12 justify-center items-center bg-gray-300 p-4 rounded-md">
            <p className="text-white font-bold mr-2">{uploadProgress.toFixed(2)}%</p>
            <div className="loader"></div>
          </div>
        ) : (
          <div className="mt-12 flex flex-col sm:flex-row">
            <Link to="/" className="hover:brightness-90 duration-150 cursor-pointer sm:w-[264px] w-full h-[77px] p-6 rounded-[40px] border border-green-700 mb-4 sm:mb-0">
              <div className="text-neutral-800 text-center text-2xl font-bold font-['Figtree']">Batal</div>
            </Link>
            <button type="submit" className="hover:brightness-90 flex justify-center duration-150 cursor-pointer sm:w-[840px] w-full h-[77px] p-6 ml-0 sm:ml-6 rounded-[40px] border bg-green-700">
              <div className="text-white text-2xl font-bold font-['Figtree']">Jual</div>
              <MdOutlineArrowOutward className="ml-2 text-white text-[28px] font-bold" />
            </button>
          </div>
        )}
      </form>
    </div>
  );
};

export default Jual;
