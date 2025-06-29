import { useContext, useState } from 'react';
import './Login.css';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../../component/AuthContext/AuthContext';

export const Login = () => {
    const { login } = useContext(AuthContext);

    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });

    const [formErrors, setFormErrors] = useState({
        email: '',
        password: ''
    });

    const [generalError, setGeneralError] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { id, value } = e.target;
        const key = id === 'userEmailLogin' ? 'email' : 'password';

        setFormData(prev => ({
            ...prev,
            [key]: value
        }));

        setFormErrors(prev => ({
            ...prev,
            [key]: ''
        }));

        setGeneralError(''); // Limpiar error general al escribir
    };

    const validate = () => {
        let isValid = true;
        const errors = {
            email: '',
            password: ''
        };

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!emailRegex.test(formData.email)) {
            errors.email = 'Correo electrónico inválido.';
            isValid = false;
        }

        if (formData.password.length < 6) {
            errors.password = 'Contraseña inválida.';
            isValid = false;
        }

        setFormErrors(errors);
        return isValid;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!validate()) return;

        setIsLoading(true); // activar loading
        setGeneralError('');

        try {
            const response = await fetch('http://localhost:8080/auth/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formData)

            });
            if (response.ok) {
                const data = await response.json();
                console.log('Respuesta completa del backend:', data);
                if (data.token && data.user && data.role) {
                    login(data.token, data.role, data.user); //guardar el token y el rol
                    navigate('/home');
                } else {
                    setGeneralError('Faltan datos en la respuesta del servidor.');
                }
            } else {
                const errorData = await response.text();
                setGeneralError(errorData || 'Error en inicio de sesión');
            }
        } catch (error) {
            console.error('Error en login:', error);
            setGeneralError('Error al intentar iniciar sesión. Intenta más tarde.');
        } finally {
            setIsLoading(false); // desactivar loading
        }
    };

    return (
        <div className="form-wrapper">
            <h2 className="title-custom">Ingresar</h2>

            <form onSubmit={handleSubmit}>
                {generalError && (
                    <div style={{ color: 'red', marginBottom: '1rem', fontWeight: 'bold', textAlign: 'center' }}>
                        {generalError}
                    </div>
                )}

                <div className="mb-3">
                    <label htmlFor="userEmailLogin" className="form-label">Correo electrónico:</label>
                    <input
                        type="email"
                        className={`form-control ${formErrors.email ? 'is-invalid' : ''}`}
                        id="userEmailLogin"
                        placeholder="tucorreo@dominio.com"
                        value={formData.email}
                        onChange={handleChange}
                    />
                    {formErrors.email && <small className="text-danger">{formErrors.email}</small>}
                </div>
                <div className="password-wrapper">
                    <input
                        type={showPassword ? 'text' : 'password'}
                        className={`form-control ${formErrors.password ? 'is-invalid' : ''}`}
                        id="passwordLogin"
                        placeholder="************"
                        value={formData.password}
                        onChange={handleChange}
                    />
                    <button
                        type="button"
                        className="toggle-password"
                        onClick={() => setShowPassword(prev => !prev)}
                        aria-label="Mostrar u ocultar contraseña"
                    >
                        {showPassword ? (
                            <svg xmlns="http://www.w3.org/2000/svg" height="20" width="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M17.94 17.94A10.93 10.93 0 0 1 12 20c-5.05 0-9.29-3.17-11-8a11.05 11.05 0 0 1 5.17-6.11" />
                                <path d="M1 1l22 22" />
                            </svg>
                        ) : (
                            <svg xmlns="http://www.w3.org/2000/svg" height="20" width="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                                <circle cx="12" cy="12" r="3" />
                            </svg>
                        )}
                    </button>
                </div>
                <div>
                    <small>
                        Si aún no se ha registrado haga <Link to="/auth/register">click aquí</Link>
                    </small>
                </div>
                <div className="btn-container">
                    <button type="submit" className="btn button-verde" disabled={isLoading}>Ingresar</button>
                </div>
            </form>
        </div>
    );
};