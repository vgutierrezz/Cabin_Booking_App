import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { NavBarAdminComponent } from '../../component/NavBarAdmin/NavBarAdminComponent';
import './EditarCabania.css';

type Address = {
    id: number,
    street: string;
    number: number;
    location: string;
    province: string;
    country: string;
};

type Categoria = {
    id: number;
    name: string;
    description: string;
};

type FormData = {
    id: number,
    name: string;
    description: string;
    image: File | null;
    capacity: number;
    rating: number;
    price: number;
    categoryId: number | '';
    address: Address;
};

export const EditarCabania = () => {
    const { id } = useParams<{ id: string }>(); // obtener id desde URL
    const navigate = useNavigate();

    const [formData, setFormData] = useState<FormData>({
        id: 0,
        name: '',
        description: '',
        image: null,
        capacity: 0,
        rating: 0,
        price: 0,
        categoryId: '',
        address: {
            id: 0,
            street: '',
            number: 0,
            location: '',
            province: '',
            country: '',
        },
    });

    const [categorias, setCategorias] = useState<Categoria[]>([]);

    // Cargar datos de la cabaña
    useEffect(() => {
        if (!id) return;

        fetch(`http://localhost:8080/cabins/${id}`)
            .then((res) => {
                if (!res.ok) throw new Error('Error al obtener la cabaña');
                return res.json();
            })
            .then((data) => {
                setFormData({
                    id: data.id,
                    name: data.name || '',
                    description: data.description || '',
                    image: null, // No cargamos la imagen, solo archivo nuevo
                    capacity: data.capacity || 0,
                    rating: data.rating || 0,
                    price: data.price || 0,
                    categoryId: data.categoryId || '',
                    address: {
                        id: data.address?.id || 0,
                        street: data.address?.street || '',
                        number: data.address?.number || 0,
                        location: data.address?.location || '',
                        province: data.address?.province || '',
                        country: data.address?.country || '',
                    },
                });
            })
            .catch((err) => alert(err.message));
    }, [id]);

    // Cargar categorías para el select
    useEffect(() => {
        fetch('http://localhost:8080/categories/list')
            .then((res) => {
                if (!res.ok) throw new Error('Error al cargar categorías');
                return res.json();
            })
            .then((data) => setCategorias(data))
            .catch((err) => alert(err.message));
    }, []);

    // Manejar cambios en inputs
    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
    ) => {
        const { name, value } = e.target;

        if (name.startsWith('address.')) {
            const key = name.split('.')[1];
            setFormData((prev) => ({
                ...prev,
                address: {
                    ...prev.address,
                    [key]: key === 'number' ? Number(value) : value,
                },
            }));
        } else if (name === 'capacity' || name === 'rating' || name === 'price') {
            setFormData((prev) => ({
                ...prev,
                [name]: Number(value),
            }));
        } else if (name === 'categoryId') {
            setFormData((prev) => ({
                ...prev,
                categoryId: Number(value),
            }));
        } else {
            setFormData((prev) => ({
                ...prev,
                [name]: value,
            }));
        }
    };

    // Manejar cambio del archivo
    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            setFormData((prev) => ({
                ...prev,
                image: e.target.files![0],
            }));
        }
    };

    // Envio de los nuevos datos de la cabaña
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            const response = await fetch('http://localhost:8080/cabins/update', {
                method: 'PUT', 
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formData)
            });

            if (!response.ok) {
                throw new Error('Error al actualizar la cabaña');
            }

            alert('Cabaña actualizada exitosamente');
            //Redirige a la lista de cabañas
            navigate(`/administracion/listar-cabanias`);
        } catch (error) {
            console.error(error);
            alert('Ocurrió un error al actualizar la cabaña');
        }
    };


    return (
        <>
            <NavBarAdminComponent />
            <div className="form-wrapper">
                <h2 className="form-title">Editar Cabaña</h2>
                <form className="form" onSubmit={handleSubmit}>
                    <input
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        className="form-control mb-3"
                        placeholder="Nombre"
                    />
                    <textarea
                        name="description"
                        value={formData.description}
                        onChange={handleChange}
                        className="form-control mb-3"
                        placeholder="Descripción"
                    />
                    <input type="file" name="image" onChange={handleFileChange} className="form-control mb-3" />

                    <input
                        type="number"
                        name="capacity"
                        value={formData.capacity}
                        onChange={handleChange}
                        className="form-control mb-3"
                        placeholder="Capacidad"
                    />
                    <input
                        type="number"
                        name="rating"
                        value={formData.rating}
                        onChange={handleChange}
                        className="form-control mb-3"
                        placeholder="Rating"
                    />
                    <input
                        type="number"
                        name="price"
                        value={formData.price}
                        onChange={handleChange}
                        className="form-control mb-3"
                        placeholder="Precio"
                    />

                    <h5 className="section-title">Categoría</h5>
                    <select
                        name="categoryId"
                        value={formData.categoryId}
                        onChange={handleChange}
                        className="form-control mb-3"
                    >
                        <option value="">Seleccioná una categoría</option>
                        {categorias.map((cat) => (
                            <option key={cat.id} value={cat.id}>
                                {cat.name} - {cat.description}
                            </option>
                        ))}
                    </select>

                    <h5 className="section-title">Dirección</h5>
                    <input
                        name="address.street"
                        value={formData.address.street}
                        onChange={handleChange}
                        className="form-control mb-2"
                        placeholder="Calle"
                    />
                    <input
                        type="number"
                        name="address.number"
                        value={formData.address.number}
                        onChange={handleChange}
                        className="form-control mb-2"
                        placeholder="Número"
                    />
                    <input
                        name="address.location"
                        value={formData.address.location}
                        onChange={handleChange}
                        className="form-control mb-2"
                        placeholder="Localidad"
                    />
                    <input
                        name="address.province"
                        value={formData.address.province}
                        onChange={handleChange}
                        className="form-control mb-2"
                        placeholder="Provincia"
                    />
                    <input
                        name="address.country"
                        value={formData.address.country}
                        onChange={handleChange}
                        className="form-control mb-3"
                        placeholder="País"
                    />

                    <div className="btn-container">
                        <button type="submit" className="btn btn-primary btn-40">
                            Guardar Cambios
                        </button>
                    </div>
                </form>
            </div>
        </>
    );
};
