
"======================================================================
 Class: Ride
 ======================================================================"
Object subclass: Ride [
    | rideID pickupLocation dropoffLocation distance fare |

    Ride class >> newWithId: id pickup: p dropoff: d distance: dist [
        ^ (self new) initializeWithId: id pickup: p dropoff: d distance: dist
    ]

    initializeWithId: anId pickup: aPickup dropoff: aDropoff distance: aDistance [
        rideID := anId.
        pickupLocation := aPickup.
        dropoffLocation := aDropoff.
        distance := aDistance.
        fare := 0.0.
    ]

    "Helper for safe float printing in buggy GST versions"
    safePrint: aFloat [
        | intPart decPart |
        intPart := aFloat truncated.
        decPart := ((aFloat - intPart) * 100) truncated abs.
        ^ intPart asString, '.', (decPart < 10 ifTrue: ['0'] ifFalse: ['']), decPart asString
    ]

    calculateFare [ self subclassResponsibility ]

    rideDetails [
        Transcript show: '[ID: ', rideID, '] ', pickupLocation, ' -> ', dropoffLocation, 
                        ' (', (self safePrint: distance), ' miles) | Fare: $', (self safePrint: fare).
    ]
]

"======================================================================
 Class: StandardRide
 ======================================================================"
Ride subclass: StandardRide [
    calculateFare [ fare := distance * 1.50. ]
    rideDetails [ Transcript show: 'Standard Ride: '. super rideDetails. Transcript cr. ]
]

"======================================================================
 Class: PremiumRide
 ======================================================================"
Ride subclass: PremiumRide [
    calculateFare [ fare := (distance * 3.50) + 5.00. ]
    rideDetails [ Transcript show: 'Premium Ride: '. super rideDetails. Transcript show: ' (Luxury vehicle included)'; cr. ]
]

"======================================================================
 Class: Driver
 ======================================================================"
Object subclass: Driver [
    | driverID name rating assignedRides |

    Driver class >> newWithId: id name: n rating: r [
        ^ (self new) initializeWithId: id name: n rating: r
    ]

    initializeWithId: id name: n rating: r [
        driverID := id.
        name := n.
        rating := r.
        assignedRides := OrderedCollection new.
    ]

    "Manual safe print to avoid ZeroDivide bug"
    formatRating: val [
        | ip dp |
        ip := val truncated.
        dp := ((val - ip) * 10) truncated abs.
        ^ ip asString, '.', dp asString
    ]

    addRide: aRide [ assignedRides add: aRide. ]

    getDriverInfo [
        Transcript cr; show: '--- Driver Profile ---'; cr.
        Transcript show: 'Name: ', name, ' | ID: ', driverID, ' | Rating: ', (self formatRating: rating), '/5.0'; cr.
        Transcript show: 'Completed Rides: ', assignedRides size asString; cr.
        assignedRides do: [:ride | 
            Transcript show: ' - '.
            ride rideDetails.
        ].
    ]
]

"======================================================================
 Class: Rider
 ======================================================================"
Object subclass: Rider [
    | riderID name requestedRides |

    Rider class >> newWithId: id name: n [
        ^ (self new) initializeWithId: id name: n
    ]

    initializeWithId: id name: n [
        riderID := id.
        name := n.
        requestedRides := OrderedCollection new.
    ]

    requestRide: aRide [
        aRide calculateFare.
        requestedRides add: aRide.
    ]

    viewRides [
        Transcript cr; show: '--- Ride History for ', name, ' ---'; cr.
        requestedRides do: [:ride | ride rideDetails].
    ]
]

"======================================================================
 Execution Script
 ======================================================================"
| r1 d1 rides |

r1 := Rider newWithId: 'R-001' name: 'Arun Kumar'.
d1 := Driver newWithId: 'D-99' name: 'John Smith' rating: 4.8.

rides := OrderedCollection new.
rides add: (StandardRide newWithId: 'S101' pickup: 'Downtown' dropoff: 'Airport' distance: 15.5).
rides add: (PremiumRide newWithId: 'P202' pickup: 'Golden Gate' dropoff: 'Silicon Valley' distance: 35.0).

Transcript show: 'Processing Rides...'; cr.
rides do: [:r | 
    r1 requestRide: r.
    d1 addRide: r.
].

r1 viewRides.
d1 getDriverInfo.
