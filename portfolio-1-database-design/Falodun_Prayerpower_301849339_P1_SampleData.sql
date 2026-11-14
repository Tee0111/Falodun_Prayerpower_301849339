-- Fictional sample records for A Transport System.
BEGIN;
SET LOCAL standard_conforming_strings = on;
INSERT INTO portfolio."route" ("route_id", "route_code", "origin", "destination", "active") VALUES (101, 'R10', 'Cedar Park', 'Central Station', TRUE);
INSERT INTO portfolio."route" ("route_id", "route_code", "origin", "destination", "active") VALUES (102, 'R20', 'River Market', 'Hill Square', TRUE);
INSERT INTO portfolio."vehicle" ("vehicle_id", "fleet_code", "capacity", "in_service") VALUES (201, 'BUS-01', 40, TRUE);
INSERT INTO portfolio."vehicle" ("vehicle_id", "fleet_code", "capacity", "in_service") VALUES (202, 'BUS-02', 32, TRUE);
INSERT INTO portfolio."trip" ("trip_id", "route_id", "vehicle_id", "service_date", "departure_time", "status", "passenger_count") VALUES (301, 101, 201, '2026-11-15', '2026-11-15T08:00:00Z', 'scheduled', 24);
INSERT INTO portfolio."trip" ("trip_id", "route_id", "vehicle_id", "service_date", "departure_time", "status", "passenger_count") VALUES (302, 102, 202, '2026-11-15', '2026-11-15T09:30:00Z', 'completed', 18);
COMMIT;
