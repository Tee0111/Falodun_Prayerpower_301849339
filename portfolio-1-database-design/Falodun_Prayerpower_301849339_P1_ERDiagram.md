# A Transport System — ER diagram

```mermaid
erDiagram
    direction LR
    route {
        bigint route_id PK
        text route_code UK
        text origin
        text destination
        boolean active
    }
    vehicle {
        bigint vehicle_id PK
        text fleet_code UK
        integer capacity
        boolean in_service
    }
    trip {
        bigint trip_id PK
        bigint route_id FK
        bigint vehicle_id FK
        date service_date
        timestamptz departure_time
        text status
        integer passenger_count
    }
    route ||--o{ trip : "route_id"
    vehicle ||--o{ trip : "vehicle_id"
```

PK identifies a record; FK links to another table; UK marks a single-field unique value. The relationship ends show exactly one, zero or one, or zero or many records. Composite unique keys and conditional rules are listed in the schema and design.

[Diagram image](../images/Falodun_Prayerpower_301849339_ERDiagram.png)
