// src/pages/EditarCabania.tsx
import { useContext, useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { CabinForm } from '../../component/CabinForm/CabinForm';
import { AuthContext } from '../../component/AuthContext/AuthContext';
import { Cabin } from '../../models/CabinDTO';

export const EditarCabania = () => {
  const { token } = useContext(AuthContext);
  const { id } = useParams();
  const navigate = useNavigate();

  const [cabinData, setCabinData] = useState<Cabin | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`http://localhost:8080/cabins/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => {
        if (!res.ok) throw new Error('No autorizado o error en la API');
        return res.json();
      })
      .then((data: Cabin) => {
        setCabinData(data);
      })
      .catch((err) => {
        console.error('Error al obtener la cabaña:', err);
        alert('Error al cargar la cabaña');
      })
      .finally(() => setLoading(false));
  }, [id]);

  const handleUpdate = async (formData: FormData) => {
    try {
      const res = await fetch('http://localhost:8080/cabins/update', {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      if (res.ok) {
        alert('Cabaña actualizada correctamente');
        navigate('/cabins'); // o la ruta que tengas
      } else {
        alert('Error al actualizar la cabaña');
      }
    } catch (err) {
      console.error('Error al enviar los datos:', err);
      alert('Error de conexión con el servidor');
    }
  };

  if (loading) return <div>Cargando cabaña...</div>;
  if (!cabinData) return <div>No se pudo cargar la cabaña.</div>;

  return (
    <>
      <div className="title-container">
        <h1 className="title-custom title-underline">Editar Cabaña</h1>
      </div>
      <CabinForm
        initialData={cabinData}
        onSubmit={handleUpdate}
        submitLabel="Actualizar"
      />
    </>
  );
};
