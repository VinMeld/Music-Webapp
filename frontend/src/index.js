import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import { Provider } from 'react-redux';
import { store } from './app/store';
import reportWebVitals from './reportWebVitals';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { CreateUser } from './components/CreateUser';
import { Login } from './components/Login';
import {UserGrid} from './components/UserGrid';
import {CommunityGrid} from './components/CommunityGrid';
import {ToastContainer} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Navbar from './components/Navbar';
window.React1 = require('react');

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <Provider store={store}>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Navbar />}>
            <Route path="/" element={<App />}/>
            <Route path="/login" element={<Login />} />
            <Route path="/createuser" element={<CreateUser />} />
            <Route path="/favouritesongs" element={
                <UserGrid />
            } />

            
            <Route path="/songs" element={<CommunityGrid />} />
          </Route>
        </Routes>
     </BrowserRouter>
     <ToastContainer />
    </Provider>
    </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
