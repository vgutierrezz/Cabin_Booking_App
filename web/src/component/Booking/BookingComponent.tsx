import React, { useState, useEffect } from 'react';
import ReactDatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { Cabin } from '../../models/CabinDTO';
import './BoookingComponent.css';

interface BookingComponentProps {
  show: boolean;
  onClose: () => void;
  cabin: Cabin | null;
  token: string | null;
  userId: number | undefined;
  onBookingSuccess?: () => void;
}

export const BookingComponent: React.FC<BookingComponentProps> = ({ show, onClose, cabin, token, userId, onBookingSuccess }) => {
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
  const [occupiedRanges, setOccupiedRanges] = useState<{ start: Date, end: Date }[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  useEffect(() => {
    if (show && cabin && token) {
      setStartDate(null);
      setEndDate(null);
      setError(null);
      setSuccess(null);
      setShowSuccessModal(false);
      fetch(`http://localhost:8080/bookings/cabin/${cabin.id}/occupied-dates`, {
        headers: { Authorization: `Bearer ${token}` },
      })
        .then(res => res.ok ? res.json() : Promise.reject())
        .then((data) => {
          setOccupiedRanges((data || []).map((r: { startDate: string, endDate: string }) => ({
            start: new Date(r.startDate),
            end: new Date(r.endDate)
          })));
        })
        .catch(() => setOccupiedRanges([]));
    }
  }, [show, cabin, token]);

  const isDateOccupied = (date: Date) => {
    return occupiedRanges.some(range => date >= range.start && date <= range.end);
  };
  const filterDate = (date: Date) => !isDateOccupied(date);

  const handleBooking = async () => {
    if (!token || !userId || !cabin) return;
    if (!startDate || !endDate) {
      setError('Seleccioná fechas válidas');
      return;
    }
    setLoading(true);
    setError(null);
    setSuccess(null);
    try {
      const res = await fetch('http://localhost:8080/bookings/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          userId,
          cabinId: cabin.id,
          startDate: startDate.toISOString().split('T')[0],
          endDate: endDate.toISOString().split('T')[0],
        }),
      });
      if (!res.ok) throw new Error();
      setSuccess('Reserva realizada con éxito, que la disfrutes');
      setTimeout(() => {
        setShowSuccessModal(true);
        setSuccess(null);
        onClose();
      }, 400); // Pequeño delay para UX
      if (onBookingSuccess) onBookingSuccess();
    } catch {
      setError('Error al realizar la reserva.');
    } finally {
      setLoading(false);
    }
  };

  // Modal de éxito
  const SuccessModal = () => (
    <div className={`modal fade show d-block`} tabIndex={-1} style={{ background: 'rgba(0,0,0,0.5)' }} aria-modal="true" role="dialog">
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content booking-modal-content" style={{ minWidth: 350, position: 'relative' }}>
          <button
            type="button"
            className="booking-btn-close-success"
            onClick={() => setShowSuccessModal(false)}
            aria-label="Cerrar"
          >
            <span className="btn-close" aria-hidden="true">&#10005;</span>
          </button>
          <div className="modal-body booking-modal-body" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: 120 }}>
            <div className="success" style={{ fontSize: '1.2rem', margin: '2rem 0', textAlign: 'center' }}>
              Reserva realizada con éxito, ¡que la disfrutes!
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  // Controlar la visibilidad del modal con clases Bootstrap
  return (
    <>
      {show && !showSuccessModal && (
        <div className={`modal fade show d-block`} tabIndex={-1} style={{ background: 'rgba(0,0,0,0.5)' }} aria-modal={show} role="dialog">
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content booking-modal-content">
              <div className="modal-header booking-modal-header">
                <h5 className="modal-title booking-modal-title">Reservar {cabin?.name}</h5>
                <button type="button" className="btn-close" onClick={onClose} aria-label="Cerrar"></button>
              </div>
              <div className="modal-body booking-modal-body">
                <div style={{ marginBottom: 16 }}>
                  <label className="booking-datepicker-label">Fecha Inicial: </label>
                  <ReactDatePicker
                    className="booking-datepicker"
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
                  <label className="booking-datepicker-label">Fecha de Salida: </label>
                  <ReactDatePicker
                    className="booking-datepicker"
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
                {error && <p className="error">{error}</p>}
                {success && <p className="success">{success}</p>}
              </div>
              <div className="modal-footer booking-modal-footer">
                <button onClick={onClose} className="booking-btn-cancelar">
                  Cancelar
                </button>
                <button onClick={handleBooking} disabled={loading} className="booking-btn-reservar">
                  {loading ? 'Reservando...' : 'Reservar'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      {showSuccessModal && <SuccessModal />}
    </>
  );
};
