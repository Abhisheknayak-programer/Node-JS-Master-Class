import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

const AllTours = () => {
  const [tours, setTours] = useState([]);

  const fetchAllTours = async () => {
    try {
      const toursData = await axios.get(`${window.API_URL}/api/v1/tours`);
      setTours(toursData.data.data);
      // console.log(toursData.data.data[1]);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    fetchAllTours();
  }, []);

  return (
    <div className="card-container">
      {tours.length > 0 &&
        tours.map((el) => {
          return (
            <div className="card" key={el.id}>
              <div className="card__header">
                <div className="card__picture">
                  <div className="card__picture-overlay">&nbsp;</div>
                  <img
                    className="card__picture-img"
                    src={`/img/tours/${el.imageCover}`}
                    alt={el.name}
                  />
                </div>
                <h3 className="heading-tertirary">
                  <span>{el.name}</span>
                </h3>
              </div>
              <div className="card__details">
                <h4 className="card__sub-heading">
                  {el.difficulty} {el.duration}-day tour
                </h4>
                <p className="card__text">{el.summary}</p>
                <div className="card__data">
                  <svg className="card__icon">
                    <use xlinkHref="/img/icons.svg#icon-map-pin"></use>
                  </svg>
                  <span>{el.startLocation.description}</span>
                </div>
                <div className="card__data">
                  <svg className="card__icon">
                    <use xlinkHref="/img/icons.svg#icon-calendar"></use>
                  </svg>
                  <span>June 2021</span>
                </div>
                <div className="card__data">
                  <svg className="card__icon">
                    <use xlinkHref="/img/icons.svg#icon-flag"></use>
                  </svg>
                  <span>{el.locations.length} stops</span>
                </div>
                <div className="card__data">
                  <svg className="card__icon">
                    <use xlinkHref="/img/icons.svg#icon-user"></use>
                  </svg>
                  <span>{el.maxGroupSize} people</span>
                </div>
              </div>
              <div className="card__footer">
                <p>
                  <span className="card__footer-value">${el.price}</span>{" "}
                  <span className="card__footer-text">per person</span>
                </p>
                <p className="card__ratings">
                  <span className="card__footer-value">
                    {el.ratingsAverage}
                  </span>{" "}
                  <span className="card__footer-text">
                    rating ({el.ratingsQuantity})
                  </span>
                </p>

                <Link
                  className="btn btn--green btn--small"
                  to={`/tour/${el.id}`}
                >
                  Details
                </Link>
              </div>
            </div>
          );
        })}
    </div>
  );
};

export default AllTours;
