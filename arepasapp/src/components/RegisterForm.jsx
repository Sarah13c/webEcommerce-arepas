import React from "react";
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import { Container, Row, Col } from 'react-bootstrap';

const RegisterForm = ({
  email,
  fullName,
  address,
  phoneNumber,
  password,
  setEmail,
  setFullName,
  setAddress,
  setPhoneNumber,
  setPassword,
  handleSubmit
}) => {
  return (
    <div className="card">
      <div className="card-body">
        <h4 className="text-center">REGISTRAR</h4>
        <Form onSubmit={handleSubmit}>
          <Form.Group as={Row} className="mb-3" controlId="inputEmailRegister">
            <Form.Label column sm={2}>Email</Form.Label>
            <Col sm={8}>
              <Form.Control
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </Col>
          </Form.Group>

          <Form.Group as={Row} className="mb-3" controlId="inputNameRegister">
            <Form.Label column sm={2}>Nombre completo</Form.Label>
            <Col sm={8}>
              <Form.Control
                type="text"
                placeholder="Nombre Completo"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                required
              />
            </Col>
          </Form.Group>

          <Form.Group as={Row} className="mb-3" controlId="inputAddressRegister">
            <Form.Label column sm={2}>Dirección</Form.Label>
            <Col sm={8}>
              <Form.Control
                type="text"
                placeholder="Dirección"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                required
              />
            </Col>
          </Form.Group>

          <Form.Group as={Row} className="mb-3" controlId="inputPhoneNumberRegister">
            <Form.Label column sm={2}>Teléfono</Form.Label>
            <Col sm={8}>
              <Form.Control
                type="tel"
                placeholder="Número telefónico"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                required
              />
            </Col>
          </Form.Group>

          <Form.Group as={Row} className="mb-3" controlId="inputPasswordRegister">
            <Form.Label column sm={2}>Contraseña</Form.Label>
            <Col sm={8}>
              <Form.Control
                type="password"
                placeholder="Contraseña"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </Col>
          </Form.Group>
          <hr className="my-4" />
          <Container className="d-flex justify-content-center">
            <Button type="submit" variant="light" style={{ backgroundColor: "#6CA6C1" }}>
              REGISTRAR
            </Button>
          </Container>
        </Form>
        ¿Ya tienes cuenta? <a href="/user" tabIndex="-1" role="button" style={{ backgroundColor: "white" }}>¡Inicia Sesión!</a>
      </div>
    </div>
  );
};

export default RegisterForm;