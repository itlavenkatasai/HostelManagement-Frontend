import React, { useState } from 'react'
import { checkValidatePersonForm } from '../utils/Validate';
import axios from 'axios';

const PersonsForm = ({
    setPersonForm,
    roomNumber,
    getPersonsFromBackend,
    personData,
    editIndex,
    setEditIndex,
    errors,
    setError,
    sharingType
}) => {

    const formData = editIndex > -1 ? personData[editIndex] : {
        Name: "",
        PhoneNumber: "",
        DateOfJoining: "",
        Photo: "",
    }
    // console.log("formData ::", formData);
    console.log("personData,sharingType",personData.length,sharingType);

    const [personFormFields, setPersonFormFields] = useState(formData);
    const env = 'PROD';
    const publicMongoUrl = env === 'PROD' ? 'https://hostelmanagement-backend.onrender.com' : 'http://localhost:3000';

    const handleSubmitButton = async (e) => {
        e.preventDefault();
        console.log(personFormFields);
        const error = checkValidatePersonForm(personFormFields.Name, personFormFields.PhoneNumber, personFormFields.DateOfJoining);
        console.log("personerror", error);
        if (Object.keys(error).length > 0) {
            setError(error);
            return;
        }
        if (editIndex === -1) {
            try {
                const response = await axios.post(`${publicMongoUrl}/hostelRoomPerson/${roomNumber}`, personFormFields, {
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${localStorage.getItem("authToken")}`
                    }
                });
                console.log(response);
                getPersonsFromBackend();
                setPersonForm(false);
                setPersonFormFields({
                    Name: "",
                    PhoneNumber: "",
                    DateOfJoining: "",
                    Photo: "",
                });
                setError({});
            } catch (error) {
                const responseError = error;
                console.log(responseError.response.data.message);
                setError({
                    genral: "Registration failed. Please try again.",
                    backEndError: responseError.response.data.message
                });
            }
        } else {
            const id = personData[editIndex]._id;
            try {
                await axios.patch(`${publicMongoUrl}/hostelRoomPerson/${id}`, personFormFields, {
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${localStorage.getItem("authToken")}`
                    }
                });
                getPersonsFromBackend();
                setPersonForm(false);
                setPersonFormFields({
                    Name: "",
                    PhoneNumber: "",
                    DateOfJoining: "",
                    Photo: "",
                });
                setEditIndex(-1);
                setError({});
            } catch (error) {
                const responseError = error;
                console.log(responseError.response.data.message);
                setError({
                    genral: "Registration failed. Please try again.",
                    backEndError: responseError.response.data.message
                });
            }
        }
    }
    return (
        <>
        <div>
        <p className='text-center text-3xl pt-3 pb-3'>Person</p>
        <div className='flex justify-center pb-5'>
            <form className='w-9/12'>
                <section></section>
                <div>
                    <input type='text'
                        placeholder='Name'
                        className='block w-full px-4 py-2 mb-4 border border-gray-300 rounded placeholder-gray-500'
                        value={personFormFields.Name}
                        onChange={(e) => {
                            setPersonFormFields({
                                ...personFormFields,
                                Name: e.target.value
                            })
                        }}
                    ></input>
                    {errors.Name && <p className='text-red-600'>{errors.Name}</p>}
                </div>
                <div>
                    <input type='number'
                        placeholder='Phone Number'
                        className='block w-full px-4 py-2 mb-4 border border-gray-300 rounded placeholder-gray-500'
                        value={personFormFields.PhoneNumber}
                        onChange={(e) => {
                            setPersonFormFields({
                                ...personFormFields,
                                PhoneNumber: e.target.value
                            })
                        }}></input>
                    {errors.PhoneNumber && <p className='text-red-600'>{errors.PhoneNumber}</p>}
                </div>
                <div>
                    <input type='date'
                        placeholder='Date of Joining'
                        className='block w-full px-4 py-2 mb-4 border border-gray-300 rounded placeholder-gray-500'
                        value={personFormFields.DateOfJoining}
                        onChange={(e) => {
                            setPersonFormFields({
                                ...personFormFields,
                                DateOfJoining: e.target.value
                            })
                        }}></input>
                    {errors.DateOfJoining && <p className='text-red-600'>{errors.DateOfJoining}</p>}
                </div>
                <div>
                </div>

                <div>
                    <input type='file'
                        placeholder='Photo'
                        alt='image'
                        className='block w-full px-4 py-2 mb-4 border border-gray-300 rounded placeholder-gray-500'
                        value={personFormFields.Photo}
                        onChange={(e) => {
                            setPersonFormFields({
                                ...personFormFields,
                                Photo: e.target.value
                            })
                        }}></input>
                </div>
                <div className='flex justify-between space-x-2 '>
                    <input type='submit' value='Submit' className='bg-blue-600 rounded text-white w-full py-3' onClick={handleSubmitButton}></input>
                    <input type='reset' value='Reset' className='bg-gray-500 text-white w-full py-3 rounded'></input>
                    <button className='bg-green-400 px-10 rounded' onClick={() => {
                        setPersonForm(false);
                        setError({});
                    }}>Close</button>
                </div>
            </form>
        </div>

    </div> 
        </>
        
    )
}

export default PersonsForm
