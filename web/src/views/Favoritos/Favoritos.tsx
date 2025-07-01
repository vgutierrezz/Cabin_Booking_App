import { useContext, useEffect, useState } from 'react';
import { Cabin } from '../../models/CabinDTO';
import { CardComponent } from '../../component/Card/CardComponent';
import { AuthContext } from '../../component/AuthContext/AuthContext';

export const Favoritos = () => {
  const { token, user } = useContext(AuthContext);
  const [cabins, setCabins] = useState<Cabin[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [favoriteIds, setFavoriteIds] = useState<number[]>([]);

  useEffect(() => {
    const fetchFavorites = async () => {
      if (!user?.id || !token) {
        setLoading(false);
        setFavoriteIds([]);
        setCabins([]);
        return;
      }
      try {
        const response = await fetch(`http://localhost:8080/favorites/list`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error('Error al cargar las cabañas favoritas');
        }

        const favorites: Cabin[] = await response.json();

        setCabins(favorites);
        setFavoriteIds(favorites.map(fav => fav.id));
      } catch (error) {
        setError((error as Error).message);
      } finally {
        setLoading(false);
      }
    };

    fetchFavorites();
  }, [user, token]);

  const toggleFavorite = async (cabinId: number) => {
    if (!token) {
      alert("Debés iniciar sesión para usar favoritos");
      return;
    }

    const isFav = favoriteIds.includes(cabinId);

    try {
      if (isFav) {
        const res = await fetch(`http://localhost:8080/favorites/delete/${cabinId}`, {
          method: 'DELETE',
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if (!res.ok) throw new Error("Error eliminando favorito");

        setFavoriteIds(prev => prev.filter(id => id !== cabinId));
        setCabins(prev => prev.filter(c => c.id !== cabinId));
      } else {
        const res = await fetch(`http://localhost:8080/favorites/create/${cabinId}`, {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if (!res.ok) throw new Error("Error agregando favorito");

        // Opcional: podrías refrescar el listado de favoritos o agregar solo el nuevo favorito
        // Acá no sabemos los datos completos de la cabaña recién agregada, por eso no la agregamos a `cabins`
        // Para simplificar, podrías recargar todo o hacer otro fetch
        setFavoriteIds(prev => [...prev, cabinId]);
        // Para actualizar la lista de cabañas favoritas después de agregar una, podés hacer fetch o ignorar.
      }
    } catch (error) {
      console.error("Error al actualizar favorito:", error);
      alert("Hubo un error al actualizar favorito");
    }
  };

  return (
    <div className="container mt-4">
      <div className='title-container'>
        <h2 className="title-custom">Cabañas Favoritas</h2>
      </div>

      <div className='container-oscuro'>
        {loading && <p>Cargando...</p>}
        {error && <p style={{ color: 'red' }}>{error}</p>}

        {!loading && !error && cabins.length === 0 && (
          <p className="text-center mt-4">No posee cabañas favoritas aún.</p>
        )}
        {!loading && !error && cabins.length > 0 && (
          <CardComponent
            cabins={cabins}
            favoriteIds={favoriteIds}
            onToggleFavorite={toggleFavorite}
          />
        )}
      </div>
    </div>
  );
};
