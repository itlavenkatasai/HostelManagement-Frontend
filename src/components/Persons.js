import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import PersonsForm from './PersonsForm';

const Persons = () => {
    const location = useLocation();
    const roomNumber = location.state.roomNumber;
    const sharingType = location.state.sharingType;

    const [editIndex, setEditIndex] = useState(-1);
    const [personForm, setPersonForm] = useState(false);
    const [personData, setPersonData] = useState([]);
    const [errors, setError] = useState({});
    const navigate = useNavigate();

    const env = 'DEV';
    const publicMongoUrl = env === 'PROD' ? 'https://hostelmanagement-backend.onrender.com' : 'http://localhost:3000';

    const handleBackButton = () => navigate('/rooms');

    const deletePerson = async (index) => {
        const id = personData[index]._id;
        console.log(id);
        try {
            await axios.delete(`${publicMongoUrl}/hostelRoomPerson/${id}`, {
                headers: { Authorization: `Bearer ${localStorage.getItem("authToken")}` }
            });
    
            // Remove from local state
            setPersonData((prevData) => prevData.filter((_, i) => i !== index));
    
            // Optionally: re-fetch from backend to confirm sync
            // await getPersonsFromBackend();
        } catch (error) {
            setError({
                general: "Deletion failed. Please try again.",
                backEndError: error.response?.data?.message
            });
        }
    };
    

    const getPersonsFromBackend = async () => {
        try {
            const response = await axios.get(`${publicMongoUrl}/hostelRoomPersons/${roomNumber}`, {
                headers: { Authorization: `Bearer ${localStorage.getItem("authToken")}` },
                params: { RoomNumber: roomNumber }
            });
            setPersonData(response.data.data);
        } catch (error) {
            setError({
                general: "Fetching failed. Please try again.",
                backEndError: error.response?.data?.message
            });
        }
    };

    useEffect(() => {
        getPersonsFromBackend();
    }, []);

    // Handle persons limit exceeded error
    const handleAddPerson = () => {
        if (personData.length < sharingType) {
            setPersonForm(true);
        } else {
            setError({ personsLimit: "Persons limit exceeded in this room" });

            // Remove the error message after 2 seconds
            setTimeout(() => {
                setError((prevErrors) => ({ ...prevErrors, personsLimit: '' }));
            }, 3000);
        }
    };

    return (
        <div className="p-4 md:px-12">
            <div className="flex justify-between items-center mb-4">
                <button onClick={handleBackButton} className="bg-cyan-500 hover:bg-cyan-600 text-white px-4 py-2 rounded">
                    ← Back to Rooms
                </button>
                <button
                    className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded"
                    onClick={handleAddPerson}
                >
                    Add Person
                </button>
            </div>

            <h2 className="text-2xl font-semibold mb-6 text-center">{roomNumber} Room - Person List</h2>

            {errors.backEndError && <p className="text-red-600 text-center mb-2">{errors.backEndError}</p>}
            {errors.personsLimit && <p className="text-red-600 text-center mb-2">{errors.personsLimit}</p>}

            {personForm && (
                <PersonsForm
                    setPersonForm={setPersonForm}
                    roomNumber={roomNumber}
                    getPersonsFromBackend={getPersonsFromBackend}
                    personData={personData}
                    editIndex={editIndex}
                    setEditIndex={setEditIndex}
                    errors={errors}
                    setError={setError}
                    sharingType={sharingType}
                />
            )}

            <div className="overflow-x-auto mt-6">
                <table className="min-w-full bg-white shadow-md rounded-xl border border-gray-200">
                    <thead className="bg-gray-100">
                        <tr>
                            <th className="py-3 px-6 border-b">SNo</th>
                            <th className="py-3 px-6 border-b">Name</th>
                            <th className="py-3 px-6 border-b">Phone Number</th>
                            <th className="py-3 px-6 border-b">Date Of Joining</th>
                            <th className="py-3 px-6 border-b">Amount per Month</th>
                            <th className="py-3 px-6 border-b">Paid</th>
                            <th className="py-3 px-6 border-b">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {personData.map((person, index) => (
                            <tr key={person._id} className="text-center">
                                <td className="py-3 px-4 border-t">{index + 1}</td>
                                <td className="py-3 px-4 border-t">{person.Name}</td>
                                <td className="py-3 px-4 border-t">{person.PhoneNumber}</td>
                                <td className="py-3 px-4 border-t">
                                    {new Date(person.DateOfJoining).toISOString().split('T')[0]}
                                </td>
                                <td className="py-3 px-4 border-t">{person.AmountPerMonth}</td>
                                <td className="py-3 px-4 border-t">
                                    {person.Paid ? 'Yes' : 'No'}
                                </td>
                                <td className="py-3 px-4 border-t space-x-2">
                                    <button
                                        className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded"
                                        onClick={() => {
                                            setEditIndex(index);
                                            setPersonForm(true);
                                        }}
                                    >
                                        Update
                                    </button>
                                    <button
                                        className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded"
                                        onClick={() => deletePerson(index)}
                                    >
                                        Delete
                                    </button>
                                </td>
                            </tr>
                        ))}
                        {personData.length === 0 && (
                            <tr>
                                <td colSpan="7" className="py-5 text-center text-gray-500">No persons assigned to this room.</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default Persons;
