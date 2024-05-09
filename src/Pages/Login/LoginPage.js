import { React, useState } from "react";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate } from 'react-router-dom'
import { FadeLoader } from 'react-spinners';
import { Helmet } from "react-helmet";

import { useAuth } from '../../Helpers/Repository/AuthContext'

//assets
import Logo from '../../Assets/logo_final.png'
import { PiUserCircleLight } from "react-icons/pi";
import { IoKeyOutline } from "react-icons/io5";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)

  const handleEmailChange = (event) => {
    setEmail(event.target.value);
  };

  const handlePasswordChange = (event) => {
    setPassword(event.target.value);
  };

  const { login, logout } = useAuth()


  async function handleSubmit(event) {
    event.preventDefault();

    // Validation logic
    if (!email && !password) {
      toast.info("Fill in all the required fields");
      return;
    }
    if (!email) {
      toast.info("Email is required");
      return;
    }
    if (!password) {
      toast.info("Password is required");
      return;
    }

    try {
      setLoading(true)
      await login(email, password)
      toast.success("Logged in successfully!")
      setLoading(false)
      navigate('/home')
    }
    catch (e) {
      await logout()
      navigate('/')
      setLoading(false)
      toast.error("Error: " + e.message)
    }
  };

  return (
    <div className="flex flex-col justify-center items-center h-screen md:flex-row bg-oliveGreen">
      <Helmet>
        <title>Hygieia</title>
      </Helmet>
      <div className="w-full justify-center items-center flex text-center px-10 max-w-screen-sm">
        <div className="bg-white rounded-md ring-gray-50 w-full px-8 lg:px-20 py-10">
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
                className="rounded border border-gray py-2 pl-9 w-full"
              />
              <PiUserCircleLight className='absolute top-0 text-xl text-darkGreen h-full left-3' />
            </div>
            <div className="relative">
              <input
                id="password"
                type="password"
                placeholder="Password"
                value={password}
                onChange={handlePasswordChange}
                autoComplete="off"
                className="rounded border border-gray py-2 pl-9 w-full"
              />
              <IoKeyOutline className='absolute top-0 text-darkGreen h-full left-3' />
            </div>
            <p className="me-auto text-darkGray hover:cursor-pointer hover:text-orange" onClick={() => navigate('/forgot-password')}>Forgot Password</p>
            <div className="flex justify-center">
              {loading ? (
                <div className="mt-3">
                  <FadeLoader
                    color="#617C49"
                  />
                </div>
              ) : (
                <div>
                  <button type="submit" className="bg-oliveGreen hover:shadow-md mt-3 text-white rounded-md py-2 w-32">Login</button>
                </div>
              )}
            </div>
          </form>
        </div>
        <ToastContainer />
      </div>
    </div>
  );
}

export default Login;
