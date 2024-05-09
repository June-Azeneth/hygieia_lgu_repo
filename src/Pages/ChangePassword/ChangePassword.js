import React, { useState } from 'react'
import { ToastContainer, toast } from 'react-toastify';
import { getAuth, sendPasswordResetEmail } from "firebase/auth";
import { useNavigate } from 'react-router-dom';

const ChangePassword = () => {
    const [email, setEmail] = useState('')
    const navigate = useNavigate()
    const resetPass = async () => {
        try {
            if (!email) {
                toast.info("Email is required!")
                return
            }
            const authentication = getAuth();
            sendPasswordResetEmail(authentication, email)
                .then(() => {
                    toast.success("Password recovery email sent!")
                })
                .catch((error) => {
                    toast.error(error.message)
                });
        }
        catch (error) {
            toast.error(error)
        }
    }

    return (
        <div className='flex justify-center h-screen w-screen flex-col text-darkGray bg-oliveGreen'>
            <ToastContainer />
            <div className='flex flex-col gap-3 w-96 mx-auto p-6 bg-white rounded-md shadow-md'>
                <h1 className='text-xl font-bold'>Reset Password</h1>
                <input
                    type="text"
                    value={email}
                    placeholder='Enter your email'
                    onChange={(e) => setEmail(e.target.value)}
                    className='w-full input-field'
                />
                <div className='flex flex-row gap-3 mt-6'>
                    <button
                        type='button'
                        className='rounded-md border-gray text-gray hover:bg-gray hover:text-white w-full py-2'
                        onClick={() => navigate('/')}>
                        Cancel
                    </button>
                    <button
                        type='button'
                        className='rounded-md border border-oliveGreen text-oliveGreen hover:bg-oliveGreen hover:text-white w-full py-2'
                        onClick={() => resetPass()}>
                        Submit
                    </button>
                </div>
            </div>
        </div>
    )
}

export default ChangePassword
