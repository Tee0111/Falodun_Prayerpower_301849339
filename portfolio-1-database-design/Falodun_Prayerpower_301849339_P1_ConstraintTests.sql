-- Run these deliberately invalid statements one at a time, outside a transaction.
-- Each should fail at the named constraint; the sample rows should remain unchanged.

-- 1. route duplicate pk. Expected: pk_route, SQLSTATE 23505.
INSERT INTO portfolio."route" ("route_id", "route_code", "origin", "destination", "active")
VALUES (101, 'R30', 'Oak End', 'West Gate', TRUE);

-- 2. route duplicate code. Expected: uq_route_0, SQLSTATE 23505.
INSERT INTO portfolio."route" ("route_id", "route_code", "origin", "destination", "active")
VALUES (901, 'R10', 'Oak End', 'West Gate', TRUE);

-- 3. route null code. Expected: route_code, SQLSTATE 23502.
INSERT INTO portfolio."route" ("route_id", "route_code", "origin", "destination", "active")
VALUES (902, NULL, 'Oak End', 'West Gate', TRUE);

-- 4. vehicle duplicate pk. Expected: pk_vehicle, SQLSTATE 23505.
INSERT INTO portfolio."vehicle" ("vehicle_id", "fleet_code", "capacity", "in_service")
VALUES (201, 'BUS-03', 28, TRUE);

-- 5. vehicle duplicate fleet. Expected: uq_vehicle_0, SQLSTATE 23505.
INSERT INTO portfolio."vehicle" ("vehicle_id", "fleet_code", "capacity", "in_service")
VALUES (903, 'BUS-01', 28, TRUE);

-- 6. trip duplicate pk. Expected: pk_trip, SQLSTATE 23505.
INSERT INTO portfolio."trip" ("trip_id", "route_id", "vehicle_id", "service_date", "departure_time", "status", "passenger_count")
VALUES (301, 101, 202, '2026-11-15', '2026-11-15T11:00:00Z', 'scheduled', 12);

-- 7. trip duplicate vehicle slot. Expected: uq_trip_0, SQLSTATE 23505.
INSERT INTO portfolio."trip" ("trip_id", "route_id", "vehicle_id", "service_date", "departure_time", "status", "passenger_count")
VALUES (904, 102, 201, '2026-11-15', '2026-11-15T08:00:00Z', 'scheduled', 12);

-- 8. trip missing route. Expected: fk_trip_0, SQLSTATE 23503.
INSERT INTO portfolio."trip" ("trip_id", "route_id", "vehicle_id", "service_date", "departure_time", "status", "passenger_count")
VALUES (905, 9901, 201, '2026-11-15', '2026-11-15T12:00:00Z', 'scheduled', 12);

-- 9. trip missing vehicle. Expected: fk_trip_1, SQLSTATE 23503.
INSERT INTO portfolio."trip" ("trip_id", "route_id", "vehicle_id", "service_date", "departure_time", "status", "passenger_count")
VALUES (906, 101, 9902, '2026-11-15', '2026-11-15T13:00:00Z', 'scheduled', 12);

-- 10. vehicle nonpositive capacity. Expected: vehicle_capacity_positive, SQLSTATE 23514.
INSERT INTO portfolio."vehicle" ("vehicle_id", "fleet_code", "capacity", "in_service")
VALUES (907, 'BUS-07', 0, TRUE);

-- 11. trip negative passengers. Expected: trip_passenger_count_nonnegative, SQLSTATE 23514.
INSERT INTO portfolio."trip" ("trip_id", "route_id", "vehicle_id", "service_date", "departure_time", "status", "passenger_count")
VALUES (908, 101, 202, '2026-11-15', '2026-11-15T14:00:00Z', 'scheduled', -1);
