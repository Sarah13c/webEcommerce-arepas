import React, { useState, useEffect } from "react";
import axios from "axios";
import { useLocation } from "react-router-dom";
import { Container, Row, Col, Card, Button, Pagination } from "react-bootstrap";
import Header from "../components/Header";

const Home = () => {
  const [products, setProducts] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [counters, setCounters] = useState([0, 0, 0]); // Estado de los contadores
  const productsPerPage = 3;

  useEffect(() => {
    fetch("http://localhost:5000/products")
      .then((response) => response.json())
      .then((data) => setProducts(data));
  }, []);

  // Calcular el índice del primer y último producto de la página actual
  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;

  // Obtener los productos de la página actual
  const currentProducts = products.slice(indexOfFirstProduct, indexOfLastProduct);

  // Calcular el número total de páginas
  const totalPages = Math.ceil(products.length / productsPerPage);

  // Función para cambiar a la página siguiente
  const nextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  // Función para cambiar a la página anterior
  const prevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

 // Función para incrementar el contador especificado por el índice
 const incrementCounter = async (index) => {
  const updatedCounters = [...counters];
  updatedCounters[index] += 1;
  setCounters(updatedCounters);

  const product = currentProducts[index]; // Obtener el producto correspondiente
  const orderId = product.id; // Obtener el ID del producto

  try {
    const response = await axios.get(
      `http://localhost:5000/orderitems?id=${orderId}`
    );

    if (response.data.length > 0) {
      const orderItem = response.data[0];
      orderItem.qty += 1; // Incrementar la cantidad del producto en el servidor
      await axios.put(
        `http://localhost:5000/orderitems/${orderItem.id}`,
        orderItem
      );
    } else {
      const order = {
        id: product.id,
        name: product.name,
        price: product.price,
        qty: 1 // Inicializar la cantidad en 1
      };
      await axios.post("http://localhost:5000/orderitems", order); // Crear un nuevo objeto de pedido en el servidor
    }
  } catch (error) {
    console.error("Error al incrementar la cantidad del producto:", error);
  }
};

// Función para decrementar el contador especificado por el índice
const decrementCounter = async (index) => {
  if (counters[index] > 0) {
    const updatedCounters = [...counters];
    updatedCounters[index] -= 1;
    setCounters(updatedCounters);

    const product = currentProducts[index]; // Obtener el producto correspondiente
    const orderId = product.id; // Obtener el ID del producto

    try {
      const response = await axios.get(
        `http://localhost:5000/orderitems?id=${orderId}`
      );

      if (response.data.length > 0) {
        const orderItem = response.data[0];
        if (orderItem.qty > 0) {
          orderItem.qty -= 1; // Actualizar la cantidad del producto en el servidor
          await axios.put(
            `http://localhost:5000/orderitems/${orderItem.id}`,
            orderItem
          );
        }
      }
    } catch (error) {
      console.error("Error al decrementar la cantidad del producto:", error);
    }
  }
};
const handleCounterChange = (index, value) => {
  const updatedCounters = [...counters];
  updatedCounters[index] = parseInt(value, 10); // Convertir el valor a entero
  setCounters(updatedCounters);
};

// Añadir al carrito
const addItem = async (a, b, c, index) => { // Agrega el parámetro `index`
  const quantity = counters[index]; // Obtén la cantidad del producto del array counters

  let isExisting = false;
  const result = await axios.get("http://localhost:5000/orderitems");
  if (result.data.length === 0) {
    const order = { id: a, name: b, price: c, qty: quantity };
    axios.post("http://localhost:5000/orderitems", order);
  } else {
    result.data.forEach((orderItem) => {
      if (a === orderItem.id) {
        orderItem.qty += quantity; // Añadir la cantidad del producto del array counters
        const order = {
          id: a,
          name: b,
          price: c,
          qty: orderItem.qty,
        };
        axios.put(`http://localhost:5000/orderitems/${orderItem.id}`, order);
        isExisting = true;
      }
    });
    if (!isExisting) {
      const order = {
        id: a,
        name: b,
        price: c,
        qty: quantity, // Usar la cantidad del producto del array counters
      };
      axios.post("http://localhost:5000/orderitems", order);
    }
  }
};

  const location = useLocation();
  const email = location.state?.email || "";

  return (
    <>
      <Header username={email} />
      <Container>
        <Row>
          <Col md={12} className="d-flex justify-content-center">
            <h1 className="text-center">
              Menú
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="30"
                height="30"
                fill="currentColor"
                className="bi bi-journal-text"
                viewBox="0 0 16 16"
              ></svg>
            </h1>
          </Col>
        </Row>
        <Row>
          {currentProducts.map((product, index) => (
            <Col md={6} key={product.id}>
              {/* Renderizar la información del producto */}
              <Card className="mb-3">
                <Row className="g-0">
                  <Col md={4}>
                    <Card.Img
                      src={product.image}
                      className="rounded-start img-fluid"
                      alt={product.name}
                      style={{ width: "100%" }}
                    />
                  </Col>
                  <Col md={8}>
                    <Card.Body>
                      <Card.Title>{product.name}</Card.Title>
                      <Card.Text>{product.description}</Card.Text>
                      <Row>
                        <Col>
                          <span className="counter-group-card">
                            <p className="card-text">Precio: {product.price}</p>
                            <Button variant="outline-dark" onClick={() => decrementCounter(index) } disabled={counters[index] === 0} 
                            >
                              -
                            </Button>
                            {"  "}
                            <input type="number" min="0" value={counters[index]} id={`counter-${index}`} onChange={(e) => handleCounterChange(index, e.target.value)}  size="sm" readOnly style={{ width: "40px" }} />
                            {"  "}
                            <Button variant="outline-dark" onClick={() => incrementCounter(index)} >
                              +
                            </Button>
                            {"   "}
                            <Button
                              className="btn-success"
                              onClick={() =>window.alert("Agregado")} // Agrega `index`
                              style={{ marginLeft: "10px" }}
                            ><svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" fill="currentColor" className="bi bi-cart" viewBox="0 0 16 16" >
                            <path d="M0 1.5A.5.5 0 0 1 .5 1H2a.5.5 0 0 1 .485.379L2.89 3H14.5a.5.5 0 0 1 .49.598l-1 5a.5.5 0 0 1-.465.401l-9.397.472L4.415 11H13a.5.5 0 0 1 0 1H4a.5.5 0 0 1-.491-.408L2.01 3.607 1.61 2H.5a.5.5 0 0 1-.5-.5zM3.102 4l.84 4.479 9.144-.459L13.89 4H3.102zM5 12a2 2 0 1 0 0 4 2 2 0 0 0 0-4zm7 0a2 2 0 1 0 0 4 2 2 0 0 0 0-4zm-7 1a1 1 0 1 1 0 2 1 1 0 0 1 0-2zm7 0a1 1 0 1 1 0 2 1 1 0 0 1 0-2z" />
                            </svg></Button>
                          </span>
                        </Col>
                      </Row>
                    </Card.Body>
                  </Col>
                </Row>
              </Card>
            </Col>
          ))}
        </Row>
        {/* Botones de paginación */}
        <Row className="justify-content-center">
          <Col>
            <Pagination>
              <Pagination.Prev
                onClick={prevPage}
                disabled={currentPage === 1}
              />
              {Array.from({ length: totalPages }, (_, index) => (
                <Pagination.Item
                  key={index + 1}
                  active={currentPage === index + 1}
                  onClick={() => setCurrentPage(index + 1)}
                >
                  {index + 1}
                </Pagination.Item>
              ))}
              <Pagination.Next
                onClick={nextPage}
                disabled={currentPage === totalPages}
              />
            </Pagination>
          </Col>
        </Row>
        {"  "}
      </Container>
    </>
  );
};

export default Home;