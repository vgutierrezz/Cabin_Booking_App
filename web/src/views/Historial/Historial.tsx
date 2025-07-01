import React, { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../../component/AuthContext/AuthContext';
import { BookingDTO } from '../../models/BookingDTO';
import { Cabin } from '../../models/CabinDTO';

export const Historial = () => {
  const { user, token } = useContext(AuthContext);
  const [bookings, setBookings] = useState<BookingDTO[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedCabin, setSelectedCabin] = useState<Cabin | null>(null);
  const [selectedBooking, setSelectedBooking] = useState<BookingDTO | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [cabinLoading, setCabinLoading] = useState(false);
  const [cabinError, setCabinError] = useState<string | null>(null);
  const [rating, setRating] = useState<number>(0);
  const [ratingLoading, setRatingLoading] = useState(false);
  const [ratingError, setRatingError] = useState<string | null>(null);
  const [ratingSuccess, setRatingSuccess] = useState<string | null>(null);
  const [cabinsById, setCabinsById] = useState<{ [id: number]: Cabin }>({});

  useEffect(() => {
    const fetchBookings = async () => {
      if (!user) return;
      setLoading(true);
      setError(null);
      try {
        const response = await fetch(`http://localhost:8080/bookings/user/${user.id}`, {
          headers: {
            'Authorization': token ? `Bearer ${token}` : '',
            'Content-Type': 'application/json',
          },
        });
        if (!response.ok) {
          throw new Error('No se pudieron obtener las reservas');
        }
        const data = await response.json();
        setBookings(data);
      } catch (err: any) {
        setError(err.message || 'Error desconocido');
      } finally {
        setLoading(false);
      }
    };
    fetchBookings();
  }, [user, token]);

  useEffect(() => {
    // Cuando bookings cambian, buscar los datos de las cabañas por id si no están en cache
    const fetchCabins = async () => {
      const idsToFetch = bookings
        .map(b => b.cabinId)
        .filter(id => !(id in cabinsById));
      if (idsToFetch.length === 0) return;
      const newCabins: { [id: number]: Cabin } = { ...cabinsById };
      for (const id of idsToFetch) {
        try {
          const res = await fetch(`http://localhost:8080/cabins/${id}`);
          if (res.ok) {
            const data = await res.json();
            newCabins[id] = data;
          }
        } catch { }
      }
      setCabinsById(newCabins);
    };
    if (bookings.length > 0) fetchCabins();
    // eslint-disable-next-line
  }, [bookings]);

  const getDays = (start: string, end: string) => {
    const startDate = new Date(start);
    const endDate = new Date(end);
    const diff = Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));
    return diff;
  };

  const isPast = (end: string) => {
    return new Date(end) < new Date();
  };

  const handleCalificar = async (cabinId: number, booking: BookingDTO) => {
    setCabinLoading(true);
    setCabinError(null);
    setSelectedCabin(null);
    setSelectedBooking(booking);
    setModalOpen(true);
    try {
      const response = await fetch(`http://localhost:8080/cabins/${cabinId}`);
      if (!response.ok) throw new Error('No se pudo obtener la cabaña');
      const data = await response.json();
      setSelectedCabin(data);
    } catch (err: any) {
      setCabinError(err.message || 'Error desconocido');
    } finally {
      setCabinLoading(false);
    }
  };

  const closeModal = () => {
    setModalOpen(false);
    setSelectedCabin(null);
    setSelectedBooking(null);
    setCabinError(null);
  };

  const handleSubmitRating = async () => {
    if (!selectedBooking) return;
    setRatingLoading(true);
    setRatingError(null);
    setRatingSuccess(null);
    try {
      const response = await fetch(`http://localhost:8080/bookings/${selectedBooking.id}/qualify/${rating}`, {
        method: 'POST',
        headers: {
          'Authorization': token ? `Bearer ${token}` : '',
          'Content-Type': 'application/json',
        },
      });
      if (!response.ok) throw new Error('No se pudo guardar la calificación');
      setRatingSuccess('¡Calificación guardada!');
      // Actualiza la reserva en la lista
      setBookings((prev) => prev.map(b => b.id === selectedBooking.id ? { ...b, rating } : b));
    } catch (err: any) {
      setRatingError(err.message || 'Error desconocido');
    } finally {
      setRatingLoading(false);
    }
  };

  const handleTableRatingChange = async (bookingId: number, newRating: number) => {
    setRatingLoading(true);
    setRatingError(null);
    setRatingSuccess(null);
    try {
      const response = await fetch(`http://localhost:8080/bookings/${bookingId}/qualify/${newRating}`, {
        method: 'POST',
        headers: {
          'Authorization': token ? `Bearer ${token}` : '',
          'Content-Type': 'application/json',
        },
      });
      if (!response.ok) throw new Error('No se pudo guardar la calificación');
      setBookings((prev) => prev.map(b => b.id === bookingId ? { ...b, rating: newRating } : b));
      setRatingSuccess('¡Calificación guardada!');
    } catch (err: any) {
      setRatingError(err.message || 'Error desconocido');
    } finally {
      setRatingLoading(false);
      setTimeout(() => setRatingSuccess(null), 2000);
    }
  };

  if (!user) return <div>Debes iniciar sesión para ver tu historial de reservas.</div>;
  if (loading) return <div>Cargando historial...</div>;
  if (error) return <div style={{ color: 'red' }}>{error}</div>;

  return (
    <div>
      <div className="title-container">
        <h1 className="title-custom">Cabañas Publicadas</h1>
      </div>
      {bookings.length === 0 ? (
        <div>No tienes reservas registradas.</div>
      ) : (
        <div className='container-table'>
          <table className="table table-striped">
            <thead>
              <tr className="text-center">
                <th>#</th>
                <th>Cabaña</th>
                <th>Fecha inicio</th>
                <th>Fecha fin</th>
                <th>Días</th>
                <th>Estado</th>
                <th>Calificación</th>
              </tr>
            </thead>
            <tbody>
              {bookings.map((b, index) => (
                <tr key={b.id}>
                  <th scope="row" className="text-center">{index + 1}</th>
                  <td className="text-center">
                    {cabinsById[b.cabinId]?.name || 'Cargando...'}
                  </td>
                  <td className="text-center">{new Date(b.startDate).toLocaleDateString()}</td>
                  <td className="text-center">{new Date(b.endDate).toLocaleDateString()}</td>
                  <td className="text-center">{getDays(b.startDate, b.endDate)}</td>
                  <td className="text-center">{isPast(b.endDate) ? 'Finalizada' : 'Próxima'}</td>
                  <td className="text-center">
                    {isPast(b.endDate) ? (
                      b.rating == null ? (
                        <select
                          value={b.rating ?? ''}
                          onChange={e => {
                            const val = Number(e.target.value);
                            if (val >= 1 && val <= 5) handleTableRatingChange(b.id, val);
                          }}
                          disabled={ratingLoading}
                          style={{ minWidth: 60 }}
                        >
                          <option value="">Calificar</option>
                          {[1,2,3,4,5].map(n => (
                            <option key={n} value={n}>{n}</option>
                          ))}
                        </select>
                      ) : (
                        <span style={{ color: '#ffc107', fontSize: 18 }}>{'★'.repeat(b.rating)}{'☆'.repeat(5 - b.rating)}</span>
                      )
                    ) : (
                      b.rating != null ? (
                        <span style={{ color: '#ffc107', fontSize: 18 }}>{'★'.repeat(b.rating)}{'☆'.repeat(5 - b.rating)}</span>
                      ) : (
                        <span style={{ color: '#ccc' }}>-</span>
                      )
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      {/* Modal para mostrar detalles de la cabaña al calificar */}
      {modalOpen && (
        <div style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', background: 'rgba(0,0,0,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
          <div style={{ background: '#fff', borderRadius: 8, padding: 24, minWidth: 300, maxWidth: 400, position: 'relative' }}>
            <button onClick={closeModal} style={{ position: 'absolute', top: 8, right: 8, background: 'transparent', border: 'none', fontSize: 20, cursor: 'pointer' }}>×</button>
            {cabinLoading && <div>Cargando cabaña...</div>}
            {cabinError && <div style={{ color: 'red' }}>{cabinError}</div>}
            {selectedCabin && selectedBooking && (
              <div>
                <h3>{selectedCabin.name}</h3>
                <p>{selectedCabin.description}</p>
                <p><b>Dirección:</b> {selectedCabin.address.street} {selectedCabin.address.number}, {selectedCabin.address.location}</p>
                <p><b>Capacidad:</b> {selectedCabin.capacity} personas</p>
                <p><b>Precio:</b> ${selectedCabin.price}</p>
                <p><b>Reserva:</b> {selectedBooking.startDate} - {selectedBooking.endDate}</p>
                <div style={{ margin: '16px 0' }}>
                  <b>Calificación:</b>
                  <select
                    value={rating}
                    onChange={(e) => {
                      const val = Number(e.target.value);
                      if (val >= 1 && val <= 5) setRating(val);
                    }}

                    disabled={ratingLoading}
                    style={{
                      padding: '4px 8px',
                      fontSize: '0.9rem',
                      borderRadius: '4px',
                      border: '1px solid #ccc',
                      backgroundColor: '#fff',
                      color: '#2e2e2e',
                    }}
                  >
                    <option value={0} disabled>Calificar</option>
                    {[1, 2, 3, 4, 5].map(num => (
                      <option key={num} value={num}>{num}</option>
                    ))}
                  </select>


                  <button className="button-verde" onClick={handleSubmitRating} disabled={ratingLoading || rating === 0} style={{ marginTop: 8 }}>
                    {ratingLoading ? 'Guardando...' : 'Guardar calificación'}
                  </button>
                  {ratingError && <div style={{ color: 'red', textAlign: 'center' }}>{ratingError}</div>}
                  {ratingSuccess && <div style={{ color: 'green', textAlign: 'center' }}>{ratingSuccess}</div>}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
