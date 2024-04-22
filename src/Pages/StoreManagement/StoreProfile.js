import React, { useState, useEffect } from 'react';
import { useAuth } from '../../Helpers/Repository/AuthContext';
import { useParams } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Modal from '@mui/material/Modal';
import { Helmet } from 'react-helmet';

//ASSETS
import Placeholder from '../../Assets/placeholder_image.jpg'
import { showLoader, formatDate } from '../../Helpers/Utils/Common';
import { AiOutlineClose } from "react-icons/ai";
import { PulseLoader } from 'react-spinners';
import { MdOutlineLocationOn } from "react-icons/md";
import { MdOutlineMailOutline } from "react-icons/md";
import { MdPhoneAndroid } from "react-icons/md";
import { FaRegUser } from "react-icons/fa6";

//QUERIES
import {
  getStore,
  getRewardsPerStore,
  getPromosPerStore,
  updateStore
} from '../../Helpers/Repository/StoreRepo';

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
  const [owner, setOwner] = useState('')
  const [phone, setPhone] = useState('')
  const [address, setAddress] = useState("");
  const [mapLink, setMapLink] = useState("");
  const [recyclables, setRecyclables] = useState("");

  const [isPhoneValid, setIsPhoneValid] = useState(false);

  const handlePhoneNumberChange = (event) => {
    const number = event.target.value;
    setPhone(number);
    // Regular expression for validating phone numbers (supports numbers with or without country code)
    const phonePattern = /^\+?([0-9]{1,4})\)?[-. ]?([0-9]{3})[-. ]?([0-9]{3})[-. ]?([0-9]{4})$/;
    setIsPhoneValid(phonePattern.test(number));
  };

  const handleShopNameChange = (event) => {
    setShopName(event.target.value);
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
    setAddress(store.address)
    setOwner(store.owner)
    setPhone(store.phone)
    setMapLink(store.googleMapLocation)
    setRecyclables(store.recyclable ? store.recyclable.join(', ') : "");
  }

  const handleSubmit = async () => {
    try {
      if (
        shopName !== store.name ||
        address !== store.address ||
        owner !== store.owner ||
        phone !== store.phone ||
        mapLink !== store.googleMapLocation ||
        recyclables !== (store.recyclable ? store.recyclable.join(', ') : '')
      ) {
        const updatedStoreData = {
          name: shopName,
          address: address,
          owner: owner,
          phone: phone,
          googleMapLocation: mapLink,
          recyclable: recyclables.split(',').map(item => item.trim())
        };

        setUpdateLoad(true)

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
      <Helmet>
        <title>{store.name}</title>
      </Helmet>
      <ToastContainer />
      {loading ? (
        <div className='w-full flex justify-center items-center h-36'>
          {showLoader()}
        </div>
      ) : (
        <div>
          <div className="flex flex-col md:flex-row gap-5">
            <div className='flex flex-col md:flex-row gap-5 w-full'>
              <img
                src={store.photo || Placeholder}
                alt=""
                className='w-52 h-52 object-cover rounded-md shadow-md'
              />
              <div className='flex flex-col text-start justify-start items-start w-full'>
                <p className='font-bold text-2xl'>{store.name}</p>
                <p>ID: {store.storeId}</p>
                <div className='flex flex-col md:flex-row gap-3 mt-3'>
                  <div className='w-full'>
                    <p className="w-full flex flex-row items-center"> <span className="text-xl m-0 pe-2"><FaRegUser /></span> {store.owner}</p>
                    <p className="w-full flex flex-row items-center"> <span className="text-xl m-0 pe-2"><MdOutlineMailOutline /></span> {store.email}</p>
                    <p className="w-full flex flex-row items-center"> <span className="text-xl m-0 pe-2"><MdPhoneAndroid /></span>{store.phone}</p>
                  </div>
                  <div className='w-full'>
                    <a href={store.googleMapLocation} target="_blank" rel="noopener noreferrer" className="w-full flex flex-row">
                      <span className="text-xl m-0 pe-2"><MdOutlineLocationOn /></span> {store.address}
                    </a>
                  </div>
                </div>
                <button className='bg-oliveGreen h-fit rounded-md hover:shadow-md py-2 w-28 text-white mt-5' onClick={() => handleEditClick()}>Edit Store</button>
              </div>
            </div>
          </div>
          <p className='mt-5'>Recyclables:</p>
          <div className='flex flex-row gap-2'>
            {store.recyclable && store.recyclable.map((item, index) => (
              <div className='bg-white border border-orange rounded-lg py-1 px-3 w-29' key={index}>{item}</div>
            ))}
          </div>
          <div className='flex flex-row gap-1 text-sm mt-6'>
            <div className={toggleState === 'rewards' ? "tabs active-tab" : "tabs"} onClick={() => toggleTab('rewards')}>Rewards</div>
            <div className={toggleState === 'promos' ? "tabs active-tab" : "tabs"} onClick={() => toggleTab('promos')}>Promos</div>
          </div>
          <div className={toggleState === "rewards" ? "content active-content" : "content"}>
            {rewards && rewards.length > 0 ? (
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
            ) : (
              <div className='font-bold text-lg w-full text-center h-24 text-gray'>
                No Rewards Offered
              </div>
            )}
          </div>
          <div className={toggleState === "promos" ? "content active-content" : "content"}>
            {promos && promos.length > 0 ? (
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
                      <p>From {formatDate(item.promoStart)}</p>
                      <p>To {formatDate(item.promoEnd)}</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className='font-bold text-lg w-full text-center h-24 text-gray'>
                No Active Promos
              </div>
            )}
          </div>
        </div>
      )}
      <Modal open={isModalOpen} onClose={() => seTIsModalOpen(false)}>
        <div className="modal-content flex justify-center items-center w-screen h-screen text-darkGray">
          {store != null && (
            <div className='bg-white rounded-md p-5 text-darkGray w-[20rem] md:w-fit'>
              <div className='flex justify-between'>
                <p className='font-bold text-lg mb-2'>Edit Store Information</p>
                <AiOutlineClose onClick={() => seTIsModalOpen(false)} className="cursor-pointer hover:text-red text-xl" />
              </div>
              <form>
                <div className="flex flex-col md:flex-row gap-3">
                  <div>
                    <p className="text-sm text-gray">Shop Name</p>
                    <input
                      id='shop_name'
                      name='shop_name'
                      type="text"
                      value={shopName}
                      onChange={handleShopNameChange}
                      className='input-field'
                    />
                  </div>
                  <div>
                    <p className="text-sm text-gray">Owner</p>
                    <input
                      id='shop_name'
                      name='shop_name'
                      type="text"
                      value={owner}
                      onChange={(e) => setOwner(e.target.value)}
                      className='input-field'
                    />
                  </div>
                  <div>
                    <p className="text-sm text-gray">Phone Number</p>
                    <input
                      id='shop_name'
                      name='shop_name'
                      type="text"
                      value={phone}
                      onChange={(e) => handlePhoneNumberChange(e)}
                      className='input-field'
                    />
                  </div>
                </div>
                <p className="text-sm mt-2 text-gray">Address</p>
                <div className="flex flex-wrap gap-2">
                  <textarea
                    id='address'
                    name='address'
                    type="text"
                    value={address}
                    placeholder='Enter address'
                    onChange={(e) => setAddress(e.target.value)}
                    className='input-field w-full'
                  />
                </div>
                <p className="text-sm mt-2 text-gray">Google Map Link</p>
                <div className="flex flex-wrap gap-2">
                  <textarea
                    id='mapLink'
                    name='mapLink'
                    type="text"
                    value={mapLink}
                    placeholder='Enter Link'
                    onChange={(e) => setMapLink(e.target.value)}
                    className='input-field w-full h-28'
                  />
                </div>
                <p className="text-sm mt-2 text-gray">Recyclables (separate by comma)</p>
                <textarea
                  id='recyclables'
                  name='recyclables'
                  type="text"
                  value={recyclables}
                  onChange={handleRecyclablesChange}
                  className='input-field w-full' />
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
                    <div></div>
                  )}
                  <button type='button' className='hover:bg-red py-1 px-4 border border-red text-red hover:text-white rounded-md' onClick={() => seTIsModalOpen(false)}>Cancel</button>
                  <button type='button' className='bg-oliveGreen py-1 px-4 text-white rounded-md' onClick={() => handleSubmit()}>Submit</button>
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
