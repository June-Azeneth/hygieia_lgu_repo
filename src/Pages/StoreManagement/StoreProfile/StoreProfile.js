import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Modal from '@mui/material/Modal';
import { AiOutlineClose } from "react-icons/ai";
import { PulseLoader } from 'react-spinners';

import {
  getStore,
  getRewardsPerStore,
  getPromosPerStore,
  updateStore
} from '../../../Helpers/Context/StoreRepo';
import { showLoader } from '../../../Helpers/Utils/Common';
import { useAuth } from '../../../Helpers/Context/AuthContext';

function StoreProfile() {
  const { id } = useParams();
  const { userDetails } = useAuth
  const [store, setStore] = useState([]);
  const [rewards, setRewards] = useState([]);
  const [promos, setPromos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updateLoad, setUpdateLoad] = useState(false)
  const [toggleState, setToggleState] = useState('rewards')
  const [isModalOpen, seTIsModalOpen] = useState(false)
  const [shopName, setShopName] = useState(store.name);
  const [sitio, setSitio] = useState("");
  const [barangay, setBarangay] = useState("");
  const [city, setCity] = useState("");
  const [province, setProvince] = useState("");
  const [recyclables, setRecyclables] = useState("");

  const handleShopNameChange = (event) => {
    setShopName(event.target.value);
  }

  const handleSitioChange = (event) => {
    setSitio(event.target.value);
  }

  const handleBarangayChange = (event) => {
    setBarangay(event.target.value);
  }

  const handleCityChange = (event) => {
    setCity(event.target.value);
  }

  const handleProvinceChange = (event) => {
    setProvince(event.target.value);
  }

  const toggleTab = (tab) => {
    setToggleState(tab)
  }

  const handleRecyclablesChange = (event) => {
    setRecyclables(event.target.value);
  }

  const fetchData = async () => {
    try {
      setLoading(true);
      const storeData = await getStore(id);
      setStore(storeData);
      await fetchRewards(storeData.storeId);
      await fetchPromos(storeData.storeId);
    } catch (error) {
      toast.error("An error occurred: " + error);
    } finally {
      setLoading(false);
    }
  };

  const fetchRewards = async (storeId) => {
    try {
      setLoading(true);
      const rewards = await getRewardsPerStore(storeId);
      setRewards(rewards);
      console.log(rewards);
    } catch (error) {
      toast.error("An error occurred: " + error);
    } finally {
      setLoading(false);
    }
  };

  const fetchPromos = async (storeId) => {
    try {
      setLoading(true);
      const promos = await getPromosPerStore(storeId);
      console.log(promos);
      setPromos(promos);
    } catch (error) {
      toast.error("An error occurred: " + error);
    } finally {
      setLoading(false);
    }
  };

  function handleEditClick() {
    seTIsModalOpen(true)
    setShopName(store.name);
    setSitio(store.address.sitio);
    setBarangay(store.address.barangay);
    setCity(store.address.city);
    setProvince(store.address.province);
    setRecyclables(store.recyclable ? store.recyclable.join(', ') : "");
  }

  const handleSubmit = async () => {
    try {
      setUpdateLoad(true)
      if (
        shopName !== store.name ||
        sitio !== store.address.sitio ||
        barangay !== store.address.barangay ||
        city !== store.address.city ||
        province !== store.address.province ||
        recyclables !== store.recyclable.join(', ')
      ) {
        const updatedStoreData = {
          name: shopName,
          address: {
            sitio,
            barangay,
            city,
            province
          },
          recyclable: recyclables.split(',').map(item => item.trim())
        };

        await updateStore(id, updatedStoreData);
        setUpdateLoad(false)
        toast.success("Store information updated successfully!");
        seTIsModalOpen(false);
        fetchData()
      } else {
        setUpdateLoad(false)
        toast.info("No changes detected.");
      }
    } catch (error) {
      toast.error("An error occurred while updating store information: " + error.message);
    }
  }

  useEffect(() => {
    fetchData();
  }, [id, userDetails]);

  return (
    <div className="page-container text-darkGray">
      <ToastContainer />
      {loading ? (
        <div className='w-full flex justify-center items-center h-36'>
          {showLoader()}
        </div>
      ) : (
        <div>
          <div className="flex flex-col md:flex-row gap-5">
            <div className='flex flex-row gap-5'>
              <img src={store.photo} alt="photo" className='w-52 h-52 object-cover rounded-md shadow-md' />
              <div>
                <p className='font-bold text-2xl'>{store.name}</p>
                <p>ID: {store.storeId}</p>
                <p className='mt-5'>Address: {store.address.sitio + " " + store.address.barangay + ", " + store.address.city + ", " + store.address.province}</p>
                <p>Email: {store.email}</p>
                <p className='mt-3'>Recyclables:</p>
                <div className='flex flex-row gap-2'>
                  {store.recyclable.map((item, index) => (
                    <div className='bg-white border border-orange rounded-lg py-1 px-3 w-29' key={index}>{item}</div>
                  ))}
                </div>
              </div>
            </div>
            <div className='ms-auto flex flex-row gap-3'>
              <button className='bg-oliveGreen h-fit rounded-md hover:shadow-md py-2 w-28 text-white' onClick={() => handleEditClick()}>Edit Store</button>
              <button className='bg-oliveGreen h-fit rounded-md hover:shadow-md py-2 px-3 w-fit text-white'>Change Password</button>
            </div>
          </div>
          <div className='flex flex-row gap-1 text-sm mt-6'>
            <div className={toggleState === 'rewards' ? "tabs active-tab" : "tabs"} onClick={() => toggleTab('rewards')}>Rewards</div>
            <div className={toggleState === 'promos' ? "tabs active-tab" : "tabs"} onClick={() => toggleTab('promos')}>Promos</div>
          </div>
          <div className={toggleState === "rewards" ? "content active-content" : "content"}>
            {rewards && (
              <div className="flex flex-wrap gap-3 text-sm overflow-x-scroll scrollbar-none">
                {rewards.map((item, index) => (
                  <div key={index} className='border border-gray rounded-md flex flex-col w-52 overflow-hidden'>
                    <img className='w-full h-[7rem] object-cover' src={item.photo} alt="" />
                    <div className='p-2 text-oliveGreen'>
                      <p className="font-bold text-darkGray text-base">{item.name}</p>
                      <p>Discount: {item.discount}%</p>
                      <p>Org Price: ₱{item.price}</p>
                      <p>Discounted Price: ₱{item.discountedPrice}</p>
                      <p>Points Required: {item.pointsRequired} pts</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
          <div className={toggleState === "promos" ? "content active-content" : "content"}>
            {promos && (
              <div className="flex flex-wrap gap-3 text-sm overflow-x-scroll scrollbar-none">
                {promos.map((item, index) => (
                  <div key={index} className='border border-gray rounded-md flex flex-col w-52 overflow-hidden'>
                    <img className='w-full h-[7rem] object-cover' src={item.photo} alt="" />
                    <div className='p-2 text-oliveGreen'>
                      <p className="font-bold text-darkGray text-base">{item.name}</p>
                      <p>Discount: {item.discountRate}%</p>
                      <p>Org Price: ₱{item.price}</p>
                      <p>Discounted Price: ₱{item.discountedPrice}</p>
                      <p>Points Required: {item.pointsRequired} pts</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
      <Modal open={isModalOpen} onClose={() => seTIsModalOpen(false)}>
        <div className="modal-content flex justify-center items-center w-screen h-screen text-darkGray">
          {store != null && (
            <div className='bg-white rounded-md p-5 text-darkGray w-[40rem]'>
              <div className='flex justify-between'>
                <p className='font-bold text-lg mb-2'>Edit Store Information</p>
                <AiOutlineClose onClick={() => seTIsModalOpen(false)} className="cursor-pointer hover:text-red text-xl" />
              </div>
              <form>
                <p className="text-sm">Shop Name</p>
                <input
                  id='shop_name'
                  name='shop_name'
                  type="text"
                  value={shopName}
                  onChange={handleShopNameChange}
                  className='border border-gray rounded-sm px-1'
                />
                <p className="text-sm mt-2">Address</p>
                <div className="flex flex-wrap gap-2">
                  <input
                    id='sitio'
                    name='sitio'
                    type="text"
                    value={sitio}
                    onChange={handleSitioChange}
                    className='border border-gray rounded-sm px-1'
                  />
                  <input
                    id='barangay'
                    name='barangay'
                    type="text"
                    value={barangay}
                    onChange={handleBarangayChange}
                    className='border border-gray rounded-sm px-1'
                  />
                  <input
                    id='city'
                    name='city'
                    type="text"
                    value={city}
                    onChange={handleCityChange}
                    className='border border-gray rounded-sm px-1'
                  />
                  <input
                    id='province'
                    name='province'
                    type="text"
                    value={province}
                    onChange={handleProvinceChange}
                    className='border border-gray rounded-sm px-1'
                  />
                </div>
                <p className="text-sm mt-2">Recyclables</p>
                <textarea
                  id='recyclables'
                  name='recyclables'
                  type="text"
                  value={recyclables}
                  onChange={handleRecyclablesChange}
                  className='border border-gray rounded-sm px-1 w-full' />
                <div className='flex justify-end gap-3 mt-3 relative'>
                  {updateLoad ? (
                    <div className='mt-3'>
                      <PulseLoader
                        color="#617C49"
                        height={13}
                        width={5}
                      />
                    </div>
                  ) : (
                    <div>

                    </div>
                  )}
                  <button type='button' className='bg-red py-2 px-4 text-white rounded-md' onClick={() => seTIsModalOpen(false)}>Cancel</button>
                  <button type='button' className='bg-oliveGreen py-2 px-4 text-white rounded-md' onClick={() => handleSubmit()}>Submit</button>
                </div>
              </form>
            </div>
          )}
        </div>
      </Modal>
    </div>
  );
}

export default StoreProfile;
