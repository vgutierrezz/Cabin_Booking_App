import React from 'react';
import { Cabin } from '../../models/CabinDTO';

import './CardComponent.css';

interface CardComponentProps {
  cabins: Cabin[];
}

export const CardComponent: React.FC<CardComponentProps> = ({ cabins }) => {
  const groupedCabins: Cabin[][] = [];
  for (let i = 0; i < cabins.length; i += 2) {
    groupedCabins.push(cabins.slice(i, i + 2));
  }

  return (
    <div className="container">
      {groupedCabins.map((group, groupIndex) => (
        <div className="row mb-4" key={groupIndex}>
          {group.map((cabin) => (
            <div className="col-md-6 d-flex justify-content-center" key={cabin.id}>
              <div className="card">
                {cabin.images?.map((img, index) => (
                  <img
                    key={index}
                    src={`data:image/jpeg;base64,${img.data}`} 
                    alt={img.fileName}
                    className="card-img-top"
                  />
                ))}
                <div className="card-body">
                  <h5 className="card-title">{cabin.name}</h5>
                  <p className="card-text">{cabin.description}</p>
                  <a href="#" className="btn button-verde">Ver más</a>
                </div>
              </div>
            </div>
          ))}
        </div>
      ))}
    </div>
  );
};
