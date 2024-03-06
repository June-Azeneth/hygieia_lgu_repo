import { React, useState } from "react";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import {signInUser} from '../../Helpers/Repository/Login';

 
import Photo from '../../Assets/waste-management.png'
import { FaUser } from "react-icons/fa";
import { RiLockPasswordFill } from "react-icons/ri";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleEmailChange = (event) => {
    setEmail(event.target.value);
  };

  const handlePasswordChange = (event) => {
    setPassword(event.target.value);
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    // signInWithEmailAndPass(authentication, email, password)

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
      signInUser(email, password)
      
    }
    catch (e) {
      toast.error("An error occured:" + e)
    }
  };

  return (
    <div className="flex flex-col justify-center items-center h-screen md:flex-row">
      <div className="w-full p-5 flex flex-col justify-center items-center">
        <p>Hygieia LGU</p>
        <img src={Photo} alt="waste-management" className="w-full" />
      </div>
      <div className="w-full justify-center items-center flex text-center px-10">
        <div className="bg-white rounded-md border ring-gray-50 w-full px-20 py-10">
          <p className="mb-6 font-bold text-green tracking-widest">Welcome Back!</p>
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
            <button type="submit" className="bg-green text-white rounded-md py-1 mx-24">Login</button>
          </form>
          <a href='/home'>FOR GOTHAM!</a>
        </div>
        <ToastContainer />
      </div>
    </div>
  );
}

export default Login;
