import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Container, Row, Col, Card } from "react-bootstrap";
import Header from "../components/Header";
import Footer from "../components/Footer";
import LoginForm from "../components/LoginForm";
import axios from "axios";
import { useDispatch } from 'react-redux';
import { setUser } from '../userReducer';

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const location = useLocation();
  const isLoggedIn = !!location.state?.email;
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleSubmit = async (event) => {
    event.preventDefault();

    const formData = {
      email,
      password,
    };

    try {
      const response = await axios.get("http://localhost:5000/customers");
      const customers = response.data;
      const user = customers.find(
        (customer) => customer.email === email && customer.password === password
      );

      if (user) {
        setEmail(user.fullName);
        dispatch(setUser(user.fullName));
        navigate("/", { state: { email: user.fullName } });
        
      } else {
        setError("Credenciales inválidas");
      }
    } catch (error) {
      setError("Error al obtener datos del servidor");
    }
  };

  return (
    <>
      <Header username={isLoggedIn ? email : null} />

      <Container className="container-xs">
        <Container fluid>
          <Row>
            <Col sm={12} className="d-flex justify-content-center">
              <h1 className="text-center">
                MI CUENTA{" "}
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="50"
                  height="50"
                  fill="black"
                  className="bi bi-person-circle"
                  viewBox="0 0 16 16"
                >
                  <path d="M11 6a3 3 0 1 1-6 0 3 3 0 0 1 6 0z" />
                  <path
                    fillRule="evenodd"
                    d="M0 8a8 8 0 1 1 16 0A8 8 0 0 1 0 8zm8-7a7 7 0 0 0-5.468 11.37C3.242 11.226 4.805 10 8 10s4.757 1.225 5.468 2.37A7 7 0 0 0 8 1z"
                  />
                </svg>
              </h1>
            </Col>
          </Row>
          <Row>
            <Col>
              <Card>
                <Card.Body>
                  <h4 className="text-center">INICIAR SESIÓN</h4>
                  <LoginForm
                    email={email}
                    password={password}
                    setEmail={setEmail}
                    setPassword={setPassword}
                    handleSubmit={handleSubmit}
                    error={error}
                  />
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </Container>
      </Container>

      <Footer />
    </>
  );
};

export default LoginPage;
