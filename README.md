# AuraPath: Preventative Urban Safety Operating System 🛡️
> Transitioning urban commuting from reactive incident alarms to predictive spatial safety and active community shielding.

AuraPath is an investor-grade repository blueprint and working prototype representing a preventative, decentralized Urban Safety Operating System.

---

## 🏛️ System Architecture

```
                       [ +-------------------------------------------+ ]
                       [ |          AuraPath Client App              | ]
                       [ |   (React Native + Leaflet + TFLite)       | ]
                       [ +-------------------------------------------+ ]
                                              |
                                              | HTTPS / WSS
                                              v
                                   [ +-------------------+ ]
                                   [ | Kong API Gateway  | ]
                                   [ | (JWT, Rate Limit) | ]
                                   [ +-------------------+ ]
                                              |
                       +----------------------+----------------------+
                       |                                             |
                       v WebSocket Sync                              v REST APIs
           [ +-------------------+ ]                     [ +-------------------+ ]
           [ | Node.js Cohort    | ]                     [ | FastAPI Backend   | ]
           [ | WebSocket Service | ]                     [ | (Python Service)  | ]
           [ +-------------------+ ]                     [ +-------------------+ ]
                       |                                             |
           +-----------+-----------+                      +----------+----------+
           |                       |                      |                     |
           v                       v                      v                     v
[ +-----------------+ ] [ +-----------------+ ] [ +---------------+ ] [ +---------------+ ]
[ |   Redis Cache   | ] [ | PostgreSQL/GIS  | ] [ | CommuteDNA AI | ] [ | AWS IoT Core  | ]
[ | (Cohort Pairing)| ] [ | (Spatial Maps)  | ] [ | (Spatial Model) | ] [ | (BLE MQTT Hub)| ]
[ +-----------------+ ] [ +-----------------+ ] [ +---------------+ ] [ +---------------+ ]
                                                                                ^
                                                                                | MQTT
                                                                      [ +---------------+ ]
                                                                      [ | BLE Sanctuary | ]
                                                                      [ | Beacons (IoT) | ]
                                                                      [ +---------------+ ]
```

---

## 🤖 Multi-Agent AI Spatial Pipeline

AuraPath is designed around a decentralized multi-agent system concept to verify physical infrastructure and security networks in a production environment:

1.  **Infrastructure OCR Agent**: Conceptually scans street cameras and streetlight pole serial tags to check active grid integrity, updating UVI lighting values dynamically.
2.  **Merchant Verification Agent**: Simulated to scan shop QR/barcodes via the companion client app to authenticate shop registration hashes (`sanc_qr_x`), updating route TrustScores.
3.  **CommuteDNA Anomaly Agent**: Designed to fuse multi-sensory telemetry (step gait signatures, smartwatch heart rates, and TFLite audio class decibels) to forecast danger thresholds.

---

## 📂 Repository File Structure

*   📁 **[user_interface/](./)**: Contains the source code of the working MVP simulator.
    *   📄 **[index.html](./index.html)**: Side-by-side viewports (Mobile App Priya Client & Safety Digital Twin Dashboard) and Stepper Story controls.
    *   📄 **[index.css](./index.css)**: Glassmorphic panel styling, gauge animations, and dark vector map settings.
    *   📄 **[app.js](./app.js)**: State machine driving the Leaflet.js simulation, biometrics, and AI chat assistant.
*   📁 **[specifications/](./specifications/)**: Contains detailed technical specifications.
    *   📄 **[architecture_specification.md](./specifications/architecture_specification.md)**: Database schemas (Firebase/Firestore collections) and REST/WebSocket API endpoints.
    *   📄 **[ai_specification.md](./specifications/ai_specification.md)**: Core mathematics (UVI, TrustScore, CommuteDNA) and Redis pairing pseudocode.
    *   📄 **[municipal_deployment_guide.md](./specifications/municipal_deployment_guide.md)**: Detailed specifications for municipal deployments, BLE hardware edge nodes, RTSP feeds, and streetlight tag scanning.
    *   📄 **[engineering_faq_manual.md](./specifications/engineering_faq_manual.md)**: Product reliability reference outlining network dropouts, GPS Kalman filtering, sensor polling limits, and QR handshakes.

---

## 💡 Core Mathematical Formulations

AuraPath replaces reactive incident alarms with active preventative spatial safety shields.

### 1. Urban Vitality Index (UVI)
Graph edges on the pathfinder are weighted dynamically using UVI:

$$\text{UVI}_e = 0.40 \cdot L_e + 0.25 \cdot C_e + 0.20 \cdot S_e + 0.10 \cdot T_e + 0.05 \cdot H_e$$

*   **Google Maps Route A (Speed Path)**: 18 minutes, routes through unlit shortcuts. **UVI = 62%**.
*   **AuraPath Route B (Safe Corridor)**: 22 minutes, routes along streetlights and active merchants. **UVI = 91%**.

### 2. TrustScore™ Formulation
Represents the safety profile of a transit route or driver-vehicle pair:

$$\text{TrustScore} = w_1 \cdot D_{\text{reliability}} + w_2 \cdot R_{\text{compliance}} + w_3 \cdot A_{\text{safety}} + w_4 \cdot T_{\text{day}} + w_5 \cdot C_{\text{feedback}}$$

### 3. CommuteDNA™ Detection Engine
Combines user gait dynamics, heart rate spikes, and local TensorFlow Lite microphone analysis into a unified threat model:
*   **Gait**: Compares real-time step frequencies with user's GMM template to detect pacing changes.
*   **Heart Rate**: Identifies sudden stress spikes (e.g. delta > 25 BPM in 10s).
*   **Audio AI**: Local TFLite models process microphone feeds locally to detect screaming/crying, preserving privacy.

---

## 🏃 Setup and Execution

1. Clone or download this repository.
2. Ensure you have an active internet connection to load Leaflet tiles and FontAwesome icons.
3. Open **`index.html`** in any modern web browser to run the prototype instantly.

---

## 🎮 Guided Walkthrough: Scenario Replay Engine

AuraPath features a built-in **Scenario Replay Engine (SRE)** that lets you step through two distinct commuter stories:

### Case 1: Standard Safe Commute (Corridor B)
1. **Event 1: Exit Metro (9:15 PM)**: Priya sets her destination. The interface compares Route A vs Route B. Ask the AI assistant: *"Why was this route selected?"* for local RAG reasoning.
2. **Event 2: Start Navigation**: Priya starts walking on Route B. The **Aura Guardian Network™** activates with a 96% Protection Score, showing active corridor shields.
3. **Event 3: Cohort Matching**: Priya matches with verified commuter **Sarah M.** Their safety bubbles merge, and protection levels stabilize.
4. **Event 4: Cohort Split**: Sarah departs. Priya enters a dim section. Sanctuary Mesh maps emergency routing to **Apollo Pharmacy**, drawing a blue guidance polyline on the map.
5. **Event 5: Arrive at Sanctuary**: Priya reaches the pharmacy. Click **"Scan Sanctuary QR"** on her phone simulator to trigger the viewfinder overlay and authenticate the shop.
6. **Event 6: Sanctuary Lock Secured**: Merchant verification agent marks the store APPROVED. Tapping **"Shelter Lock"** locks shelter status to "Active Defense", alerting the merchant and placing patrols on standby.
7. **Event 7: Safe Arrival**: Priya reaches home and confirms arrival, closing the trip logs.

### Case 2: Alley Deviation & SOS Dispatch (Route A)
1. **Event 1-2**: Priya exits the metro and starts navigation.
2. **Event 3: Route Deviation Anomaly**: Priya detours into a dark shortcut. CommuteDNA immediately flags the mismatch. Heart rate spikes to 132 BPM, gait changes to "Running", and a 10s countdown alert modal displays.
3. **Event 4: Check-in Timeout (SOS)**: Priya fails to respond. The system activates the panic loop, alerting the nearest sanctuary beacon.
4. **Event 5: Police Patrol Dispatch**: Municipal dispatch dispatched Police Patrol Unit 04 to Priya's real-time coordinates.
5. **Event 6: Patrol Intercept & Secured**: Patrol unit arrives, secures Priya, and resets all telemetry.
