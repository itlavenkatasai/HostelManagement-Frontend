import React, { useState } from 'react';
import { checkValidateRegisterForm } from "../utils/Validate";
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';

const Register = () => {
    const navigate = useNavigate();
    const [registerFields, setRegisterFields] = useState({
        Name: "",
        PhoneNumber: "",
        Password: ""
    });
    const env = 'PROD';
    const publicMongoUrl = env === 'PROD' ? 'https://hostelmanagement-backend.onrender.com' : 'http://localhost:3000';
    const [errors, setError] = useState({});
    // const name = useRef(null);
    // const phoneNumber = useRef(null);
    // const password = useRef(null);
    const handleButtonRegister = async () => {
        const error = checkValidateRegisterForm(registerFields.Name, registerFields.PhoneNumber, registerFields.Password);
        if (Object.keys(error).length > 0) {
            setError(error);
            return;
        }
        try {
            const response = await axios.post(`${publicMongoUrl}/register`, registerFields);
            console.log(response);
            setRegisterFields({
                Name: "",
                PhoneNumber: "",
                Password: ""
            })
            setError({});
            navigate('/login');

        } catch (error) {
            const responseError = error;
            console.log(responseError.response.data.message);
            setError({
                genral: "Registration failed. Please try again.",
                backEndError: responseError.response.data.message
            });
        }

    }
    console.log(errors);
    return (
        <div className="mx-auto right-0 left-0  w-5/12 space-y-4">
            <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
                <p className="text-4xl py-4 text-center font-bold">Register</p>
                
                <input
                    
                    type="text"
                    placeholder="Name"
                    className="block w-full px-4 py-2 border border-gray-500 rounded placeholder-gray-500 shadow-blue-400"
                    onChange={(e) => {
                        setRegisterFields({
                            ...registerFields,
                            Name: e.target.value
                        })
                    }}
                />
                {errors.name && <p className='text-red-600 px-3'>{errors.name}</p>}
                <input
                    
                    type="number"
                    placeholder="PhoneNumber"
                    className="block w-full px-4 py-2 border border-gray-500 rounded placeholder-gray-500 shadow-blue-400"
                    onChange={(e) => {
                        setRegisterFields({
                            ...registerFields,
                            PhoneNumber: e.target.value
                        })
                    }}
                />
                {errors.phoneNumber && <p className='text-red-600 px-3'>{errors.phoneNumber}</p>}
                <input
                    
                    type="password"
                    placeholder="Password"
                    className="block w-full px-4 py-2 border border-gray-500 rounded placeholder-gray-500 shadow-blue-400"
                    onChange={(e) => {
                        setRegisterFields({
                            ...registerFields,
                            Password: e.target.value
                        })
                    }}
                />
                {errors.password && <p className='text-red-600 px-3'>{errors.password}</p>}
                {errors.backEndError && <p className='text-red-600 text-center'>{errors.backEndError}</p>}
                <button className="block w-full px-6 py-2 bg-blue-600 text-white rounded" onClick={handleButtonRegister}>
                    Submit
                </button>
            </form>
            <p className='text-center'>
                Don't have an account? Please   
                <Link to='/login' className='text-blue-600 underline'> Login Here</Link>
            </p>
            <p className='text-center'>
                Back to

                <Link to='/' className='text-blue-600 underline'> Home</Link>
            </p>
        </div>
    )
}

export default Register
