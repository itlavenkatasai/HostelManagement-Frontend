import React  from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import WelcomePage from './components/WelcomePage';
import "./App";
import { Outlet, RouterProvider, createBrowserRouter } from 'react-router-dom';
import Login from './components/Login';
import Register from './components/Register';
import Rooms from './components/Rooms';
import Persons from './components/Persons';

const AppLayOut = () => {
  return (
    <Outlet />
  )
}
const appRouter = createBrowserRouter([
  {
    path: '/',
    element: <AppLayOut />,
    children: [
      {
        path: '/',
        element: <WelcomePage />
      },
      {
        path: '/login',
        element: <Login />
      },
      {
        path: '/register',
        element: <Register />
      },
      {
        path: '/rooms',
        element: <Rooms />
      },
      {
        path: '/persons',
        element: <Persons />
      }
    ]
  }
]);

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <RouterProvider router={appRouter} />
  </React.StrictMode>
);


