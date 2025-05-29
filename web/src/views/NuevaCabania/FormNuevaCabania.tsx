import React, { useEffect, useState } from 'react';
import './formnuevacabania.css';
import { NavBarAdminComponent } from '../../component/NavBarAdmin/NavBarAdminComponent'

export const FormNuevaCabania = () => {
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        image: null,
        capacity: '',
        rating: '',
        price: '',
        address: {
            street: '',
            number: '',
            location: '',
            province: '',
            country: ''
        },
        categoryId: ''
    });

    const [categorias, setCategorias] = useState<Category[]>([]);

    type Category = {
        id: number;
        name: string;
        description: string;
    };

    //Llamo a la api para listar todas las categorías disponibles en mi formulario
    useEffect(() => {
        fetch('http://localhost:8080/categories/list')
            .then((res) => res.json())
            .then((data: Category[]) => setCategorias(data))
            .catch((err) => console.error('Error al cargar categorías', err));
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;

        if (name.startsWith('address.')) {
            const field = name.split('.')[1];
            setFormData((prev) => ({
                ...prev,
                address: {
                    ...prev.address,
                    [field]: value
                }
            }));
        } else {
            setFormData((prev) => ({
                ...prev,
                [name]: value
            }));
        }
    };

    const handleFileChange = (e) => {
        setFormData((prev) => ({
            ...prev,
            image: e.target.files[0]
        }));
    };

    const convertFileToBase64 = (file: File): Promise<string> => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => resolve(reader.result as string); // 👈 corregido
            reader.onerror = reject;
        });
    };


    //Envio del DTO al backend
    const handleSubmit = async (e) => {
        e.preventDefault();

        let imageBase64: string = '';
        if (formData.image) {
            imageBase64 = await convertFileToBase64(formData.image);
        }

        const dto = {
            name: formData.name,
            description: formData.description,
            image: imageBase64,
            capacity: parseInt(formData.capacity),
            rating: parseInt(formData.rating),
            price: parseInt(formData.price),
            address: {
                street: formData.address.street,
                number: parseInt(formData.address.number),
                location: formData.address.location,
                province: formData.address.province,
                country: formData.address.country
            },
            categoryId: parseInt(formData.categoryId)
        };

        //Creación de una nueva cabaña
        try {
            const response = await fetch('http://localhost:8080/cabins/create', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(dto)
            });

            if (response.ok) {
                alert('Cabaña guardada exitosamente');
                // opcional: limpiar el formulario
                setFormData({
                    name: '',
                    description: '',
                    image: null,
                    capacity: '',
                    rating: '',
                    price: '',
                    address: {
                        street: '',
                        number: '',
                        location: '',
                        province: '',
                        country: ''
                    },
                    categoryId: ''
                });
            } else {
                alert('Error al guardar');
            }
        } catch (error) {
            console.error('Error en el envío:', error);
            alert('Fallo la conexión con el servidor');
        }
    };



    return (
        <>
            <NavBarAdminComponent/>
            <div className="form-wrapper">
                <h2 className="title-custom">Nueva Cabaña</h2>
                <form className="form" onSubmit={handleSubmit}>

                    <input name="name" value={formData.name} onChange={handleChange} className="form-control mb-3" placeholder="Nombre" />
                    <textarea name="description" value={formData.description} onChange={handleChange} className="form-control mb-3" placeholder="Descripción" />
                    <input type="file" name="image" onChange={handleFileChange} className="form-control mb-3" />

                    <input type="number" name="capacity" value={formData.capacity} onChange={handleChange} className="form-control mb-3" placeholder="Capacidad" />
                    <input type="number" name="rating" value={formData.rating} onChange={handleChange} className="form-control mb-3" placeholder="Rating" />
                    <input type="number" name="price" value={formData.price} onChange={handleChange} className="form-control mb-3" placeholder="Precio" />

                    {/*SELECCIÓN DE CATEGORÍA */}
                    <h5 className='section-title'>Categoría</h5>
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

                    {/*SELECCIÓN DE CATEGORÍA */}
                    <h5 className='section-title'>Dirección</h5>
                    <input name="address.street" value={formData.address.street} onChange={handleChange} className="form-control mb-2" placeholder="Calle" />
                    <input type="number" name="address.number" value={formData.address.number} onChange={handleChange} className="form-control mb-2" placeholder="Número" />
                    <input name="address.location" value={formData.address.location} onChange={handleChange} className="form-control mb-2" placeholder="Localidad" />
                    <input name="address.province" value={formData.address.province} onChange={handleChange} className="form-control mb-2" placeholder="Provincia" />
                    <input name="address.country" value={formData.address.country} onChange={handleChange} className="form-control mb-3" placeholder="País" />

                    {/*BOTÓN GUARDAR */}
                    <div className="btn-container">
                        <button type="submit" className="button-save-custom">
                            Guardar Cabaña
                        </button>
                    </div>
                </form>
            </div>
        </>
    );
};
