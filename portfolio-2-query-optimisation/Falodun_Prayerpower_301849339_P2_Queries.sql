-- Show related trip, route, vehicle records (up to 20).
SELECT t0."trip_id" AS "trip_trip_id",
       t0."service_date" AS "trip_service_date",
       t1."route_id" AS "route_route_id",
       t1."route_code" AS "route_route_code",
       t2."vehicle_id" AS "vehicle_vehicle_id",
       t2."fleet_code" AS "vehicle_fleet_code"
FROM portfolio."trip" t0
JOIN portfolio."route" t1 ON t0."route_id" = t1."route_id"
JOIN portfolio."vehicle" t2 ON t0."vehicle_id" = t2."vehicle_id"
ORDER BY t0."trip_id", t1."route_id", t2."vehicle_id"
LIMIT 20;

EXPLAIN (ANALYZE, BUFFERS, FORMAT JSON)
SELECT t0."trip_id" AS "trip_trip_id",
       t0."service_date" AS "trip_service_date",
       t1."route_id" AS "route_route_id",
       t1."route_code" AS "route_route_code",
       t2."vehicle_id" AS "vehicle_vehicle_id",
       t2."fleet_code" AS "vehicle_fleet_code"
FROM portfolio."trip" t0
JOIN portfolio."route" t1 ON t0."route_id" = t1."route_id"
JOIN portfolio."vehicle" t2 ON t0."vehicle_id" = t2."vehicle_id"
ORDER BY t0."trip_id", t1."route_id", t2."vehicle_id"
LIMIT 20;

-- Find trip records where service_date matches "2026-11-15" (up to 20).
SELECT * FROM portfolio."trip"
WHERE "service_date" IS NOT DISTINCT FROM '2026-11-15'
ORDER BY "trip_id"
LIMIT 20;

EXPLAIN (ANALYZE, BUFFERS, FORMAT JSON)
SELECT * FROM portfolio."trip"
WHERE "service_date" IS NOT DISTINCT FROM '2026-11-15'
ORDER BY "trip_id"
LIMIT 20;

-- Count trip records for each route_id (up to 20 groups).
SELECT "route_id", count(*) AS record_count
FROM portfolio."trip"
GROUP BY "route_id"
ORDER BY record_count DESC, "route_id" NULLS LAST
LIMIT 20;

EXPLAIN (ANALYZE, BUFFERS, FORMAT JSON)
SELECT "route_id", count(*) AS record_count
FROM portfolio."trip"
GROUP BY "route_id"
ORDER BY record_count DESC, "route_id" NULLS LAST
LIMIT 20;
