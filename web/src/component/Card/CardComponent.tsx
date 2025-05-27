import './CardComponent.css';
import Img1 from './img/cabania1.avif';
import Img2 from './img/cabania2.jpg';
import Img3 from './img/cabania3.jpg';

export const CardComponent = () => {
  return (
    <div className="card-group">
      {[Img1, Img2, Img3].map((img, index) => (
        <div key={index} className="card h-100 d-flex flex-column m-2">
          <img src={img} className="card-img-top" alt={`Hotel ${index + 1}`} />
          <div className="card-body d-flex flex-column flex-grow-1">
            <h5 className="card-title">Cabaña {index + 1}</h5>
            <p className="card-text">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Quisque euismod.
            </p>
            <p className="card-text mt-auto">
              <small className="text-body-secondary">Última actualización: 3 mins</small>
            </p>
          </div>
        </div>
      ))}
    </div>
  );
};

