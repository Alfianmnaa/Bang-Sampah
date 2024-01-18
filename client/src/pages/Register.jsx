import React, { useState } from "react";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth, db } from "../firebase";
import { doc, setDoc } from "firebase/firestore";
import { Link, useNavigate } from "react-router-dom";

const Register = () => {
  const [error, setError] = useState(false);
  const navigate = useNavigate();
  const handleRegister = async (e) => {
    e.preventDefault();
    const username = e.target[0].value;
    const email = e.target[1].value;
    const password = e.target[2].value;
    const nomor = e.target[3].value;

    try {
      //Create user
      const res = await createUserWithEmailAndPassword(auth, email, password);
      console.log(res);
      await setDoc(doc(db, "users", res.user.uid), {
        uid: res.user.uid,
        username,
        email,
        nomor,
      });
      navigate("/masuk");
    } catch (err) {
      setError(true);
      console.log(err);
    }
  };

  return (
    <div className="container-register md:py-[120px] py-[100px] min-h-screen ">
      <div className="sm:w-[550px] w-[300px] mx-auto">
        <h1 className=" text-[32px] font-bold">Selamat Datang di Bang Sampah! 👋</h1>
        <p className="login-text mt-3 text-[#666] font-medium text-[16px] ">Mari mulai buat akun anda</p>
        <form onSubmit={handleRegister} className="login-container mt-9 h-auto ">
          <div className="input2 flex flex-col mb-6">
            <label htmlFor="username" className="text-neutral-800 text-xl font-bold font-['Figtree'] leading-normal">
              Nama Lengkap
            </label>
            <input id="username" type="text" required placeholder="Contoh: John Doe " className="border mt-2 rounded-md border-[#222] w-full py-3 px-4 text-tprimary outline-none" />
          </div>
          <div className="input2 flex flex-col mb-6">
            <label htmlFor="email" className="text-neutral-800 text-xl font-bold font-['Figtree'] leading-normal">
              Email
            </label>
            <input id="email" type="email" required placeholder="Contoh: JohnDoe@gmail.com " className="border mt-2 rounded-md border-[#222] w-full py-3 px-4 text-tprimary outline-none" />
          </div>
          <div className="input2 flex flex-col mb-6">
            <label htmlFor="password" className="text-neutral-800 text-xl font-bold font-['Figtree'] leading-normal">
              Password
            </label>
            <input id="password" type="password" required placeholder="Contoh: John123Doe " className="border mt-2 rounded-md border-[#222] w-full py-3 px-4 text-tprimary outline-none" />
            <div className=" text-zinc-700 text-smtprimary font-normal font-['Figtree'] leading-none mt-2">Gunakan minimal 8 karakter dengan kombinasi huruf dan angka</div>
          </div>
          <div className="input2 flex flex-col mb-6">
            <label htmlFor="wa" className="text-neutral-800 text-xl font-bold font-['Figtree'] leading-normal">
              No HP/Whatsapp
            </label>
            <input id="wa" type="text" required placeholder="Contoh: 0812345678 " className="border mt-2 rounded-md border-[#222] w-full py-3 px-4 text-tprimary outline-none" />
          </div>

          <button type="submit" className="button-login w-full py-4 mt-2 text-white bg-green-700 text-xl font-bold rounded-md border-none transition duration-200 cursor-pointer hover:brightness-90">
            Daftar
          </button>
          <div className="text-center mt-4">
            <span className="text-stone-500 text-base font-medium font-['Figtree'] leading-normal">Sudah punya akun? </span>
            <Link to={"/masuk"} className="text-green-700 text-base font-bold font-['Figtree'] underline leading-normal">
              Masuk sekarang
            </Link>
          </div>
          {error && <p className="wrong-input mt-4 text-center text-red-500">Wrong email or password!</p>}
        </form>
      </div>
    </div>
  );
};

export default Register;
