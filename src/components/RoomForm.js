import axios from 'axios';
import React, { useState } from "react";
import { checkValidateRoomForm } from "../utils/Validate";

const RoomForm = (props) => {
    const { getDataFromBackend, setShowRoomForm, editIndex, data, setEditIndex, errors, setError } = props;

    const formData = editIndex > -1 ? data[editIndex] : {
        RoomNumber: '',
        SharingType: ''
    };
    const [roomFormFields, setRoomFormFields] = useState(formData);

    const env = 'DEV';
    const publicMongoUrl = env === 'PROD' ? 'https://hostelmanagement-backend.onrender.com' : 'http://localhost:3000';
    const sharingTypes = [1, 2, 3, 4, 5, 6];

    const handleSubmitButton = async () => {
        const error = checkValidateRoomForm(roomFormFields.RoomNumber, roomFormFields.SharingType);
        if (Object.keys(error).length > 0) {
            setError(error);
            return;
        }

        try {
            if (editIndex === -1) {
                await axios.post(`${publicMongoUrl}/hostelRoom`, roomFormFields, {
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${localStorage.getItem("authToken")}`
                    }
                });
            } else {
                const id = data[editIndex]._id;
                await axios.patch(`${publicMongoUrl}/hostelRoom/${id}`, roomFormFields, {
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${localStorage.getItem("authToken")}`
                    }
                });
            }

            setShowRoomForm(false);
            setRoomFormFields({ RoomNumber: '', SharingType: '' });
            setError({});
            getDataFromBackend();
            setEditIndex(-1);
        } catch (error) {
            console.log(error.response?.data?.message);
            setError({
                general: "Failed to submit. Please try again.",
                backEndError: error.response?.data?.message
            });
        }
    };

    return (
        <div className='flex justify-center py-10 px-4 sm:px-6'>
            <div className='bg-white p-6 sm:p-8 shadow-2xl rounded-lg w-full max-w-md space-y-6'>
                <p className='text-2xl font-bold text-center'>Room</p>

                <form onSubmit={(e) => e.preventDefault()} className='space-y-4'>

                    <input
                        value={roomFormFields.RoomNumber}
                        type='text'
                        placeholder='Room Number'
                        className='w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500'
                        onChange={(e) => {
                            setRoomFormFields({
                                ...roomFormFields,
                                RoomNumber: e.target.value
                            });
                        }}
                    />
                    {errors.RoomNumber && <p className='text-red-600 text-sm'>{errors.RoomNumber}</p>}

                    <select
                        value={roomFormFields.SharingType}
                        onChange={(e) => {
                            setRoomFormFields({
                                ...roomFormFields,
                                SharingType: e.target.value
                            });
                        }}
                        name="roomtypes"
                        className='w-full px-4 py-2 border border-gray-300 rounded-md bg-white focus:outline-none focus:ring-2 focus:ring-blue-500'
                    >
                        <option value="">Select Sharing Type</option>
                        {sharingTypes.map((type) => (
                            <option key={type} value={type}>{type} Sharing</option>
                        ))}
                    </select>
                    {errors.SharingType && <p className='text-red-600 text-sm'>{errors.SharingType}</p>}
                    {errors.backEndError && <p className='text-red-600 text-sm text-center'>{errors.backEndError}</p>}

                    <div className='flex flex-wrap justify-between gap-2 pt-2'>
                        <button
                            type='submit'
                            className='flex-1 px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition'
                            onClick={handleSubmitButton}
                        >
                            Submit
                        </button>
                        <button
                            type='reset'
                            className='flex-1 px-6 py-2 bg-gray-500 text-white rounded hover:bg-gray-600 transition'
                            onClick={() => {
                                setRoomFormFields({ RoomNumber: '', SharingType: '' });
                                setError({});
                            }}
                        >
                            Reset
                        </button>
                        <button
                            type='button'
                            className='px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition'
                            onClick={() => {
                                setRoomFormFields({});
                                setEditIndex(-1);
                                setShowRoomForm(false);
                                setError({});
                            }}
                        >
                            Close
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default RoomForm;
