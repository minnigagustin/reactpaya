import React, { Component } from 'react';
import './App.css';
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit } from '@fortawesome/free-solid-svg-icons';
import { Modal, ModalBody, ModalFooter, ModalHeader, Container, Row, Col } from 'reactstrap';
import firebase from "./firebase";
import _ from "lodash";
import moment from "moment";
import DataTable, { createTheme } from 'react-data-table-component';
import ReactExport from "react-data-export";

const ExcelFile = ReactExport.ExcelFile;
const ExcelSheet = ReactExport.ExcelFile.ExcelSheet;
const ExcelColumn = ReactExport.ExcelFile.ExcelColumn;
const url="https://us-central1-yappareports.cloudfunctions.net/tookanQuery";
const dato = {date: '2021-04-17'}
const headers = {
  "Content-Type": "application/json"
}


class Home extends Component {
state={
  data:[],
  progress: true,
  dataBackup:[],
  modalInsertar: false,
  modalEliminar: false,
  textSearch: "",
  desde: '',
  hasta: '',
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

    
axios.post(url,dato).then(response=>{
    console.log(response)
  this.setState({data: response.data.data,
    dataBackup: response.data.data});
  
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

convertArrayOfObjectsToCSV(args){
  var result, ctr, keys, columnDelimiter, lineDelimiter, data;

  data = args.data || null;
  if (data == null || !data.length) {
      return null;
  }

  columnDelimiter = args.columnDelimiter || ',';
  lineDelimiter = args.lineDelimiter || '\n';

  keys = Object.keys(data[0]);

  result = '';
  result += keys.join(columnDelimiter);
  result += lineDelimiter;

  data.forEach(function(item) {
      ctr = 0;
      keys.forEach(function(key) {
          if (ctr > 0) result += columnDelimiter;

          result += item[key];
          ctr++;
      });
      result += lineDelimiter;
  });

  return result;
}


downloadCSV(args){
  var data, filename, link;
  var csv = this.convertArrayOfObjectsToCSV({
      data: this.state.data
  });
  if (csv == null) return;

  filename = args.filename || 'export.csv';

  if (!csv.match(/^data:text\/csv/i)) {
      csv = 'data:text/csv;charset=utf-8,' + csv;
  }
  data = encodeURI(csv);

  link = document.createElement('a');
  link.setAttribute('href', data);
  link.setAttribute('download', filename);
  link.click();
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


filtrar(){
  if(this.state.desde === this.state.hasta){
    var items = this.state.dataBackup;
    var antes = moment(this.state.desde).format('YYYY-MM-DD');
    var despues = moment(this.state.hasta).add(1, 'days').format('YYYY-MM-DD');
  
   
 } else {

  var items = this.state.dataBackup;
  var antes = this.state.desde;
  var despues = this.state.hasta;
  
  }
  const resultad = _.filter(items, function(n) {
    const today = new Date();
const yesterday = new Date(today);
yesterday.setDate(today.getDate() - 1); 
const yesterdays = new Date(today);
yesterdays.setDate(today.getDate() - 7); 

     return moment(n.accepted_at).isBetween(antes, despues)})

  this.setState({data: resultad,
progress: false});

  

};

handleChange=async e=>{
e.persist();
await this.setState({
 
    [e.target.name]: e.target.value
  
});
}

onChangeSearch=async e=>{
  e.persist();
  const data = this.state.dataBackup
  const newData = data.filter(function(item){
    const itemData = item.restaurant_name.toUpperCase()
    const textData = e.target.value.toUpperCase()
    return itemData.indexOf(textData) > -1
  })


  this.setState({
    data: newData,
  
  })
}

  componentDidMount() {
    const ref = firebase.firestore().collection("orders");
    const eladio = [];
    ref.get().then((item) => {
      const items = item.docs.map((doc) => doc.data().orders[0]);
      const resultad = _.filter(items, function(n) {
        const today = new Date();
    const despues = new Date(today);
    despues.setDate(today.getDate()); 
    const antes = new Date(today);
    antes.setDate(today.getDate() - 7); 
         return moment(n.accepted_at).isBetween(antes, despues)})

        
        
        
      this.setState({data: resultad,
      dataBackup : items,
    progress: false,});
     
    
    });
    
  }
  

  render(){
    const {form}=this.state;
    const columns = [
      {
        name: 'Order ID',
        sortable: true,
        selector: 'id',
        },
        {
          name: 'Tipo',
          sortable: true,
          selector: 'type',
          },
        {
          name: 'Fecha',
          sortable: true,
          cell: row => <div>{moment(row.accepted_at).format("DD-MM-YYYY")}</div>,
          },
        {
          name: 'Nombre',
          sortable: true,
          cell: row => <div>{row.client_first_name} {row.client_last_name}</div>,
          },
          {
            name: 'Venta Total sin descuento',
            sortable: true,
            cell: row => <div>${row.total_price}</div>,
            },
            {
            name: 'Venta total c. descuento',
            sortable: true,
            cell: row => <div>${((row.total_price * 0.965) - 0.35).toFixed(2)}</div>,
            },
            {
            name: 'Descuento',
            sortable: true,
            cell: row => <div>${((row.total_price * 3.5) /100 + 0.35).toFixed(2)}</div>,
            },
            {
          name: 'Metodo',
          sortable: true,
          selector: 'payment',
          },
            {
              name: 'Mail',
              sortable: true,
              selector: 'client_email',
              },
      {
        name: 'Comercio',
        selector: 'year',
        sortable: true,
        right: true,
        selector: 'restaurant_name',
      },
    ];
    createTheme('solarized', {
      text: {
        primary: '#268bd2',
        
        secondary: '#2aa198',
      },
      background: {
        default: '#002b36',
      },
      context: {
        background: '#cb4b16',
        text: '#FFFFFF',
      },
      divider: {
        default: '#073642',
      },
      action: {
        button: 'rgba(0,0,0,.54)',
        hover: 'rgba(0,0,0,.08)',
        disabled: 'rgba(0,0,0,.12)',
      },
    });
    return (
    <div className="App">
    <br />
<h1>INFORME</h1>
    <br /><Container>
    <input  className="form-control" placeholder="Buscar..." onChange={this.onChangeSearch}/>
    <br />
    
                  <ExcelFile filename="reporte" element={<button className="btn btn-success" style={{ width: '98%' }}>
                    Exportar Excel >>
                  </button>}>
                <ExcelSheet data={this.state.data} name="Reporte">
                    <ExcelColumn label="Order ID" value="id"/>
                    <ExcelColumn label="Tipo" value="type"/>
                    <ExcelColumn label="Fecha" value={col => moment(col.accepted_at).format("DD-MM-YYYY")}/>
                    <ExcelColumn label="Nombre" value={col => col.client_first_name + ' ' + col.client_last_name} />
                    <ExcelColumn label="Mail" value="client_email"/>
                    <ExcelColumn label="Venta Total sin descuento" value="total_price"/>
                    <ExcelColumn label="Venta total con descuento" value={col => ((col.total_price * 0.965) - 0.35).toFixed(2)}/>
                    <ExcelColumn label="Descuento" value={col => ((col.total_price * 3.5) /100 + 0.35).toFixed(2)}/>
                    <ExcelColumn label="Metodo" value="payment"/>
                    <ExcelColumn label="Restaurante" value="restaurant_name"/>
                    
                </ExcelSheet>

            </ExcelFile>
    <Row>
                    <Col>
                    <label htmlFor="nombre">Desde</label>
     <input type="date" name="text" className="form-control" id="desde"  onChange={this.handleChange} name="desde" />
     </Col>
     <Col>
     <label htmlFor="nombre">Hasta</label>
     <input type="date" name="text" className="form-control" id="hasta" onChange={this.handleChange} name="hasta"/>
     </Col>
     </Row><div>
     <br/></div>
     <button className="btn btn-success" style={{ width: '98%' }} onClick={() => this.filtrar()}>
                    Filtrar Fechas >>
                  </button>
                  </Container> 
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
export default Home;