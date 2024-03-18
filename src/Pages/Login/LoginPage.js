import { React, useState } from "react";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import {useNavigate} from 'react-router-dom'

import { useAuth } from '../../Helpers/Context/AuthContext'

//assets
import Logo from '../../Assets/logo_final.png'
import { FaUser } from "react-icons/fa";
import { RiLockPasswordFill } from "react-icons/ri";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate()


  const handleEmailChange = (event) => {
    setEmail(event.target.value);
  };

  const handlePasswordChange = (event) => {
    setPassword(event.target.value);
  };

  const { login } = useAuth()


  async function handleSubmit(event) {
    event.preventDefault();

    // Validation logic
    if (!email && !password) {
      toast.error("Fill in all the required fields");
      return;
    }
    if (!email) {
      toast.error("Email is required");
      return;
    }
    if (!password) {
      toast.error("Password is required");
      return;
    }

    try {
      await login(email, password)
      toast.success("Logged in successfully!")
      navigate('/home')
    }
    catch (e) {
      toast.error("An error occured:" + e)
    }
  };

  return (
    <div className="flex flex-col justify-center items-center h-screen md:flex-row">
      <div className="w-full justify-center items-center flex text-center px-10 max-w-screen-sm">
        <div className="bg-white rounded-md border ring-gray-50 w-full px-8 lg:px-20 py-10">
          <img src={Logo} alt="waste-management" className="w-28 h-28 mx-auto" />
          <p className="mb-6 font-bold text-green tracking-widest">Hygieia Web Service</p>
          <form className="flex flex-col gap-3" onSubmit={handleSubmit}>
            <div className="relative">
              <input
                id="email"
                type="email"
                placeholder="Email"
                value={email}
                onChange={handleEmailChange}
                autoComplete="off"
                className="rounded border-2 border-gray-200 py-2 pl-9 w-full"
              />
              <FaUser className='absolute top-0 text-darkGreen h-full left-3' />
            </div>
            <div className="relative">
              <input
                id="password"
                type="password"
                placeholder="Password"
                value={password}
                onChange={handlePasswordChange}
                autoComplete="off"
                className="rounded border-2 border-gray-200 py-2 pl-9 w-full"
              />
              <RiLockPasswordFill className='absolute top-0 text-darkGreen h-full left-3' />
            </div>
            <button type="submit" className="bg-oliveGreen hover:bg-green mt-3 text-white rounded-md py-2 mx-24">Login</button>
          </form>
        </div>
        <ToastContainer />
      </div>
    </div>
  );
}

export default Login;
