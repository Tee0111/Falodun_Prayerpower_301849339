# Portfolio 4 — NoSQL and Advanced Data Models

I used MongoDB collection trip_events for trip_scheduled and trip_departed events. These are fictional event examples based on trip, route, vehicle.

## Document model

| Field | Meaning |
| --- | --- |
| _id | Unique string event ID |
| eventType | One of the two selected case event labels |
| occurredAt | Native BSON Date; sample timestamps are in 2030 |
| source | Original entity, primary key and saved JSON snapshot |
| embedded | Linked record snapshots read with the event |
| references | Keys for linked sources kept outside the embedded snapshots |
| details | Event metadata whose fields vary |

Related route, vehicle details are stored as snapshots with the event. This makes an event readable in one document. It duplicates some information, and later SQL changes do not automatically update the snapshots. PostgreSQL continues to enforce the relational rules.

## Example document

```javascript
{
    "_id": "event_000001",
    "schemaVersion": 1,
    "simulation": true,
    "eventType": "trip_scheduled",
    "occurredAt": ISODate("2030-01-01T10:00:00Z"),
    "source": {
        "entity": "trip",
        "key": {
            "trip_id": 301
        },
        "snapshot": {
            "trip_id": 301,
            "route_id": 101,
            "vehicle_id": 201,
            "service_date": "2026-11-15",
            "departure_time": "2026-11-15T08:00:00Z",
            "status": "scheduled",
            "passenger_count": 24
        }
    },
    "embedded": {
        "route": [
            {
                "key": {
                    "route_id": 101
                },
                "snapshot": {
                    "route_id": 101,
                    "route_code": "R10",
                    "origin": "Cedar Park",
                    "destination": "Central Station",
                    "active": true
                },
                "via": [
                    "trip.route_id → route"
                ]
            }
        ],
        "vehicle": [
            {
                "key": {
                    "vehicle_id": 201
                },
                "snapshot": {
                    "vehicle_id": 201,
                    "fleet_code": "BUS-01",
                    "capacity": 40,
                    "in_service": true
                },
                "via": [
                    "trip.vehicle_id → vehicle"
                ]
            }
        ]
    },
    "references": {},
    "details": {
        "channel": "web"
    }
}
```

## Queries and results

| Query | Returned documents |
| --- | --- |
| Find the first sample event type (up to five documents). | 2 |
| Find events for the first source record using nested key fields (up to five). | 2 |
| Find events in the sample time range using a MongoDB Date filter (up to five). | 4 |
| Count documents for each event type. | 2 |

## 1. Find the first sample event type (up to five documents).

```javascript
db.getCollection("trip_events").find({"eventType":"trip_scheduled"}).sort({_id:1}).limit(5).toArray();
```

Selected fields from the returned documents:

```json
[
  {
    "_id": "event_000001",
    "eventType": "trip_scheduled",
    "occurredAt": {
      "$date": "2030-01-01T10:00:00Z"
    },
    "source": {
      "trip_id": 301
    }
  },
  {
    "_id": "event_000003",
    "eventType": "trip_scheduled",
    "occurredAt": {
      "$date": "2030-01-01T10:02:00Z"
    },
    "source": {
      "trip_id": 302
    }
  }
]
```

## 2. Find events for the first source record using nested key fields (up to five).

```javascript
db.getCollection("trip_events").find({"source.key.trip_id":301}).sort({_id:1}).limit(5).toArray();
```

Selected fields from the returned documents:

```json
[
  {
    "_id": "event_000001",
    "eventType": "trip_scheduled",
    "occurredAt": {
      "$date": "2030-01-01T10:00:00Z"
    },
    "source": {
      "trip_id": 301
    }
  },
  {
    "_id": "event_000002",
    "eventType": "trip_departed",
    "occurredAt": {
      "$date": "2030-01-01T10:01:00Z"
    },
    "source": {
      "trip_id": 301
    }
  }
]
```

## 3. Find events in the sample time range using a MongoDB Date filter (up to five).

```javascript
db.getCollection("trip_events").find({"occurredAt":{"$gte":ISODate("2030-01-01T10:00:00Z"), "$lt":ISODate("2030-01-01T11:00:00Z")}}).sort({_id:1}).limit(5).toArray();
```

Selected fields from the returned documents:

```json
[
  {
    "_id": "event_000001",
    "eventType": "trip_scheduled",
    "occurredAt": {
      "$date": "2030-01-01T10:00:00Z"
    },
    "source": {
      "trip_id": 301
    }
  },
  {
    "_id": "event_000002",
    "eventType": "trip_departed",
    "occurredAt": {
      "$date": "2030-01-01T10:01:00Z"
    },
    "source": {
      "trip_id": 301
    }
  },
  {
    "_id": "event_000003",
    "eventType": "trip_scheduled",
    "occurredAt": {
      "$date": "2030-01-01T10:02:00Z"
    },
    "source": {
      "trip_id": 302
    }
  },
  {
    "_id": "event_000004",
    "eventType": "trip_departed",
    "occurredAt": {
      "$date": "2030-01-01T10:03:00Z"
    },
    "source": {
      "trip_id": 302
    }
  }
]
```

## 4. Count documents for each event type.

```javascript
db.getCollection("trip_events").aggregate([{"$group":{"_id":"$eventType", "documentCount":{"$sum":1}}}, {"$sort":{"_id":1}}]).toArray();
```

| _id | documentCount |
| --- | --- |
| trip_departed | 2 |
| trip_scheduled | 2 |

## Validation and suitability

MongoDB inserted 4 documents. An invalid date type was rejected with code 121 and a repeated event ID with 11000. The collection still contained 4 valid documents. The compound eventType/occurredAt index supports those access fields; this exercise does not measure its speed.

The details field can vary across event types, while the common fields have a validator. Events can be added as separate documents rather than growing one large history record.

## Run the script

Connect mongosh to a fresh exercise database and run Falodun_Prayerpower_301849339_P4_MongoDB.js. It selects portfolio_nosql, creates the collection, inserts the sample documents and displays the query results. [Implementation evidence](screenshots/Falodun_Prayerpower_301849339_P4_DocumentsAndQueries.png).

## References

- [MongoDB — data modelling](https://www.mongodb.com/docs/manual/data-modeling/)

