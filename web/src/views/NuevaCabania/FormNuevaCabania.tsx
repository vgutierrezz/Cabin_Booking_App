import React, { useContext } from 'react';
import { AuthContext } from '../../component/AuthContext/AuthContext';
import { CabinForm } from '../../component/CabinForm/CabinForm';

export const FormNuevaCabania = () => {
    const { token } = useContext(AuthContext);

    const handleCreateCabin = async (formData: FormData) => {
        try {
            const response = await fetch('http://localhost:8080/cabins/create', {
                method: 'POST',
                headers: {
                    Authorization: `Bearer ${token}`,
                },
                body: formData,
            });

            if (response.ok) {
                alert('Cabaña creada exitosamente');
            } else {
                const error = await response.text();
                alert('Error al crear la cabaña: ' + error);
            }
        } catch (err) {
            console.error('Error al enviar la solicitud:', err);
            alert('Fallo la conexión con el servidor');
        }
    };

    return (

        <>
            <h2 className="title-custom">Nueva Cabaña</h2>
            <CabinForm
                onSubmit={handleCreateCabin}
                submitLabel="Guardar Cabaña"
            />
        </>

    );
};