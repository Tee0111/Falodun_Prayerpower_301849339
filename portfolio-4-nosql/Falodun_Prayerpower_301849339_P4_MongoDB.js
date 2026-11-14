// Run once in mongosh against a fresh exercise database.
// These records are fictional events for the case study.
(async function () {
  db = db.getSiblingDB('portfolio_nosql');
  if ((await db.getCollectionNames()).includes("trip_events")) {
    throw new Error('The exercise collection already exists. Use a fresh database.');
  }

  // The validator checks the stable event fields while details can vary.
  await db.createCollection("trip_events", {
    validator: {
    "$jsonSchema": {
        "bsonType": "object",
        "required": [
            "_id",
            "schemaVersion",
            "simulation",
            "eventType",
            "occurredAt",
            "source",
            "embedded",
            "references",
            "details"
        ],
        "properties": {
            "_id": {
                "bsonType": "string",
                "minLength": 1
            },
            "schemaVersion": {
                "enum": [
                    1
                ]
            },
            "simulation": {
                "enum": [
                    true
                ]
            },
            "eventType": {
                "bsonType": "string",
                "enum": [
                    "trip_scheduled",
                    "trip_departed"
                ]
            },
            "occurredAt": {
                "bsonType": "date"
            },
            "source": {
                "bsonType": "object",
                "required": [
                    "entity",
                    "key",
                    "snapshot"
                ],
                "properties": {
                    "entity": {
                        "enum": [
                            "trip"
                        ]
                    },
                    "key": {
                        "bsonType": "object",
                        "required": [
                            "trip_id"
                        ]
                    },
                    "snapshot": {
                        "bsonType": "object"
                    }
                }
            },
            "embedded": {
                "bsonType": "object"
            },
            "references": {
                "bsonType": "object"
            },
            "details": {
                "bsonType": "object"
            }
        }
    }
},
    validationLevel: 'strict', validationAction: 'error'
  });

  // Insert the four example events and show their IDs.
  printjson(await db.getCollection("trip_events").insertMany([
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
    },
    {
        "_id": "event_000002",
        "schemaVersion": 1,
        "simulation": true,
        "eventType": "trip_departed",
        "occurredAt": ISODate("2030-01-01T10:01:00Z"),
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
            "channel": "mobile",
            "note": "Illustrative event-specific metadata",
            "examples": {
                "delay_minutes": "illustrative delay_minutes",
                "incident_code": "illustrative incident_code",
                "status_note": "illustrative status_note"
            }
        }
    },
    {
        "_id": "event_000003",
        "schemaVersion": 1,
        "simulation": true,
        "eventType": "trip_scheduled",
        "occurredAt": ISODate("2030-01-01T10:02:00Z"),
        "source": {
            "entity": "trip",
            "key": {
                "trip_id": 302
            },
            "snapshot": {
                "trip_id": 302,
                "route_id": 102,
                "vehicle_id": 202,
                "service_date": "2026-11-15",
                "departure_time": "2026-11-15T09:30:00Z",
                "status": "completed",
                "passenger_count": 18
            }
        },
        "embedded": {
            "route": [
                {
                    "key": {
                        "route_id": 102
                    },
                    "snapshot": {
                        "route_id": 102,
                        "route_code": "R20",
                        "origin": "River Market",
                        "destination": "Hill Square",
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
                        "vehicle_id": 202
                    },
                    "snapshot": {
                        "vehicle_id": 202,
                        "fleet_code": "BUS-02",
                        "capacity": 32,
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
    },
    {
        "_id": "event_000004",
        "schemaVersion": 1,
        "simulation": true,
        "eventType": "trip_departed",
        "occurredAt": ISODate("2030-01-01T10:03:00Z"),
        "source": {
            "entity": "trip",
            "key": {
                "trip_id": 302
            },
            "snapshot": {
                "trip_id": 302,
                "route_id": 102,
                "vehicle_id": 202,
                "service_date": "2026-11-15",
                "departure_time": "2026-11-15T09:30:00Z",
                "status": "completed",
                "passenger_count": 18
            }
        },
        "embedded": {
            "route": [
                {
                    "key": {
                        "route_id": 102
                    },
                    "snapshot": {
                        "route_id": 102,
                        "route_code": "R20",
                        "origin": "River Market",
                        "destination": "Hill Square",
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
                        "vehicle_id": 202
                    },
                    "snapshot": {
                        "vehicle_id": 202,
                        "fleet_code": "BUS-02",
                        "capacity": 32,
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
            "channel": "mobile",
            "note": "Illustrative event-specific metadata",
            "examples": {
                "delay_minutes": "illustrative delay_minutes",
                "incident_code": "illustrative incident_code",
                "status_note": "illustrative status_note"
            }
        }
    }
]));
  await db.getCollection("trip_events").createIndex({eventType: 1, occurredAt: -1}, {name: 'event_type_time'});

  // 1. Find the first sample event type (up to five documents).
  printjson(await db.getCollection("trip_events").find({"eventType":"trip_scheduled"}).sort({_id:1}).limit(5).toArray());

  // 2. Find events for the first source record using nested key fields (up to five).
  printjson(await db.getCollection("trip_events").find({"source.key.trip_id":301}).sort({_id:1}).limit(5).toArray());

  // 3. Find events in the sample time range using a MongoDB Date filter (up to five).
  printjson(await db.getCollection("trip_events").find({"occurredAt":{"$gte":ISODate("2030-01-01T10:00:00Z"), "$lt":ISODate("2030-01-01T11:00:00Z")}}).sort({_id:1}).limit(5).toArray());

  // 4. Count documents for each event type.
  printjson(await db.getCollection("trip_events").aggregate([{"$group":{"_id":"$eventType", "documentCount":{"$sum":1}}}, {"$sort":{"_id":1}}]).toArray());

  // A date stored as text should be rejected by the validator.
  try {
    await db.getCollection("trip_events").insertOne({...{
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
}, _id: 'invalid_date_example', occurredAt: 'not-a-date'});
  } catch (error) { print('Invalid date error: ' + error.code); }

  // Reusing an event ID should be rejected by the unique _id index.
  try { await db.getCollection("trip_events").insertOne({
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
}); }
  catch (error) { print('Duplicate ID error: ' + error.code); }

  print('Document count: ' + await db.getCollection("trip_events").countDocuments());
})().catch(error => { print(error.stack || String(error)); quit(1); });
