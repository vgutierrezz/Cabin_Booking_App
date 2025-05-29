import React from 'react';
import * as ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Home } from './views/Home/Home';
import { FormNuevaCabania } from './views/NuevaCabania/FormNuevaCabania';
import { VerCabanias } from './views/VerCabanias/VerCabanias';
import { EditarCabania } from './views/EditarCabania/EditarCabania';

import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        {/*PÁGINA PRINCIPAL PARA EL USUARIO */}
        <Route path="/home" element={<Home/>} />
        {/*FORMULARIO QUE PERMITE CARGAR UNA NUEVA CABAÑA EN LA BASE DE DATOS */}
        <Route path="/administracion/nueva-cabania" element={<FormNuevaCabania/>} />

        {/*LISTA DE TODAS LAS CABAÑAS CARGADAS EN LA BASE DE DATOS */}
        <Route path="/administracion/listar-cabanias" element={<VerCabanias/>} />

        {/*ESTA VISTA PERMITE EDITAR TODOS LOS CAMPOS DE UNA CABAÑA YA CREADA */}
        <Route path="/administracion/editar-cabania/:id" element={<EditarCabania/>} />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
);
