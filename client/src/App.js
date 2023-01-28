import * as ReactBootstrap from 'react-bootstrap';
import './styles.css'

function App() {
  const { Container, Row, Col } = ReactBootstrap;

  return (
      <Container>
          <Row>
              <Col md={{ offset: 3, span: 6 }}>
                NoNo
              </Col>
          </Row>
      </Container>
  );
}

export default App;
