import React from 'react';
import * as ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './component/AuthContext/AuthContext';
import { Home } from './views/Home/Home';
import { FormNuevaCabania } from './views/NuevaCabania/FormNuevaCabania';
import { VerCabanias } from './views/VerCabanias/VerCabanias';
import { EditarCabania } from './views/EditarCabania/EditarCabania';
import { DetalleCabania } from './views/DetalleCabania/DetalleCabania'
import { Registro } from './views/Registro/Registro';
import { Login } from './views/Login/Login';

import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css'
import { MainLayout } from './component/MainLayout/MainLayout';
import { VerUsuarios } from './views/VerUsuarios/VerUsuarios';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* CONTENEDOR CON HEADER Y FOOTER */}
          <Route path='/' element={<MainLayout />}>

            {/*PÁGINA PRINCIPAL */}
            <Route path="/" element={<Navigate to="/home" replace />} />
            <Route path="/home" element={<Home />} />
            
            {/*REGISTRO*/}
            <Route path='/auth/register' element={<Registro />}></Route>

            {/*LOGIN*/}
            <Route path='/auth/login' element={<Login />}></Route>

            {/*FORMULARIO QUE PERMITE CARGAR UNA NUEVA CABAÑA EN LA BASE DE DATOS */}
            <Route path="/administracion/nueva-cabania" element={<FormNuevaCabania />} />

            {/*LISTA DE TODAS LAS CABAÑAS CARGADAS EN LA BASE DE DATOS */}
            <Route path="/administracion/listar-cabanias" element={<VerCabanias />} />

            {/*ESTA VISTA PERMITE EDITAR TODOS LOS CAMPOS DE UNA CABAÑA YA CREADA */}
            <Route path="/administracion/editar-cabania/:id" element={<EditarCabania />} />

            {/* DETALLE DE CASA CABAÑA */}
            <Route path="/cabania/:id" element={<DetalleCabania />} />

            {/*ESTA VISTA PERMITE VER TODOS LOS USUARIOS Y MODIFICAR SU ROLE */}
            <Route path="/administracion/listar-usuarios" element={<VerUsuarios />} />
            
          </Route>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  </React.StrictMode>
);
