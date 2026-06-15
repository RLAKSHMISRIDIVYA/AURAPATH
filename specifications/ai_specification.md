# AuraPath: AI & Algorithmic Design Specifications

This document outlines the core algorithms, mathematical weights, pseudocode, and execution models powering the intelligence engines in the AuraPath platform.

---

## 📐 Mathematical Frameworks

### 1. Urban Vitality Index (UVI) Calculation
The pathfinding engine weights edges on the OpenStreetMap graph using the UVI. A higher UVI reduces the "perceived cost" of an edge, guiding the A* pathfinder to safe routes.

$$\text{UVI}_e = 0.40 \cdot L_e + 0.25 \cdot C_e + 0.20 \cdot S_e + 0.10 \cdot T_e + 0.05 \cdot H_e$$

Where for each edge $e$:
*   $L_e$ = **Lighting Score** (calculated from municipal streetlight nodes proximity, lux ratings, and verified commuter ratings).
*   $C_e$ = **Crowd Vitality** (aggregated from real-time dynamic commuter density, mobile device network associations, and transit exit volumes).
*   $S_e$ = **Storefront Activity** (number of registered active commercial store beacons within 15m radius of the edge).
*   $T_e$ = **Transit Presence** (frequency of active public transport feeds, police patrol paths, and auto stands along the edge).
*   $H_e$ = **Historical Safety Rating** ($1.0 - \text{normalized incident rate}$).

#### Path Edge Cost Function:
$$\text{Cost}_e = \text{Length}_e \cdot \left( 1.5 - \text{UVI}_e \right)$$
*If UVI is high (e.g. 0.95), the cost factor is $1.5 - 0.95 = 0.55$, making this path highly preferred. If UVI is low (e.g. 0.30), the cost factor is $1.5 - 0.30 = 1.20$, routing the path away from this edge.*

---

### 2. TrustScore™ Formulation
Represents the safety profile of a transit route or driver-vehicle pair in real-time.

$$\text{TrustScore} = w_1 \cdot D_{\text{reliability}} + w_2 \cdot R_{\text{compliance}} + w_3 \cdot A_{\text{safety}} + w_4 \cdot T_{\text{day}} + w_5 \cdot C_{\text{feedback}}$$

Where:
*   $D_{\text{reliability}}$ = Historical driver rating.
*   $R_{\text{compliance}}$ = Route deviation compliance score (1.0 = zero detours, 0.0 = total deviation).
*   $A_{\text{safety}}$ = Average UVI score of the current geohash area.
*   $T_{\text{day}}$ = Time of day penalty weight (1.0 at noon, drops to 0.7 after 8:00 PM).
*   $C_{\text{feedback}}$ = Weighted community feedback scores.
*   Weights: $w_1 = 0.25, w_2 = 0.30, w_3 = 0.20, w_4 = 0.15, w_5 = 0.10$.

---

## 🧬 CommuteDNA™ Detection Engine

CommuteDNA aggregates spatial, gait, and environmental variables to identify threat scenarios. It utilizes a local on-device **gait fingerprint** and runs a **TensorFlow Lite audio model** locally on the client phone to classify distress cries in real-time.

```
+------------------+     +------------------+     +------------------+
|   Spatial GPS    |     | Gait Accelerometer|    | Local Microphone |
| Route Deviations |     | Heart Rate Spikes|    | (TFLite Audio AI)|
+--------+---------+     +--------+---------+     +--------+---------+
         |                        |                        |
         +------------------------+------------------------+
                                  |
                                  v
                    +---------------------------+
                    | CommuteDNA Sensor Fusion  |
                    +-------------+-------------+
                                  |
            +---------------------+---------------------+
            |                     |                     |
     [Normal State]      [Minor Anomaly]        [Distress / Detour]
      Gait: Stable        Gait: Fast            Gait: Running
      Heart: <85 BPM      Heart: 90-105 BPM     Heart: >130 BPM
      Audio: <50 dB       Audio: 55-65 dB       Audio: >70 dB
      Risk: GREEN         Risk: YELLOW/ORANGE   Risk: RED
```

---

## 💻 Algorithmic Pseudocode

### 1. Dynamic Cohort Pairing Algorithm (Redis Match Queue)
Runs in Node.js, checking candidate pairings when commuters enter transit exit portals.

```python
def find_cohort_match(new_commuter):
    # Retrieve candidates in the same geohash starting point
    candidates = Redis.georadius("cohort_queue_geo", 
                                 new_commuter.origin.lng, 
                                 new_commuter.origin.lat, 
                                 50, "m") # 50m radius search
    
    best_match = None
    max_match_score = 0.0
    
    for candidate_id in candidates:
        if candidate_id == new_commuter.userId:
            continue
            
        candidate = Firestore.get_document("cohort_queues", candidate_id)
        
        # 1. Match destination similarity using Haversine
        dest_dist = haversine(new_commuter.destination, candidate.destination)
        if dest_dist > 500: # Max destination offset threshold 500m
            continue
            
        # 2. Match departure timing
        time_delta = abs(new_commuter.departureTime - candidate.departureTime)
        if time_delta > 300: # Max 5-minute wait threshold
            continue
            
        # 3. Calculate pairing score
        match_score = (1.0 - (dest_dist / 500.0)) * 0.6 + (1.0 - (time_delta / 300.0)) * 0.4
        
        if match_score > max_match_score and match_score >= 0.75:
            max_match_score = match_score
            best_match = candidate
            
    if best_match:
        # Create Pair and notify both clients via WebSocket
        cohort_id = generate_id("cohort_")
        create_cohort_bubble(cohort_id, new_commuter.userId, best_match.userId)
        Redis.geodelete("cohort_queue_geo", new_commuter.userId)
        Redis.geodelete("cohort_queue_geo", best_match.userId)
        return {"status": "PAIRED", "cohortId": cohort_id, "partnerId": best_match.userId}
        
    # If no match found, append commuter to queue
    Redis.geoadd("cohort_queue_geo", new_commuter.origin.lng, new_commuter.origin.lat, new_commuter.userId)
    return {"status": "QUEUED"}
```

---

### 2. Guardian Trail (Expected stops & Anomaly Escalation)
Tracks active routes. If a commuter stops moving unexpectedly (speed drops to 0.0m/s for over 45 seconds) in a low UVI zone, it triggers verification.

```python
def process_guardian_trail_ping(trip, client_telemetry):
    current_time = timestamp()
    
    # Check if user has arrived at destination
    if haversine(client_telemetry.coords, trip.route.destination) < 20:
        trigger_safe_arrival_verification(trip)
        return
        
    # Check Route deviation
    deviation_dist = point_to_polyline_distance(client_telemetry.coords, trip.route.plannedPolyline)
    if deviation_dist > 15: # 15 meters deviation tolerance
        trip.deviationPercentage = (deviation_dist / trip.route.plannedDistance) * 100
        trip.riskLevel = "ORANGE"
        trigger_deviation_alert(trip)
        return
        
    # Check expected stop duration
    if client_telemetry.speed == 0.0:
        if not trip.stopTimerStartedAt:
            trip.stopTimerStartedAt = current_time
            Firestore.update_document("trips", trip.tripId, trip)
        else:
            idle_duration = current_time - trip.stopTimerStartedAt
            if idle_duration > 45: # 45 seconds threshold
                trip.riskLevel = "YELLOW"
                trigger_stop_verification_prompt(trip)
    else:
        # User is moving, reset stop timers
        if trip.stopTimerStartedAt:
            trip.stopTimerStartedAt = None
            trip.riskLevel = "GREEN"
            Firestore.update_document("trips", trip.tripId, trip)
```
