import React, { useContext, useEffect, useState } from "react";
import beli from "../assets/Beli.png";
import { FaLocationDot, FaStar } from "react-icons/fa6";
import { CiShare2 } from "react-icons/ci";
import { addDoc, collection, deleteDoc, doc, getDoc, serverTimestamp, updateDoc } from "firebase/firestore";
import { db } from "../firebase";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { FaWhatsapp } from "react-icons/fa";
import axios from "axios";
import { AuthContext } from "../context/AuthContext";
import Swal from "sweetalert2";
import { axiosInstance } from "../../config";
const Detail = () => {
  const { currentUser } = useContext(AuthContext);
  const navigate = useNavigate();
  const [token, setToken] = useState("");
  const [urlToShare, setUrlToShare] = useState(window.location.href);
  const [status, setStatud] = useState("");
  const location = useLocation();
  const itemId = location.pathname.split("/")[2];
  // const [order_id, setOrder_id] = useState("");
  const [itemDetails, setItemDetails] = useState({
    judul: "",
    type: "",
    deskripsi: "",
    namaPenjual: "",
    harga: "",
    berat: "",
    nomor: "",
    kota: "",
    domisili: "",
    imageUrl: "",
  });

  useEffect(() => {
    const fetchItemDetails = async () => {
      try {
        const itemDocRef = doc(db, "userSales", itemId);
        const itemDocSnap = await getDoc(itemDocRef);

        if (itemDocSnap.exists()) {
          const itemData = itemDocSnap.data();

          // Konversi harga dari string dengan titik menjadi bilangan bulat
          if (typeof itemData.harga === "string") {
            // Konversi harga dari string dengan titik menjadi bilangan bulat
            const hargaTanpaTitik = itemData.harga.replace(/\./g, "");
            const hargaBulat = parseInt(hargaTanpaTitik, 10);
            setItemDetails({
              userId: itemData.userId,
              judul: itemData.judul,
              type: itemData.type,
              deskripsi: itemData.deskripsi,
              namaPenjual: itemData.namaPenjual,
              harga: hargaBulat,
              berat: itemData.berat,
              nomor: itemData.nomor,
              kota: itemData.kota,
              domisili: itemData.domisili,
              imageUrl: itemData.imageUrl,
            });
          } else {
            alert("refresh the page");
          }
        } else {
          console.log("Item not found");
          navigate("/beli-sampah");
        }
      } catch (error) {
        console.error("Error fetching item details:", error);
      }
    };

    fetchItemDetails();
  }, [itemId]);

  const handlePesan = () => {
    if (!currentUser) {
      // Jika belum login, tampilkan pesan atau arahkan pengguna ke halaman login
      navigate("/masuk");
      // Alternatif: Redirect ke halaman login
      // history.push('/login');
      return;
    }
    if (currentUser.uid == itemDetails.userId) {
      Swal.fire({
        icon: "error",
        title: "wrong ID!",
        text: "Ini adalah produk anda!",
      }).then(() => {
        navigate("/beli-sampah");
      });
    } else {
      // Ganti nomor WhatsApp dan pesan sesuai kebutuhan
      const phoneNumber = itemDetails.nomor;
      console.log(phoneNumber); // Ganti dengan nomor WhatsApp yang diinginkan
      const message = encodeURIComponent(`Hallo saya ingin memesan produk ${itemDetails.judul} ini, harga ${itemDetails.harga}!`);
      // Konstruksi URL dengan nomor WhatsApp dan pesan
      const whatsappUrl = `https://wa.me/${phoneNumber}?text=${message}`;

      // Redirect ke WhatsApp
      window.location.href = whatsappUrl;
    }
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator
        .share({
          title: document.title,
          url: urlToShare,
        })
        .then(() => console.log("Berhasil berbagi"))
        .catch((error) => console.error("Error berbagi:", error));
    } else {
      // Fallback jika fungsi share tidak didukung
      console.log("Fungsi share tidak didukung di browser ini.");
      // Implementasikan cara lain untuk berbagi link jika diperlukan
    }
  };

  const deleteItemFromDatabase = async (itemIdToDelete) => {
    try {
      const itemDocRef = doc(db, "userSales", itemIdToDelete);
      await deleteDoc(itemDocRef);
      console.log("Item deleted from the database");
    } catch (error) {
      console.error("Error deleting item from the database:", error);
    }
  };
  const manipData = async () => {
    console.log("proses penhapusan data");
    // Call the function to delete the item from the database after successful transaction
    await deleteItemFromDatabase(itemId);

    // Retrieve seller information from userDetail collection
    const sellerDocRef = doc(db, "userDetail", itemDetails.userId);
    const sellerDocSnap = await getDoc(sellerDocRef);

    if (sellerDocSnap.exists()) {
      const sellerData = sellerDocSnap.data();
      // Update seller's balance by adding the transaction amount
      const currentBalance = parseFloat(sellerData.saldo);
      const transactionAmount = parseFloat(itemDetails.harga);

      // Update seller's balance by adding the transaction amount
      const updatedBalance = currentBalance + transactionAmount;
      await updateDoc(sellerDocRef, { saldo: updatedBalance });
      const produkSoldCollectionRef = collection(db, "produkSold");
      const soldProductData = {
        barangId: itemId,
        penjualId: itemDetails.userId,
        pembeliId: currentUser.uid,
        namaPenjual: itemDetails.namaPenjual,
        namaBarang: itemDetails.judul,
        imageUrl: itemDetails.imageUrl,
        berat: itemDetails.berat,
        harga: itemDetails.harga,
        kota: itemDetails.kota,
        domisili: itemDetails.domisili,
        status,
        transactionDate: serverTimestamp(),
      };

      // Add a new document to the produkSold collection
      await addDoc(produkSoldCollectionRef, soldProductData);
      navigate("/beli-sampah");
      console.log("Seller's balance updated:", updatedBalance);
    } else {
      console.log("Seller not found");
    }
  };
  const date = new Date().getTime();
  const processData = async () => {
    if (!currentUser) {
      // Jika belum login, tampilkan pesan atau arahkan pengguna ke halaman login
      navigate("/masuk");
      // Alternatif: Redirect ke halaman login
      // history.push('/login');
      return;
    }
    if (currentUser.uid == itemDetails.userId) {
      Swal.fire({
        icon: "error",
        title: "Tidak Bisa Melakukan Transaksi!",
        text: "Ini adalah produk anda!",
      }).then(() => {
        navigate("/beli-sampah");
      });
      return;
    }
    try {
      const data = {
        nama: itemDetails.judul,
        order_id: itemId + date,
        total: itemDetails.harga,
      };
      console.log(data);

      const config = {
        headers: {
          "Content-Type": "application/json",
        },
      };
      const response = await axiosInstance.post("/api/payment/process-transaction", data, config);
      setToken(response.data.token);
      console.log(response);
      manipData();
      // Check if the transaction was successful
    } catch (error) {
      console.error("Error processing transaction:", error);
    }
  };

  useEffect(() => {
    if (token) {
      window.snap.pay(token, {
        onSuccess: (result) => {
          localStorage.setItem("Pembayaran", JSON.stringify(result));
          setToken("");
        },
        onPending: (result) => {
          localStorage.setItem("Pembayaran", JSON.stringify(result));
          setToken("");
        },
        onError: (error) => {
          console.log(error);
          setToken("");
        },
        onClose: () => {
          console.log("Anda belum menyelesaikan pembayaran!");
          setToken("");
        },
      });

      // reset data disini
    }
  }, [token]);

  useEffect(() => {
    const midtransUrl = "https://app.sandbox.midtrans.com/snap/snap.js";
    let scriptTag = document.createElement("script");
    scriptTag.src = midtransUrl;

    const midtransClientKey = "SB-Mid-client-hDSf5Jk6178euLKF";
    scriptTag.setAttribute("data-client-key", midtransClientKey);

    document.body.appendChild(scriptTag);

    return () => {
      document.body.removeChild(scriptTag);
    };
  }, []);

  const formatNumberWithDot = (number) => {
    return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  };

  return (
    <div className="sm:p-10 px-4 p-2 md:py-[120px] py-[100px]">
      <div className="md:px-12 px-2">
        <span className="text-green-700 text-base font-medium ">Home </span>
        <span className="text-neutral-500 text-base font-medium ">{">"}</span>
        <span className="text-green-700 text-base font-medium "> Pilihan Untukmu </span>
        <span className="text-neutral-500 text-base font-medium ">{">"}</span>
        <span className="text-green-700 text-base font-medium "> </span>
        <span className="text-neutral-800 text-base font-medium ">{itemDetails.judul}</span>
      </div>
      <div className="details py-4 flex flex-wrap sm:gap-2 gap-6 justify-between md:px-12 px-2">
        <img src={itemDetails.imageUrl} alt={itemDetails.judul} className="object-cover h-full sm:max-w-96" />
        <div className=" ">
          <h1 className=" text-neutral-800 text-2xl  font-bold ">{itemDetails.judul}</h1>
          <div className="flex items-center gap-2 py-4">
            <span>
              <FaStar className="text-yellow-400 text-tprimary" />
            </span>
            <div>
              <span className="text-neutral-800 text-base font-normal font-">5,0 </span>
              <span className="text-stone-500 text-base font-normal font-">(275 rating) </span>
              <span className="text-neutral-800 text-base font-normal font-">• Terjual </span>
              <span className="text-stone-500 text-base font-normal font-">500+</span>
            </div>
          </div>
          <div className=" text-neutral-800 text-2xl font-bold ">Rp{formatNumberWithDot(itemDetails.harga)}</div>
          <div className="sm:w-96 w-auto h-[0px] border my-4 border-stone-300"></div>
          <div className="w-auto pb-4">
            <span className="text-stone-500 text-base font-normal">Jenis: </span>
            <span className="text-neutral-800 text-base font-normal">
              {itemDetails.jenis}
              <br />
            </span>
            <span className="text-stone-500 text-base font-normal">Berat:</span>
            <span className="text-neutral-800 text-base font-normal"> {itemDetails.berat} Kg (kilogram)</span>
          </div>
          <p className="sm:max-w-[368px] max-w-[300px] text-neutral-800 text-base font-normal ">{itemDetails.deskripsi}</p>
          <div className="sm:w-96 w-auto h-[0px] border my-4 border-stone-300"></div>
          <div className=" sm:w-96 w-auto flex flex-wrap items-center justify-between py-4">
            <div className="flex gap-4 items-center">
              <img className="w-14 h-14 rounded-full" src="https://via.placeholder.com/56x56" />
              <div className="">
                <div className="text-neutral-800 text-base font-semibold my-2">{itemDetails.namaPenjual}</div>
                <div className="flex gap-2">
                  <FaLocationDot className="text-maingreen" />
                  <div className="text-stone-500 text-sm font-normal ">
                    Kota {itemDetails.kota} {itemDetails.domisili}
                  </div>
                </div>
              </div>
            </div>
            <Link className="w-28 h-[38px] px-5 py-3 bg-white rounded-[30px] border border-green-700 justify-center items-center gap-2 inline-flex sm:mt-4 mt-4">
              <div className="text-neutral-800 text-xs font-semibold ">Lihat profil</div>
            </Link>
          </div>
          <div className="flex ml-[72px] items-center gap-2">
            <span>
              <FaStar className="text-yellow-400 text-tprimary" />
            </span>
            <div>
              <span className="text-neutral-800 text-sm font-normal">5,0 </span>
              <span className="text-stone-500 text-sm font-normal">(275 rating) </span>
              <span className="text-neutral-800 text-sm font-normal">• Terjual </span>
              <span className="text-stone-500 text-sm font-normal">500+</span>
            </div>
          </div>
        </div>
        <div>
          <div className="card sm:w-[264px] w-full h-auto bg-white rounded-lg border border-stone-300 p-4">
            <div className="text-neutral-800 text-base font-bold ">Checkout barangmu disini!</div>
            {/* <div className="flex gap-2 mt-2">
              <input type="number" placeholder="1" className="w-[70px] text-center border border-stone-300 outline-none" />
              <div>
                <span className="text-stone-500 text-sm font-normal ">Stok:</span>
                <span className="text-neutral-800 text-sm font-normal "> 20</span>
              </div>
            </div> */}
            <div className="flex justify-between items-center mt-8">
              <div className="text-stone-500 text-sm font-normal">TOTAL</div>
              <div className="text-neutral-800 text-2xl font-bold f">Rp{formatNumberWithDot(itemDetails.harga)}</div>
            </div>
            <div className="cursor-pointer mt-6 sm:w-[232px] w-full h-[51px] px-6 py-4 bg-white rounded-[30px] border border-green-700 justify-center items-center gap-2 inline-flex" onClick={handlePesan} target="_blank">
              <FaWhatsapp />
              <div className="text-neutral-800 text-base font-semibold ">Beli Via Whatsapp</div>
            </div>
            <div onClick={processData} className="cursor-pointer hover:brightness-95 duration-150 mt-3 sm:w-[232px] w-full px-6 py-4 bg-green-700 rounded-[30px] justify-center items-center gap-2 inline-flex">
              <div className="text-white text-base font-semibold ">Beli Sekarang</div>
            </div>
            <div className="share mt-6 flex items-center gap-2 cursor-pointer" onClick={handleShare}>
              <CiShare2 />
              <div className="text-neutral-800 text-sm font-medium ">Bagikan</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Detail;
