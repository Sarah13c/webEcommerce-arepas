import Header from "../components/Header";
import Footer from "../components/Footer";
import { useLocation, useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from "axios";
import { Button, Card, Col, Container, Form, Row, Modal } from 'react-bootstrap';


const Payment = () => {
  const location = useLocation();
  const { username } = location.state || {};
  const [orderItems, setOrderItems] = useState([]);
  const [productData, setProductData] = useState([]);
  const [userData, setUserData] = useState({id: "" ,fullName: "", address: "",phoneNumber: "", email: "",});
  const [guestData, setGuestData] = useState({ fullName: "", address: "", phoneNumber: "", email: "" });
  const [orderId, setOrderId] = useState("");
  const [notes, setNotes] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [orderDetails, setOrderDetails] = useState({});
  const navigate = useNavigate();
  const [orderItemsData, setOrderItemsData] = useState([]);

    
  // Estado para almacenar los datos del usuario
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await axios.get("http://localhost:5000/customers", {
          params: {
            email: username,
          },
        });
        if (response.data.length > 0) {
          const { fullName, address, phoneNumber, email, id } = response.data[0];
          setUserData({ fullName, address, phoneNumber, email, id });
        }
      }catch (error) {console.error("Error fetching user data:", error);}
    };
      fetchUserData();
    }, [username]);


  // Actualizar los datos de los productos y cantidades
  useEffect(() => {
    const updatedOrderItemsData = orderItems.map((orderItem) => {
      const product = getProductById(orderItem.id);
      return {
        productId: orderItem.id,
        qty: orderItem.qty,
        subTotal: product.price * orderItem.qty,
      };
    });
    setOrderItemsData(updatedOrderItemsData);
  }, [orderItems]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [orderItemsResponse, productDataResponse] = await Promise.all([
          axios.get("http://localhost:5000/orderitems"),
          axios.get("http://localhost:5000/products"),
        ]);
        setOrderItems(orderItemsResponse.data);
        setProductData(productDataResponse.data);
      } catch (error) {
        console.log(error);
      }
    };
    fetchData();
  }, []);

  //obtener producto por Id
  const getProductById = (productId) => {
    return productData.find((product) => product.id === productId);
  };

  //Calcular subtotal compra
  const calculateSubTotalPrice = () => {
      let totalPrice = 0;
      orderItems.forEach((orderItem) => {
        const product = getProductById(orderItem.id);
        totalPrice += product.price * orderItem.qty;
      });
      return totalPrice;
    };

  const calculateIVA = () =>{
    let subtotal =  calculateSubTotalPrice();
    let iva = subtotal *0.19
    return iva
  };

  const calculateTotalPrice = () =>{
      
      let subtotal =  calculateSubTotalPrice();
      let iva = calculateIVA();
      let domicilio = 8000
      let FinalPrice = subtotal+iva+domicilio;
      return FinalPrice
  };

  const sendOrderFinal = async (orderFinalData) => {
    try {
      const response = await axios.post("http://localhost:5000/orderfinal", orderFinalData);
      console.log("Datos de orderFinal enviados:", response.data);
    } catch (error) {
      console.error("Error al enviar los datos de orderFinal:", error);
      // Manejar el error adecuadamente
    }
  };

  const handleSubmit = async () => {
    const isFormValid = validateForm();
    if (!isFormValid) {
      return;
    }
    const orderData = {
      id: orderId,
      fullName: username ? userData.fullName : guestData.fullName,
      address: username ? userData.address : guestData.address,
      phoneNumber: username ? userData.phoneNumber : guestData.phoneNumber,
      calculateTotalPrice: calculateTotalPrice(),
      notes: notes,
    };
    try {
      const response = await axios.post("http://localhost:5000/orders", orderData);
      console.log("Pedido enviado:", response.data);
  
      setOrderDetails(response.data); // Guardar los datos del pedido en el estado
      setShowModal(true); // Mostrar el Modal
      setOrderId("");
      setNotes("");
  
      // Enviar datos de orderFinal
      const productsResponse = await axios.get('http://localhost:5000/orderitems');
      const productsData = productsResponse.data;
  
      // Calcular el subtotal
      let subtotal = 0;
      orderItemsData.forEach((orderItem) => {
        subtotal += orderItem.subTotal;
      });
  
      // Crear el objeto orderFinal
      const orderFinalData = {
        id: orderId,
        orderId: response.data.id,
        orderItems: orderItemsData.map((orderItem) => ({
          productId: orderItem.productId,
          qty: orderItem.qty,
        })),
        subTotal: subtotal
      };
      sendOrderFinal(orderFinalData);
      // Realizar otras acciones después de enviar el pedido correctamente
    } catch (error) {
      console.error("Error al enviar el pedido:", error);
      // Manejar el error adecuadamente
    }
  };
  const validateForm = () => {
    // Validar los campos requeridos y mostrar mensajes de error si es necesario
    let isFormValid = true;

    if (!username && !guestData.fullName) {
      // Si no hay un usuario registrado y no se ha ingresado el nombre completo del invitado
      isFormValid = false;
      // Mostrar mensaje de error o realizar alguna acción para indicar que el campo es obligatorio
      window.alert("El nombre completo es obligatorio");
    }

    if (!username && !guestData.address) {
      // Si no hay un usuario registrado y no se ha ingresado la dirección del invitado
      isFormValid = false;
      // Mostrar mensaje de error o realizar alguna acción para indicar que el campo es obligatorio
      window.alert("La dirección es obligatoria");
    }

    if (!username && !guestData.phoneNumber) {
      // Si no hay un usuario registrado y no se ha ingresado el número de teléfono del invitado
      isFormValid = false;
      // Mostrar mensaje de error o realizar alguna acción para indicar que el campo es obligatorio
      window.alert("El número de teléfono es obligatorio");
    }

    if (!notes) { 
      // Si no se ha ingresado ninguna nota adicional
      isFormValid = false;
      // Mostrar mensaje de error o realizar alguna acción para indicar que el campo es obligatorio
      window.alert("Las notas son obligatorias");
    }

    return isFormValid;
  };

  const handleReturnHome = async () => {
    try {
      // Eliminar los elementos del carrito uno por uno
      for (const orderItem of orderItems) {
        await axios.delete(`http://localhost:5000/orderitems/${orderItem.id}`);
      }
      // Vaciar el estado del carrito de compras
      setOrderItems([]);
      // Redirigir a la página de inicio
      navigate("/");
    } catch (error) {
      console.error("Error al vaciar el carrito:", error);
      // Manejar el error adecuadamente
    }
  };
  return (
    <>
      <Header username={username} />
      <Container className="container-xs" xs="true">
        <Link to="/shopping_cart" className="btn btn-outline-light" style={{ color: "gray" }} state={{ username }} >
          <svg xmlns="http://www.w3.org/2000/svg" width="35" height="35" fill="currentColor" className="bi bi-arrow-left-square-fill" viewBox="0 0 16 16" >
            <path d="M16 14a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V2a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v12zm-4.5-6.5H5.707l2.147-2.146a.5.5 0 1 0-.708-.708l-3 3a.5.5 0 0 0 0 .708l3 3a.5.5 0 0 0 .708-.708L5.707 8.5H11.5a.5.5 0 0 0 0-1z"/>
          </svg>
        </Link>
        <Container fluid>
          <Row>
            <Col sm={12} className="d-flex justify-content-center">
              <h1 className="text-center">PAGO
                  <svg xmlns="http://www.w3.org/2000/svg" width="50" height="50" fill="currentColor" className="bi bi-receipt-cutoff" viewBox="0 0 16 16">
                  </svg>
              </h1>
            </Col>
          </Row>
          {"  "}
          <Row>
            <Col sm={6}>
              <Card>
                <Card.Body>
                  <h4 className="text-center">DETALLE DE PEDIDO</h4>
                  {" "}
                  <Container>
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
                                <p className="text-center">${product.price * orderItem.qty}</p>
                            </Col>
                        </Row>
                      );
                    })}
                    <Row className="align-items-start">
                        <Col>
                            <p className="text-center">IVA (19%)</p>
                        </Col>
                        <Col>
                            <p className="text-center">N/A</p>
                        </Col>
                        <Col>
                            <p className="text-center">${calculateIVA()}</p>
                        </Col>
                    </Row>
                    <Row className="align-items-start">
                        <Col>
                            <p className="text-center">Domicilio</p>
                        </Col>
                        <Col>
                            <p className="text-center">N/A</p>
                        </Col>
                        <Col>
                            <p className="text-center">$8.000</p>
                        </Col>
                    </Row>
                  </Container>
                </Card.Body>
                <Card.Footer><h5>Total: ${calculateTotalPrice()}</h5></Card.Footer>
              </Card>
              {"   "}
            </Col>
            <Col sm={6}>
              <Col>
                <Card>
                  <Card.Body>
                    <h4 className="text">NOTAS</h4>
                    <Container>
                      <div className="col-md-12">
                        <div className="form-group">              
                          <textarea className="form-control" id="notes" value={notes}
                            onChange={(e) => setNotes(e.target.value)}
                            placeholder="Ingrese cualquier nota adicional para su pedido"
                            required
                          ></textarea>
                        </div>
                      </div>
                    </Container>
                  </Card.Body>
                </Card>
              </Col>
              {"   "}
              <Col>
                <Card>
                  <Card.Body>
                    <h4 className="text">INFORMACIÓN PERSONAL</h4>
                    <Form className="row g-3">
                      <Col md={6}>
                        <Form.Label htmlFor="fullName" className="form-label">Nombre Completo</Form.Label>
                        <Form.Control type="text" id="fullName"placeholder="Nombre completo"  value={username ? userData.fullName : guestData.fullName}
                          onChange={(e) =>
                            username
                              ? setUserData({ ...userData, fullName: e.target.value })
                              : setGuestData({ ...guestData, fullName: e.target.value })
                          }
                        />
                      </Col>
                      <Col md={6}>
                        <Form.Label htmlFor="direccion" className="form-label">Dirección</Form.Label>
                        <Form.Control
                          type="text"
                          id="direccion"
                          placeholder="Dirección de envío"
                          value={username ? userData.address : guestData.address}
                          onChange={(e) =>
                            username
                              ? setUserData({ ...userData, address: e.target.value })
                              : setGuestData({ ...guestData, address: e.target.value })
                          }
                          required
                        />
                      </Col>
                      <Col md={6}>
                       <Form.Label htmlFor="numero" className="form-label">Numero</Form.Label>
                        <Form.Control
                          type="text"
                          id="numero"
                          placeholder="Numero"
                          value={username ? userData.phoneNumber : guestData.phoneNumber}
                          onChange={(e) =>
                            username
                              ? setUserData({ ...userData, phoneNumber: e.target.value })
                              : setGuestData({ ...guestData, phoneNumber: e.target.value })
                          }
                          required
                        />
                      </Col>
                    </Form>
                  </Card.Body>
                </Card>
              </Col>
              {"   "}
              <div className="d-grid gap-2 d-md-flex justify-content-md-end">                       
                <Button className="btn btn-success"
                  onClick={() => {
                  const uniqueId = Date.now().toString();
                  setOrderId(uniqueId);
                  handleSubmit();
                  }} tabIndex="-1" role="button"style={{ color: 'white' }}>
                  <h6>
                    CONFIRMAR PEDIDO
                    <svg xmlns="http://www.w3.org/2000/svg" width="21" height="21" fill="currentColor" class="bi bi-check-circle" viewBox="0 0 16 16">
                        <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z"/>
                        <path d="M10.97 4.97a.235.235 0 0 0-.02.022L7.477 9.417 5.384 7.323a.75.75 0 0 0-1.06 1.06L6.97 11.03a.75.75 0 0 0 1.079-.02l3.992-4.99a.75.75 0 0 0-1.071-1.05z"/>
                    </svg>
                  </h6>
                </Button>
                <Modal show={showModal} onHide={() => setShowModal(false)}>
                  <Modal.Header closeButton>
                    <Modal.Title>Orden #{orderDetails.id}</Modal.Title>
                  </Modal.Header>
                  <Modal.Body>
                    <h5>Detalles de pedido: </h5>
                    <p>Nombre: {orderDetails.fullName}</p>
                    <p>Dirección: {orderDetails.address}</p>
                    <p>Número de teléfono: {orderDetails.phoneNumber}</p>
                    <p>Precio total: ${orderDetails.calculateTotalPrice}</p>
                    <p>Notas: {orderDetails.notes}</p>
                    <h6>¡Gracias por comprar en Arepasp&g, disfrute su pedido!</h6>
                    
                    
                  </Modal.Body>
                  <Modal.Footer>
                    <Button variant="success" onClick={handleReturnHome}>
                      Volver al Inicio
                    </Button>
                  </Modal.Footer>
                </Modal>
              </div>
            </Col>
          </Row>    
        </Container>
      </Container>
      <Footer />
    </>
      
  );
};export default Payment;
