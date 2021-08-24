import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { withAuth0 } from '@auth0/auth0-react';
import axios from 'axios';
import {Card,Button} from 'react-bootstrap';


class Home extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      allFlowers: []
    }
  }

  componentDidMount() {

    axios
      .get(`http://localhost:3001/getAllFlowers`)
      .then(result => {
        this.setState({
          allFlowers: result.data
        })
      })
  }

  addFlowerM = (floweObj)=> {
    const {user} =this.props.auth0;

    const params={
      userEmail: user.email,
      floweObj: {
        name: floweObj.name,
        instructions: floweObj.instructions,
        photo: floweObj.photo,
      }
    }
    axios
    .post(`http://localhost:3001/addFlowersR`, params)
  .catch(err=> {console.log(err)})
  }

  render() {
    return (
      <>
        <h1>API Flowers</h1>

        {
          this.state.allFlowers.length && this.state.allFlowers.map((flower, idx) => {

            return (
              <>
                <Card style={{ width: '18rem' , display:'inline-block'}}>
                  <Card.Img variant="top" src={flower.photo} />
                  <Card.Body>
                    <Card.Title>{flower.name}</Card.Title>
                    <Card.Text>
                      {flower.instructions}
                    </Card.Text>
                    <Button onClick={()=> {this.addFlowerM(flower)}} variant="primary">ADD to Fav</Button>
                  </Card.Body>
                </Card>
              </>)
          })
        }



      </>
    )
  }
}

export default withAuth0(Home);
