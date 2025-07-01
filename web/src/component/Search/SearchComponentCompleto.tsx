import { useEffect, useState, useContext } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { AuthContext } from '../AuthContext/AuthContext';
import { CardComponent } from '../Card/CardComponent';
import { Cabin } from '../../models/CabinDTO';
import { FiX } from 'react-icons/fi';
import ReactDatePicker from 'react-datepicker';
import Modal from 'react-modal';
import 'react-datepicker/dist/react-datepicker.css';

interface SearchComponentProps {
    onSearch: (keyword: string) => void;
}

export const SearchComponentCompleto: React.FC<SearchComponentProps> = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { token, user } = useContext(AuthContext);

    // Leer keyword desde la url
    const params = new URLSearchParams(location.search);
    const keywordFromUrl = params.get("keyword") || "";

    const [keyword, setKeyword] = useState(keywordFromUrl);
    const [searchResults, setSearchResults] = useState<Cabin[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [favoriteIds, setFavoriteIds] = useState<number[]>([]);
    const [showModal, setShowModal] = useState(false);
    const [selectedCabin, setSelectedCabin] = useState<Cabin | null>(null);
    const [startDate, setStartDate] = useState<Date | null>(null);
    const [endDate, setEndDate] = useState<Date | null>(null);
    const [bookingLoading, setBookingLoading] = useState(false);
    const [bookingError, setBookingError] = useState<string | null>(null);
    const [bookingSuccess, setBookingSuccess] = useState<string | null>(null);
    const [occupiedRanges, setOccupiedRanges] = useState<{start: Date, end: Date}[]>([]);

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            setError(null);

            try {
                // Obtener cabañas según la keyword
                const endpoint = keywordFromUrl.trim()
                    ? `http://localhost:8080/cabins/search?keyword=${encodeURIComponent(keywordFromUrl)}`
                    : `http://localhost:8080/cabins/list`;

                const res = await fetch(endpoint);
                if (!res.ok) throw new Error("Error al cargar cabañas");
                const data = await res.json();
                setSearchResults(data);

                // Obtener favoritos si está logueado
                if (token && user) {
                    const favRes = await fetch("http://localhost:8080/favorites/list", {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    });
                    if (!favRes.ok) throw new Error("Error cargando favoritos");
                    const favData: Cabin[] = await favRes.json();
                    setFavoriteIds(favData.map(f => f.id));
                } else {
                    setFavoriteIds([]);
                }

            } catch (err) {
                setSearchResults([]);
                setError("Ocurrió un error al cargar los datos.");
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [keywordFromUrl, token, user]);


    useEffect(() => {
        setKeyword(keywordFromUrl);
    }, [keywordFromUrl]);

    const handleSearch = () => {
        if (keyword.trim()) {
            navigate(`/buscar?keyword=${encodeURIComponent(keyword.trim())}`);
        }
    };

    const handleClear = () => {
        setKeyword('');
        navigate('/buscar');
    };

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
                if (!res.ok) throw new Error();
                setFavoriteIds(prev => prev.filter(id => id !== cabinId));
            } else {
                const res = await fetch(`http://localhost:8080/favorites/create/${cabinId}`, {
                    method: 'POST',
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                if (!res.ok) throw new Error();
                setFavoriteIds(prev => [...prev, cabinId]);
            }
        } catch {
            alert("Error al actualizar favorito.");
        }
    };

    const openBookingModal = async (cabin: Cabin) => {
        setSelectedCabin(cabin);
        setShowModal(true);
        setStartDate(null); // El usuario debe elegir la fecha
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
        <div className="busqueda-container mt-4">
            <form className="search-form" onSubmit={handleSearch}>
                <div className="search-input-wrapper">
                    <input
                        className="search-input"
                        type="search"
                        placeholder="Buscá tu próximo alojamiento"
                        value={keyword}
                        onChange={(e) => setKeyword(e.target.value)}
                    />
                    {keyword && (
                        <button
                            type="button"
                            onClick={handleClear}
                            className="clear-button"
                            aria-label="Limpiar búsqueda"
                        >
                            <FiX size={20} />
                        </button>
                    )}
                </div>
                <button className="search-button" type="submit">
                    Buscar
                </button>
            </form>

            {loading && <p>Cargando cabañas...</p>}
            {error && <p className="error">{error}</p>}

            {!loading && searchResults.length === 0 && (
                <p className="no-results-text">No se encontraron cabañas que coincidan.</p>
            )}

            {!loading && searchResults.length > 0 && (
                <CardComponent
                    cabins={searchResults}
                    favoriteIds={favoriteIds}
                    onToggleFavorite={toggleFavorite}
                    renderExtraActions={(cabin: Cabin) => (
                        <button className="book-btn" onClick={() => openBookingModal(cabin)}>
                            Reservar
                        </button>
                    )}
                />
            )}
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
        </div>
    );
};
