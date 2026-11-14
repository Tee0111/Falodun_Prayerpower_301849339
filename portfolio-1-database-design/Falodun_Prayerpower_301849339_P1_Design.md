# A Transport System — database design

My case study records route, vehicle, trip.

## Users

- Dispatchers schedule and review trips.
- Operations analysts review service and passenger-count summaries.

## Main operations

- Maintain route and vehicle details.
- Schedule trips and record their status and passenger count.
- Find trips by date and summarize service by route.

## Entities

| Entity | Information stored |
| --- | --- |
| route | A bus route with a code, endpoints, and service availability. |
| vehicle | A bus available for assignment to scheduled trips. |
| trip | One scheduled run, linked to one route and one vehicle. Trip-specific values are stored here; route and vehicle attributes remain in their respective parent entities. |

## route

| Field | Type | Key | Required |
| --- | --- | --- | --- |
| route_id | BIGINT | PK | Yes |
| route_code | TEXT | Unique | Yes |
| origin | TEXT |  | Yes |
| destination | TEXT |  | Yes |
| active | BOOLEAN |  | Yes |
- Unique key: (route_code).

## vehicle

| Field | Type | Key | Required |
| --- | --- | --- | --- |
| vehicle_id | BIGINT | PK | Yes |
| fleet_code | TEXT | Unique | Yes |
| capacity | INTEGER |  | Yes |
| in_service | BOOLEAN |  | Yes |
- Unique key: (fleet_code).

## trip

| Field | Type | Key | Required |
| --- | --- | --- | --- |
| trip_id | BIGINT | PK | Yes |
| route_id | BIGINT | FK | Yes |
| vehicle_id | BIGINT | FK | Yes |
| service_date | DATE |  | Yes |
| departure_time | TIMESTAMPTZ |  | Yes |
| status | TEXT |  | Yes |
| passenger_count | INTEGER |  | Yes |
- route_id → route.route_id
- vehicle_id → vehicle.vehicle_id
- Unique key: (vehicle_id, departure_time).

## Relationships and business rules

- Each route code identifies at most one route.
- A vehicle must have a positive passenger capacity.
- Every trip must reference an existing route.
- Every trip must reference an existing vehicle.
- A vehicle may be assigned to at most one trip at a given departure timestamp; this uniqueness rule also resolves concurrent scheduling attempts for the same slot.
- A trip's recorded passenger count cannot be negative.

## Assumptions

- The operator runs urban bus service; all sample data must be synthetic.
- Each trip uses exactly one route and one vehicle.
- Departure timestamps are stored in UTC, and service_date is the operator's service date.
- Passenger counts are trip-level totals; no passenger identities or student names or IDs are stored.
- Normalization example: Trip has one row per scheduled run and references Route and Vehicle by foreign keys; route endpoints and vehicle capacity stay in their parent entities rather than being repeated in Trip.

