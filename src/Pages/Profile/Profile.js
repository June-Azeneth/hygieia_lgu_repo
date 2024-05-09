import React, { useEffect, useRef, useState } from 'react'
import { Helmet } from 'react-helmet'
import { useAuth } from '../../Helpers/Repository/AuthContext'
import { formatDate } from '../../Helpers/Utils/Common'
import { ToastContainer, toast } from 'react-toastify';

import { updateUserPhoto, updateUserProfile } from '../../Helpers/Repository/ClientRepo';

//assets
import { FaCamera } from "react-icons/fa";
import { FadeLoader } from 'react-spinners';

const Profile = () => {
    const { userDetails } = useAuth()
    const [editProfile, setEditProfile] = useState(false)
    const showSaveBtn = () => setEditProfile(!editProfile);
    const [name, setName] = useState('')
    const [id, setId] = useState('')
    const [email, setEmail] = useState('')
    const [address, setAddress] = useState('')
    const [dateJoined, setDateJoined] = useState('')
    const fileInputRef = useRef(null);
    const [imageSrc, setImageSrc] = useState(null);
    const [loading, setLoading] = useState(false)
    const [loader, setLoader] = useState(false)

    const handleClick = () => {
        fileInputRef.current.click();
    };

    const handleFileSelect = async (event) => {
        try {
            setLoading(true)
            const selectedFile = event.target.files[0];
            console.log("Selected File:", selectedFile);
            if (selectedFile && selectedFile.type.startsWith('image/')) {
                const imageUrl = URL.createObjectURL(selectedFile);
                const success = await updateUserPhoto(selectedFile, id)
                if (success) {
                    setLoading(false)
                    toast.success("Profile photo updated successfully")
                    setImageSrc(imageUrl)
                }
                else {
                    setLoading(false)
                    toast.error("Something went wrong. Please try again later.")
                }
            }
        } catch (error) {
            setLoading(false)
            toast.error("Failed to upload image. Please try again later.");
        }
    };

    const updateProfileClick = async () => {
        try {
            setLoader(true)
            const data = {
                name: name,
                address: address
            }
            const success = await updateUserProfile(data, id)
            if (success) {
                setLoader(false)
                toast.success("User info updated successfully")
                setEditProfile(false)
            }
            else {
                setLoader(false)
                toast.error("Something went wrong. Please try again later.")
            }
        } catch (error) {
            setLoader(false)
            toast.error(error)
        }
    }

    useEffect(() => {
        if (userDetails) {
            setName(userDetails.name)
            setId(userDetails.id)
            setEmail(userDetails.email)
            setAddress(userDetails.address)
            setDateJoined(formatDate(userDetails.dateAdded))
            setImageSrc(userDetails.photo)
        }
    }, userDetails)
    return (
        <div className='page-container'>
            <Helmet>
                <title>Profile</title>
            </Helmet>
            <ToastContainer />
            <div className='w-full h-full flex justify-center items-center'>
                <div className='rounded-md p-7 bg-white shadow-md flex flex-col justify-center md:flex-row gap-9'>
                    <input
                        type="file"
                        ref={fileInputRef}
                        style={{ display: 'none' }}
                        accept="image/*"
                        onChange={handleFileSelect}
                    />
                    <div className='flex flex-col gap-5'>
                        <div className='relative rounded-full overflow-clip'>
                            <img src={imageSrc} alt="" className='top-0 object-cover w-[11rem] h-[11rem]' />
                            <div className='absolute top-[9rem] bg-black opacity-30 h-full w-full'></div>
                            <div className='w-full h-full flex justify-center items-end absolute top-0 pb-4 cursor-pointer'>
                                <FaCamera className='text-4xl text-white hover:text-orange' onClick={handleClick} />
                            </div>
                            {loading ? (
                                <div className='w-full h-full flex justify-center items-center absolute top-0'>
                                    <FadeLoader
                                        color="#FFFF"
                                    />
                                </div>
                            ) : (
                                <div></div>
                            )}
                        </div>
                    </div>
                    <form className=''>
                        {!editProfile ? (
                            <div className='flex flex-col gap-2 w-[20rem]'>
                                <p className='text-gray'>Name: <span className='text-darkGray m-0 ps-1'>{name}</span></p>
                                <p className='text-gray'>ID: <span className='text-darkGray m-0 ps-1'>{id}</span></p>
                                <p className='text-gray'>Email: <span className='text-darkGray m-0 ps-1'>{email}</span></p>
                                <p className='text-gray'>Address: <span className='text-darkGray m-0 ps-1'>{address}</span></p>
                                <p className='text-gray'>Joined On: <span className='text-darkGray m-0 ps-1'>{dateJoined}</span></p>
                            </div>
                        ) : (
                            <div className='flex flex-col gap-3 text-darkGray w-[20rem]'>
                                <h1 className='font-bold text-xl mx-auto'>Edit Profile</h1>
                                <div>
                                    <p className='text-sm text-gray'>Name <span className='text-red m-0'>*</span></p>
                                    <input
                                        type="text"
                                        id='name'
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                        className='input-field w-full' />
                                </div>
                                <div>
                                    <p className='text-sm text-gray'>Address <span className='text-red m-0'>*</span></p>
                                    <textarea
                                        type="text"
                                        id='address'
                                        value={address}
                                        onChange={(e) => setAddress(e.target.value)}
                                        className='input-field w-full' />
                                </div>
                            </div>
                        )}
                        {!editProfile ? (
                            <div className='flex gap-3 flex-row mt-6 justify-center'>
                                <button className='bg-oliveGreen px-9 py-2 rounded-md text-white' onClick={showSaveBtn} type='button'>
                                    Edit Profile
                                </button>
                            </div>
                        ) : (
                            <div className='flex gap-3 flex-row mt-6 justify-center'>
                                <button className='hover:bg-gray border-gray w-full py-2 rounded-md text-gray border hover:text-white' onClick={showSaveBtn} type='button'>
                                    Cancel
                                </button>
                                {loader ? (
                                    <div className='w-full flex justify-center items-center'>
                                        <FadeLoader
                                            color='#567d34'
                                        />
                                    </div>
                                ) : (
                                    <button className='view-btn w-full py-2 rounded-md' type='button' onClick={() => updateProfileClick()}>
                                        Save
                                    </button>
                                )}
                            </div>
                        )}
                    </form>
                </div>
            </div >
        </div >
    )
}

export default Profile
