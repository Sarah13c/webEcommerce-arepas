import React from 'react';
import { Nav, NavDropdown, Form, FormControl, Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
import InputGroup from 'react-bootstrap/InputGroup';
import { useSelector, useDispatch } from 'react-redux';
import { clearUser } from '../userReducer';


const Header = () => {
  const username = useSelector((state) => state.user.username);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const logOut = () => {
    localStorage.clear();
    dispatch(clearUser());
    navigate('/');
  };
  
  return (
    <header>
      <Nav className="navbar navbar-light" style={{ backgroundColor: '#FFE66D' }}>
        <Link to="/" className="navbar-brand" >
          <img src="/img/PyA-Logo.png" width="80" height="80" className="d-inline-block align-top" alt="" />
        </Link>

        <Nav.Item>
          <InputGroup>
            <FormControl type="search" id="searchForm" placeholder="Buscar" className="form-control" />
            <Button type="button" className="btn btn-outline-dark" style={{ backgroundColor: '#FFE66D', borderColor: '#FFE66D' }}>
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-search" viewBox="0 0 16 16">
              
              </svg>
            </Button>
          </InputGroup>
        </Nav.Item>

        <Nav className="nav justify-content-end">

        <Nav.Item>
            
            <Link to="/contactenos" className="nav-link" style={{ color: 'black' }} state={{ username   }}>
              Contactenos
            </Link> 
          
        </Nav.Item>
          
          <Nav.Item>
            
              <Link to="/shopping_cart" className="nav-link" style={{ color: 'black' }} state={{ username   }}>
                <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" fill="currentColor" className="bi bi-cart" viewBox="0 0 16 16" >
                <path d="M0 1.5A.5.5 0 0 1 .5 1H2a.5.5 0 0 1 .485.379L2.89 3H14.5a.5.5 0 0 1 .49.598l-1 5a.5.5 0 0 1-.465.401l-9.397.472L4.415 11H13a.5.5 0 0 1 0 1H4a.5.5 0 0 1-.491-.408L2.01 3.607 1.61 2H.5a.5.5 0 0 1-.5-.5zM3.102 4l.84 4.479 9.144-.459L13.89 4H3.102zM5 12a2 2 0 1 0 0 4 2 2 0 0 0 0-4zm7 0a2 2 0 1 0 0 4 2 2 0 0 0 0-4zm-7 1a1 1 0 1 1 0 2 1 1 0 0 1 0-2zm7 0a1 1 0 1 1 0 2 1 1 0 0 1 0-2z" />
                </svg>
              </Link>
            
              
            
          </Nav.Item>
          <Nav.Item>
            
            <Link to="/user" className="nav-link"style={{ color: 'black' }}>
              <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" fill="black" className="bi bi-person-circle" viewBox="0 0 16 16">
                <path d="M11 6a3 3 0 1 1-6 0 3 3 0 0 1 6 0z" />
                <path
                  fillRule="evenodd"
                  d="M0 8a8 8 0 1 1 16 0A8 8 0 0 1 0 8zm8-7a7 7 0 0 0-5.468 11.37C3.242 11.226 4.805 10 8 10s4.757 1.225 5.468 2.37A7 7 0 0 0 8 1z"
                />
              </svg>
            </Link>
          </Nav.Item>
          <NavDropdown title={username}>
            <NavDropdown.Item onClick={logOut}>Logout</NavDropdown.Item>
          </NavDropdown>
        </Nav>
      </Nav>
    </header>
  );
};

export default Header;
