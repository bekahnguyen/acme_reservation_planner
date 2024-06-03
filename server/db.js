const pg = require("pg");
const client = new pg.Client(
  process.env.DATABASE_URL || "postgres://localhost/acme_reservation_planner_db"
);
const { v4: uuidv4 } = require("uuid");

const createTables = async () => {
  const SQL = `
  DROP TABLE IF EXISTS reservation;
  DROP TABLE IF EXISTS restaurant;
  DROP TABLE IF EXISTS customer;
CREATE TABLE customer(
    id UUID primary key,
    name VARCHAR
);
CREATE TABLE restaurant(
    id UUID primary key,
    name VARCHAR
);
CREATE TABLE reservation(
    id UUID primary key,
    date DATE NOT NULL,
    party_count INTEGER NOT NULL,
    restaurant_id UUID REFERENCES restaurant(id) NOT NULL,
    customer_id UUID REFERENCES customer(id) NOT NULL
);
`;
  await client.query(SQL);
  return;
};

const createCustomer = (name) => {
  const SQL = `
INSERT INTO customer(id, name)
VALUES($1, $2)`;
  client.query(SQL, [uuidv4(), name]);
};

const createRestaurant = (name) => {
  const SQL = `
INSERT INTO restaurant(id, name)
VALUES($1, $2)`;
  client.query(SQL, [uuidv4(), name]);
};

const fetchCustomers = async () => {
  const SQL = `
    SELECT * FROM customer`;
  const response = await client.query(SQL);
  return response.rows;
};
const fetchRestaurants = async () => {
  const SQL = `
    SELECT * FROM restaurant`;
  const response = await client.query(SQL);
  return response.rows;
};
const createReservation = async ({
  date,
  party_count,
  restaurant_id,
  customer_id,
}) => {
  const SQL = `
    INSERT into reservation( id, date, party_count, restaurant_id, customer_id)
    VALUES($1, $2, $3, $4, $5)
    RETURNING *
    `;
  const response = await client.query(SQL, [
    uuidv4(),
    date,
    party_count,
    restaurant_id,
    customer_id,
  ]);
  return response.rows[0];
};

const fetchReservation = async () => {
  const SQL = `
    SELECT * FROM reservation`;
  const response = await client.query(SQL);
  return response.rows;
};

const destroyReservation = async (reservation_id, user_id) => {
  const SQL = ` 
DELETE FROM reservation WHERE id=$1 AND user_id=$2
`;
  await client.query(SQL, [reservation_id, user_id]);
};

module.exports = {
  client,
  createTables,
  createCustomer,
  createRestaurant,
  fetchCustomers,
  fetchRestaurants,
  createReservation,
  fetchReservation,
  destroyReservation,
};
