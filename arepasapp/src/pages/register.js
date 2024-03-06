import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";
import Formulario from "../components/RegisterForm";
import { Container, Row, Col } from 'react-bootstrap';

const Register = () => {
  const [email, setEmail] = useState("");
  const [fullName, setFullName] = useState("");
  const [address, setAddress] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [password, setPassword] = useState("");

  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();

    const formData = {
      email,
      fullName,
      address,
      phoneNumber,
      password,
    };

    try {
      await axios.post("http://localhost:5000/customers", formData);

      setEmail("");
      setFullName("");
      setAddress("");
      setPhoneNumber("");
      setPassword("");

      navigate("/");

    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      <Header />
      <Container>
        <Row className="justify-content-center">
          <Col>
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
    
        <Row className="justify-content-center">
          <Col sm={8}>
            <Formulario
              email={email}
              fullName={fullName}
              address={address}
              phoneNumber={phoneNumber}
              password={password}
              setEmail={setEmail}
              setFullName={setFullName}
              setAddress={setAddress}
              setPhoneNumber={setPhoneNumber}
              setPassword={setPassword}
              handleSubmit={handleSubmit}
            />
          </Col>
        </Row>
    
        
      </Container>
      <Footer />
    </>
  );
};

export default Register;