import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import RoomForm from './RoomForm';

const Rooms = () => {
    const [data,setData] = useState([]);
    const [editIndex, setEditIndex] = useState(-1);
    const [showRoomForm, setShowRoomForm] = useState(false);
    const [errors, setError] = useState({});
    const navigate = useNavigate();

    const handleAddRoomButton = () => {
        setShowRoomForm(true);
    };
    const env = 'PROD';
    const publicMongoUrl = env === 'PROD' ? 'https://hostelmanagement-backend.onrender.com' : 'http://localhost:3000';
    const handleViewButton = (roomNumber,sharingType) => {
        navigate('/persons', {state: {
            roomNumber,
            sharingType
        }});
    }
    const getDataFromBackend = async ()=>{
        try{
            const response = await axios.get(`${publicMongoUrl}/hostelRooms`,{
                headers : {
                    Authorization : `Bearer ${localStorage.getItem("authToken")}`
                }
            });
            // console.log(response.data.data);
            setData(response.data.data);
        }catch(error){
            const responseError = error;
            console.log(responseError.response.data.message);
            setError({
                genral: "Registration failed. Please try again.",
                backEndError: responseError.response.data.message
            });
        }
    }
    const deleteRoom = async (index) => {
        const id = data[index]._id;
        console.log("dlt",id);

        try{
            await axios.delete(`${publicMongoUrl}/${id}`,{
            headers : {
                Authorization : `Bearer ${localStorage.getItem("authToken")}`
            }
        });
        getDataFromBackend();
        // setEditIndex(-1);
        }catch(error){
            const responseError = error;
            console.log(responseError.response.data.message);
            setError({
                genral: "Registration failed. Please try again.",
                backEndError: responseError.response.data.message
            });
        }
    }
    useEffect(() => {
        
    },[getDataFromBackend])
    console.log(editIndex);
    const handleLogoutButton = () => {
        localStorage.removeItem("authToken");
        navigate("/login");
    } 
    

    return (
        <div>
            {errors.backEndError && <p className='text-red-500 text-xl text center'>{errors.backEndError}</p>}
            <div className='flex px-40 py-10 justify-between'>
                <p className='text-4xl'>Welcome to App</p>
                <button className='px-7 py-2 bg-red-600 text-white rounded' onClick={handleLogoutButton}>Logout</button>
            </div>
            {showRoomForm && <RoomForm 
            getDataFromBackend = {getDataFromBackend} 
            setShowRoomForm = {setShowRoomForm} 
            data = {data} 
            setData={setData} 
            editIndex={editIndex} 
            setEditIndex = {setEditIndex}
            errors = {errors}
            setError = {setError}/>}
            <div className='flex px-32 justify-between'>
                <p className='text-2xl pl-16'>Rooms</p>
                <button
                    className='px-7 py-2 bg-green-600 text-white rounded mr-5'
                    onClick={handleAddRoomButton}
                >
                    Add New Room
                </button>
            </div>
            <div className='flex justify-center py-10'>
                <table className='border border-collapse'>
                    <thead>
                        <tr>
                            <th className='border border-gray-600 px-28 py-2 text-left'>SNo</th>
                            <th className='border border-gray-600 px-28 py-2 text-left'>Room number</th>
                            <th className='border border-gray-600 px-28 py-2 text-left'>Sharing Type</th>
                            <th className='border border-gray-600 px-28 py-2 text-left'>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            data.map((room,index)=>(
                                <tr key={room.RoomNumber} className='text-center border'>
                                    <td className='border border-gray-300'>{index+1}</td>
                                    <td className='border border-gray-300'>{room.RoomNumber}</td>
                                    <td className='border border-gray-300'>{room.SharingType + " sharing"}</td>
                                    <td className='border border-gray-300'>
                                        <div className='flex justify-between px-3 py-2'>
                                            <button className='bg-cyan-400 px-3 py-1 rounded-lg ' onClick={() => {handleViewButton(room.RoomNumber,room.SharingType)}} >View</button>
                                            <button className='bg-blue-600 px-3 py-1 rounded-lg text-white' onClick={() => {
                                                setEditIndex(index);
                                                setShowRoomForm(true);
                                            }}>Update</button>
                                            <button className='bg-red-600 px-3 py-1 rounded-lg text-white' onClick={() => {
                                                
                                                deleteRoom(index);
                                            }}>Delete</button>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        }
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default Rooms;