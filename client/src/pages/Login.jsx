import React, { useContext, useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

const Login = () => {
  const [error, setError] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const navigate = useNavigate();
  const location = useLocation();

  const { dispatch } = useContext(AuthContext);

  const handleLogin = (e) => {
    e.preventDefault();

    signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        const user = userCredential.user;
        dispatch({ type: "LOGIN", payload: user });
        console.log(user);
        // Redirect the user to the previous page or "/" if no previous page
        navigate("/beli-sampah");
      })
      .catch((error) => {
        setError(true);
      });
  };

  return (
    <div className="container-login md:py-[120px] py-[100px] ">
      <div className="sm:w-[550px] w-[300px] mx-auto">
        <h1 className="text-center text-[32px] font-bold">Masuk ke Bang Sampah</h1>
        <form onSubmit={handleLogin} className="login-container mt-9 h-auto">
          <div className="input1 mb-6 flex flex-col">
            <label htmlFor="email" className="text-neutral-800 text-xl font-bold font-['Figtree'] leading-normal">
              Email:
            </label>
            <input required type="email" id="email" placeholder="Contoh: JohnDoe@gmail.com " className="border mt-2 rounded-md border-[#222] w-full py-3 px-4 text-tprimary outline-none" onChange={(e) => setEmail(e.target.value)} />
          </div>
          <div className="input2 flex flex-col mb-6">
            <label htmlFor="password" className="text-neutral-800 text-xl font-bold font-['Figtree'] leading-normal">
              Password:
            </label>
            <input required type="password" id="password" placeholder="your password!" className="border mt-2 rounded-md border-[#222] w-full py-3 px-4 text-tprimary outline-none" onChange={(e) => setPassword(e.target.value)} />
          </div>
          <button type="submit" className="button-login w-full py-2 mt-2 text-white bg-green-700 text-xl font-bold rounded-md border-none transition duration-200 cursor-pointer hover:brightness-90">
            Login
          </button>
          <p className="text-center mt-4 text-[#666] font-semibold">
            Belum punya akun?{" "}
            <Link to="/daftar" className=" text-green-700 underline">
              Daftar Sekarang
            </Link>
          </p>
          {error && <p className="wrong-input mt-4 text-center text-red-500">Wrong email or password!</p>}
        </form>
      </div>
    </div>
  );
};

export default Login;
