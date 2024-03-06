// Counter.js
import React from "react";
import { Button, ButtonGroup, Form } from "react-bootstrap";

const Counter = ({ value, index, increment, decrement }) => {
  
  return (
    <span className="counter-group-card">
      <ButtonGroup>
        <Button variant="outline-dark" onClick={() => decrement(index)}>
          -
        </Button>
        <Form.Control type="number" min="0" value={value} id={`counter-${index}`} onBlur={() => {}} size="sm" readOnly style={{ width: "40px" }} />
        <Button variant="outline-dark" onClick={() => increment(index)}>
          +
        </Button>
      </ButtonGroup>
    </span>
  );
};

export default Counter;
