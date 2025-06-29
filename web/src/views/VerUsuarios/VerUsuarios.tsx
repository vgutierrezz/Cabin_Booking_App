import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../component/AuthContext/AuthContext";
import { User } from "../../models/UserDTO";
import { useNavigate } from "react-router-dom";
import * as  bootstrap from "bootstrap";
import { FaEdit, FaTrash } from "react-icons/fa";

export const VerUsuarios = () => {
    const { token } = useContext(AuthContext);
    const [usuarios, setUsuarios] = useState<User[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [usuariosAEliminar, setUsuariosAEliminar] = useState<User | null>(null);
    const navigate = useNavigate();

    const handleNuevoUsuario = () => {
        navigate('/auth/register');
    }

    useEffect(() => {
        if (!token) return; // Espera hasta que el token esté listo

        setLoading(true);
        setError(null);

        fetch('http://localhost:8080/users/list', {
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
            .then((data: User[]) => {
                setUsuarios(data);
                console.log("Usuario recibido del backend ", data);
            })
            .catch((err) => setError(err.message))
            .finally(() => setLoading(false));
    }, [token]);


    useEffect(() => {
        const tooltipTriggerList = document.querySelectorAll('[data-bs-toggle="tooltip"]');
        tooltipTriggerList.forEach(tooltipTriggerEl => {
            new bootstrap.Tooltip(tooltipTriggerEl);
        });
    }, [usuarios]);

    //Abrir Modal para confirmar eliminación de una cabaña
    const confirmarEliminar = (cabania: User) => {
        setUsuariosAEliminar(cabania);
        const modal = new bootstrap.Modal(document.getElementById('confirmarModal')!);
        modal.show();
    };

    //Cambio de rol de usuario
    const handleChangeRol = async (userId: number, newRole: string) => {
        if (!token) return;

        //buscar el usuario actual
        const user = usuarios.find(u => u.id === userId);
        if (!user) {
            alert("Usuario no encontrado");
            return;
        }

        // Crear el cuerpo del request con todos los datos del usuario
        const updatedUser = {
            id: user.id,
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
            role: newRole 
        };

        try {
            const res = await fetch(`http://localhost:8080/users/update`, {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
                
                body: JSON.stringify(updatedUser)
            });

            if (!res.ok) throw new Error('No se pudo cambiar el rol');

            setUsuarios(prev =>
                prev.map(user =>
                    user.id === userId ? { ...user, role: newRole } : user
                )
            );
        } catch (err) {
            alert(`Error al cambiar rol: ${err}`);
        }
    };

    //Confirmación para eliminar una cabaña
    const handleConfirmDelete = async () => {
        if (!usuariosAEliminar || !token) return;

        try {
            const res = await fetch(`http://localhost:8080/users/delete/${usuariosAEliminar.id}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                }
            });

            if (!res.ok) throw new Error('Error al eliminar la cabaña');

            setUsuarios(prev => prev.filter(c => c.id !== usuariosAEliminar.id));
            setUsuariosAEliminar(null);

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
            <h2 className="title-custom">Lista de Usuarios</h2>

            {/* Botón Nuevo Usuario */}
            <div className='d-flex justify-content-end button-container'>
                <button className='button-new-custom' onClick={handleNuevoUsuario}>
                    Nuevo Usuario
                </button>
            </div>

            {/* Tabla */}
            <div className='container-table'>
                <table className="table table-striped">
                    <thead>
                        <tr className="text-center">
                            <th>ID</th>
                            <th>Nombre</th>
                            <th>Apellido</th>
                            <th>Email</th>
                            <th>Rol</th>
                            <th>Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {usuarios.map((usuario, index) => (
                            <tr key={usuario.id}>
                                <th scope="row" className="text-center">{index + 1}</th>
                                <td className="text-center">{usuario.firstName}</td>
                                <td className="text-center">{usuario.lastName}</td>
                                <td className="text-center">{usuario.email}</td>
                                <td className="text-center">
                                    <select
                                        className="form-select form-select-sm"
                                        value={usuario.role}
                                        onChange={(e) => handleChangeRol(usuario.id, e.target.value)}
                                    >
                                        <option value="USER">USER</option>
                                        <option value="ADMIN">ADMIN</option>
                                    </select>
                                </td>
                                <td className="text-center d-flex justify-content-center gap-2">

                                    <button
                                        className="btn p-1 text-danger"
                                        data-tooltip-id="tooltip"
                                        data-tooltip-content="Eliminar"
                                        onClick={() => confirmarEliminar(usuario)}
                                        style={{ background: 'none', border: 'none' }}
                                    >
                                        <FaTrash size={18} />
                                    </button>

                                </td>

                            </tr>
                        ))}
                    </tbody>
                </table>
                {/*<Tooltip id="tooltip" place="top" className='my-tooltip' />*/}
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
                            ¿Desea eliminar <strong>{usuariosAEliminar?.firstName}</strong>?
                        </div>
                        <div className="modal-footer">
                            <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Cancelar</button>
                            <button type="button" className="btn btn-danger" onClick={handleConfirmDelete}>Eliminar</button>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}
