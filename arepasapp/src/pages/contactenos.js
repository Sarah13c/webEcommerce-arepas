import Header from "../components/Header";
import Footer from "../components/Footer";
import { Button,Container, Card} from 'react-bootstrap';

const contactenos = () => {
  return (
    <>
    <Header/>
    <Card>
                  <Card.Body>
                    <h4 className="text">Sugerencias</h4>
                    <Container>
                      <div className="col-md-12">
                        <div className="form-group">              
                          <textarea className="form-control" id="notes" 
                            
                            placeholder="Ingrese cualquier nota adicional para su pedido"
                            required
                          ></textarea>
                        </div>
                      </div>
                    </Container>
                  </Card.Body>
                </Card>
                <Button variant="success">
            Enviar
          </Button>
    <Footer />

    </>
  );
};

export default contactenos;