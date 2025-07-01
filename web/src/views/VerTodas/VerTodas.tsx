// src/pages/CabinsList.tsx
import { useContext, useEffect, useState } from 'react';
import { Cabin } from '../../models/CabinDTO';
import { CardComponent } from '../../component/Card/CardComponent';
import { AuthContext } from '../../component/AuthContext/AuthContext';

export const VerTodas = () => {
    const { token, user } = useContext(AuthContext);
    const [cabins, setCabins] = useState<Cabin[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [favoriteIds, setFavoriteIds] = useState<number[]>([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                // Traer todas las cabañas
                const cabinsRes = await fetch("http://localhost:8080/cabins/list");
                if (!cabinsRes.ok) throw new Error("Error cargando cabañas");
                const cabinsData = await cabinsRes.json();
                setCabins(cabinsData);

                // Si no hay token o usuario, limpiamos favoritos y terminamos
                if (!token || !user) {
                    setFavoriteIds([]);
                    setLoading(false);
                    return;
                }

                // Traer favoritos del usuario autenticado
                const favoritesRes = await fetch("http://localhost:8080/favorites/list", {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                if (!favoritesRes.ok) throw new Error("Error cargando favoritos");

                const favoritesData: Cabin[] = await favoritesRes.json();
                setFavoriteIds(favoritesData.map(fav => fav.id));

            } catch (error) {
                setError((error as Error).message);
                setFavoriteIds([]);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [token, user]);

    // Función para togglear favoritos y actualizar el estado global
    const toggleFavorite = async (cabinId: number) => {
        if (!token) {
            alert("Debés iniciar sesión para usar favoritos");
            return;
        }

        const isFav = favoriteIds.includes(cabinId);

        try {
            if (isFav) {
                // Eliminar favorito
                const res = await fetch(`http://localhost:8080/favorites/delete/${cabinId}`, {
                    method: 'DELETE',
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                if (!res.ok) throw new Error("Error eliminando favorito");

                setFavoriteIds(prev => prev.filter(id => id !== cabinId));
            } else {
                // Agregar favorito
                const res = await fetch(`http://localhost:8080/favorites/create/${cabinId}`, {
                    method: 'POST',
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                if (!res.ok) throw new Error("Error agregando favorito");

                setFavoriteIds(prev => [...prev, cabinId]);
            }
        } catch (error) {
            console.error("Error al actualizar favorito:", error);
            alert("Hubo un error al actualizar favorito");
        }
    };

    return (
        <div className="container mt-4">
            <div className="title-container">
                <h1 className="title-custom">Cabañas Disponibles</h1>
            </div>
            <div className="container-oscuro">
                {loading && <p>Cargando...</p>}
                {error && <p style={{ color: 'red' }}>{error}</p>}
                {!loading && !error && <CardComponent cabins={cabins} favoriteIds={favoriteIds} onToggleFavorite={toggleFavorite} />}
            </div>
        </div>
    );
};
