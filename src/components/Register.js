import React, { useState } from 'react';
import { checkValidateRegisterForm } from "../utils/Validate";
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import bgImage from '../images/hostel.jpg';

const Register = () => {
    const navigate = useNavigate();
    const [registerFields, setRegisterFields] = useState({
        Name: "",
        PhoneNumber: "",
        Password: ""
    });

    const [errors, setError] = useState({});
    const [isLoading, setIsLoading] = useState(false);
    const env = 'DEV';
    const publicMongoUrl = env === 'PROD' ? 'https://hostelmanagement-backend.onrender.com' : 'http://localhost:3000';

    const handleButtonRegister = async () => {
        const error = checkValidateRegisterForm(registerFields.Name, registerFields.PhoneNumber, registerFields.Password);
        if (Object.keys(error).length > 0) {
            setError(error);
            return;
        }

        setIsLoading(true);

        try {
            const response = await axios.post(`${publicMongoUrl}/register`, registerFields);
            console.log(response);
            setRegisterFields({ Name: "", PhoneNumber: "", Password: "" });
            setError({});
            navigate('/login');
        } catch (error) {
            const responseError = error;
            console.log(responseError.response?.data?.message);
            setError({
                general: "Registration failed. Please try again.",
                backEndError: responseError.response?.data?.message
            });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div
            className="flex items-center justify-center min-h-screen bg-cover bg-center px-4"
            style={{ backgroundImage: `url(${bgImage})` }}
        >
            <div className="bg-white bg-opacity-90 rounded-xl p-6 sm:p-8 lg:p-10 shadow-2xl w-11/12 sm:w-3/4 md:w-1/2 lg:w-1/3 space-y-4">
                <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
                    <p className="text-2xl sm:text-3xl lg:text-4xl py-4 text-center font-bold">Register</p>

                    <input
                        type="text"
                        placeholder="Name"
                        className="block w-full px-4 py-2 border border-gray-400 rounded placeholder-gray-500 shadow focus:outline-none focus:ring focus:border-blue-500"
                        value={registerFields.Name}
                        onChange={(e) => setRegisterFields({ ...registerFields, Name: e.target.value })}
                    />
                    {errors.name && <p className='text-red-600 text-sm px-3'>{errors.name}</p>}

                    <input
                        type="number"
                        placeholder="Phone Number"
                        className="block w-full px-4 py-2 border border-gray-400 rounded placeholder-gray-500 shadow focus:outline-none focus:ring focus:border-blue-500"
                        value={registerFields.PhoneNumber}
                        onChange={(e) => setRegisterFields({ ...registerFields, PhoneNumber: e.target.value })}
                    />
                    {errors.phoneNumber && <p className='text-red-600 text-sm px-3'>{errors.phoneNumber}</p>}

                    <input
                        type="password"
                        placeholder="Password"
                        className="block w-full px-4 py-2 border border-gray-400 rounded placeholder-gray-500 shadow focus:outline-none focus:ring focus:border-blue-500"
                        value={registerFields.Password}
                        onChange={(e) => setRegisterFields({ ...registerFields, Password: e.target.value })}
                    />
                    {errors.password && <p className='text-red-600 text-sm px-3'>{errors.password}</p>}
                    {errors.backEndError && <p className='text-red-600 text-center text-sm'>{errors.backEndError}</p>}

                    <button
                        className="block w-full px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md font-semibold flex justify-center items-center transition duration-300 disabled:opacity-50"
                        onClick={handleButtonRegister}
                        disabled={isLoading}
                    >
                        {isLoading ? (
                            <>
                                <svg className="animate-spin h-5 w-5 mr-2 text-white" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
                                </svg>
                                Submitting...
                            </>
                        ) : (
                            'Register'
                        )}
                    </button>
                </form>

                <div className='text-center mt-6 space-y-2'>
                    <p>
                        Already have an account?
                        <Link to='/login' className='text-blue-600 underline ml-1'>Login Here</Link>
                    </p>
                    <p>
                        Back to
                        <Link to='/' className='text-blue-600 underline ml-1'>Home</Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Register;
