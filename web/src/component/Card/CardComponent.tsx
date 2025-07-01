import { FaHeart, FaRegHeart } from "react-icons/fa";
import { Cabin } from "../../models/CabinDTO";
import { useNavigate } from "react-router-dom";
import { useContext, useState } from "react";
import { BookingComponent } from '../Booking/BookingComponent';
import { AuthContext } from "../AuthContext/AuthContext";
import './CardComponent.css'

interface CardComponentProps {
  cabins: Cabin[];
  favoriteIds: number[];
  onToggleFavorite?: (cabinId: number) => void;  // Función para togglear favorito
  renderExtraActions?: (cabin: Cabin) => React.ReactNode;
}

export const CardComponent: React.FC<CardComponentProps> = ({ cabins, favoriteIds = [], onToggleFavorite, renderExtraActions }) => {
  const navigate = useNavigate();
  const [showBooking, setShowBooking] = useState(false);
  const [selectedCabin, setSelectedCabin] = useState<Cabin | null>(null);
  const { token, user } = useContext(AuthContext);

  const handleToggle = (cabinId: number) => {
    if (onToggleFavorite) {
      onToggleFavorite(cabinId);
    }
  };

  const handleOpenBooking = (cabin: Cabin) => {
    setSelectedCabin(cabin);
    setShowBooking(true);
  };
  const handleCloseBooking = () => {
    setShowBooking(false);
    setSelectedCabin(null);
  };

  const groupedCabins: Cabin[][] = [];
  for (let i = 0; i < cabins.length; i += 2) {
    groupedCabins.push(cabins.slice(i, i + 2));
  }

  return (
    <div className="container">
      {groupedCabins.map((group, groupIndex) => (
        <div className="row mb-4" key={groupIndex}>
          {group.map((cabin) => {
            const isFavorite = favoriteIds.includes(cabin.id);

            return (
              <div className="col-md-6 d-flex justify-content-center" key={cabin.id} style={{ position: 'relative' }}>
                <div className="card">
                  <div
                    className="favorite-icon"
                    onClick={() => handleToggle(cabin.id)}
                    title={isFavorite ? 'Quitar de favoritos' : 'Agregar a favoritos'}
                  >
                    {isFavorite ? (
                      <FaHeart color="red" size={24} />
                    ) : (
                      <FaRegHeart color="white" size={24} />
                    )}
                  </div>

                  {cabin.images && cabin.images.length > 0 ? (
                    <img
                      src={`data:image/jpeg;base64,${cabin.images[0].data}`}
                      alt={cabin.images[0].fileName}
                      className="card-img-top cabin-image"
                    />
                  ) : (
                    <div className="cabin-no-image">
                      Sin imagen
                    </div>
                  )}
                  <div className="card-body">
                    <h5 className="card-title">{cabin.name}</h5>
                    <p className="card-text">{cabin.description}</p>
                    <div className="card-actions-row">
                      <button
                        className="button-ver-mas-gris"
                        onClick={() => navigate(`/cabania/${cabin.id}`)}
                      >
                        Ver más
                      </button>
                      <button className="book-btn" onClick={() => handleOpenBooking(cabin)}>
                        Reservar
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ))}
      <BookingComponent
        show={showBooking}
        onClose={handleCloseBooking}
        cabin={selectedCabin}
        token={token}
        userId={user?.id}
      />
    </div>
  );
};