import React, { useEffect, useState } from 'react';
import './VerCabanias.css';
import { NavBarAdminComponent } from '../../component/NavBarAdmin/NavBarAdminComponent';
import { FaEdit, FaTrash } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

{/*ESTA VISTA LISTA TODAS LAS CABAÑAS CARGADAS EN LA BASE DE DATOS */}

type Address = {
    id?: number;
    street: string;
    number: number;
    location: string;
    province: string;
    country: string;
};

type Cabin = {
    id: number;
    name: string;
    description: string;
    image: string | null;
    capacity: number;
    rating: number;
    price: number;
    address: Address;
    categoryId: number;
};

export const VerCabanias = () => {
    const [cabanias, setCabanias] = useState<Cabin[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const navigate = useNavigate();

    useEffect(() => {
        fetch('http://localhost:8080/cabins/list')
            .then((res) => {
                if (!res.ok) throw new Error('Error al obtener las cabañas');
                return res.json();
            })
            .then((data: Cabin[]) => {
                setCabanias(data);
                setLoading(false);
            })
            .catch((err) => {
                setError(err.message);
                setLoading(false);
            });
    }, []);

    if (loading) return <p>Cargando cabañas...</p>;
    if (error) return <p>Error: {error}</p>;

    const handleDelete = async (id: number) => {
        
        try {
            const res = await fetch(`http://localhost:8080/cabins/delete/${id}`, {
                method: 'DELETE',
            });

            if (!res.ok) throw new Error('Error al eliminar la cabaña');

            // Filtrar la cabaña eliminada de la lista
            setCabanias(prev => prev.filter(cabania => cabania.id !== id));
        } catch (err) {
            alert(`No se pudo eliminar la cabaña. ${err}`);
        }
    };


    return (
        <>
            <NavBarAdminComponent />
            <h2 className="list-title">Cabañas Publicadas</h2>
            <div className='container-table'>
                <table className="table table-striped">
                    <thead>
                        <tr className="text-center">
                            <th>ID</th>
                            <th>Nombre</th>
                            <th>Descripción</th>
                            <th>Capacidad</th>
                            <th>Precio</th>
                            <th>Dirección</th>
                            <th>Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {cabanias.map((cabaña, index) => (
                            <tr key={cabaña.id} className='fila'>
                                <th scope="row" className="text-center">{index + 1}</th>
                                <td className="text-center">{cabaña.name}</td>
                                <td className="text-center">{cabaña.description}</td>
                                <td className="text-center">{cabaña.capacity}</td>
                                <td className="text-center">${cabaña.price}</td>
                                <td className="text-center">
                                    {cabaña.address.street} {cabaña.address.number}, {cabaña.address.location}, {cabaña.address.province}, {cabaña.address.country}
                                </td>
                                <td className="text-center">
                                    <FaEdit
                                        className="icon edit-icon"
                                        onClick={() => navigate(`/administracion/editar-cabania/${cabaña.id}`)}
                                    />
                                    <FaTrash
                                        className="icon delete-icon"
                                        onClick={() => handleDelete(cabaña.id)}
                                    />
                                </td>

                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </>
    );
};
