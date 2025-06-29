import { useContext, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Cabin } from '../../models/CabinDTO';
import { Category } from '../../models/CategoryDTO';
import { AuthContext } from '../../component/AuthContext/AuthContext';

import cabania2Img from '../../component/Card/img/cabania2.jpg';  // IMPORTAR LA IMAGEN

import './DetalleCabania.css';
import { HeaderComponent } from '../../component/Header/HeaderComponent';

export const DetalleCabania = () => {
  
  const { id } = useParams<{ id: string }>();
  const [cabania, setCabania] = useState<Cabin | null>(null);
  const [categoria, setCategoria] = useState<Category | null>(null);

  const { token } = useContext(AuthContext);

  type serviceCabin = {
    wifi: boolean,
    estacionamiento: boolean,
    pileta: boolean,
    tv: boolean,
    climatizacion: boolean,
  };

  const serviciosPrueba: serviceCabin = {
    wifi: true,
    estacionamiento: true,
    pileta: true,
    tv: true,
    climatizacion: true,
  };

  useEffect(() => {
    if (!id) return;

    const headers: Record<string, string> = {};
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    fetch(`http://localhost:8080/cabins/${id}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })
      .then(res => {
        if (!res.ok) {
          if (res.status === 401) {
            throw new Error('No autorizado, token inválido o expirado');
          } else {
            throw new Error(`Error en la petición: ${res.status}`);
          }
        }
        return res.json();
      })
      .then(data => setCabania(data))
      .catch(err => console.error(err));
  }, [id, token]);

  useEffect(() => {
    if (!id) return;

    const headers: Record<string, string> = {};
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    fetch(`http://localhost:8080/categories/${id}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      }
    })
      .then(res => res.json())
      .then(data => setCategoria(data))
      .catch(err => console.log(err));
  }, [id, token]);

  if (!cabania) return <p>Cargando...</p>;

  return (
    <>
      <HeaderComponent />
      <div className="detalle-cabania container mt-4">
        <h2>{cabania.name}</h2>
        <h5 className="text-muted">{categoria?.description}</h5>

        <img src={cabania2Img} className="card-img-top img-custom" alt={cabania.name} />

        {/* Servicios */}
        <div className="mb-3 d-flex gap-3 flex-wrap">
          {Object.entries(serviciosPrueba)
            .filter(([_, value]) => value)
            .map(([key], idx) => (
              <span key={idx} className="badge p-2 icono-service">
                <i className={`bi bi-${getIcono(key)} me-2`}></i>{key}
              </span>
            ))}
        </div>

        {/* Descripción */}
        <p>{cabania.description}</p>
      </div>
    </>
  );
};

const getIcono = (servicio: string) => {
  switch (servicio) {
    case 'wifi': return 'wifi';
    case 'estacionamiento': return 'car-front-fill';
    case 'pileta': return 'water';
    case 'tv': return 'tv';
    case 'climatizacion': return 'snow';
    default: return 'check-circle';
  }
};
