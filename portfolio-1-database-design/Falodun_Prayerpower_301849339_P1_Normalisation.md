# A Transport System — normalisation

The example uses the saved sample records. The full set of fields is in the design and schema.

## Starting grouped records

| route_id | trip records (list) |
| --- | --- |
| 101 | [301] |
| 102 | [302] |


The record IDs are grouped in a list. In 1NF, each record has its own row and each cell holds one value.

## 1NF: one value per cell

| trip.trip_id | trip.route_id | trip.vehicle_id | trip.status | route.route_id | route.route_code | vehicle.vehicle_id | vehicle.fleet_code |
| --- | --- | --- | --- | --- | --- | --- | --- |
| 301 | 101 | 201 | scheduled | 101 | R10 | 201 | BUS-01 |
| 302 | 102 | 202 | completed | 102 | R20 | 202 | BUS-02 |

Key: trip_id.

## 2NF: depend on the whole key

trip: vehicle_id is a proper part of candidate key (vehicle_id, departure_time), and determines vehicle details.

## vehicle_example

| vehicle.vehicle_id | vehicle.fleet_code |
| --- | --- |
| 201 | BUS-01 |
| 202 | BUS-02 |

## trip_example

| trip.trip_id | trip.route_id | trip.vehicle_id | trip.status | route.route_id | route.route_code |
| --- | --- | --- | --- | --- | --- |
| 301 | 101 | 201 | scheduled | 101 | R10 |
| 302 | 102 | 202 | completed | 102 | R20 |

## 3NF: store each entity’s details once

The entity keys determine their own descriptions. Related records keep foreign keys rather than repeating those descriptions.

## route

| route_id | route_code | origin | destination | active |
| --- | --- | --- | --- | --- |
| 101 | R10 | Cedar Park | Central Station | true |
| 102 | R20 | River Market | Hill Square | true |

## vehicle

| vehicle_id | fleet_code | capacity | in_service |
| --- | --- | --- | --- |
| 201 | BUS-01 | 40 | true |
| 202 | BUS-02 | 32 | true |

## trip

| trip_id | route_id | vehicle_id | service_date | departure_time | status | passenger_count |
| --- | --- | --- | --- | --- | --- | --- |
| 301 | 101 | 201 | 2026-11-15 | 2026-11-15T08:00:00+00:00 | scheduled | 24 |
| 302 | 102 | 202 | 2026-11-15 | 2026-11-15T09:30:00+00:00 | completed | 18 |

## Dependencies

- route: (route_id) → route_code, origin, destination, active
- vehicle: (vehicle_id) → fleet_code, capacity, in_service
- trip: (trip_id) → route_id, vehicle_id, service_date, departure_time, status, passenger_count

Joining the decomposed sample tables reproduces the original 2 example rows. The design assumes the declared keys describe the relevant business dependencies.
