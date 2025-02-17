import React, { useState, useEffect } from 'react';
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import { useNavigate } from 'react-router-dom';
import { LOGIN_REQUEST, PUBLIC_CLIENT_APPLICATION } from '../AzureAd/msalConfig.js';
import IMG from "../../src/Login/login.png";

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
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '93vh', backgroundColor: '#f4f6f9' }}>
            <Card style={{ width: '65%', padding: '20px', textAlign: 'center', boxShadow: '0px 4px 10px rgba(0,0,0,0.1)', borderRadius: '10px', background: '#fff' }}>
                <img 
                    src={IMG}
                    alt="Kanban Board Illustration"
                    style={{ width: "100%", marginBottom: '20px' }}
                />
                {user ? (
                    <div>
                        <h4>Welcome, <strong>{user.username}</strong>!</h4>
                        <p>Manage your tasks efficiently with our task manager system.</p>
                        <Button variant="danger" size="lg" onClick={handleSignOut} style={{ marginTop: '10px' }}>
                            Logout
                        </Button>
                    </div>
                ) : (
                    <div>
                        <h4>Sign in to Manage Your Tasks</h4>
                        <p>Organize your work using our task manager system.</p>
                        <Button variant="primary" size="lg" style={{ padding: '12px 40px', marginTop: '10px' }} onClick={handleSignIn}>
                            Sign in with Azure AD
                        </Button>
                    </div>
                )}
            </Card>
        </div>
    );
}

export default Signin;
