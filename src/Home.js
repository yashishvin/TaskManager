import './App.css';
import Signin from './Login/Signin';
import 'bootstrap/dist/css/bootstrap.min.css';
import Navbar from 'react-bootstrap/Navbar';
import Container from 'react-bootstrap/Container';

function Home() {
    return (
        <div>
            <Navbar bg="dark" variant="dark">
                <Container>
                    <Navbar.Brand href="/">
                        <div style={{ textAlign: 'center', fontSize: '1.5rem', fontWeight: 'bold' }}>
                            Terra Cloud Task Manager
                        </div>
                    </Navbar.Brand>
                </Container>
            </Navbar>
            <Signin />
        </div>
    );
}

export default Home;
