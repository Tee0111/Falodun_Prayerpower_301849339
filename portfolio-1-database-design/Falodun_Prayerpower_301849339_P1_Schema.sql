-- A Transport System: tables, keys and business constraints.
-- Run once in a fresh PostgreSQL database.
BEGIN;
SET LOCAL standard_conforming_strings = on;
CREATE SCHEMA portfolio;
CREATE TABLE portfolio."route" (
  "route_id" bigint NOT NULL,
  "route_code" text NOT NULL,
  "origin" text NOT NULL,
  "destination" text NOT NULL,
  "active" boolean NOT NULL,
  CONSTRAINT "pk_route" PRIMARY KEY ("route_id"),
  CONSTRAINT "uq_route_0" UNIQUE ("route_code")
);
CREATE TABLE portfolio."vehicle" (
  "vehicle_id" bigint NOT NULL,
  "fleet_code" text NOT NULL,
  "capacity" bigint NOT NULL,
  "in_service" boolean NOT NULL,
  CONSTRAINT "pk_vehicle" PRIMARY KEY ("vehicle_id"),
  CONSTRAINT "uq_vehicle_0" UNIQUE ("fleet_code")
);
CREATE TABLE portfolio."trip" (
  "trip_id" bigint NOT NULL,
  "route_id" bigint NOT NULL,
  "vehicle_id" bigint NOT NULL,
  "service_date" date NOT NULL,
  "departure_time" timestamptz NOT NULL,
  "status" text NOT NULL,
  "passenger_count" bigint NOT NULL,
  CONSTRAINT "pk_trip" PRIMARY KEY ("trip_id"),
  CONSTRAINT "uq_trip_0" UNIQUE ("vehicle_id", "departure_time")
);
ALTER TABLE portfolio."trip" ADD CONSTRAINT "fk_trip_0" FOREIGN KEY ("route_id") REFERENCES portfolio."route" ("route_id");
ALTER TABLE portfolio."trip" ADD CONSTRAINT "fk_trip_1" FOREIGN KEY ("vehicle_id") REFERENCES portfolio."vehicle" ("vehicle_id");
ALTER TABLE portfolio."vehicle" ADD CONSTRAINT "vehicle_capacity_positive" CHECK ("capacity" > 0);
ALTER TABLE portfolio."trip" ADD CONSTRAINT "trip_passenger_count_nonnegative" CHECK ("passenger_count" >= 0);
COMMIT;
