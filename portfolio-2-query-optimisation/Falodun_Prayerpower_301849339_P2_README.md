# A Transport System — SQL queries

## 1. Show related trip, route, vehicle records (up to 20).

```sql
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
```

| trip_trip_id | trip_service_date | route_route_id | route_route_code | vehicle_vehicle_id | vehicle_fleet_code |
| --- | --- | --- | --- | --- | --- |
| 301 | 2026-11-15 | 101 | R10 | 201 | BUS-01 |
| 302 | 2026-11-15 | 102 | R20 | 202 | BUS-02 |

## 2. Find trip records where service_date matches "2026-11-15" (up to 20).

```sql
SELECT * FROM portfolio."trip"
WHERE "service_date" IS NOT DISTINCT FROM '2026-11-15'
ORDER BY "trip_id"
LIMIT 20;
```

| trip_id | route_id | vehicle_id | service_date | departure_time | status | passenger_count |
| --- | --- | --- | --- | --- | --- | --- |
| 301 | 101 | 201 | 2026-11-15 | 2026-11-15T08:00:00+00:00 | scheduled | 24 |
| 302 | 102 | 202 | 2026-11-15 | 2026-11-15T09:30:00+00:00 | completed | 18 |

## 3. Count trip records for each route_id (up to 20 groups).

```sql
SELECT "route_id", count(*) AS record_count
FROM portfolio."trip"
GROUP BY "route_id"
ORDER BY record_count DESC, "route_id" NULLS LAST
LIMIT 20;
```

| route_id | record_count |
| --- | --- |
| 101 | 1 |
| 102 | 1 |


## Index comparison

| Phase | Median (ms) | Three runs (ms) | Plan nodes | Buffer hits |
| --- | --- | --- | --- | --- |
| Before index | 1.94 | 1.94, 1.907, 1.964 | Sort → Seq Scan | 274 |
| After index | 0.281 | 0.271, 0.32, 0.281 | Sort → Bitmap Heap Scan → Bitmap Index Scan | 55 |

The median execution time changed from 1.94 ms to 0.281 ms. The measured plan used p2_filter_idx. The results matched in both phases. An index adds storage and write-maintenance costs; timings depend on the selected lookup and environment.

## Execution plans

### Before index, run 1

```text
Sort (actual time=1.91..1.913 rows=50 loops=1)
  Seq Scan on trip (actual time=0.013..1.873 rows=50 loops=1)
Planning Time: 0.34 ms
Execution Time: 1.94 ms
```

### Before index, run 2

```text
Sort (actual time=1.878..1.881 rows=50 loops=1)
  Seq Scan on trip (actual time=0.014..1.842 rows=50 loops=1)
Planning Time: 0.298 ms
Execution Time: 1.907 ms
```

### Before index, run 3

```text
Sort (actual time=1.932..1.935 rows=50 loops=1)
  Seq Scan on trip (actual time=0.013..1.894 rows=50 loops=1)
Planning Time: 0.328 ms
Execution Time: 1.964 ms
```

### After index, run 1

```text
Sort (actual time=0.216..0.219 rows=50 loops=1)
  Bitmap Heap Scan on trip (actual time=0.029..0.179 rows=50 loops=1)
    Bitmap Index Scan using p2_filter_idx (actual time=0.013..0.014 rows=50 loops=1)
Planning Time: 0.544 ms
Execution Time: 0.271 ms
```

### After index, run 2

```text
Sort (actual time=0.254..0.257 rows=50 loops=1)
  Bitmap Heap Scan on trip (actual time=0.035..0.208 rows=50 loops=1)
    Bitmap Index Scan using p2_filter_idx (actual time=0.016..0.016 rows=50 loops=1)
Planning Time: 0.644 ms
Execution Time: 0.32 ms
```

### After index, run 3

```text
Sort (actual time=0.228..0.231 rows=50 loops=1)
  Bitmap Heap Scan on trip (actual time=0.029..0.193 rows=50 loops=1)
    Bitmap Index Scan using p2_filter_idx (actual time=0.013..0.013 rows=50 loops=1)
Planning Time: 0.521 ms
Execution Time: 0.281 ms
```

## Reproduce

Use a fresh database with the Portfolio 1 schema and sample data. Run Falodun_Prayerpower_301849339_P2_Queries.sql, then Falodun_Prayerpower_301849339_P2_Optimisation.sql. The optimisation script creates a separate performance table and runs EXPLAIN (ANALYZE, BUFFERS).

[Query screenshot](screenshots/Falodun_Prayerpower_301849339_P2_QueryResults.png) · [Index comparison](screenshots/Falodun_Prayerpower_301849339_P2_IndexComparison.png)

## References

- [PostgreSQL — EXPLAIN](https://www.postgresql.org/docs/17/using-explain.html)

