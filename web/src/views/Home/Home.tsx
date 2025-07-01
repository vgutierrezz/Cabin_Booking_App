import React, { useEffect, useState, useMemo, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../../component/AuthContext/AuthContext';
import { CardComponent } from '../../component/Card/CardComponent';
import { Cabin } from '../../models/CabinDTO';
import { Search } from '../../component/Search/Search';
import Modal from 'react-modal';
import ReactDatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

import './Home.css';

export const Home = () => {
  const { token, user } = useContext(AuthContext);

  // Estados para las cabañas por categoría
  const [rusticas, setRusticas] = useState<Cabin[]>([]);
  const [modernas, setModernas] = useState<Cabin[]>([]);
  const [ecologicas, setEcologicas] = useState<Cabin[]>([]);

  // Keyword para la búsqueda
  const [searchResults, setSearchResults] = useState<Cabin[] | null>(null);

  // Botón volver
  const navigate = useNavigate();

  // Estados para manejo de carga y error
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Estado para IDs favoritos del usuario
  const [favoriteIds, setFavoriteIds] = useState<number[]>([]);

  // Estados para el modal de reserva
  const [showModal, setShowModal] = useState(false);
  const [selectedCabin, setSelectedCabin] = useState<Cabin | null>(null);
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
  const [bookingLoading, setBookingLoading] = useState(false);
  const [bookingError, setBookingError] = useState<string | null>(null);
  const [bookingSuccess, setBookingSuccess] = useState<string | null>(null);
  const [occupiedRanges, setOccupiedRanges] = useState<{start: Date, end: Date}[]>([]);

  // Función para traer cabañas por categoría
  const fetchCabinsByCategory = async (category: string): Promise<Cabin[]> => {
    const encodedCategory = encodeURIComponent(category);
    try {
      const res = await fetch(`http://localhost:8080/cabins/category/${encodedCategory}`);

      const contentType = res.headers.get("content-type");
      if (!res.ok) {
        const text = await res.text();
        throw new Error(`Error ${res.status} (${res.statusText}): ${text}`);
      }

      if (contentType && contentType.includes("application/json")) {
        return await res.json();
      } else {
        const text = await res.text();
        throw new Error(`Respuesta no JSON: ${text}`);
      }
    } catch (err) {
      console.error("Error en fetch:", err);
      throw err;
    }
  };

  const fetchSearchResults = async (keyword: string) => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`http://localhost:8080/cabins/search?keyword=${encodeURIComponent(keyword)}`);
      if (!res.ok) throw new Error("Error al buscar cabañas");
      const data = await res.json();
      setSearchResults(data);
    } catch (err) {
      setSearchResults([]);
    } finally {
      setLoading(false);
    }
  };

  // Fetch favoritos si usuario y token existen
  const fetchFavorites = async () => {
    if (!user?.id || !token) {
      setFavoriteIds([]);
      return;
    }
    try {
      const res = await fetch(`http://localhost:8080/favorites/list`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (!res.ok) throw new Error('Error al cargar favoritos');
      const favs: Cabin[] = await res.json();
      setFavoriteIds(favs.map(f => f.id));
    } catch (error) {
      console.error(error);
      setFavoriteIds([]);
    }
  };

  useEffect(() => {
    setLoading(true);
    setError(null);

    const categories = ['Rústica', 'Moderna', 'Ecológica'];
    Promise.all(categories.map(cat => fetchCabinsByCategory(cat)))
      .then(([rusticasData, modernasData, ecologicasData]) => {
        setRusticas(rusticasData);
        setModernas(modernasData);
        setEcologicas(ecologicasData);
      })
      .catch((err) => {
        console.error(err);
        setError('Error al cargar cabañas. Intenta nuevamente.');
      })
      .finally(() => setLoading(false));

    fetchFavorites();
  }, [token, user]);

  // Función toggleFavorite para agregar o eliminar favorito
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
      } else {
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

  // Función para mostrar 2 cabañas aleatorias de cada categoría
  function getRandomTwo<T>(array: T[]): T[] {
    const shuffled = [...array].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, 2);
  }

  // Memoizar para evitar que se mezclen las cabañas en cada render
  const randomRusticas = useMemo(() => getRandomTwo(rusticas), [rusticas]);
  const randomModernas = useMemo(() => getRandomTwo(modernas), [modernas]);
  const randomEcologicas = useMemo(() => getRandomTwo(ecologicas), [ecologicas]);

  const handleSearchHome = (keyword: string) => {
    navigate(`/search?keyword=${encodeURIComponent(keyword)}`);
  };

  const openBookingModal = async (cabin: Cabin) => {
    setSelectedCabin(cabin);
    setShowModal(true);
    setStartDate(null);
    setEndDate(null);
    setBookingError(null);
    setBookingSuccess(null);
    // Traer fechas ocupadas
    try {
      const res = await fetch(`http://localhost:8080/bookings/cabin/${cabin.id}/occupied-dates`, {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });
      if (!res.ok) throw new Error();
      const data = await res.json();
      setOccupiedRanges(
        (data || []).map((r: {startDate: string, endDate: string}) => ({
          start: new Date(r.startDate),
          end: new Date(r.endDate)
        }))
      );
    } catch {
      setOccupiedRanges([]);
    }
  };

  const closeBookingModal = () => {
    setShowModal(false);
    setSelectedCabin(null);
    setStartDate(null);
    setEndDate(null);
    setBookingError(null);
    setBookingSuccess(null);
  };

  const isDateOccupied = (date: Date) => {
    return occupiedRanges.some(range =>
      date >= range.start && date <= range.end
    );
  };

  const filterDate = (date: Date) => {
    return !isDateOccupied(date);
  };

  const handleBooking = async () => {
    if (!token) {
      setBookingError('Debés iniciar sesión para reservar');
      return;
    }
    if (!startDate || !endDate) {
      setBookingError('Seleccioná fechas válidas');
      return;
    }
    setBookingLoading(true);
    setBookingError(null);
    setBookingSuccess(null);
    try {
      const res = await fetch(`http://localhost:8080/bookings`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          userId: user?.id,
          cabinId: selectedCabin?.id,
          startDate: startDate.toISOString().split('T')[0],
          endDate: endDate.toISOString().split('T')[0],
        }),
      });
      if (!res.ok) throw new Error();
      setBookingSuccess('Reserva realizada con éxito');
    } catch {
      setBookingError('Error al realizar la reserva.');
    } finally {
      setBookingLoading(false);
    }
  };

  return (
    <>
      <div className="title-container">
        <h1 className="title-custom title-underline">Entre Cabañas</h1>
      </div>
      {/* SearchComponent solo recibe onSearch para disparar la navegación */}
      <Search onSearch={handleSearchHome} />
      {loading && <p>Cargando cabañas...</p>}
      {error && <p className="error">{error}</p>}

      <main>
        <div className='buscador-container'>
          <div className="subtitle-container">
            <h3 className="subtitle-custom subtitle-underline">Cabañas Rústicas</h3>
          </div>
          <CardComponent
            cabins={randomRusticas}
            favoriteIds={favoriteIds}
            onToggleFavorite={toggleFavorite}
            renderExtraActions={(cabin: Cabin) => (
              <button className="book-btn" onClick={() => openBookingModal(cabin)}>
                Reservar
              </button>
            )}
          />
        </div>

        <div className='categoria-container'>
          <div className="subtitle-container">
            <h3 className="subtitle-custom subtitle-underline">Cabañas Modernas</h3>
          </div>
          <CardComponent
            cabins={randomModernas}
            favoriteIds={favoriteIds}
            onToggleFavorite={toggleFavorite}
            renderExtraActions={(cabin: Cabin) => (
              <button className="book-btn" onClick={() => openBookingModal(cabin)}>
                Reservar
              </button>
            )}
          />
        </div>

        <div className='recomendaciones-container'>
          <div className="subtitle-container">
            <h3 className="subtitle-custom subtitle-underline">Cabañas Ecológicas</h3>
          </div>
          <CardComponent
            cabins={randomEcologicas}
            favoriteIds={favoriteIds}
            onToggleFavorite={toggleFavorite}
            renderExtraActions={(cabin: Cabin) => (
              <button className="book-btn" onClick={() => openBookingModal(cabin)}>
                Reservar
              </button>
            )}
          />
        </div>
      </main>
      <Modal
        isOpen={showModal}
        onRequestClose={closeBookingModal}
        contentLabel="Reservar Cabaña"
        ariaHideApp={false}
        className="modal"
        overlayClassName="modal-overlay"
      >
        <h2>Reservar {selectedCabin?.name}</h2>
        <div style={{ marginBottom: 16 }}>
          <label>Desde: </label>
          <ReactDatePicker
            selected={startDate}
            onChange={date => setStartDate(date)}
            selectsStart
            startDate={startDate}
            endDate={endDate}
            minDate={new Date()}
            dateFormat="yyyy-MM-dd"
            filterDate={filterDate}
            excludeDates={occupiedRanges.flatMap(r => {
              const dates: Date[] = [];
              let d = new Date(r.start.getTime());
              while (d <= r.end) {
                dates.push(new Date(d.getTime()));
                d.setDate(d.getDate() + 1);
              }
              return dates;
            })}
          />
        </div>
        <div style={{ marginBottom: 16 }}>
          <label>Hasta: </label>
          <ReactDatePicker
            selected={endDate}
            onChange={date => setEndDate(date)}
            selectsEnd
            startDate={startDate}
            endDate={endDate}
            minDate={startDate || new Date()}
            dateFormat="yyyy-MM-dd"
            filterDate={filterDate}
            excludeDates={occupiedRanges.flatMap(r => {
              const dates: Date[] = [];
              let d = new Date(r.start.getTime());
              while (d <= r.end) {
                dates.push(new Date(d.getTime()));
                d.setDate(d.getDate() + 1);
              }
              return dates;
            })}
          />
        </div>
        {bookingError && <p className="error">{bookingError}</p>}
        {bookingSuccess && <p className="success">{bookingSuccess}</p>}
        <button onClick={handleBooking} disabled={bookingLoading} className="confirm-btn">
          {bookingLoading ? 'Reservando...' : 'Confirmar Reserva'}
        </button>
        <button onClick={closeBookingModal} className="cancel-btn" style={{ marginLeft: 8 }}>
          Cancelar
        </button>
      </Modal>
    </>
  );
};
