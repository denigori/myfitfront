import React, { useState } from 'react';
import Login from '../components/Login';
import Header from '../components/landingPage/Header';
import { useNavigate } from 'react-router-dom';

const LoginPage = () => {
  const [token, setToken] = useState(null);
  const navigate = useNavigate();

  return (
    <div>
      <Header />
      <Login setToken={setToken} navigate={navigate} />
      {token && <p>Logged in successfully. Token: {token}</p>}
    </div>
  );
};

export default LoginPage;
