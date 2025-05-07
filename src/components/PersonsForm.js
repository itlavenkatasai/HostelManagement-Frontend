import React, { useState, useEffect } from 'react';
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
    sharingType,
}) => {
    const initialForm = {
        Name: '',
        PhoneNumber: '',
        DateOfJoining: '',
        Photo: '', // Photo as empty string
        AmountPerMonth: '',
        Paid: false,
    };

    const [personFormFields, setPersonFormFields] = useState(initialForm);

    const env = 'DEV';
    const publicMongoUrl =
        env === 'PROD' ? 'https://hostelmanagement-backend.onrender.com' : 'http://localhost:3000';

    useEffect(() => {
        if (editIndex > -1 && personData[editIndex]) {
            setPersonFormFields(personData[editIndex]);
        } else {
            setPersonFormFields(initialForm);
        }
    }, [editIndex, personData]);

    const handleSubmitButton = async (e) => {
        e.preventDefault();

        const error = checkValidatePersonForm(
            personFormFields.Name,
            personFormFields.PhoneNumber,
            personFormFields.DateOfJoining
        );

        if (Object.keys(error).length > 0) {
            setError(error);
            return;
        }

        try {
            const payload = {
                Name: personFormFields.Name,
                PhoneNumber: personFormFields.PhoneNumber,
                DateOfJoining: personFormFields.DateOfJoining,
                AmountPerMonth: personFormFields.AmountPerMonth,
                Paid: personFormFields.Paid,
                Photo: '', // No image uploading
            };

            const headers = {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${localStorage.getItem('authToken')}`,
            };

            let response;
            if (editIndex === -1) {
                response = await axios.post(`${publicMongoUrl}/hostelRoomPerson/${roomNumber}`, payload, { headers });
            } else {
                const id = personData[editIndex]._id;
                response = await axios.patch(`${publicMongoUrl}/hostelRoomPerson/${id}`, payload, { headers });
            }

            console.log(response.data);

            getPersonsFromBackend();
            setPersonForm(false);
            setEditIndex(-1);
            setPersonFormFields(initialForm);
            setError({});
        } catch (error) {
            console.log(error.response?.data?.message);
            setError({
                general: 'Operation failed. Please try again.',
                backEndError: error.response?.data?.message,
            });
        }
    };

    return (
        <div className="w-full flex justify-center items-center py-6 px-4">
            <form
                className="w-full max-w-xl bg-white shadow-lg rounded-xl p-6 space-y-4"
                onSubmit={handleSubmitButton}
            >
                <h2 className="text-2xl font-bold text-center mb-6 text-gray-700">
                    {editIndex === -1 ? 'Add Person' : 'Update Person'}
                </h2>

                <div>
                    <input
                        type="text"
                        placeholder="Name"
                        className="w-full px-4 py-2 border border-gray-300 rounded"
                        value={personFormFields.Name}
                        onChange={(e) => setPersonFormFields({ ...personFormFields, Name: e.target.value })}
                    />
                    {errors.Name && <p className="text-red-600 text-sm mt-1">{errors.Name}</p>}
                </div>

                <div>
                    <input
                        type="number"
                        placeholder="Phone Number"
                        className="w-full px-4 py-2 border border-gray-300 rounded"
                        value={personFormFields.PhoneNumber}
                        onChange={(e) =>
                            setPersonFormFields({ ...personFormFields, PhoneNumber: e.target.value })
                        }
                    />
                    {errors.PhoneNumber && <p className="text-red-600 text-sm mt-1">{errors.PhoneNumber}</p>}
                </div>

                <div>
                    <input
                        type="date"
                        className="w-full px-4 py-2 border border-gray-300 rounded"
                        value={personFormFields.DateOfJoining}
                        onChange={(e) =>
                            setPersonFormFields({ ...personFormFields, DateOfJoining: e.target.value })
                        }
                    />
                    {errors.DateOfJoining && (
                        <p className="text-red-600 text-sm mt-1">{errors.DateOfJoining}</p>
                    )}
                </div>

                <div>
                    <input
                        type="number"
                        placeholder="Amount per Month"
                        className="w-full px-4 py-2 border border-gray-300 rounded"
                        value={personFormFields.AmountPerMonth}
                        onChange={(e) =>
                            setPersonFormFields({ ...personFormFields, AmountPerMonth: e.target.value })
                        }
                    />
                    {errors.AmountPerMonth && (
                        <p className="text-red-600 text-sm mt-1">{errors.AmountPerMonth}</p>
                    )}
                </div>

                <div>
                    <label className="flex items-center">
                        <input
                            type="checkbox"
                            checked={personFormFields.Paid}
                            onChange={(e) =>
                                setPersonFormFields({ ...personFormFields, Paid: e.target.checked })
                            }
                            className="mr-2"
                        />
                        Paid
                    </label>
                </div>

                <div>
                    <input
                        type="file"
                        disabled
                        className="w-full px-4 py-2 border border-gray-300 rounded opacity-50 cursor-not-allowed"
                    />
                    <p className="text-sm text-gray-500 mt-1">File upload disabled</p>
                </div>

                <div className="flex flex-col md:flex-row md:space-x-3 gap-3">
                    <button
                        type="submit"
                        className="bg-blue-600 hover:bg-blue-700 text-white w-full py-2 rounded"
                    >
                        {editIndex === -1 ? 'Add' : 'Update'}
                    </button>
                    <button
                        type="reset"
                        onClick={() => setPersonFormFields(initialForm)}
                        className="bg-gray-500 hover:bg-gray-600 text-white w-full py-2 rounded"
                    >
                        Reset
                    </button>
                    <button
                        type="button"
                        onClick={() => {
                            setPersonForm(false);
                            setError({});
                            setEditIndex(-1);
                        }}
                        className="bg-red-500 hover:bg-red-600 text-white w-full py-2 rounded"
                    >
                        Close
                    </button>
                </div>
            </form>
        </div>
    );
};

export default PersonsForm;
