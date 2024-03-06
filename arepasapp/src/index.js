import React from 'react';
import ReactDOM from 'react-dom/client';
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import './index.css';
import App from './App';
import User from './/pages/user.js';
import Shopping from './/pages/shoppingCart.js';
import Payment from './/pages/payment.js';
import Contact from './/pages/contactenos.js';
import Register from './/pages/register.js';
import store from './store';
import reportWebVitals from './reportWebVitals';
import { Provider } from 'react-redux';

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
  },
  {
    path: "shopping_cart",
    element: <Shopping />,
  },
  {
    path: "payment",
    element: <Payment />,
  },
  {
    path: "user",
    element: <User />,
  },
  {
    path: "register",
    element: <Register />,
  },
  {
    path: "contactenos",
    element: <Contact />,
  }
]);
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <Provider store={store}>
      <RouterProvider router={router}>
        <App />
      </RouterProvider>
    </Provider>
  </React.StrictMode>,
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();