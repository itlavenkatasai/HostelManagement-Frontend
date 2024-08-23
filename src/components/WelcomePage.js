import React from 'react';
import { Link } from 'react-router-dom';

const WelcomePage = () => {
  return (
    <div className='flex items-center justify-center'>
      <div className="mx-auto right-0 left-0 text-center">
        <p className='text-4xl py-10 font-bold'>Welcome to App</p>
        <p>Already having an account?</p>
        <Link to="login"><button className="mt-2 px-4 py-2 bg-blue-600 text-white rounded">Login Here</button></Link>
        <p className='py-4'>OR</p>
        <p className='py-2'>New to our app?</p>
        <Link to="register"><button className="mt-2 px-5 py-2 bg-cyan-400 text-black rounded" >Register Here</button></Link>
      </div>
    </div>
  )
  }
export default WelcomePage; 