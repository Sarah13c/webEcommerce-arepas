import React, { useEffect, useState } from "react";
import axios from "axios";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { useLocation } from "react-router-dom";
import { Link } from "react-router-dom";
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import Container from 'react-bootstrap/Container';
const ShoppingCart = () => {
  const location = useLocation();
  const { username } = location.state || {};
  const [orderItems, setOrderItems] = useState([]);
  const [productData, setProductData] = useState([]);
  const [counters, setCounters] = useState([0, 0, 0]); // Estado de los contadores
  const [message, setMessage] = useState(""); // Estado del mensaje
  const [isCartEmpty, setIsCartEmpty] = useState(false);


  const fetchData = async () => {
    try {
      const [orderItemsResponse, productDataResponse] = await Promise.all([
        axios.get("http://localhost:5000/orderitems"),
        axios.get("http://localhost:5000/products"),
      ]);
      if (orderItemsResponse.data.length === 0) {
        setOrderItems(orderItemsResponse.data);
        setProductData(productDataResponse.data);
        setIsCartEmpty(true); // Carrito vacío
        // El carrito está vacío, muestra un mensaje
        setMessage("El carrito está vacío");
      } else {
        setOrderItems(orderItemsResponse.data);
        setProductData(productDataResponse.data);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const deleteOrder = async (id) => {
    let isDelete = window.confirm("¿Seguro que desea eliminar el producto?");

    if (isDelete) {
      await axios.delete(`http://localhost:5000/orderitems/${id}`);
      fetchData();
    }
  };

  const emptyCart = async () => {
    let isDelete = window.confirm("¿Seguro que desea vaciar el carrito?");

    if (isDelete) {
      try {
        const orderItemIds = orderItems.map((orderItem) => orderItem.id);
        await Promise.all(
          orderItemIds.map((orderId) =>
            axios.delete(`http://localhost:5000/orderitems/${orderId}`)
          )
        );
        fetchData();
      } catch (error) {
        console.log(error);
      }
    }
  };

  const getProductById = (productId) => {
    return productData.find((product) => product.id === productId);
  };

  const calculateTotalPrice = () => {
    let totalPrice = 0;

    orderItems.forEach((orderItem) => {
      const product = getProductById(orderItem.id);
      totalPrice += product.price * orderItem.qty;
    });

    return totalPrice;
  };


  //botones de añadir
  // Función para incrementar el contador especificado por el índice
  const incrementCounter = async (index) => {
    const orderItemId = orderItems[index].id;
    const updatedOrderItem = {
      ...orderItems[index],
      qty: orderItems[index].qty + 1,
    };
  
    try {
      await axios.put(`http://localhost:5000/orderitems/${orderItemId}`, updatedOrderItem);
  
      setOrderItems((prevOrderItems) => {
        const updatedItems = [...prevOrderItems];
        updatedItems[index] = updatedOrderItem;
        return updatedItems;
      });
    } catch (error) {
      console.log(error);
    }
  };


  // Función para decrementar el contador especificado por el índice
  const decrementCounter = async (index) => {
    const orderItem = orderItems[index];
  
    if (orderItem.qty > 0) {
      const orderItemId = orderItem.id;
      const updatedOrderItem = {
        ...orderItem,
        qty: orderItem.qty - 1,
      };
  
      try {
        await axios.put(`http://localhost:5000/orderitems/${orderItemId}`, updatedOrderItem);
  
        setOrderItems((prevOrderItems) => {
          const updatedItems = [...prevOrderItems];
          updatedItems[index] = updatedOrderItem;
          return updatedItems;
        });
      } catch (error) {
        console.log(error);
      }
    }
  
    if (orderItem.qty === 1) {
      const orderItemId = orderItem.id;
  
      try {
        await deleteOrder(orderItemId);
      } catch (error) {
        console.log(error);
      }
    }
  };
  const handleCounterChange = (index, value) => {
    const updatedCounters = [...counters];
    updatedCounters[index] = parseInt(value, 10); // Convertir el valor a entero
    setCounters(updatedCounters);
  };

  return (
    <>
    <Header username={username} />
    <Container>
    <Link to="/" className="btn btn-outline-light" style={{ color: "gray" }} state={{ username }} >
        <svg xmlns="http://www.w3.org/2000/svg" width="35" height="35" fill="currentColor" className="bi bi-arrow-left-square-fill" viewBox="0 0 16 16" >
        <path d="M16 14a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V2a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v12zm-4.5-6.5H5.707l2.147-2.146a.5.5 0 1 0-.708-.708l-3 3a.5.5 0 0 0 0 .708l3 3a.5.5 0 0 0 .708-.708L5.707 8.5H11.5a.5.5 0 0 0 0-1z"/>
        </svg>
      </Link>
      
      <Row className="justify-content-center">
        <Col sm={12} className="d-flex justify-content-center">
          <h1 className="text-center">
            CARRITO DE COMPRA {"  "}
            <svg xmlns="http://www.w3.org/2000/svg" width="50" height="50" fill="currentColor" className="bi bi-cart" viewBox="0 0 16 16" >
              <path d="M0 1.5A.5.5 0 0 1 .5 1H2a.5.5 0 0 1 .485.379L2.89 3H14.5a.5.5 0 0 1 .49.598l-1 5a.5.5 0 0 1-.465.401l-9.397.472L4.415 11H13a.5.5 0 0 1 0 1H4a.5.5 0 0 1-.491-.408L2.01 3.607 1.61 2H.5a.5.5 0 0 1-.5-.5zM3.102 4l.84 4.479 9.144-.459L13.89 4H3.102zM5 12a2 2 0 1 0 0 4 2 2 0 0 0 0-4zm7 0a2 2 0 1 0 0 4 2 2 0 0 0 0-4zm-7 1a1 1 0 1 1 0 2 1 1 0 0 1 0-2zm7 0a1 1 0 1 1 0 2 1 1 0 0 1 0-2z"/>
            </svg>
          </h1>
          </Col>
          <Col sm={12} className="d-flex justify-content-center"><h4>Correo electrónico: {username}</h4></Col>
            
      </Row>
      <Row className="justify-content-center">
      
        <Col md={6}>
        <h5 className="text-center"><b>{message}</b></h5>
          {orderItems.map((orderItem, index) => {
            const product = getProductById(orderItem.id);
            return (
              <Card key={orderItem.id} className="mb-3">
              
                <Row className="g-0">
                  <Col md={4}>
                    <Card.Img src={product.image} className="rounded-start" width="150" height="140" alt={product.name} />
                  </Col>
                  <Col md={8}>
                  
                    <Card.Body>
                      
                      <Card.Title>{product.name}</Card.Title>
                      <Card.Text>{product.description}</Card.Text>
                      
                      <Row>
                        <Col>
                          {" "}
                          <div className="counter-group-card">
                            <strong>${product.price}</strong>{"   "}
                            <Button variant="outline-dark" onClick={() => decrementCounter(index)}
                            >
                              -
                            </Button>
                            {"  "}
                            <input type="number" min="0" value={orderItem.qty} id={`counter-${index}`} onChange={(e) => handleCounterChange(index, e.target.value)}  size="sm" readOnly style={{ width: "40px" }} />
                            {"  "}
                            <Button variant="outline-dark" onClick={() => incrementCounter(index)} >
                              +
                            </Button>
                            {"   "}
                            <Button variant="danger" onClick={() =>deleteOrder(product.id)}>
                              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" className="bi bi-trash3" viewBox="0 0 16 16" >
                                <path d="M6.5 1h3a.5.5 0 0 1 .5.5v1H6v-1a.5.5 0 0 1 .5-.5ZM11 2.5v-1A1.5 1.5 0 0 0 9.5 0h-3A1.5 1.5 0 0 0 5 1.5v1H2.506a.58.58 0 0 0-.01 0H1.5a.5.5 0 0 0 0 1h.538l.853 10.66A2 2 0 0 0 4.885 16h6.23a2 2 0 0 0 1.994-1.84l.853-10.66h.538a.5.5 0 0 0 0-1h-.995a.59.59 0 0 0-.01 0H11Zm1.958 1-.846 10.58a1 1 0 0 1-.997.92h-6.23a1 1 0 0 1-.997-.92L3.042 3.5h9.916Zm-7.487 1a.5.5 0 0 1 .528.47l.5 8.5a.5.5 0 0 1-.998.06L5 5.03a.5.5 0 0 1 .47-.53Zm5.058 0a.5.5 0 0 1 .47.53l-.5 8.5a.5.5 0 1 1-.998-.06l.5-8.5a.5.5 0 0 1 .528-.47ZM8 4.5a.5.5 0 0 1 .5.5v8.5a.5.5 0 0 1-1 0V5a.5.5 0 0 1 .5-.5Z"/>
                              </svg>
                            </Button>{" "}
                          </div>
                        </Col>
                      </Row>
                    </Card.Body>
                  </Col>
                </Row>
              </Card>
            );
          })}
          
        </Col>
        <Col sm={6}>
          <Card>
            <Card.Body>
              <h4 className="text-center">DETALLE DE PEDIDO</h4>
              {"  "}
              <div className="container">
              <Row className="align-items-start">
                      <Col>
                        <h5 className="text-center">Producto</h5>
                      </Col>
                      <Col>
                        <h5 className="text-center">Cantidad</h5>
                      </Col>
                      <Col>
                        <h5 className="text-center">
                          Precio
                        </h5>
                      </Col>
                    </Row>
                    <h5 className="text-center"><b>{message}</b></h5>
                {orderItems.map((orderItem) => {
                  const product = getProductById(orderItem.id);
                  return (
                    <Row className="align-items-start" key={orderItem.id}>
                      <Col>
                        <p className="text-center">{product.name}</p>
                      </Col>
                      <Col>
                        <p className="text-center">{orderItem.qty}</p>
                        
                      </Col>
                      <Col>
                        <p className="text-center">
                          ${product.price * orderItem.qty}
                        </p>
                      </Col>
                    </Row>
                  );
                })}
              </div>
            </Card.Body>
            <Card.Footer>
              <h5>Total: ${calculateTotalPrice()}</h5>
            </Card.Footer>
          </Card>
          {"  "}        
          <div className="d-grid gap-2 d-md-flex justify-content-md-end">
          <br />
          <Button variant="danger" onClick={emptyCart}>
            Vaciar Carrito
          </Button>
            <Link to={isCartEmpty ? "#" : "/payment"} className={`btn btn-success ${isCartEmpty ? "disabled" : ""}`} style={{ color: "white" }} state={{ username }} >
              <h6>
                IR A PAGAR {"  "}
                <svg xmlns="http://www.w3.org/2000/svg" width="21" height="21" fill="currentColor" className="bi bi-receipt-cutoff" viewBox="0 0 16 16" >
                  <path d="M3 4.5a.5.5 0 0 1 .5-.5h6a.5.5 0 1 1 0 1h-6a.5.5 0 0 1-.5-.5zm0 2a.5.5 0 0 1 .5-.5h6a.5.5 0 1 1 0 1h-6a.5.5 0 0 1-.5-.5zm0 2a.5.5 0 0 1 .5-.5h6a.5.5 0 1 1 0 1h-6a.5.5 0 0 1-.5-.5zm0 2a.5.5 0 0 1 .5-.5h6a.5.5 0 0 1 0 1h-6a.5.5 0 0 1-.5-.5zm0 2a.5.5 0 0 1 .5-.5h6a.5.5 0 0 1 0 1h-6a.5.5 0 0 1-.5-.5zM11.5 4a.5.5 0 0 0 0 1h1a.5.5 0 0 0 0-1h-1zm0 2a.5.5 0 0 0 0 1h1a.5.5 0 0 0 0-1h-1zm0 2a.5.5 0 0 0 0 1h1a.5.5 0 0 0 0-1h-1zm0 2a.5.5 0 0 0 0 1h1a.5.5 0 0 0 0-1h-1zm0 2a.5.5 0 0 0 0 1h1a.5.5 0 0 0 0-1h-1z"/>
                  <path d="M2.354.646a.5.5 0 0 0-.801.13l-.5 1A.5.5 0 0 0 1 2v13H.5a.5.5 0 0 0 0 1h15a.5.5 0 0 0 0-1H15V2a.5.5 0 0 0-.053-.224l-.5-1a.5.5 0 0 0-.8-.13L13 1.293l-.646-.647a.5.5 0 0 0-.708 0L11 1.293l-.646-.647a.5.5 0 0 0-.708 0L9 1.293 8.354.646a.5.5 0 0 0-.708 0L7 1.293 6.354.646a.5.5 0 0 0-.708 0L5 1.293 4.354.646a.5.5 0 0 0-.708 0L3 1.293 2.354.646zm-.217 1.198.51.51a.5.5 0 0 0 .707 0L4 1.707l.646.647a.5.5 0 0 0 .708 0L6 1.707l.646.647a.5.5 0 0 0 .708 0L8 1.707l.646.647a.5.5 0 0 0 .708 0L10 1.707l.646.647a.5.5 0 0 0 .708 0L12 1.707l.646.647a.5.5 0 0 0 .708 0l.509-.51.137.274V15H2V2.118l.137-.274z"/>
                </svg>
              </h6>
            </Link>
          </div>
        </Col>
      </Row>
    </Container>
    <Footer />
    </>
  );
};

export default ShoppingCart;