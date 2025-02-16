import React from 'react';
import { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import Button from 'react-bootstrap/Button';
import ReactDOM from 'react-dom/client';
import { useNavigate } from 'react-router-dom';
import { LOGIN_REQUEST, PUBLIC_CLIENT_APPLICATION, TOKEN_REQUEST } from '../AzureAd/msalConfig.js';
function Signin()
{
  const navigate = useNavigate();
  const [token, setToken] = useState(null);
  const [interactionInProgress, setInteractionInProgress] = useState(false);
 
  const handleClick = async () => {
    const loginResponse = await PUBLIC_CLIENT_APPLICATION.loginPopup(LOGIN_REQUEST);
     if (loginResponse.account) {
       PUBLIC_CLIENT_APPLICATION.setActiveAccount(loginResponse.account);
       console.log('account authenticated' + loginResponse.account)
       navigate('/tasks'); 
     }
     const tokenResponse = await PUBLIC_CLIENT_APPLICATION.acquireTokenSilent(TOKEN_REQUEST);
     console.log('token' + tokenResponse.accessToken)
     setToken(tokenResponse.accessToken);
   };
   
 
  return (
    <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center',
        height: '100vh'
      }}>
        <Button variant="primary" size="lg" 
         style={{ padding: '15px 40px' }}
         onClick={handleClick} >
          Sign in
        </Button>
      </div>
    );
}
export default Signin;