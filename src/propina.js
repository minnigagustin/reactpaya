import React, { Component } from 'react';
import './App.css';
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit } from '@fortawesome/free-solid-svg-icons';
import { Modal, ModalBody, ModalFooter, ModalHeader, Container, Row, Col } from 'reactstrap';
import _ from "lodash";
import moment from "moment";
import DataTable, { createTheme } from 'react-data-table-component';
import ReactExport from "react-data-export";

const ExcelFile = ReactExport.ExcelFile;
const ExcelSheet = ReactExport.ExcelFile.ExcelSheet;
const ExcelColumn = ReactExport.ExcelFile.ExcelColumn;

const url = "https://api.tookanapp.com/v2/get_job_and_fleet_details";
const dato = {api_key: '56616583f2464d185d5a773c4345254315edc6f922df783f5c1a06'}
const headers = {
  "Content-Type": "application/json"
}

class Propina extends Component {
state={
  data:[],
  dataBackup:[],
  modalInsertar: false,
  modalEliminar: false,
  total: 0,
  textSearch: "",
  fecha:{
  inicial: '',
  final: '',
  },
  noti:{
    id: 0,
    nombre: '',
    total: 0
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



peticionPrimera = () => {


  const dato = {
    "api_key": "56616583f2464d185d5a773c4345254315edc6f922df783f5c1a06",
    "team_id": "449045",
    "date": moment().subtract(6, "days").format("YYYY-MM-DD"),
  }
  axios.post(url, dato, headers).then(response => {
    // console.log(response.data);
    const jobList = _.get(response.data, 'data.teams.449045.jobs');
    const jobsNumbers = _.map(jobList, 'job_id');
    const jobsNumbersSplit = _.chunk(jobsNumbers, 100);
    // console.log(jobsNumbersSplit)



  var arraynuevo = [];

    for (const jobNumberArray of jobsNumbersSplit) {

      const urldato = "https://api.tookanapp.com/v2/get_job_details";
      const datowallet = {
        "api_key": "56616583f2464d185d5a773c4345254315edc6f922df783f5c1a06",
        "job_ids": jobNumberArray,
        "include_task_history": 0
      }
      axios.post(urldato, datowallet, headers).then(response => {

        const jobsListDetails = _.get(response.data, 'data');
        

          arraynuevo = _.concat(arraynuevo, jobsListDetails)
          const resultad = _.filter(arraynuevo, {'job_status': 2})
          const nashe = _.filter(resultad, 'order_id');
    const result = _.filter(nashe, {'job_type': 1})
    const resulta = result.filter(
      (item) => item.custom_field[11].label != 'Items'
    );
       //console.log(arraynuevo);
       this.setState({data : resulta,
      dataBackup : resulta });

        
        console.log(this.state.data[1]);
      

       

        
      });
      
    }
    
  })
}

peticionGet=()=>{

axios.post(url,dato,headers).then(response=>{

  
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

handleChangeNoti=async e=>{
  e.persist();
  await this.setState({

      [e.target.name]: e.target.value
    
  });
  }

  seleccionarNoti=(empresa)=>{
    const urldato = "https://api.tookanapp.com/v2/fleet/wallet/create_transaction";
    const datowallet = {
      "api_key":"56616583f2464d185d5a773c4345254315edc6f922df783f5c1a06",
      "fleet_id":1060358,
      "amount":(empresa.custom_field[11].data - ((empresa.custom_field[11].data * 3.5) / 100)).toFixed(2),
      "transaction_type" : 2,
      "reference_id": String(empresa.job_id),
      "wallet_type" : 2,
      "description" : 'Propina del pedido: ' + empresa.job_id
  }
  axios.post(urldato, datowallet, headers).then(response=>{

  })

  const urlprofile = "https://api.tookanapp.com/v2/view_fleet_profile";
    const datoprofile = {
      "api_key":"56616583f2464d185d5a773c4345254315edc6f922df783f5c1a06",
      "fleet_id":1060358,
  }
  axios.post(urlprofile, datoprofile, headers).then(response=>{
console.log(response.data.data.fleet_details[0])
  
var cars = this.state.data.filter(function(car) {
  return car.job_id != empresa.job_id ; 
});
    this.setState({
      total: 0,
      data : cars,
      noti: {
        id: empresa.fleet_id,
        nombre: response.data.data.fleet_details[0].first_name + ' ' + response.data.data.fleet_details[0].last_name,
        total: (empresa.custom_field[11].data - ((empresa.custom_field[11].data * 3.5) / 100)).toFixed(2)
      },
      modalEliminar: !this.state.modalEliminar
    })
  })
    
  }
  

  peticionDoble = () => {


    const urlnueva = "https://api.tookanapp.com/v2/get_all_tasks";
    const dato = {
      "api_key": "56616583f2464d185d5a773c4345254315edc6f922df783f5c1a06",
      "job_status": 9,
  "job_type": 1,
  "start_date": "2021-09-21",
  "end_date": "2021-09-22",
    }
    axios.post(urlnueva, dato, headers).then(response => {
    console.log(response.data);
    this.setState({data: response.data.data,
        dataBackup: response.data.data});
      
    })
  }

onChangeSearch=async e=>{
  e.persist();
  const data = this.state.dataBackup
  const newData = data.filter(function(item){
    const itemData = String(item.job_id)
    const textData = e.target.value
    return itemData.indexOf(textData) > -1
  })


  this.setState({
    data: newData,
  
  })
}

  componentDidMount() {
    //this.peticionGet();
    this.peticionPrimera();
  }

  
  
  EnviarNoti = () => {

    const notiid = [];
    notiid.push(this.state.noti.id)
    const urlnueva = "https://api.tookanapp.com/v2/send_notification";
    const dato = {
      "api_key": "56616583f2464d185d5a773c4345254315edc6f922df783f5c1a06",
      "fleet_ids": notiid,
      "message": "Hola " + this.state.noti.nombre + ", hemos realizado una transferencia a tu cuenta por $" + this.state.total,
    }
    axios.post(urlnueva, dato, headers).then(response => {
    console.log(response.data);
    this.setState({
      modalEliminar: !this.state.modalEliminar
    })
      
    })
  }

  render(){
    const {form}=this.state;
    const columns = [
      {
        name: 'Order ID',
        sortable: true,
        cell: row => row['job_id'],
        },
        {
          name: 'Nombre',
          sortable: true,
          cell: row => <div>{row.custom_field[0].data ? row.custom_field[0].data : row.custom_field[1].data}</div>,
          },
          {
            name: 'Propina',
            sortable: true,
            cell: row => <div>{row.custom_field[11].label != 'Items' ? '$' + row.custom_field[11].data : 'SIN PROPINA'}</div>,
            },
            {
            name: '3.5%',
            sortable: true,
            cell: row => <div>{row.custom_field[11].label != 'Items' ? '$' + ((row.custom_field[11].data * 3.5) / 100).toFixed(2) : 'SIN PROPINA'}</div>,
            },
            {
              name: 'Recibe',
              sortable: true,
              cell: row => <div>{row.custom_field[11].label != 'Items' ? '$' + (row.custom_field[11].data - ((row.custom_field[11].data * 3.5) / 100)).toFixed(2) : 'SIN PROPINA'}</div>,
              },
            {
              name: 'Motorizado',
              sortable: true,
              cell: row => <div><button className="btn btn-success" onClick={()=>{this.seleccionarNoti(row);}}>{row.fleet_id}</button></div>,
              }
    ];

  return (
    <div className="App">
    <br />
<h1>PROPINAS</h1>
    <br />
    <input  placeholder="Buscar..." onChange={this.onChangeSearch}/>
    <ExcelFile filename="reporte" element={<button className="btn btn-success" style={{ width: '98%', margin: '6px' }}>
                    Exportar Excel >>
                  </button>}>
                <ExcelSheet data={this.state.data} name="Reporte">
                    <ExcelColumn label="Job ID" value="job_id"/>
                    <ExcelColumn label="Nombre" value={col => col.custom_field[0].data ? col.custom_field[0].data : col.custom_field[1].data} />

                    <ExcelColumn label="Venta Total sin descuento" value={col => col.custom_field[11].label != 'Items' ? '$' + col.custom_field[11].data : 'SIN PROPINA'}/>
                    <ExcelColumn label="Venta total con descuento" value={col => col.custom_field[11].label != 'Items' ? '$' + ((col.custom_field[11].data * 3.5) / 100).toFixed(2) : 'SIN PROPINA'}/>
                    <ExcelColumn label="Recibe" value={col => col.custom_field[11].label != 'Items' ? '$' + (col.custom_field[11].data - ((col.custom_field[11].data * 3.5) / 100)).toFixed(2) : 'SIN PROPINA'}/>
                    <ExcelColumn label="Motorizado" value="fleet_id"/>
                    
                </ExcelSheet>

            </ExcelFile>

            

    <DataTable
    
    columns={columns}
    data={this.state.data}
    // theme="solarized"
    pagination={true}
    responsive={true}
    progressPending={this.state.progress}
 
  
  />
  

    <Modal isOpen={this.state.modalInsertar} centered={true}>
                <ModalHeader style={{display: 'block'}}>
      
                  <span style={{float: 'right'}} onClick={()=>this.modalInsertar()}>x</span>
                </ModalHeader>
                <ModalBody>
                  <div className="form-group">
                    <label htmlFor="id">ID</label>
                    <input className="form-control" type="text" name="id" id="id" readOnly onChange={this.handleChange} value={form?form.id: this.state.data.length+1}/>
                    <br />
                    <label htmlFor="nombre">Nombre</label>
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


          <Modal isOpen={this.state.modalEliminar} centered={true}>
            <ModalBody>
            <div className="form-group">
                   
                    <label htmlFor="nombre">Monto depositado a {this.state.noti.nombre + ' '} </label>
                    <label htmlFor="nombr"> - TOTAL: {' ' + this.state.noti.total}</label>
                   
                  </div>
            </ModalBody>
            <ModalFooter>
              
              <button className="btn btn-danger" onClick={()=>this.setState({modalEliminar: false})}>Salir</button>
            <button className="btn btn-success" onClick={()=>this.EnviarNoti()}>Notificacion</button>
            </ModalFooter>
          </Modal>
  </div>



  );
}
}
export default Propina;