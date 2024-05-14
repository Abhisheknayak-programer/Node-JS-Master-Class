const express = require("express");
const fs = require("fs");
const app = express();

app.use(express.json()); // Middleware

const toursData = JSON.parse(
  fs.readFileSync(`${__dirname}/dev-data/data/tours-simple.json`, "utf-8")
);

const getAllTours = (req, res) => {
  res.status(200).json({
    status: "success",
    results: toursData.length,
    data: {
      tours: toursData,
    },
  });
};

const getTourById = (req, res) => {
  const tourId = Number(req.params.id);
  const tour = toursData.find((el) => el.id === tourId);

  if (!tour) {
    return res.status(404).json({
      status: "fail",
      message: "Invalid Id",
    });
  }
  res.status(200).json({
    status: "success",
    data: {
      tour: tour,
    },
  });
};

const getInitialPage = (req, res) => {
  res.status(200).send("Abhishek Nayak");
};

const postANewTour = (req, res) => {
  //   console.log(req.body);
  const newId = toursData[toursData.length - 1].id + 1;
  const newTour = Object.assign({ id: newId, ...req.body });
  toursData.push(newTour);

  fs.writeFile(
    `${__dirname}/dev-data/data/tours-simple.json`,
    JSON.stringify(toursData),
    (err) => {
      res.status(201).json({
        status: "success",
        data: {
          tour: newTour,
        },
      });
    }
  );
};

const updateATour = (req, res) => {
  const tourId = Number(req.params.id);
  const tour = toursData.find((el) => el.id === tourId);
  if (!tour) {
    return res.status(404).json({
      status: "fail",
      message: "Invalid Id",
    });
  }

  res.status(200).json({
    status: "success",
    message: "Updated tour",
  });
};

const deleteATour = (req, res) => {
  const tourId = Number(req.params.id);
  const tour = toursData.find((el) => el.id === tourId);
  if (!tour) {
    return res.status(404).json({
      status: "fail",
      message: "Invalid Id",
    });
  }

  const toursAfterDelete = toursData.filter((el) => el.id !== tourId);

  fs.writeFile(
    `${__dirname}/dev-data/data/tours-simple.json`,
    JSON.stringify(toursAfterDelete),
    (err) => {
      res.status(204).json({
        status: "success",
        message: "Deleted Successfully!",
      });
    }
  );
};

//// [Way -- 1] ROUTES
// app.get("/", getInitialPage);

// app.get("/api/v1/tours", getAllTours);

// app.get("/api/v1/tours/:id", getTourById);

// app.post("/api/v1/tours", postANewTour);

// app.patch("/api/v1/tours/:id", updateATour);

// app.delete("/api/v1/tours/:id", deleteATour);

//// [Way -- 2] ROUTES
app.route("/api/v1/tours").get(getAllTours).post(postANewTour);

app
  .route("/api/v1/tours/:id")
  .get(getTourById)
  .patch(updateATour)
  .delete(deleteATour);

const port = 8000;
app.listen(port, () => console.log("Site is running on port"));
