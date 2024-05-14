import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

const Tour = (props) => {
  const [tour, setTour] = useState(null);
  const params = useParams();
  const id = params.id;

  const fetchTour = async () => {
    try {
      const toursData = await axios.get(`${window.API_URL}/api/v1/tours/${id}`);
      // console.log(toursData.data.data);
      setTour(toursData.data.data);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    fetchTour();
  }, [params]);

  return (
    <div>
      {tour && (
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "10px",
          }}
        >
          <div
            style={{
              display: "flex",
              flexDirection: "row-reverse",
              justifyContent: "space-between",
              fontWeight: "bold",
              fontSize: "20px",
            }}
          >
            <span>ID : {tour.id}</span>
            <span>Name : {tour.name}</span>
          </div>
          <span style={{ fontSize: "14px", textAlign: "justify" }}>
            DESC : {tour.description}
          </span>
          <img
            className="card__picture-img"
            src={`../img/tours/${tour.imageCover}`}
            alt={tour.name}
          />
        </div>
      )}
    </div>
  );
};

export default Tour;
