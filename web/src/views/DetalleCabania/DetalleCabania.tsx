import React, { useState, useEffect, useContext } from 'react';
import { useParams } from 'react-router-dom';
import { Cabin } from '../../models/CabinDTO';
import { AuthContext } from '../../component/AuthContext/AuthContext';
import {
  FaWifi,
  FaSnowflake,
  FaPaw,
  FaSwimmingPool,
  FaTv,
  FaCar,
  FaCoffee,
  FaFire,
  FaTemperatureLow,
  FaTshirt,
  FaUtensils,
  FaShower,
  FaBinoculars,
  FaLeaf,
  FaHome,
  FaShieldAlt,
  FaCheckCircle,
} from 'react-icons/fa';

import './DetalleCabania.css';

export const DetalleCabania = () => {
  const { id } = useParams<{ id: string }>();
  const [cabania, setCabania] = useState<Cabin | null>(null);
  const { token } = useContext(AuthContext);

  // Estados para modal
  const [modalOpen, setModalOpen] = useState(false);
  const [modalImage, setModalImage] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;

    fetch(`http://localhost:8080/cabins/${id}`, {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => res.ok ? res.json() : Promise.reject(res.status))
      .then(data => setCabania(data))
      .catch(err => console.error(err));
  }, [id, token]);

  if (!cabania) return <p>Cargando...</p>;

  const servicios = cabania.features || [];

  // Abrir modal con imagen
  const openModal = (src: string) => {
    setModalImage(src);
    setModalOpen(true);
  };

  // Cerrar modal
  const closeModal = () => setModalOpen(false);

  return (
    <>
      <div className="detalle-cabania container mt-4">
        <div className="title-container">
          <h1 className="title-custom">{cabania.name}</h1>
        </div>

        {/* Mostrar todas las imágenes en un cuadro */}
        <div className="imagenes-cuadro mb-4">
          {cabania.images.map(img => {
            const src = `data:image/jpeg;base64,${img.data.replace(/\s/g, '')}`;
            return (
              <img
                key={img.id}
                src={src}
                alt={img.fileName}
                className="imagen-detalle"
                onClick={() => openModal(src)}
                style={{ cursor: 'pointer' }}
              />
            );
          })}
        </div>

        {/* Modal */}
        {modalOpen && modalImage && (
          <div className="modal-overlay" onClick={closeModal}>
            <div className="modal-content" onClick={e => e.stopPropagation()}>
              <img src={modalImage} alt="Imagen ampliada" />
              <button className="modal-close" onClick={closeModal}>Cerrar</button>
            </div>
          </div>
        )}

        {/* Resto del detalle */}
        <h6 className="text-muted text-end">Categoría: {cabania.category.name}</h6>
        <h5><strong>¿Que ofrece esta cabaña?</strong></h5>
        <h5 className="text-muted">{cabania.category?.description}</h5>
        <p>{cabania.description}</p>
        <h5><strong>¿Donde se encuentra?</strong></h5>
        <p>
          <strong>Dirección:</strong> {cabania.address.street} {cabania.address.number}, {cabania.address.location}, {cabania.address.province}, {cabania.address.country}
        </p>
        <br />
        <h5><strong>CARACTERÍSTICAS</strong></h5>
        <br />
        <div
          className={`d-flex flex-wrap gap-3 px-3 ${servicios.length > 2 ? 'justify-content-center' : 'justify-content-start'
            }`}
        >
          {servicios.map((servicio, idx) => (
            <span key={idx} className="icono-service d-flex align-items-center me-3">
              {getIcono(servicio.name, 20, '#3a9d23')}
              <span style={{ marginLeft: '6px' }}>{servicio.name}</span>
            </span>
          ))}
        </div>
      </div>
    </>
  );
};

// Tu función getIcono, como antes
const getIcono = (nombre: string, size = 24, color = '#4caf50'): React.ReactElement => {
  const lower = nombre.toLowerCase();

  const iconos = [
    { keywords: ['wifi'], icon: FaWifi },
    { keywords: ['aire'], icon: FaSnowflake },
    { keywords: ['mascota'], icon: FaPaw },
    { keywords: ['pileta', 'piscina'], icon: FaSwimmingPool },
    { keywords: ['tv'], icon: FaTv },
    { keywords: ['estacionamiento', 'auto'], icon: FaCar },
    { keywords: ['desayuno'], icon: FaCoffee },
    { keywords: ['parrilla', 'asador'], icon: FaFire },
    { keywords: ['calefaccion'], icon: FaTemperatureLow },
    { keywords: ['cocina'], icon: FaUtensils },
    { keywords: ['balcon'], icon: FaBinoculars },
    { keywords: ['jardin'], icon: FaLeaf },
    { keywords: ['seguridad'], icon: FaShieldAlt },
  ];

  const match = iconos.find(item =>
    item.keywords.some(keyword => lower.includes(keyword))
  );

  const IconComponent = match ? match.icon : FaCheckCircle;

  return <IconComponent size={size} color={color} />;
};
