import React from 'react';
import './CardComponent.css';

interface Cabin {
  id: number;
  title: string;
  description: string;
  image: string;
}

interface CardComponentProps {
  cabins: Cabin[];
}

export const CardComponent: React.FC<CardComponentProps> = ({ cabins }) => {
  const groupedCabins = [];
  for (let i = 0; i < cabins.length; i += 2) {
    groupedCabins.push(cabins.slice(i, i + 2));
  }

  return (
    <div className="container">
      {groupedCabins.map((group, groupIndex) => (
        <div className="row mb-4" key={groupIndex}>
          {group.map((cabin) => (
            <div className="col-md-6 d-flex justify-content-center" key={cabin.id}>
              <div className="card" >
                <img src="src\component\Card\img\cabania2.jpg" className="card-img-top" alt={cabin.title} />
                <div className="card-body">
                  <h5 className="card-title">{cabin.title}</h5>
                  <p className="card-text">{cabin.description}</p>
                  <a href="#" className="btn btn-primary">Ver más</a>
                </div>
              </div>
            </div>
          ))}
        </div>
      ))}
    </div>
  );
};
