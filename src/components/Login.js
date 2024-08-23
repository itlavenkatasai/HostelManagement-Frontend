import { useState } from "react";
import { checkValidateLoginForm } from "../utils/Validate";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";

const Login = () => {
    const navigate = useNavigate();
    const [loginFields, setLoginFields] = useState({
        PhoneNumber: "",
        Password: ""
    })
    const env = 'PROD';
    const publicMongoUrl = env === 'PROD' ? 'https://hostelmanagement-backend.onrender.com' : 'http://localhost:3000';
    const [errors, setError] = useState({});
    const handleButtonLogin = async () => {
        const error = checkValidateLoginForm(loginFields.PhoneNumber, loginFields.Password);
        if (Object.keys(error).length > 0) {
            setError(error);
            return;
        }
        try {
            const response = await axios.post(`${publicMongoUrl}/login`, loginFields);
            console.log(response);
            const token = response.data.data;
            localStorage.setItem("authToken", token);
            setLoginFields({
                PhoneNumber: "",
                Password: ""
            })
            setError({})
            navigate("/rooms");

        } catch (error) {

            const responseError = error;
            console.log(responseError.response.data.message);
            setError({ genral: "Registration failed. Please try again.",
        backEndError : responseError.response.data.message });
        }

    }
    return (
        <div className="mx-auto right-0 left-0  w-5/12 space-y-4">
            <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
                <p className="text-4xl py-4 text-center font-bold">Login</p>
                <input
                    type="number"
                    placeholder="PhoneNumber"
                    className="block w-full px-4 py-2 border border-gray-500 rounded placeholder-gray-500 shadow-blue-400"
                    onChange={(e) => {
                        setLoginFields({
                            ...loginFields,
                            PhoneNumber: e.target.value
                        })
                    }}
                />
                {errors.phoneNumber && <p className="text-red-600 px-3">{errors.phoneNumber}</p>}
                <input
                    type="password"
                    placeholder="Password"
                    className="block w-full px-4 py-2 border border-gray-500 rounded placeholder-gray-500 shadow-blue-400"
                    onChange={(e) => {
                        setLoginFields({
                            ...loginFields,
                            Password: e.target.value
                        })
                    }}
                />
                {errors.password && <p className="text-red-600 px-3">{errors.password}</p>}
                {errors.backEndError && <p className="text-red-600">{errors.backEndError}</p>}
                <button className="block w-full px-6 py-2 bg-blue-600 text-white rounded" onClick={handleButtonLogin}>
                    Submit
                </button>
            </form>
            <p className="text-center">
                 Don't have an account?
                
                <Link to='/register' className="text-blue-600 underline"> Register Here</Link>
            </p>
            <p className="text-center">
                Back to
                <Link to='/' className="text-blue-600 underline"> Home</Link>
            </p>
        </div>
    );
};

export default Login;