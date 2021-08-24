import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { withAuth0 } from '@auth0/auth0-react';
import axios from 'axios';
import { Card, Button,Form } from 'react-bootstrap';


class FavFlowers extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      favFlowers: [],
      showForm: false,
      index: -1,
      flowerObj: {},
      flowerName: '',
      flowerInst: '',
      flowerPhoto: ''
    }
  }

  componentDidMount() {
    const { user } = this.props.auth0;

    axios
      .get(`http://localhost:3001/getFavFlowers`, { params: { userEmail: user.email } })
      .then(result => {
        this.setState({
          favFlowers: result.data
        })
      }).catch(err => {console.log(err)})
  }

  deleteFlowerM = (idx) => {
    const { user } = this.props.auth0;

    axios
      .delete(`http://localhost:3001/deleteFlowers/${idx}`, { params: { userEmail: user.email } })
      .then(result => {
        this.setState({
          favFlowers: result.data,
        })
      }).catch(err => { console.log(err) })
  }

  updateFlowerM = (flower, idx) => {
    this.setState({
      showForm: true,
      index: idx,
      flowerObj: flower,
      flowerName: flower.flowerName,
      flowerInst: flower.flowerInst,
      flowerPhoto: flower.flowerPhoto
    })
  }

  submitUpdateForm = (event) => {
    event.preventDefault();

    const { user } = this.props.auth0
    const params = {
      userEmail: user.email,
      flowerObj: {
        flowerName: event.target.flowerName.value,
        flowerInst: event.target.flowerInst.value,
        flowerPhoto: this.state.flowerObj.flowerPhoto
      }
    }
    axios.put(`http://localhost:3001/deleteFlowers/${this.state.index}`, params)
      .then(result => {
        this.setState({
          favFlowers: result.data
        })
      }).catch(err => {console.log(err)})
  }

  render() {
    return (
      <>
        <h1>API Flowers</h1>

        {
          this.state.showForm &&
          <Form onSubmit={(e)=> {this.submitUpdateForm(e)}}>
            <Form.Group className="mb-3" controlId="formBasicEmail">
              <Form.Label>flowerName</Form.Label>
             <Form.Control type="text" defaultValue={this.state.flowerName} name='flowerName' />          
            </Form.Group>

            <Form.Group className="mb-3" controlId="formBasicEmail">
              <Form.Label>flowerInst</Form.Label>
             <Form.Control type="text" defaultValue={this.state.flowerInst} name='flowerInst' />          
            </Form.Group>

            {/* <Form.Group className="mb-3" controlId="formBasicEmail">
              <Form.Label>flowerPhoto</Form.Label>
             <Form.Control type="text" defaultValue={this.state.flowerPhoto} name='flowerPhoto' />          
            </Form.Group> */}

            <Button variant="primary" type="submit">
              update
            </Button>
          </Form>
        }

        {
          this.state.favFlowers.length && this.state.favFlowers.map((flower, idx) => {

            return (
              <>
                <Card style={{ width: '18rem' }}>
                  <Card.Img variant="top" src={flower.flowerPhoto} />
                  <Card.Body>
                    <Card.Title>{flower.flowerName}</Card.Title>
                    <Card.Text>
                      {flower.flowerInst}
                    </Card.Text>
                    <Button onClick={() => this.deleteFlowerM(idx)} variant="primary">Delete</Button>
                    <Button onClick={() => this.updateFlowerM(flower, idx)} variant="primary">Update</Button>
                  </Card.Body>
                </Card>
              </>)
          })
        }



      </>
    )
  }
}

export default withAuth0(FavFlowers);