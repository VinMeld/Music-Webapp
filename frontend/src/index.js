import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import { Provider } from 'react-redux';
import { store } from './app/store';
import reportWebVitals from './reportWebVitals';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { CreateUser } from './components/Register';
import { Login } from './components/Login';
import {FavouriteSongs} from './components/FavouriteSongs';
import {PublicSongs} from './components/PublicSongs';
import {ToastContainer} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Navbar from './components/Navbar';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import {CssBaseline} from "@mui/material";

window.React1 = require('react');
const darkTheme = createTheme({
  palette: {
      mode: 'dark',
  },
  spacing: 8,
});
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
  <ThemeProvider theme={darkTheme}>
  <CssBaseline />

    <Provider store={store}>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Navbar />}>
            <Route path="/" element={<App />}/>
            <Route path="/login" element={<Login />} />
            <Route path="/createuser" element={<CreateUser />} />
            <Route path="/favouritesongs" element={
                <FavouriteSongs />
            } />

            
            <Route path="/songs" element={<PublicSongs />} />
          </Route>
        </Routes>
     </BrowserRouter>
     <ToastContainer />
    </Provider>
  </ThemeProvider>
    </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
