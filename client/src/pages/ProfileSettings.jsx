import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { storage } from "../firebase";
import React, { useContext, useEffect, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import { db } from "../firebase";
import { doc, getDoc, serverTimestamp, setDoc } from "firebase/firestore";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
import { MdOutlineAddAPhoto } from "react-icons/md";

const ProfileSettings = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [whatsapp, setWhatsapp] = useState("");
  const [kotaKecamatan, setKotaKecamatan] = useState("");
  const [alamat, setAlamat] = useState("");
  const [saldo, setSaldo] = useState(0);
  const [file, setFile] = useState(null);
  const { currentUser } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const userDocRef = doc(db, "users", currentUser.uid);
        const userDocSnapshot = await getDoc(userDocRef);

        if (userDocSnapshot.exists()) {
          const userData = userDocSnapshot.data();
          setEmail(userData.email);
          setUsername(userData.username);
          setWhatsapp(userData.nomor);
        } else {
          console.error("User document not found.");
        }
      } catch (error) {
        console.error("Error fetching user data: ", error);
      }
    };

    const fetchUserDataDetail = async () => {
      try {
        const userDocRef = doc(db, "userDetail", currentUser.uid);
        const userDocSnapshot = await getDoc(userDocRef);

        if (userDocSnapshot.exists()) {
          const userData = userDocSnapshot.data();
          setKotaKecamatan(userData.kotaKecamatan);
          setAlamat(userData.alamat);
          setSaldo(parseFloat(userData.saldo));
        } else {
          console.error("User document not found.");
        }
      } catch (error) {
        console.error("Error fetching user detail data: ", error);
      }
    };

    fetchUserData();
    fetchUserDataDetail();
  }, [currentUser.uid]);

  const handleUserUpdate = async () => {
    try {
      const userDetailRef = doc(db, "userDetail", currentUser.uid);
      const userDetailSnapshot = await getDoc(userDetailRef);

      // Initialize userDataToUpdate object
      const userDataToUpdate = {
        userId: currentUser.uid,
        username,
        email,
        nomor: whatsapp,
        kotaKecamatan,
        alamat,
        saldo,
        timestamp: serverTimestamp(),
      };

      // Check if a file is selected
      if (file) {
        const storageRef = ref(storage, `profile_images/${currentUser.uid}/${file.name}`);

        // Upload image to Firebase Storage
        await uploadBytes(storageRef, file);

        // Get the download URL of the uploaded image
        const downloadURL = await getDownloadURL(storageRef);

        // Include the image URL in the user data
        userDataToUpdate.imageUrl = downloadURL;
      }

      if (userDetailSnapshot.exists()) {
        // Update existing document
        await setDoc(userDetailRef, userDataToUpdate, { merge: true });
        Swal.fire({
          icon: "success",
          title: "Berhasil!",
          text: "Data berhasil di update!",
        }).then(() => {
          navigate("/");
        });
      } else {
        // Create a new document
        await setDoc(userDetailRef, userDataToUpdate);
        Swal.fire({
          icon: "success",
          title: "Berhasil!",
          text: "Data berhasil di tambahkan!",
        }).then(() => {
          navigate("/");
        });
      }

      console.log("User data updated successfully!");
    } catch (error) {
      console.error("Error updating user data: ", error);
    }
  };

  return (
    <div className="md:py-[120px] py-[100px] sm:px-10 px-2">
      <div className="flex items-center gap-4 justify-center">
        {file ? (
          <img className="profile-pic flex justify-center items-center w-[100px] h-[100px] rounded-full" src={URL.createObjectURL(file)} />
        ) : (
          <label htmlFor="fileInput" className="hover:brightness-95 duration-150 cursor-pointer flex flex-col items-center justify-center border p-3 w-[100px] h-[100px] bg-neutral-100  border-neutral-500 rounded-full">
            <MdOutlineAddAPhoto className="text-2xl" />
          </label>
        )}
        <input type="file" id="fileInput" className="hidden" onChange={(e) => setFile(e.target.files[0])} />
      </div>
      <div className="saldo text-center">
        <h2 className="font-bold text-subtitle my-4">Saldo Kamu : {saldo ? saldo : 0} Rupiah</h2>
        <button className="hover:brightness-90 duration-150 cursor-pointer  px-6 py-2 rounded-[40px] border bg-green-700 text-white font-semibold">Cairkan Saldo</button>
      </div>
      <div className="mx-auto sm:w-[60%] w-[100%] ">
        <div className=" input-settings  mt-4">
          <label htmlFor="username" className="text-[#222] ">
            Username :
          </label>
          <input required defaultValue={username} onChange={(e) => setUsername(e.target.value)} type="text" id="username" className="bg-white border border-black text-[#222] px-2 my-2 w-full py-2 rounded-md" />
        </div>
        <div className=" input-settings  mt-4">
          <label htmlFor="email" className="text-[#222] ">
            Email :
          </label>
          <input required defaultValue={currentUser.email} onChange={(e) => setEmail(e.target.value)} type="email" id="email" className="bg-white border border-black text-[#222] px-2 my-2 w-full py-2 rounded-md" />
        </div>
        <div className=" input-settings  mt-4">
          <label htmlFor="nomor" className="text-[#222] ">
            Nomor Whatsapp :
          </label>
          <input required defaultValue={whatsapp} onChange={(e) => setWhatsapp(e.target.value)} type="number" id="nomor" className="bg-white border border-black text-[#222] px-2 my-2 w-full py-2 rounded-md" />
        </div>
        <div className=" input-settings  mt-4">
          <label htmlFor="kota" className="text-[#222] ">
            Kota & Kecamatan :
          </label>
          <input required defaultValue={kotaKecamatan} onChange={(e) => setKotaKecamatan(e.target.value)} type="text" id="kota" className="bg-white border border-black text-[#222] px-2 my-2 w-full py-2 rounded-md" />
        </div>
        <div className=" input-settings  mt-4">
          <label htmlFor="alamat" className="text-[#222] ">
            Alamat Lengkap :
          </label>
          <input required defaultValue={alamat} onChange={(e) => setAlamat(e.target.value)} type="text" id="alamat" className="bg-white border border-black text-[#222] px-2 my-2 w-full py-2 rounded-md" />
        </div>
        <div className="flex gap-2">
          <div className="submit  ">
            <button onClick={handleUserUpdate} className="text-[#fff] bg-maingreen py-2 px-6 rounded-md mt-4 hover:brightness-90 duration-150 font-semibold">
              Update
            </button>
          </div>
          {/* <div className="submit">
            <button onClick={handleUserDelete} className="text-[#222] bg-red-700 py-2 px-6 rounded-md mt-4 hover:brightness-90 duration-150">
              Delete
            </button>
          </div> */}
        </div>
      </div>
    </div>
  );
};

export default ProfileSettings;
