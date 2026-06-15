# AuraPath: Municipal Integration & Deployment Guide

This guide outlines the specifications for integrating AuraPath with municipal infrastructure, including hardware placement, beacon setups, camera redirects, and street-level scanning.

---

## 1. Edge Hardware & BLE Beacons

The proposed AuraPath architecture specifies deploying IoT edge nodes at transit hubs and commercial storefronts.

### Proposed Hardware Specifications
*   **Microcontroller**: Nordic Semiconductor nRF52840 SoC (ARM Cortex-M4 @ 64 MHz).
*   **Wireless Protocols**: Bluetooth Low Energy (BLE 5.2), Thread, Zigbee.
*   **Tx Power**: Adjustable from -20 dBm to +8 dBm.
*   **Battery Life**: Up to 5 years using a CR2477 Li-MnO2 cell (1000 mAh).
*   **Enclosure**: IP67 weather-rated, UV-stabilized polycarbonate.

### Configuration Parameters
Beacons are calibrated to advertise at a frequency of 10 Hz (100 ms intervals) to ensure rapid connection handshake times as commuters enter transition zones.
*   **UUID**: `a470d001-5b92-411a-85d8-c8914b439c28`
*   **Major Value**: Represents the Municipal District ID.
*   **Minor Value**: Represents the specific Merchant / Sanctuary Node ID.
*   **Transmission Power**: Configured to -4 dBm to establish a localized 15-meter coverage radius, minimizing cross-talk in dense commercial corridors.

---

## 2. Real-Time RTSP Video Stream Redirects

The proposed system design allows municipalities to integrate camera feeds from participating merchant storefronts and public intersections to verify safety anomalies.

### Proposed Direct Streaming Architecture
When a safety anomaly triggers:
1.  **Event Webhook**: The AuraPath Event Broker is designed to publish a Redis Pub/Sub alert with the commuter's current GPS quadrant.
2.  **Stream Selection**: The system queries the database to find cameras within a 50-meter radius of the incident.
3.  **RTSP Session Negotiation**: The dashboard conceptually establishes an outbound RTSP stream connection over a secured VPN tunnel:
    ```
    rtsp://admin:auth_token@10.240.12.54:554/stream/channels/101
    ```
4.  **HLS Transcoding**: The municipal backend transcodes the raw H.264 stream into HTTP Live Streaming (HLS) segments for rendering on the central operator dashboard.

---

## 3. Streetlight Grid OCR Scanning

AuraPath is designed to integrate with municipal streetlight management systems (SLMS) to verify lighting levels.

### Proposed Pole Tag Identification
Municipal streetlights can be equipped with high-visibility, retroreflective serial tags. Mobile patrols and city service vehicles would run OCR models on dashcam feeds to verify tagging status.

### Proposed Software Integration
*   **Model**: Edge-optimized MobileNetV3-SSD designed to run inside the vehicle computer.
*   **Processing Pipeline**:
    1.  Detect retroreflective tag rectangle.
    2.  Perspective correction (homography matrix transformation).
    3.  OCR character extraction (characters e.g. `SL-9438-BLR`).
    4.  Transmit payload to municipal gateway over cellular networks.

---

## 4. Transit Hub Queue Setup

To facilitate cohort pairing at major transit hubs (metro stations, bus terminals), designated **Aura Co-Commute Zones** are demarcated physically and digitally.

### Physical Design
*   **Demarcation**: Green floor markings near exits indicating "Co-Commute Joining Zone".
*   **IoT Kiosk**: A central kiosk running a static BLE gateway that registers passengers queuing up for cohort matching.

### Matching Queue Mechanics
*   **Geofence Radius**: Passengers must be within 30 meters of the transit hub exit coordinates.
*   **Telemetry Sync**: Once a passenger enters the geofence, their device begins transmitting trajectory queries to the WebSocket pairing server, which runs the Redis geohash matching algorithm.
