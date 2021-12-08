import React, { Component } from 'react';
import axios from "axios";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit } from '@fortawesome/free-solid-svg-icons';
import { Modal, ModalBody, ModalFooter, ModalHeader, Container, Row, Col } from 'reactstrap';
import { DistanceMatrixService, LoadScript } from '@react-google-maps/api';

const url="https://api.tookanapp.com/v2/get_fare_estimate";
const dato = { 
    "template_name": "Order_Details", 
    "pickup_latitude": "8.988113842010309", 
    "pickup_longitude": "-79.51823593617631", 
    "api_key": "56616583f2464d185d5a773c4345254315edc6f922df783f5c1a06", 
    "delivery_latitude": "8.978175730472307", 
    "delivery_longitude": "-79.50813943743437", 
    "formula_type": 1,
    "map_keys":{
        "map_plan_type":1,
         
      "google_api_key":"AIzaSyDVkVjap_CH32oy6A3V6T_ewq9jIq8q5eY"
        } 
    }
const headers = {
  "Content-Type": "application/json"
}

class Gps extends Component {
state={
  data:[],
  modalInsertar: false,
  modalEliminar: false,
  fecha:{
  inicial: '',
  final: '',
  },
  form:{
    id: '',
    nombre: '',
    pais: 0,
    razon: '',
    razons: '',
    reference_id: '',
    tipoModal: '',
    aurest: 2,
    crediwallet: 2,
    wallettotal: 0,
    total: 0,
  }
}

peticionGet=()=>{

axios.post(url,dato,headers).then(response=>{
    console.log(response.data);
  this.setState({data: response.data.data});

}).catch(error=>{
  console.log(error.message);
})
}

peticionPost=async()=>{
  delete this.state.form.id;
 await axios.post(url,this.state.form).then(response=>{
    this.modalInsertar();
    this.peticionGet();
  }).catch(error=>{
    console.log(error.message);
  })
}

peticionPut=()=>{


  
    const urldato = "https://api.tookanapp.com/v2/fleet/wallet/create_transaction";
    const datowallet = {
      "api_key":"56616583f2464d185d5a773c4345254315edc6f922df783f5c1a06",
      "fleet_id":this.state.form.id,
      "amount":this.state.form.total,
      "transaction_type" : this.state.form.aurest,
      "reference_id": this.state.form.reference_id,
      "wallet_type" : this.state.form.crediwallet,
      "description" : this.state.form.razon
  }
  axios.post(urldato, datowallet, headers).then(response=>{
    this.modalInsertar();
    this.peticionGet();
  })
}

peticionDelete=()=>{
  axios.delete(url+this.state.form.id).then(response=>{
    this.setState({modalEliminar: false});
    this.peticionGet();
  })
}

modalInsertar=()=>{
  this.setState({modalInsertar: !this.state.modalInsertar});
}

seleccionarEmpresa=(empresa)=>{
  this.setState({
    tipoModal: 'actualizar',
    form: {
      id: empresa.fleet_id,
      nombre: empresa.name,
      pais: 'Cargando...',
      aurest: 2,
      crediwallet: 2,
      wallettotal: 'Cargando...',
      capital_bursatil: empresa.pais
    }
  })
  const urldato = "https://api.tookanapp.com/v2/fleet/wallet/read_transaction_history";
  const datowallet = {
    "api_key":"56616583f2464d185d5a773c4345254315edc6f922df783f5c1a06",
    "fleet_id":empresa.fleet_id,
    "wallet_type" : 2,
    "starting_date" : '2019-06-21',
    "ending_date" : '2023-06-21'
}
  axios.post(urldato,datowallet,headers).then(response=>{
     // var total = 0
     // const cart = response.data.data.transaction_history
     // for (var i = 0; i < cart.length; i++) {
      //  total = total + cart[i].amount
      // }
    // console.log(response.data.data)
    if(response.data.data.wallet_balance[0].wallet_type === 1){
      var crediwal = response.data.data.wallet_balance[0].wallet_balance;
    } else {
      crediwal = 'Cargando...';
    }
    this.setState({
      tipoModal: 'actualizar',
      form: {
        id: empresa.fleet_id,
        nombre: empresa.name,
        pais: response.data.data.wallet_balance[response.data.data.wallet_balance.length - 1].wallet_balance,
        aurest: 2,
        crediwallet: 2,
        wallettotal: crediwal,
        capital_bursatil: empresa.pais
      }
    })
    
  }).catch(error=>{
    console.log(error.message);
  })
  
}

handleChangeFecha=async e=>{
e.persist();
await this.setState({
  fecha:{
    ...this.state.fecha,
    [e.target.name]: e.target.value
  }
});
}

handleChange=async e=>{
e.persist();
await this.setState({
  form:{
    ...this.state.form,
    [e.target.name]: e.target.value
  }
});
}

  componentDidMount() {
    this.peticionGet();
  }
  

  render(){
    const {form}=this.state;

  return (
    <div className="App">
      <LoadScript
        googleMapsApiKey="AIzaSyDVkVjap_CH32oy6A3V6T_ewq9jIq8q5eY"
      >
      <DistanceMatrixService
            options={{
              destinations: [{ lat: 8.978175730472307, lng: -79.50813943743437 }],
              origins: [{ lat: 8.988113842010309, lng: -79.51823593617631 }],
              travelMode: "DRIVING",
            }}
            callback={(res) => {
              console.log("RESPONSE", res);
             
            }}
          />
          </LoadScript>
    <br />
<h1>GENERsssAL</h1>
    <br />
    <input  placeholder="Buscar..."/>
    <button className="btn btn-primary"><FontAwesomeIcon icon={faEdit}/></button>
    <table className="table ">
      <thead>
        <tr>
          <th>ID</th>
          <th>Distancia</th>
          <th>Total</th>
        </tr>
      </thead>
      <tbody>
        
      </tbody>
    </table>



    <Modal isOpen={this.state.modalInsertar} centered={true}>
                <ModalHeader style={{display: 'block'}}>
      
                  <span style={{float: 'right'}} onClick={()=>this.modalInsertar()}>x</span>
                </ModalHeader>
                <ModalBody>
                  <div className="form-group">
                    <label htmlFor="id">ID</label>
                    <input className="form-control" type="text" name="id" id="id" readOnly onChange={this.handleChange} value={form?form.id: this.state.data.length+1}/>
                    <br />
                    <label htmlFor="nombre">Distancia</label>
                    <input className="form-control" type="text" name="nombre" id="nombre" readOnly onChange={this.handleChange} value={form?form.nombre: ''}/>
                    <br />
                    <Container>
                    <Row>
                    <Col>
                    <label htmlFor="nombre">Wallet</label>
                    <input className="form-control" type="text" name="wallettotal" id="wallettotal" readOnly  onChange={this.handleChange} value={form.wallettotal !== 'Cargando...' ? '$' + form.wallettotal.toFixed(2) : form.wallettotal }/>
                    </Col>
                    <Col>
                    <label htmlFor="nombre">Credito</label>
                    <input className="form-control" type="text" name="pais" id="pais" readOnly  onChange={this.handleChange} value={form.pais !== 'Cargando...'? '$' + form.pais.toFixed(2) : form.pais }/>
                    </Col>
                    </Row>
                    <br />
                    
                    <select className="form-control" name="crediwallet" id="crediwallet" onChange={this.handleChange}> 
                      <option value="2">Credito</option>
                      <option value="1">Wallet</option>
                    </select>
                    <br />
                    <Row>
                    <Col>
                    <select className="form-control" name="aurest" id="aurest" onChange={this.handleChange}> 
                      <option value="2">Aumentar</option>
                      <option value="1">Restar</option>
                    </select>
                    </Col><Col>
                    <input className="form-control" type="number" inputmode="numeric" name="total" id="total" onChange={this.handleChange} value={form?form.capital_bursatil:''}/>
                    </Col>
                    </Row>
                    </Container>
                    <br />
                    <label htmlFor="nombre">Razon</label>
                    <input className="form-control" type="text" name="razon" id="razon"  onChange={this.handleChange} value={form? form.razon : ''}/>
                    <br />
                    <label htmlFor="nombre">Task ID</label>
                    <input className="form-control" type="number" inputmode="numeric" name="reference_id" id="reference_id"  onChange={this.handleChange} value={form? form.razons : ''}/>
                    
                  </div>
                </ModalBody>

                <ModalFooter>
                  {this.state.tipoModal==='insertar'?
                    <button className="btn btn-success" onClick={()=>this.peticionPost()}>
                    Insertar
                  </button>: <button className="btn btn-primary" onClick={()=>this.peticionPut()}>
                    Actualizar
                  </button>
  }
                    <button className="btn btn-danger" onClick={()=>this.modalInsertar()}>Cancelar</button>
                </ModalFooter>
          </Modal>


          <Modal isOpen={this.state.modalEliminar}>
            <ModalBody>
               Estás seguro que deseas eliminar a la empresa {form && form.nombre}
            </ModalBody>
            <ModalFooter>
              <button className="btn btn-danger" onClick={()=>this.peticionDelete()}>Sí</button>
              <button className="btn btn-secundary" onClick={()=>this.setState({modalEliminar: false})}>No</button>
            </ModalFooter>
          </Modal>
  </div>



  );
}
}
export default Gps;