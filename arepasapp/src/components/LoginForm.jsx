import React from "react";
import { Form, Button } from "react-bootstrap";

const LoginForm = ({ email, password, setEmail, setPassword, handleSubmit, error }) => {
  return (
    <Form onSubmit={handleSubmit}>
      <Form.Group controlId="inputEmailLogin">
        <Form.Label>Email</Form.Label>
        <Form.Control
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
      </Form.Group>
      <Form.Group controlId="inputPasswordLogin">
        <Form.Label>Contraseña</Form.Label>
        <Form.Control
          type="password"
          placeholder="Contraseña"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
      </Form.Group>
      <hr className="my-4" />
      <div className="d-flex justify-content-center">
        <Button type="submit" variant="light" style={{ backgroundColor: "#6CA6C1" }}>
          INICIAR SESIÓN
        </Button>
      </div>
      <p>{error}</p>
      <p>
        ¿No tienes cuenta? <a href="/register" tabIndex="-1" role="button" style={{ backgroundColor: "white" }}>
          ¡Registrate!
        </a>
      </p>
    </Form>
  );
};

export default LoginForm;