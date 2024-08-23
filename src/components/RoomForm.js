import axios from 'axios';
import React, { useState } from "react";
import { checkValidateRoomForm } from "../utils/Validate";

const RoomForm = (props) => {
    const { getDataFromBackend, setShowRoomForm, editIndex, data, setEditIndex, errors, setError } = props;
    const formData = editIndex > -1 ? data[editIndex] : {
        RoomNumber: '',
        SharingType: ''
    }
    const [roomFormFields, setRoomFormFields] = useState(formData)

    const env = 'PROD';
    const publicMongoUrl = env === 'PROD' ? 'https://hostelmanagement-backend.onrender.com' : 'http://localhost:3000';
    const sharingTypes = [1, 2, 3, 4, 5, 6]
    const handleSubmitButton = async () => {
        const error = checkValidateRoomForm(roomFormFields.RoomNumber, roomFormFields.SharingType);
        if (Object.keys(error).length > 0) {
            setError(error);
            return;
        }
        console.log(roomFormFields);
        if (editIndex === -1) {
            try {
                await axios.post(`${publicMongoUrl}/hostelRoom`, roomFormFields, {
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${localStorage.getItem("authToken")}`
                    }
                });
                setShowRoomForm(false);
                setRoomFormFields({});
                setError({});
                getDataFromBackend();
                // console.log(response);

            } catch (error) {
                const responseError = error;
                console.log(responseError.response.data.message);
                setError({
                    genral: "Registration failed. Please try again.",
                    backEndError: responseError.response.data.message
                });
            }
        } else {
            const id = data[editIndex]._id;
            console.log(id);
            try {
                await axios.patch(`${publicMongoUrl}/hostelRoom/${id}`, roomFormFields, {
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${localStorage.getItem("authToken")}`
                    }
                })
                setShowRoomForm(false);
                setRoomFormFields({});
                setError({});
                getDataFromBackend();
                setEditIndex(-1);
            } catch (error) {
                const responseError = error;
                console.log(responseError.response.data.message);
                setError({
                    genral: "Registration failed. Please try again.",
                    backEndError: responseError.response.data.message
                });
            }
        }
    };

    return (
        <div className=' mx-auto right-0 left-0 py-10 space-y-3'>
            <p className='text-2xl font-bold text-center'>Room</p>
            <form onSubmit={(e) => e.preventDefault()} className='w-4/12 mx-auto right-0 left-0 space-y-6'>
                <input
                    value={roomFormFields.RoomNumber}
                    type='text'
                    placeholder='Room Number'
                    className='block w-full px-4 py-2 mb-4 border border-gray-300 rounded placeholder-gray-500'
                    onChange={(e) => {
                        setRoomFormFields({
                            ...roomFormFields,
                            RoomNumber: e.target.value
                        })
                    }}
                />
                {errors.RoomNumber && <p className='text-red-600'>{errors.RoomNumber}</p>}
                <select
                    value={roomFormFields.SharingType}
                    onChange={(e) => {
                        console.log("result >> ", e.target.value);
                        setRoomFormFields({
                            ...roomFormFields,
                            SharingType: e.target.value
                        })
                    }}
                    name="roomtypes"
                    id="rooms"
                    className='block w-full px-4 py-3 mb-4 border border-gray-300 rounded'
                >
                    <option value="" disabled selected>Sharing Type</option>
                    {
                        sharingTypes.map((o, ind) => {
                            return <option key={"ind_" + ind} value={o}> {o} sharing </option>
                        })
                    }
                </select>
                {errors.SharingType && <p className='text-red-600'>{errors.SharingType}</p>}
                {/* {errors.backEndError && <p className='text-red-600'> {errors.backEndError}</p>} */}
                <div className='flex justify-between space-x-1'>
                    <button
                        type='submit'
                        className='px-20 py-2 bg-blue-600 text-white rounded'
                        onClick={handleSubmitButton}
                    >
                        Submit
                    </button>
                    <button
                        type='reset'
                        className='px-20 py-2 bg-gray-500 text-white rounded'
                        onClick={() => {
                            setRoomFormFields({
                                RoomNumber: '',
                                SharingType: ''
                            });
                            setError({});
                        }}
                    >
                        Reset
                    </button>
                    <button className='bg-green-500 rounded px-4' onClick={() => {
                        setRoomFormFields({});
                        setEditIndex(-1);
                        setShowRoomForm(false);
                        setError({});

                    }}>Close</button>
                </div>
            </form>
        </div>
    )
}

export default RoomForm;