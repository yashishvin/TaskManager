import React, { useState, useEffect } from 'react';
import Button from 'react-bootstrap/Button';
import { useNavigate } from 'react-router-dom';
import { LOGIN_REQUEST, PUBLIC_CLIENT_APPLICATION } from '../AzureAd/msalConfig.js';

function Signin() {
    const navigate = useNavigate();
    const [user, setUser] = useState(null);

    // Check if user is already logged in
    useEffect(() => {
        const activeAccount = PUBLIC_CLIENT_APPLICATION.getActiveAccount();
        if (activeAccount) {
            setUser(activeAccount);
        }
    }, []);

    // Handle Sign-In
    const handleSignIn = async () => {
        try {
            const loginResponse = await PUBLIC_CLIENT_APPLICATION.loginPopup(LOGIN_REQUEST);
            if (loginResponse.account) {
                PUBLIC_CLIENT_APPLICATION.setActiveAccount(loginResponse.account);
                setUser(loginResponse.account);
                console.log('User authenticated:', loginResponse.account);
                navigate('/tasks'); // Redirect after login
            }
        } catch (error) {
            console.error("Login failed:", error);
        }
    };

    // Handle Sign-Out
    const handleSignOut = () => {
        PUBLIC_CLIENT_APPLICATION.logout();
        setUser(null);
    };

    return (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginTop: '20px' }}>
            {user ? (
                <div style={{ textAlign: 'center' }}>
                    <p><strong>Welcome, {user.username}!</strong></p>
                    <Button variant="danger" size="lg" onClick={handleSignOut}>
                        Logout
                    </Button>
                </div>
            ) : (
                <Button variant="primary" size="lg" style={{ padding: '15px 40px' }} onClick={handleSignIn}>
                    Sign in with Azure AD
                </Button>
            )}
        </div>
    );
}

export default Signin;
