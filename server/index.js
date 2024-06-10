const {
  client,
  createTables,
  createCustomer,
  createRestaurant,
  fetchCustomers,
  fetchRestaurants,
  createReservation,
  destroyReservation,
} = require("./db");

const express = require("express");
const app = express();

//GET /api/customers - returns array of customers
app.get("/api/customers", async (req, res, next) => {
  try {
    res.send(await fetchCustomers());
  } catch (ex) {
    next(ex);
  }
});
// GET /api/restaurants - returns an array of restaurants
app.get("/api/restaurants", async (req, res, next) => {
  try {
    res.send(await fetchRestaurants());
  } catch (ex) {
    next(ex);
  }
});
// GET /api/reservations - returns an array of reservations

app.get("/api/reservations", async (req, res, next) => {
  try {
    const SQL = `
    SELECT * FROM reservation`;
  } catch (ex) {
    next(ex);
  }
});

app.post("/api/customers/:id/reservations", async (req, res, next) => {
  try {
    res.status(201).send(
      await createReservation({
        date: req.body.date,
        party_count: req.body.party_count,
        restaurant_id: req.body.restaurant_id,
        customer_id: req.params.id,
      })
    );
  } catch (ex) {
    next(ex);
  }
});

app.delete(
  "/api/customers/:customer_id/reservations/:id",
  async (req, res, next) => {
    try {
      await destroyReservation({
        customer_id: req.params.customer_id,
        id: req.params.id,
      });
      res.sendStatus(204);
    } catch (ex) {
      next(ex);
    }
  }
);

// DELETE /api/customers/:customer_id/reservations/:id

const init = async () => {
  console.log("connecting to database");
  await client.connect();
  console.log("connected to database");
  await createTables();
  console.log("created tables");
  await Promise.all([
    createCustomer("Beky"),
    createCustomer("Nammo"),
    createRestaurant("LPC"),
    createRestaurant("Fish Gaucho"),
    createRestaurant("Five Test Kitchen"),
    createRestaurant("Etto"),
    createReservation(
      "2024-06-07",
      7,
      "5081aac5-acf8-42d5-b36f-0cd961292ede",
      "dc971043-4626-4eec-b332-06930e35fdb1"
    ),
  ]);
  const port = process.env.PORT || 3000;
  app.listen(port, () => {
    console.log(`listening on port ${port}`);
  });
};

init();
