import logo from './logo.svg';
import './App.css';
import Home from './Home'
import Tasks from './Tasks/Tasks'
import { Routes, Route } from 'react-router-dom';


function App() {
  return (
    <div >
      <Routes>
        <Route path="/" element={ <Home/> }/>
        <Route path="tasks" element={ <Tasks/> }/>
       </Routes>
      
    </div>
  );
}

export default App;
