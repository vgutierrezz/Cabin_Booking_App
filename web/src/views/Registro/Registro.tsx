import { useContext, useState } from 'react';
import './Registro.css';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../../component/AuthContext/AuthContext';

export const Registro = () => {
    const { token, user } = useContext(AuthContext);

    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        password: ''
    });

    const [formErrors, setFormErrors] = useState({
        firstName: '',
        lastName: '',
        email: '',
        password: ''
    });

    const navigate = useNavigate();

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { id, value } = e.target;

        const key = id === 'firstNameRegister'
            ? 'firstName'
            : id === 'lastNameRegister'
                ? 'lastName'
                : id === 'emailRegister'
                    ? 'email'
                    : 'password';

        setFormData(prev => ({
            ...prev,
            [key]: value
        }));

        setFormErrors(prev => ({
            ...prev,
            [key]: ''
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        const nameRegex = /^[a-zA-ZÀ-ÿ\s]{2,30}$/;
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        const passwordRegex = /^(?=.*\d).{6,}$/;

        const errors = {
            firstName: '',
            lastName: '',
            email: '',
            password: ''
        };

        if (!nameRegex.test(formData.firstName)) {
            errors.firstName = 'El nombre debe tener entre 2 y 30 letras.';
        }

        if (!nameRegex.test(formData.lastName)) {
            errors.lastName = 'El apellido debe tener entre 2 y 30 letras.';
        }

        if (!emailRegex.test(formData.email)) {
            errors.email = 'Correo electrónico no válido.';
        }

        if (!passwordRegex.test(formData.password)) {
            errors.password = 'La contraseña debe tener al menos 6 caracteres y un número.';
        }

        // Si hay errores, los mostramos
        if (Object.values(errors).some(msg => msg !== '')) {
            setFormErrors(errors);
            return;
        }

        try {
            const response = await fetch('http://localhost:8080/auth/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formData)
            });

            if (response.ok) {
                alert('Registro exitoso');
                if(token && user){
                    navigate('/administracion/listar-usuarios');
                }else {
                    navigate('/auth/login');
                }
            } else {
                const errorMsg = await response.text();
                alert('Error al registrarse: ' + errorMsg);
            }
        } catch (error) {
            console.error('Error al registrar:', error);
            alert('Error al registrar');
        }
    };


    return (
        <div className="form-wrapper">
            <h2 className="title-custom">Nuevo Usuario</h2>
            <form onSubmit={handleSubmit}>
                <div className="mb-3">
                    <label htmlFor="firstNameRegister" className="form-label">Nombre:</label>
                    <input
                        type="text"
                        className={`form-control ${formErrors.firstName ? 'input-error' : ''}`}
                        id="firstNameRegister"
                        name="firstName"
                        placeholder="Tu nombre"
                        value={formData.firstName}
                        onChange={handleChange}
                    />
                    {formErrors.firstName && <small className="text-danger">{formErrors.firstName}</small>}
                </div>

                <div className="mb-3">
                    <label htmlFor="lastNameRegister" className="form-label">Apellido:</label>
                    <input
                        type="text"
                        className={`form-control ${formErrors.firstName ? 'input-error' : ''}`}
                        id="lastNameRegister"
                        name="lastName"
                        placeholder="Tu apellido"
                        value={formData.lastName}
                        onChange={handleChange}
                    />
                    {formErrors.lastName && <small className="text-danger">{formErrors.lastName}</small>}
                </div>

                <div className="mb-3">
                    <label htmlFor="emailRegister" className="form-label">Correo electrónico:</label>
                    <input
                        type="email"
                        className={`form-control ${formErrors.firstName ? 'input-error' : ''}`}
                        id="emailRegister"
                        name="email"
                        placeholder='tucorreo@dominio.com'
                        value={formData.email}
                        onChange={handleChange}
                    />
                    {formErrors.email && <small className="text-danger">{formErrors.email}</small>}

                </div>

                <div className="mb-3">
                    <label htmlFor="passwordRegister" className="form-label">Contraseña:</label>
                    <input
                        type="password"
                        className={`form-control ${formErrors.firstName ? 'input-error' : ''}`}
                        id="passwordRegister"
                        name="password"
                        placeholder='************'
                        value={formData.password}
                        onChange={handleChange}
                    />
                    <small>Mínimo 6 caracteres y un número</small>
                    {formErrors.password && <small className="text-danger">{formErrors.password}</small>}
                </div>
                <div className="btn-container">
                    <button type="submit" className="btn button-verde">Registrarme</button>
                </div>
            </form>
        </div>
    );
};
