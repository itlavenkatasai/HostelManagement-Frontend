import React from 'react';
import { Link } from 'react-router-dom';
import bgImage from '../images/hostel.jpg';

const WelcomePage = () => {
  return (
    <div
      className="flex items-center justify-center min-h-screen bg-cover bg-center px-4"
      style={{ backgroundImage: `url(${bgImage})` }}
    >
      <div className="bg-white bg-opacity-90 rounded-xl p-6 sm:p-10 shadow-2xl w-full max-w-md text-center">
        <p className="text-2xl sm:text-3xl md:text-4xl font-bold py-6">
          Welcome to Hostel Management Application
        </p>

        <p className="text-base sm:text-lg">Already have an account?</p>
        <Link to="login">
          <button className="mt-3 w-full py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded transition duration-300">
            Login Here
          </button>
        </Link>

        <p className="py-4 text-gray-600 font-medium">OR</p>

        <p className="text-base sm:text-lg">New to our app?</p>
        <Link to="register">
          <button className="mt-3 w-full py-2 bg-cyan-400 hover:bg-cyan-500 text-black font-semibold rounded transition duration-300">
            Register Here
          </button>
        </Link>
      </div>
    </div>
  );
};

export default WelcomePage;
