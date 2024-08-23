import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import PersonsForm from './PersonsForm';

const Persons = () => {
    const location = useLocation();
    // console.log("locate params :: ", location);
    const roomNumber = location.state.roomNumber;
    const sharingType = location.state.sharingType;
    const [editIndex, setEditIndex] = useState(-1);
    const [personForm, setPersonForm] = useState(false);
    const navigate = useNavigate();
    const [personData, setPersonData] = useState([]);
    // const [errors,setError] = useState({});
    const [errors, setError] = useState({});
    const handleBackButton = () => {
        navigate('/rooms');
    }
    const env = 'PROD';
    const publicMongoUrl = env === 'PROD' ? 'https://hostelmanagement-backend.onrender.com' : 'http://localhost:3000';
  
    // console.log("persondata_length,sharingtype",personData.length,sharingType);
    
    const deletePerson = async (index) => {
        const id = personData[index]._id;
        console.log("id", id);
        try {
            await axios.delete(`${publicMongoUrl}/hostelRoomPerson/${id}`, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("authToken")}`
                }
            });
            getPersonsFromBackend();
        } catch (error) {
            const responseError = error;
            console.log(responseError.response.data.message);
            setError({
                genral: "Registration failed. Please try again.",
                backEndError: responseError.response.data.message
            });
        }
    }

    const getPersonsFromBackend = async () => {
        try {
            const response = await axios.get(`${publicMongoUrl}/hostelRoomPersons/${roomNumber}`, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("authToken")}`,
                },
                params: {
                    RoomNumber: roomNumber
                }
            });
            setPersonData(response.data.data);
            // console.log(response.data);
        } catch (error) {
            const responseError = error;
            console.log(responseError.response.data.message);
            setError({
                genral: "Registration failed. Please try again.",
                backEndError: responseError.response.data.message
            });
        }
    }

    useEffect(() => {
        getPersonsFromBackend();
    }, []);

    return (
        <div>
            
            <div className='ml-44 mt-10'>
                <button className='bg-cyan-400 px-4 py-2 rounded' onClick={handleBackButton}>Back to Rooms</button>
            </div>
            {errors.backEndError && <p className='text-red-600 text-center text-xl'>{errors.backEndError}</p>}
            {personForm && <PersonsForm setPersonForm={setPersonForm}
                roomNumber={roomNumber}
                getPersonsFromBackend={getPersonsFromBackend}
                personData={personData}
                editIndex={editIndex}
                setEditIndex={setEditIndex}
                errors = {errors}
                setError = {setError}
                sharingType = {sharingType} />}
             {errors.personsLimit && <p className='text-red-600 text-center text-xl'>{errors.personsLimit}</p>}
            <div className='flex justify-between px-32 py-5'>
               
                <p className='text-3xl ml-10'>{roomNumber} Room Number Persons</p>
                <button className='px-7 py-2 bg-green-600 text-white rounded mr-16' onClick={() => { 
                    if(personData.length < sharingType){
                        setPersonForm(true) 
                    }else{
                        setError({
                            personsLimit : "persons limit exceeded in this room"
                        })
                    }
                    
                 }}>Add Person</button>
            </div>
            <div className='flex justify-center py-5'>
                <table className='border border-collapse'>
                    <thead>
                        <tr>
                            <td className='border border-gray-500 px-24 py-3'>SNo</td>
                            <td className='border border-gray-500 px-24 py-3'>Name</td>
                            <td className='border border-gray-500 px-24 py-3'>Phone Number</td>
                            <td className='border border-gray-500 px-24 py-3'>Date Of Joining</td>
                            <td className='border border-gray-500 px-24 py-3'>Actions</td>
                        </tr>
                    </thead>
                    <tbody>
                        {personData.map((person, index) => (
                            <tr key={person.PhoneNumber} className='border text-center'>
                                <td className='border border-gray-300'>{index + 1}</td>
                                <td className='border border-gray-300'>{person.Name}</td>
                                <td className='border border-gray-300'>{person.PhoneNumber}</td>
                                <td className='border border-gray-300'>{person.DateOfJoining}</td>
                                <td className='border border-gray-300'>
                                    <div className='space-x-2 py-2'>
                                        <button className='bg-cyan-400 px-3 py-1 rounded-lg' onClick={() => {
                                            setEditIndex(index);
                                            setPersonForm(true);
                                        }}>Update</button>
                                        <button className='bg-red-600 px-3 py-1 rounded-lg' onClick={() => {

                                            deletePerson(index);
                                        }}>Delete</button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    )
}

export default Persons
