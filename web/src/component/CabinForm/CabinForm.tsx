// src/components/CabinForm.tsx
import React, { useEffect, useState, useContext } from 'react';
import { Cabin, Category } from '../../models/CabinDTO';
import { Feature } from '../../models/FeaturesDTO';
import { AuthContext } from '../../component/AuthContext/AuthContext';
import { useNavigate } from 'react-router-dom';
import './CabinForm.css';

interface CabinFormProps {
    initialData?: any;
    onSubmit: (formData: FormData) => Promise<void>;
    submitLabel: string;
}

interface FormErrors {
    [key: string]: string;
}

export const CabinForm = ({ initialData, onSubmit, submitLabel }: CabinFormProps) => {
    const { token } = useContext(AuthContext);

    const [formData, setFormData] = useState<{
        name: string;
        description: string;
        capacity: string;
        rating: string;
        price: string;
        categoryId: string; // guardo solo id como string
        features: number[]; // array con ids seleccionados
        address: {
            street: string;
            number: string;
            location: string;
            province: string;
            country: string;
        };
    }>({
        name: '',
        description: '',
        capacity: '',
        rating: '',
        price: '',
        categoryId: '',
        features: [],
        address: {
            street: '',
            number: '',
            location: '',
            province: '',
            country: '',
        }
    });

    const [categorias, setCategorias] = useState<Category[]>([]);
    const [featuresList, setFeaturesList] = useState<Feature[]>([]);
    const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
    const [errors, setErrors] = useState<FormErrors>({});
    const [existingImages, setExistingImages] = useState<string[]>([]);
    const navigate = useNavigate();
    const selectedFeatures = featuresList.filter(f => formData.features.includes(f.id));
    const selectedCategory = categorias.find(cat => cat.id === Number(formData.categoryId));

    useEffect(() => {
        if (initialData) {
            setFormData({
                name: initialData.name || '',
                description: initialData.description || '',
                capacity: initialData.capacity?.toString() || '',
                rating: initialData.rating?.toString() || '',
                price: initialData.price?.toString() || '',
                categoryId: initialData.category?.id.toString() || '',
                features: initialData.features?.map(f => f.id) || [],
                address: {
                    street: initialData.address?.street || '',
                    number: initialData.address?.number?.toString() || '',
                    location: initialData.address?.location || '',
                    province: initialData.address?.province || '',
                    country: initialData.address?.country || '',
                }
            });
        }
    }, [initialData]);

    useEffect(() => {
        fetch('http://localhost:8080/categories/list', {
            headers: { Authorization: `Bearer ${token}` }
        })
            .then(res => res.json())
            .then(data => setCategorias(data));

        fetch('http://localhost:8080/features/list', {
            headers: { Authorization: `Bearer ${token}` }
        })
            .then(res => res.json())
            .then(data => setFeaturesList(data));
    }, []);


    const handleRemoveExistingImage = (index: number) => {
        setExistingImages(prev => prev.filter((_, i) => i !== index));
    };


    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;

        if (name === 'categoryId') {
            setFormData(prev => ({
                ...prev,
                categoryId: value // string
            }));
        } else if (name.startsWith('address.')) {
            const field = name.split('.')[1];
            setFormData(prev => ({
                ...prev,
                address: { ...prev.address, [field]: value }
            }));
        } else if (name === 'features') {
            const id = Number(value);
            setFormData(prev => ({
                ...prev,
                features: prev.features.includes(id)
                    ? prev.features.filter(fId => fId !== id)
                    : [...prev.features, id]
            }));
        } else {
            setFormData(prev => ({ ...prev, [name]: value }));
        }
    };



    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            const files = Array.from(e.target.files).filter(f => f.type.startsWith('image/') && f.size <= 5 * 1024 * 1024);
            setSelectedFiles(files);
        }
    };

    const handleRemoveImage = (index: number) => {
        setSelectedFiles(prev => prev.filter((_, i) => i !== index));
    };

    const validateForm = () => {
        const newErrors: FormErrors = {};
        if (!formData.name) newErrors.name = 'El nombre es obligatorio';
        if (!formData.description) newErrors.description = 'La descripción es obligatoria';
        if (!formData.capacity || Number(formData.capacity) <= 0) newErrors.capacity = 'Capacidad inválida';
        const rating = parseFloat(formData.rating);
        if (isNaN(rating) || rating < 0 || rating > 5) newErrors.rating = 'Rating debe ser entre 0 y 5';
        if (!formData.price || Number(formData.price) <= 0) newErrors.price = 'Precio inválido';
        if (!formData.address.street) newErrors.street = 'Calle requerida';
        if (!formData.address.number || Number(formData.address.number) <= 0) newErrors.number = 'Número inválido';
        if (!formData.address.location) newErrors.location = 'Localidad requerida';
        if (!formData.address.province) newErrors.province = 'Provincia requerida';
        if (!formData.address.country) newErrors.country = 'País requerido';
        if (!formData.categoryId) newErrors.categoryId = 'Seleccioná una categoría';

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e: React.FormEvent) => {

        e.preventDefault();
        if (!validateForm()) return;

        const categoryName = categorias.find(cat => cat.id === Number(formData.categoryId))?.name || '';

        // Armar el DTO completo para enviar:
        const dto: Cabin = {
            id: initialData?.id || 0,
            name: formData.name,
            description: formData.description,
            capacity: Number(formData.capacity),
            rating: Number(formData.rating),
            price: Number(formData.price),
            category: categorias.find(cat => cat.id === Number(formData.categoryId))!,
            features: featuresList.filter(f => formData.features.includes(f.id)),
            address: {
                street: formData.address.street,
                number: Number(formData.address.number),
                location: formData.address.location,
                province: formData.address.province,
                country: formData.address.country,
            },
            images: initialData?.images || []
        };

        const formToSend = new FormData();
        formToSend.append('cabinDTO', new Blob([JSON.stringify(dto)], { type: 'application/json' }));
        selectedFiles.forEach(file => formToSend.append('images', file));
        console.log('Rating en DTO:', Number(formData.rating));
        console.log('FormData rating:', formData.rating);

        await onSubmit(formToSend);
    };

    const volver = () => {
        navigate('/administracion/listar-cabanias');
    };

    return (
        <>
            <div className='d-flex justify-content-end button-container'>
                <button className='button-new-custom' onClick={volver}>
                    Volver
                </button>
            </div>
            <form className="form" onSubmit={handleSubmit}>
                <label>Nombre</label>
                <input name="name" value={formData.name} onChange={handleChange} className={`form-control mb-1 ${errors.name ? 'is-invalid' : ''}`} />
                {errors.name && <div className="invalid-feedback">{errors.name}</div>}

                <label>Descripción</label>
                <textarea name="description" value={formData.description} onChange={handleChange} className={`form-control mb-1 ${errors.description ? 'is-invalid' : ''}`} />
                {errors.description && <div className="invalid-feedback">{errors.description}</div>}

                <label>Imágenes</label>
                <input
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handleFileChange}
                    className="form-control mb-2"
                />

                <div
                    className="image-preview-container"
                    style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}
                >
                    {selectedFiles.map((file, index) => {
                        const url = URL.createObjectURL(file);
                        return (
                            <div key={index} style={{ position: 'relative' }}>
                                <img
                                    src={url}
                                    alt={`preview ${index}`}
                                    style={{
                                        width: '100px',
                                        height: '100px',
                                        objectFit: 'cover',
                                        borderRadius: '8px',
                                        boxShadow: '0 2px 6px rgba(0, 0, 0, 0.2)',
                                    }}
                                    onLoad={() => URL.revokeObjectURL(url)}
                                />
                                <button
                                    type="button"
                                    onClick={() => handleRemoveImage(index)}
                                    style={{
                                        position: 'absolute',
                                        top: '2px',
                                        right: '2px',
                                        background: 'rgba(0,0,0,0.6)',
                                        border: 'none',
                                        color: 'white',
                                        borderRadius: '50%',
                                        width: '20px',
                                        height: '20px',
                                        cursor: 'pointer',
                                        fontWeight: 'bold',
                                        lineHeight: '18px',
                                        padding: 0,
                                    }}
                                    aria-label="Eliminar imagen"
                                >
                                    ×
                                </button>
                            </div>
                        );
                    })}
                    {existingImages.length > 0 && (
                        <div
                            className="image-preview-container"
                            style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', marginTop: '10px' }}
                        >
                            {existingImages.map((img, index) => (
                                <div key={index} style={{ position: 'relative' }}>
                                    <img
                                        src={img}
                                        alt={`existing ${index}`}
                                        style={{
                                            width: '100px',
                                            height: '100px',
                                            objectFit: 'cover',
                                            borderRadius: '8px',
                                            boxShadow: '0 2px 6px rgba(0, 0, 0, 0.2)',
                                        }}
                                    />
                                    <button
                                        type="button"
                                        onClick={() => handleRemoveExistingImage(index)}
                                        style={{
                                            position: 'absolute',
                                            top: '2px',
                                            right: '2px',
                                            background: 'rgba(0,0,0,0.6)',
                                            border: 'none',
                                            color: 'white',
                                            borderRadius: '50%',
                                            width: '20px',
                                            height: '20px',
                                            cursor: 'pointer',
                                            fontWeight: 'bold',
                                            lineHeight: '18px',
                                            padding: 0,
                                        }}
                                        aria-label="Eliminar imagen existente"
                                    >
                                        ×
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}

                </div>

                <label>Capacidad</label>
                <input type="number" name="capacity" value={formData.capacity} onChange={handleChange} className={`form-control mb-1 ${errors.capacity ? 'is-invalid' : ''}`} />
                {errors.capacity && <div className="invalid-feedback">{errors.capacity}</div>}

                <label>Rating</label>
                <input type="number" name="rating" value={formData.rating} onChange={handleChange} step="0.1" min="0" max="5" className={`form-control mb-1 ${errors.rating ? 'is-invalid' : ''}`} />
                {errors.rating && <div className="invalid-feedback">{errors.rating}</div>}

                <label>Precio</label>
                <input type="number" name="price" value={formData.price} onChange={handleChange} className={`form-control mb-1 ${errors.price ? 'is-invalid' : ''}`} />
                {errors.price && <div className="invalid-feedback">{errors.price}</div>}

                <label>Categoría</label>
                <select
                    name="categoryId"
                    value={formData.categoryId}
                    onChange={handleChange}
                    className={`form-control mb-1 ${errors.categoryId ? 'is-invalid' : ''}`}
                >
                    <option value="">Seleccioná una categoría</option>
                    {categorias.map(cat => (
                        <option key={cat.id} value={cat.id.toString()}>
                            {cat.name} - {cat.description}
                        </option>
                    ))}
                </select>

                {errors.categoryId && <div className="invalid-feedback">{errors.categoryId}</div>}

                <label>Características</label>
                {featuresList.map(feature => (
                    <label key={feature.id} className="feature-checkbox">
                        <input
                            type="checkbox"
                            checked={formData.features.includes(feature.id)}
                            onChange={() =>
                                setFormData(prev => ({
                                    ...prev,
                                    features: prev.features.includes(feature.id)
                                        ? prev.features.filter(id => id !== feature.id)
                                        : [...prev.features, feature.id]
                                }))
                            }
                        />{' '}
                        {feature.name}
                    </label>
                ))}

                <h5>Dirección</h5>
                <input name="address.street" placeholder="Calle" value={formData.address.street} onChange={handleChange} className={`form-control mb-1 ${errors.street ? 'is-invalid' : ''}`} />
                {errors.street && <div className="invalid-feedback">{errors.street}</div>}

                <input name="address.number" type="number" placeholder="Número" value={formData.address.number} onChange={handleChange} className={`form-control mb-1 ${errors.number ? 'is-invalid' : ''}`} />
                {errors.number && <div className="invalid-feedback">{errors.number}</div>}

                <input name="address.location" placeholder="Localidad" value={formData.address.location} onChange={handleChange} className={`form-control mb-1 ${errors.location ? 'is-invalid' : ''}`} />
                {errors.location && <div className="invalid-feedback">{errors.location}</div>}

                <input name="address.province" placeholder="Provincia" value={formData.address.province} onChange={handleChange} className={`form-control mb-1 ${errors.province ? 'is-invalid' : ''}`} />
                {errors.province && <div className="invalid-feedback">{errors.province}</div>}

                <input name="address.country" placeholder="País" value={formData.address.country} onChange={handleChange} className={`form-control mb-3 ${errors.country ? 'is-invalid' : ''}`} />
                {errors.country && <div className="invalid-feedback">{errors.country}</div>}

                <div className="btn-container">
                    <button type="submit" className="button-save-custom">{submitLabel}</button>
                </div>
            </form>
        </>
    );
};
