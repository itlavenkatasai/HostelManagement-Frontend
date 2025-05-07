import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import RoomForm from './RoomForm';

const Rooms = () => {
    const [data, setData] = useState([]);
    const [editIndex, setEditIndex] = useState(-1);
    const [showRoomForm, setShowRoomForm] = useState(false);
    const [errors, setError] = useState({});
    const navigate = useNavigate();

    const env = 'PROD';
    const publicMongoUrl = env === 'PROD' ? 'https://hostelmanagement-backend.onrender.com' : 'http://localhost:3000';

    const handleAddRoomButton = () => setShowRoomForm(true);

    const handleViewButton = (roomNumber, sharingType) => {
        navigate('/persons', {
            state: { roomNumber, sharingType }
        });
    };

    const getDataFromBackend = async () => {
        try {
            const response = await axios.get(`${publicMongoUrl}/hostelRooms`, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("authToken")}`
                }
            });
            setData(response.data.data);
        } catch (error) {
            console.log(error.response?.data?.message);
            setError({
                general: "Data fetch failed. Please try again.",
                backEndError: error.response?.data?.message
            });
        }
    };

    const deleteRoom = async (index) => {
        const id = data[index]._id;
        console.log(id);
        try {
            // Corrected URL with '/hostelRoom/' in front of the id
            await axios.delete(`${publicMongoUrl}/hostelRoom/${id}`, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("authToken")}`
                }
            });
            // After successful deletion, refresh the data
            getDataFromBackend();
        } catch (error) {
            console.log(error.response?.data?.message);
            setError({
                general: "Delete failed. Please try again.",
                backEndError: error.response?.data?.message
            });
        }
    };
    

    useEffect(() => {
        getDataFromBackend();
    }, []);

    const handleLogoutButton = () => {
        localStorage.removeItem("authToken");
        navigate("/login");
    };

    return (
        <div className='min-h-screen bg-gray-50'>
            {errors.backEndError && (
                <p className='text-red-500 text-center text-lg mt-4'>{errors.backEndError}</p>
            )}

            {/* Header */}
            <div className='flex justify-between items-center px-4 sm:px-10 lg:px-20 py-6 bg-white shadow'>
                <h1 className='text-3xl font-bold'>Welcome to Hostel Manager</h1>
                <button className='px-5 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition' onClick={handleLogoutButton}>
                    Logout
                </button>
            </div>

            {/* Room Form */}
            {showRoomForm && (
                <RoomForm
                    getDataFromBackend={getDataFromBackend}
                    setShowRoomForm={setShowRoomForm}
                    data={data}
                    setData={setData}
                    editIndex={editIndex}
                    setEditIndex={setEditIndex}
                    errors={errors}
                    setError={setError}
                />
            )}

            {/* Room Table Header */}
            <div className='flex justify-between items-center px-4 sm:px-10 lg:px-20 py-6'>
                <h2 className='text-2xl font-semibold'>Rooms</h2>
                <button
                    className='px-6 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition'
                    onClick={handleAddRoomButton}
                >
                    Add New Room
                </button>
            </div>

            {/* Table */}
            <div className='px-4 sm:px-10 lg:px-20 pb-10 overflow-x-auto'>
                <table className='min-w-full border border-collapse bg-white shadow rounded'>
                    <thead className='bg-gray-100'>
                        <tr>
                            <th className='border px-6 py-3 text-left'>S.No</th>
                            <th className='border px-6 py-3 text-left'>Room Number</th>
                            <th className='border px-6 py-3 text-left'>Sharing Type</th>
                            <th className='border px-6 py-3 text-left'>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {data.map((room, index) => (
                            <tr key={room._id} className='text-sm'>
                                <td className='border px-6 py-2'>{index + 1}</td>
                                <td className='border px-6 py-2'>{room.RoomNumber}</td>
                                <td className='border px-6 py-2'>{room.SharingType} Sharing</td>
                                <td className='border px-6 py-2'>
                                    <div className='flex flex-wrap gap-2'>
                                        <button
                                            className='bg-cyan-500 text-white px-4 py-1 rounded hover:bg-cyan-600 transition'
                                            onClick={() => handleViewButton(room.RoomNumber, room.SharingType)}
                                        >
                                            View
                                        </button>
                                        <button
                                            className='bg-blue-600 text-white px-4 py-1 rounded hover:bg-blue-700 transition'
                                            onClick={() => {
                                                setEditIndex(index);
                                                setShowRoomForm(true);
                                            }}
                                        >
                                            Update
                                        </button>
                                        <button
                                            className='bg-red-600 text-white px-4 py-1 rounded hover:bg-red-700 transition'
                                            onClick={() => deleteRoom(index)}
                                        >
                                            Delete
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                        {data.length === 0 && (
                            <tr>
                                <td colSpan="4" className='text-center py-6 text-gray-500'>
                                    No rooms found.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default Rooms;
