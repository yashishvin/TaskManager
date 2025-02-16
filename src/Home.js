import logo from './logo.svg';
import './App.css';
import Signin from './Login/Signin';
import 'bootstrap/dist/css/bootstrap.min.css';
import Navbar from 'react-bootstrap/Navbar';
import Container from 'react-bootstrap/Container';
function Home() {
    return (
      <div >
         <Navbar bg="dark" variant="dark">
            <Navbar.Brand href="#home">
            <div style={{ 
              textAlign: 'center'   
            }}>
              Terra Cloud Task Manager
            </div>
            </Navbar.Brand>
        </Navbar>
         <Signin/>
      </div>
    );
  }
  
  export default Home;
  