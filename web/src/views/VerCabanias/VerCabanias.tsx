import { useContext, useEffect, useState } from 'react';
import { FaEdit, FaTrash, FaPlus } from 'react-icons/fa';
import { Tooltip } from 'react-tooltip';
import { useNavigate } from 'react-router-dom';
import { Cabin } from '../../models/CabinDTO';
import { AuthContext } from '../../component/AuthContext/AuthContext';

import * as bootstrap from 'bootstrap';
import 'react-tooltip/dist/react-tooltip.css';

import './VerCabanias.css';


{/*ESTA VISTA LISTA TODAS LAS CABAÑAS CARGADAS EN LA BASE DE DATOS */ }

export const VerCabanias = () => {
    const { token } = useContext(AuthContext);
    const [cabanias, setCabanias] = useState<Cabin[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [cabaniaAEliminar, setCabaniaAEliminar] = useState<Cabin | null>(null);

    const navigate = useNavigate();

    const handleAgregarProducto = () => {
        navigate('/administracion/nueva-cabania');
    }


    useEffect(() => {
        if (!token) return; // Espera hasta que el token esté listo

        setLoading(true);
        setError(null);

        fetch('http://localhost:8080/cabins/list', {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            }
        })
            .then((res) => {
                if (!res.ok) throw new Error('Error al obtener las cabañas');
                return res.json();
            })
            .then((data: Cabin[]) => {
                setCabanias(data);
            })
            .catch((err) => setError(err.message))
            .finally(() => setLoading(false));
    }, [token]);

    useEffect(() => {
        const tooltipTriggerList = document.querySelectorAll('[data-bs-toggle="tooltip"]');
        tooltipTriggerList.forEach(tooltipTriggerEl => {
            new bootstrap.Tooltip(tooltipTriggerEl);
        });
    }, [cabanias]);

    //Abrir Modal para confirmar eliminación de una cabaña
    const confirmarEliminar = (cabania: Cabin) => {
        setCabaniaAEliminar(cabania);
        const modal = new bootstrap.Modal(document.getElementById('confirmarModal')!);
        modal.show();
    };

    //Confirmación para eliminar una cabaña
    const handleConfirmDelete = async () => {
        if (!cabaniaAEliminar || !token) return;

        try {
            const res = await fetch(`http://localhost:8080/cabins/delete/${cabaniaAEliminar.id}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                }
            });

            if (!res.ok) throw new Error('Error al eliminar la cabaña');

            setCabanias(prev => prev.filter(c => c.id !== cabaniaAEliminar.id));
            setCabaniaAEliminar(null);

            const modal = bootstrap.Modal.getInstance(document.getElementById('confirmarModal')!);
            modal?.hide();
        } catch (err) {
            alert(`No se pudo eliminar la cabaña. ${err}`);
        }
    };

    //Información para el usuario
    if (loading) return <p>Cargando cabañas...</p>;
    if (error) return <p>Error: {error}</p>;
    
    return (
        <>
            <div className="title-container">
                <h1 className="title-custom">Cabañas Publicadas</h1>
            </div>

            {/* Botón Nueva Cabaña */}
            <div className='d-flex justify-content-end button-container'>
                <button className='button-new-custom' onClick={handleAgregarProducto}>
                     <FaPlus />
                </button>
            </div>

            {/* Tabla */}
            <div className='container-table'>
                <table className="table table-striped">
                    <thead>
                        <tr className="text-center">
                            <th>ID</th>
                            <th>Nombre</th>
                            <th>Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {cabanias.map((cabaña, index) => (
                            <tr key={cabaña.id}>
                                <th scope="row" className="text-center">{index + 1}</th>
                                <td className="text-center">{cabaña.name}</td>
                                <td className="text-center d-flex justify-content-center gap-2">
                                    <button
                                        className="btn p-1 text-warning"
                                        data-tooltip-id="tooltip"
                                        data-tooltip-content="Editar"
                                        onClick={() => navigate(`/administracion/editar-cabania/${cabaña.id}`)}
                                        style={{ background: 'none', border: 'none' }}
                                    >
                                        <FaEdit size={18} />
                                    </button>

                                    <button
                                        className="btn p-1 text-danger"
                                        data-tooltip-id="tooltip"
                                        data-tooltip-content="Eliminar"
                                        onClick={() => confirmarEliminar(cabaña)}
                                        style={{ background: 'none', border: 'none' }}
                                    >
                                        <FaTrash size={18} />
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                <Tooltip id="tooltip" place="top" className='my-tooltip' />
            </div>

            {/* Modal de Confirmación */}
            <div className="modal fade" id="confirmarModal" tabIndex={-1} aria-hidden="true">
                <div className="modal-dialog modal-dialog-centered">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title">Confirmar eliminación</h5>
                            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Cerrar"></button>
                        </div>
                        <div className="modal-body">
                            ¿Desea eliminar <strong>{cabaniaAEliminar?.name}</strong>?
                        </div>
                        <div className="modal-footer">
                            <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Cancelar</button>
                            <button type="button" className="btn btn-danger" onClick={handleConfirmDelete}>Eliminar</button>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};