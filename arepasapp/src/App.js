import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import Footer from './components/Footer';

import Home from "./pages/home";


function App() {
  
  
  return (
    <>
     
    <Routes>
      <Route path="/" element={<Home />}/>  
    </Routes>
    <Footer/>

    </>
    
    
    
  );
}

export default App;