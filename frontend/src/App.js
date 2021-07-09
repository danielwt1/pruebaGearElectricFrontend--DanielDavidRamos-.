
import React, { useEffect, useState } from 'react';
import './App.css';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Modal, TextField, Button } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';

import axios from 'axios';
import MaterialTable from 'material-table';
const apiURL = 'http://localhost:4000/api/asistentes'
const columnas = [
  {
    title: 'Nombres y Apellidos', field: 'nombreApellido'
  },
  {
    title: 'Tipo de documento', field: 'TipoDoc'
  },
  {
    title: 'Numero de documento', field: 'numeroDoc'
  },
  {
    title: 'Celular', field: 'celular', type: 'numeric'
  },
  {
    title: 'E-mail', field: 'email'
  }

];

const useStyles = makeStyles((theme) => ({
  modal: {
    position: 'absolute',
    width: 400,
    backgroundColor: theme.palette.background.paper,
    border: '2px solid #000',
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3),
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)'
  },
  iconos: {
    cursor: 'pointer'
  },
  inputMaterial: {
    width: '100%'
  }
}));




function App() {
  const styles = useStyles();
  const [data, setData] = useState([]);
  const [modalInsertar, setModalInsert] = useState(false);
  const[modalEditar,setModalEditar]=useState(false);
  const[modalDelete,setModalDelete]=useState(false);
  const [asistenteSeleccionado,setAsistenteSelect]=useState({
    nombreApellido:"",    
    TipoDoc:"",
    numeroDoc:"",
    celular:0,
    email:""
  })
  const handleChange=e=>{
    const{name,value}=e.target;
    setAsistenteSelect(prevState=>({
      ...prevState,
      [name]:value
    }));
    console.log(asistenteSeleccionado);
  }
  const seleccionarAsistente=(asistente,caso)=>{
    setAsistenteSelect(asistente);
    (caso==="Editar") ? abrirCerrarModalEdit()
    :
    abrirCerrarModalDelete()
  }
  const peticionGet = async () => {
   const res= await axios.get(apiURL)
   setData(res.data);
    

  }
  const peticionPost=async()=>{
    
    abrirCerrarModalInsert();
    peticionGet();
    //console.log(asistenteSeleccionado);
    const res=await axios.post(apiURL,asistenteSeleccionado);
    console.log("hh"+res);
    setData(data.concat(res.data));
    //console.log(data)
    
    
    
  }
  //
  const peticionPut=async()=>{
    peticionGet();
    abrirCerrarModalEdit();
    
    
    await axios.put(apiURL+"/"+asistenteSeleccionado._id,asistenteSeleccionado)
    
    .then(res=>{
      var dataNueva=data;
      dataNueva.map(asistente=>{
        if(asistente._id===asistenteSeleccionado._id){          
          asistente.asistente=asistenteSeleccionado.asistente;
          
        }
      });
      
      setData(dataNueva);  
      
    
    }).catch(error=>{
      
      console.log(error);
    })
    
    
    
  }
  const peticionDelete=async()=>{
    await axios.delete(apiURL+"/"+asistenteSeleccionado._id)
    .then(response=>{
      setData(data.filter(asistente=>asistente._id==asistenteSeleccionado._id));
      peticionGet();
    }).catch(error=>{
      console.log(error);
    })
    abrirCerrarModalDelete();
  }
  const abrirCerrarModalInsert = () => {
    setModalInsert(!modalInsertar);
  }
  const abrirCerrarModalEdit = () => {
    setModalEditar(!modalEditar);
  }
  const abrirCerrarModalDelete = () => {
    setModalDelete(!modalDelete);
  }
  
  useEffect(() => {
    peticionGet();
  }, [])

  const bodyInsertar = (
    <div className={styles.modal}>
      <h3>Agregar Nuevo Asistente a evento</h3>
      <TextField maxLength={100} className={styles.inputMaterial} label="Nombres y Apellidos" name="nombreApellido" onChange={handleChange} />
      <br />
      <TextField className={styles.inputMaterial} label="Escribir si es [ C.E,C.C o Pasaporte]" name="TipoDoc" onChange={handleChange} />
      <br />
      <TextField maxLength={30} className={styles.inputMaterial} label="Numero de documento" name="numeroDoc" onChange={handleChange} />
      <br />
      <br />
      <TextField type="number"maxLength={10} className={styles.inputMaterial} label="Celular" name="celular" onChange={handleChange} />
      <br />
      <TextField type="email" className={styles.inputMaterial} label="E-Mail" name="email" onChange={handleChange} />
      <br /><br />
      <div align="right">
        <Button color="primary" onClick={() => peticionPost()}>Insertar</Button>
        <Button onClick={() => abrirCerrarModalInsert()}>Cancelar</Button>
      </div>
    </div>
  )
  const bodyEditar = (
    <div className={styles.modal}>
      <h3>Editar  Asistente a evento</h3>
      <TextField maxLength={100} className={styles.inputMaterial} label="Nombres y Apellidos" name="nombreApellido" onChange={handleChange} value={asistenteSeleccionado&&asistenteSeleccionado.nombreApellido}/>
      <br />
      <TextField className={styles.inputMaterial} label="País" name="TipoDoc" onChange={handleChange} value={asistenteSeleccionado&&asistenteSeleccionado.TipoDoc}/>
      <br />
      <TextField maxLength={30} className={styles.inputMaterial} label="Numero de documento" name="numeroDoc" onChange={handleChange} value={asistenteSeleccionado&&asistenteSeleccionado.numeroDoc}/>
      <br />
      <br />
      <TextField type="number" maxLength={10} className={styles.inputMaterial} label="Celular" name="celular" onChange={handleChange} value={asistenteSeleccionado&&asistenteSeleccionado.celular}/>
      <br />
      <TextField type="email" className={styles.inputMaterial} label="E-Mail" name="email" onChange={handleChange} value={asistenteSeleccionado&&asistenteSeleccionado.email}/>
      <br /><br />
      <div align="right">
        <Button color="primary" onClick={() => peticionPut()}>Editar</Button>
        <Button onClick={() => abrirCerrarModalEdit()}>Cancelar</Button>
      </div>
    </div>
  )
  const bodyEliminar=(
    <div className={styles.modal}>
      <p>Estás seguro que deseas eliminar  <b>{asistenteSeleccionado && asistenteSeleccionado.nombreApellido}</b>? </p>
      <div align="right">
        <Button color="secondary" onClick={()=>peticionDelete()}>Sí</Button>
        <Button onClick={()=>abrirCerrarModalDelete()}>No</Button>

      </div>

    </div>
  )



  return (

    <div>
      <br />
      <Button onClick={() => abrirCerrarModalInsert()}>Añadir Asistente al evento</Button>
      <br />
      <link rel="stylesheet" href="https://fonts.googleapis.com/icon?family=Material+Icons"></link>
      <MaterialTable
        columns={columnas}
        data={data}
        title="Prueba Gear Asistentes"
        actions={[
          {
            icon: 'edit',
            tooltip: 'Editar asistente',
            onClick: (event, rowData) => seleccionarAsistente(rowData,"Editar")
          },
          {
            icon: 'delete',
            tooltip: 'Eliminar asistente',
            onClick: (event, rowData) => seleccionarAsistente(rowData,"Eliminar")
          }

        ]}
        options={{
          actionsColumnIndex: -1
        }}
        localization={{
          header: {
            actions: 'Acciones'
          }
        }}
      />
      <Modal
        open={modalInsertar}
        onClose={abrirCerrarModalInsert} >
        {bodyInsertar}
      </Modal>
      <Modal open={modalEditar}
        onClose={abrirCerrarModalEdit} >
        {bodyEditar}

      </Modal>
      <Modal open={modalDelete}
        onClose={abrirCerrarModalDelete} >
        {bodyEliminar}

      </Modal>
    </div>
  );
}

export default App;
