import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import Button from 'react-bootstrap/Button';
import Navbar from 'react-bootstrap/Navbar';
function Tasks()
{
  return(
    <div>
      <Navbar bg="dark" variant="dark">
          <Navbar.Brand href="#home">
          <div style={{ 
            textAlign: 'center'   
          }}>
            Tasks We need to Work on
          </div>
          </Navbar.Brand>
      </Navbar>
    </div>
  );

}
export default Tasks;