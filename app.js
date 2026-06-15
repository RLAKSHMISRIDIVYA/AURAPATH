/* ==========================================================================
   AURAPATH CORE SIMULATION - SCENARIO REPLAY ENGINE & DOCS CONTROLLER
   ========================================================================== */

// --- Coordinate Configurations (Bengaluru Green Glen Layout area) ---
const CENTER_COORDS = [12.9242, 77.6780];
const METRO_EXIT = [12.9230, 77.6810];
const HOME_COORDS = [12.9225, 77.6750];

// Safe Route B Coordinates (UVI: 91%, well-lit service rd + sanctuaries)
const ROUTE_B_COORDS = [
    METRO_EXIT,
    [12.9235, 77.6806],
    [12.9241, 77.6800], // Near ORR Service Road
    [12.9242, 77.6795], // Near Ramesh Kirana Store
    [12.9243, 77.6785],
    [12.9244, 77.6775],
    [12.9243, 77.6766], // Crossing point
    [12.9235, 77.6765], // Apollo Pharmacy
    [12.9228, 77.6763],
    [12.9225, 77.6757],
    HOME_COORDS
];

// Speed Route A Coordinates (UVI: 62%, unlit alleys - Deviation path)
const ROUTE_A_COORDS = [
    METRO_EXIT,
    [12.9226, 77.6798], // Turn down unlit alley
    [12.9220, 77.6790], // Deep unlit alley
    [12.9218, 77.6780], 
    [12.9220, 77.6768], // Rejoining corner
    [12.9222, 77.6759],
    HOME_COORDS
];

// Sanctuary Beacons
const SANCTUARIES = [
    {
        id: 1,
        name: "Ramesh Kirana Store",
        coords: [12.9242, 77.6795],
        beaconId: "beacon_node_01",
        address: "Lane 4, ORR Junction",
        radius: 20
    },
    {
        id: 2,
        name: "Apollo Pharmacy",
        coords: [12.9235, 77.6765],
        beaconId: "beacon_node_02",
        address: "Main Layout Rd, Sector 5",
        radius: 25
    },
    {
        id: 3,
        name: "Family Mart",
        coords: [12.9260, 77.6770],
        beaconId: "beacon_node_03",
        address: "Outer Grid Road, Sector 4",
        radius: 30
    }
];

// Streetlights (for map layout)
const STREETLIGHTS = [
    [12.9230, 77.6810],
    [12.9238, 77.6803],
    [12.9242, 77.6795],
    [12.9244, 77.6780],
    [12.9243, 77.6766],
    [12.9235, 77.6765],
    [12.9228, 77.6763],
    [12.9225, 77.6750]
];

// Police starting coordinates
const POLICE_START = [12.9255, 77.6800];

// --- Map & App State Variables ---
let map = null;
let pathLineA = null;
let pathLineB = null;
let pathLineSanctuary = null; // Navigation line for sanctuary routing
let commuterMarker = null;
let cohortMarker = null;
let patrolMarker = null;
let sanctuaryMarkers = [];
let streetlightCircles = [];
let audioAnimInterval = null;

// --- Scenario Replay State ---
let currentCase = 1;
let currentEventIndex = 0;
let countdownInterval = null;
let countdownVal = 10;
let selectedRouteOption = 'B';

// ==========================================================================
// SCENARIO EVENT DEFINITIONS
// ==========================================================================

const CASE_1_EVENTS = [
    {
        title: "Exit Metro Station",
        time: "09:15 PM",
        phase: "PHASE 1: SAFE CORRIDOR ENGINE",
        desc: "Priya exits Metro Gate 4. Google Maps suggests Route A (18m, unlit alleys). AuraPath calculates Route B (22m, UVI 91%). Priya selects Route B to active safe corridor shielding.",
        stepNum: 1,
        agentReasoning: "OCR Agent: Active lighting verified at 95% on Route B. Storefront density: 8 nodes. Google maps Route A rejected due to low lighting (35%).",
        techActive: ["uvi", "ws", "postgis"],
        mobileScreen: "route-select",
        commuterCoords: METRO_EXIT,
        patrolCoords: POLICE_START,
        cohortActive: false,
        trustScore: 94,
        kpiUvi: "91%",
        kpiRouteDesc: "Safe Corridor Route B",
        networkProtection: "96%",
        networkStatus: "SECURE SHIELD",
        networkStatusClass: "green-tag",
        layers: { corridor: "active", cohort: "active", sanctuary: "active", patrol: "active" },
        cohortStatus: "SEARCHING",
        cohortStatusClass: "warning",
        cohortPaired: false,
        biometrics: { gait: "Normal", heart: "76 BPM", audio: "Quiet" },
        soundDb: 35,
        logMsg: "New routing query initialized: Metro Exit 4 -> Green Glen layout. Safe Corridor engine calculated Route B. UVI: 91%."
    },
    {
        title: "Start Navigation",
        time: "09:17 PM",
        phase: "PHASE 1: SAFE CORRIDOR ENGINE",
        desc: "Priya starts her walk. The Aura Guardian Network activates, securing her under a 96% Protection Score with active Corridor Routing, Cohort matching beacons, and Police alert loops.",
        stepNum: 2,
        agentReasoning: "CommuteDNA Agent: Gait calibration matches user walking profile. Orientation aligned. Heart rate 76 BPM compliant.",
        techActive: ["uvi", "ws", "dna", "postgis"],
        mobileScreen: "nav-active",
        commuterCoords: ROUTE_B_COORDS[2],
        patrolCoords: POLICE_START,
        cohortActive: false,
        trustScore: 94,
        kpiUvi: "91%",
        kpiRouteDesc: "Safe Corridor Route B",
        networkProtection: "96%",
        networkStatus: "SECURE SHIELD",
        networkStatusClass: "green-tag",
        layers: { corridor: "active", cohort: "active", sanctuary: "active", patrol: "active" },
        cohortStatus: "SEARCHING",
        cohortStatusClass: "warning",
        cohortPaired: false,
        biometrics: { gait: "Normal", heart: "76 BPM", audio: "Quiet" },
        soundDb: 35,
        progressWidth: "20%",
        eta: "20 min",
        logMsg: "Trip trip_b9843 started. Telemetry transmission running via WebSocket. [CommuteDNA] Gait template matches user walk profile."
    },
    {
        title: "Cohort Matching",
        time: "09:20 PM",
        phase: "PHASE 2: DYNAMIC SAFETY BUBBLE",
        desc: "Priya walks along Route B. The backend pairs her with Sarah, a verified female commuter walking in the same direction. They merge their safety bubbles. Protection score restores to 85%.",
        stepNum: 3,
        agentReasoning: "Anomaly Agent: Trajectory matching algorithm solved via Redis spatial queue. Pair verified: Sarah M. (ID: usr_92834).",
        techActive: ["ws", "dna", "postgis"],
        mobileScreen: "nav-active",
        commuterCoords: ROUTE_B_COORDS[4],
        patrolCoords: POLICE_START,
        cohortCoords: [ROUTE_B_COORDS[4][0] + 0.00008, ROUTE_B_COORDS[4][1] - 0.00008],
        cohortActive: true,
        trustScore: 94,
        kpiUvi: "91%",
        kpiRouteDesc: "Safe Corridor Route B",
        networkProtection: "85%",
        networkStatus: "COHORT MERGED",
        networkStatusClass: "green-tag",
        layers: { corridor: "active", cohort: "active", sanctuary: "active", patrol: "active" },
        cohortStatus: "PAIRED",
        cohortStatusClass: "online",
        cohortPaired: true,
        biometrics: { gait: "Normal", heart: "82 BPM", audio: "Quiet" },
        soundDb: 32,
        progressWidth: "45%",
        eta: "14 min",
        logMsg: "[WS Match] Cohort pairing authorized. matched Priya with verified commuter Sarah M. Combined safety bubbles."
    },
    {
        title: "Cohort Split",
        time: "09:26 PM",
        phase: "PHASE 3: SANCTUARY MESH",
        desc: "Sarah splits off to her street. Priya enters a dim layout stretch. UVI drops, and protection score drops to 60%. The Sanctuary Mesh immediately maps emergency routing to Apollo Pharmacy (120m away).",
        stepNum: 4,
        agentReasoning: "Anomaly Agent: Cohort bubble split detected (dist > 15m). Dynamic Bubble deactivated. Protected by Sanctuary Mesh tracking.",
        techActive: ["ws", "iot", "postgis"],
        mobileScreen: "nav-active",
        commuterCoords: ROUTE_B_COORDS[6],
        patrolCoords: POLICE_START,
        cohortActive: false,
        trustScore: 94,
        kpiUvi: "72%",
        kpiRouteDesc: "Approaching Sanctuary",
        networkProtection: "60%",
        networkStatus: "SHIELD REDUCED",
        networkStatusClass: "orange-tag",
        layers: { corridor: "warning", cohort: "danger", sanctuary: "active", patrol: "active" },
        cohortStatus: "FALLBACK",
        cohortStatusClass: "warning",
        cohortPaired: false,
        sanctuaryTarget: true,
        biometrics: { gait: "Pacing Fast", heart: "96 BPM", audio: "Alert" },
        soundDb: 52,
        progressWidth: "65%",
        eta: "8 min",
        logMsg: "[Cohort split] Commuter Sarah matches trajectory exit. Priya solo walk path active. [Sanctuary Mesh] Calculating safe haven paths."
    },
    {
        title: "Arrive at Sanctuary",
        time: "09:29 PM",
        phase: "PHASE 3: SANCTUARY MESH",
        desc: "Priya arrives at Apollo Pharmacy. BLE beacons auto-connect. Replay awaits QR scan to verify store registration details before unlocking shelter.",
        stepNum: 5,
        agentReasoning: "Merchant Agent: Handshake established. Awaiting merchant QR authentication hash from client camera scanner...",
        techActive: ["ws", "iot", "postgis"],
        mobileScreen: "nav-active",
        commuterCoords: SANCTUARIES[1].coords,
        patrolCoords: POLICE_START,
        cohortActive: false,
        trustScore: 94,
        kpiUvi: "95%",
        kpiRouteDesc: "Apollo Pharmacy Sanctuary",
        networkProtection: "75%",
        networkStatus: "BEACON CONNECT",
        networkStatusClass: "orange-tag",
        layers: { corridor: "active", cohort: "danger", sanctuary: "active", patrol: "active" },
        cohortStatus: "FALLBACK",
        cohortStatusClass: "warning",
        cohortPaired: false,
        sanctuaryState: "awaiting-scan",
        biometrics: { gait: "Normal", heart: "80 BPM", audio: "Quiet" },
        soundDb: 40,
        progressWidth: "85%",
        eta: "3 min",
        logMsg: "[BLE Beacon] Proximity handshake ok. Awaiting merchant QR authentication..."
    },
    {
        title: "Sanctuary Lock Secured",
        time: "09:30 PM",
        phase: "PHASE 3: SANCTUARY MESH",
        desc: "QR scan verified. Merchant Verification Agent marks store APPROVED. TrustScore boosts to 98/100. Priya locks shelter, activating local cameras and placing police on high standby.",
        stepNum: 6,
        agentReasoning: "Merchant Agent: QR hash sanc_qr_9482 matches registration database. Status: APPROVED. CCTV feed redirected.",
        techActive: ["ws", "iot", "tflite", "postgis"],
        mobileScreen: "nav-active",
        commuterCoords: SANCTUARIES[1].coords,
        patrolCoords: [12.9238, 77.6780],
        cohortActive: false,
        trustScore: 98,
        kpiUvi: "98%",
        kpiRouteDesc: "Shelter Active",
        networkProtection: "98%",
        networkStatus: "SHELTER LOCKED",
        networkStatusClass: "green-tag",
        layers: { corridor: "active", cohort: "active", sanctuary: "active", patrol: "active" },
        cohortStatus: "COMPLETED",
        cohortStatusClass: "online",
        cohortPaired: false,
        sanctuaryState: "verified",
        biometrics: { gait: "Normal", heart: "72 BPM", audio: "Quiet" },
        soundDb: 38,
        progressWidth: "85%",
        eta: "3 min",
        logMsg: "[Merchant Agent] Authenticated Apollo Pharmacy (sanc_qr_9482). Status: APPROVED. TrustScore boosted 94 -> 98. Shelter Locked."
    },
    {
        title: "Safe Arrival Geofence",
        time: "09:37 PM",
        phase: "PHASE 4: SAFE ARRIVAL VERIFICATION",
        desc: "Priya reaches her home. The app prompts a final 'Safe Arrival Verification' check. Priya confirms her safety, completing the commute. The digital twin logs a closed trip.",
        stepNum: 7,
        agentReasoning: "Anomaly Agent: Geofence coordinates match home location (delta < 5m). Safe arrival confirmed. Session closed.",
        techActive: ["ws", "postgis"],
        mobileScreen: "nav-active",
        commuterCoords: HOME_COORDS,
        patrolCoords: [12.9235, 77.6765],
        cohortActive: false,
        trustScore: 98,
        kpiUvi: "100%",
        kpiRouteDesc: "Arrived Home",
        networkProtection: "100%",
        networkStatus: "COMPLETED",
        networkStatusClass: "green-tag",
        layers: { corridor: "active", cohort: "active", sanctuary: "active", patrol: "active" },
        cohortStatus: "COMPLETED",
        cohortStatusClass: "online",
        cohortPaired: false,
        arrivalPrompt: true,
        biometrics: { gait: "Normal", heart: "70 BPM", audio: "Quiet" },
        soundDb: 30,
        progressWidth: "100%",
        eta: "0 min",
        logMsg: "Trip trip_b9843 completed successfully. Database status updated to closed. --- Commute Loop Secured ---"
    }
];

const CASE_2_EVENTS = [
    {
        title: "Exit Metro Station",
        time: "09:15 PM",
        phase: "PHASE 1: SAFE CORRIDOR ENGINE",
        desc: "Priya exits Metro Gate 4. Google Maps suggests Route A (18m, unlit alleys). AuraPath calculates Route B (22m, UVI 91%). Priya selects Route B.",
        stepNum: 1,
        agentReasoning: "OCR Agent: Active lighting verified at 95% on Route B. Storefront density: 8 nodes. Google maps Route A rejected due to low lighting (35%).",
        techActive: ["uvi", "ws", "postgis"],
        mobileScreen: "route-select",
        commuterCoords: METRO_EXIT,
        patrolCoords: POLICE_START,
        cohortActive: false,
        trustScore: 94,
        kpiUvi: "91%",
        kpiRouteDesc: "Safe Corridor Route B",
        networkProtection: "96%",
        networkStatus: "SECURE SHIELD",
        networkStatusClass: "green-tag",
        layers: { corridor: "active", cohort: "active", sanctuary: "active", patrol: "active" },
        cohortStatus: "SEARCHING",
        cohortStatusClass: "warning",
        cohortPaired: false,
        biometrics: { gait: "Normal", heart: "76 BPM", audio: "Quiet" },
        soundDb: 35,
        logMsg: "New routing query initialized: Metro Exit 4 -> Green Glen layout. Safe Corridor engine calculated Route B. UVI: 91%."
    },
    {
        title: "Start Navigation",
        time: "09:17 PM",
        phase: "PHASE 1: SAFE CORRIDOR ENGINE",
        desc: "Priya starts her walk. The Aura Guardian Network activates, securing her under a 96% Protection Score with active Corridor Routing and Police loops.",
        stepNum: 2,
        agentReasoning: "CommuteDNA Agent: Gait calibration matches user walking profile. Orientation aligned. Heart rate 76 BPM compliant.",
        techActive: ["uvi", "ws", "dna", "postgis"],
        mobileScreen: "nav-active",
        commuterCoords: ROUTE_B_COORDS[2],
        patrolCoords: POLICE_START,
        cohortActive: false,
        trustScore: 94,
        kpiUvi: "91%",
        kpiRouteDesc: "Safe Corridor Route B",
        networkProtection: "96%",
        networkStatus: "SECURE SHIELD",
        networkStatusClass: "green-tag",
        layers: { corridor: "active", cohort: "active", sanctuary: "active", patrol: "active" },
        cohortStatus: "SEARCHING",
        cohortStatusClass: "warning",
        cohortPaired: false,
        biometrics: { gait: "Normal", heart: "76 BPM", audio: "Quiet" },
        soundDb: 35,
        progressWidth: "20%",
        eta: "20 min",
        logMsg: "Trip trip_b9843 started. Telemetry transmission running via WebSocket. [CommuteDNA] Gait template matches user walk profile."
    },
    {
        title: "Route Deviation Anomaly",
        time: "09:19 PM",
        phase: "PHASE 3: PATH ANOMALY RESPONSE",
        desc: "Priya detours into a dark layout alley shortcut (Route A). CommuteDNA immediately flags the trajectory mismatch. Gait speed accelerates, and heart rate spikes to 132 BPM. A 10s countdown is triggered.",
        stepNum: 3,
        agentReasoning: "DNA Agent: Trajectory mismatch (Fréchet distance > 15m). Speed: Running; HR: 132 BPM. Noise spike 78dB. Status: CRITICAL ANOMALY.",
        techActive: ["ws", "dna", "tflite", "postgis"],
        mobileScreen: "nav-active",
        commuterCoords: ROUTE_A_COORDS[2],
        patrolCoords: POLICE_START,
        cohortActive: false,
        trustScore: 60,
        kpiUvi: "35%",
        kpiRouteDesc: "Dangerous Unlit Alley",
        networkProtection: "40%",
        networkStatus: "SHIELD BROKEN",
        networkStatusClass: "red-tag",
        layers: { corridor: "danger", cohort: "danger", sanctuary: "warning", patrol: "active" },
        cohortStatus: "FALLBACK",
        cohortStatusClass: "warning",
        cohortPaired: false,
        deviationPrompt: true,
        biometrics: { gait: "Running", heart: "132 BPM", audio: "Noise Spike" },
        soundDb: 78,
        progressWidth: "40%",
        eta: "16 min",
        logMsg: "[CRITICAL] Route deviation anomaly detected! Distance offset: 18 meters. Physiological footprint mismatch. Gait speed spike. HR: 132 BPM."
    },
    {
        title: "Check-in Timeout (SOS)",
        time: "09:20 PM",
        phase: "PHASE 3: PATH ANOMALY RESPONSE",
        desc: "Priya fails to respond to the confirmation prompt within 10 seconds. The emergency escalation loop deploys automatically: MQTT alerts send to nearest sanctuary beacon and Municipal Command Center.",
        stepNum: 4,
        agentReasoning: "Anomaly Agent: Commuter feedback timeout. Confirming SOS dispatch event. Activating nearest sanctuary beacon node_01.",
        techActive: ["ws", "iot", "dna", "postgis"],
        mobileScreen: "nav-active",
        commuterCoords: ROUTE_A_COORDS[2],
        patrolCoords: POLICE_START,
        cohortActive: false,
        trustScore: 40,
        kpiUvi: "35%",
        kpiRouteDesc: "Emergency Alerting",
        networkProtection: "20%",
        networkStatus: "SOS ACTIVE",
        networkStatusClass: "red-tag",
        layers: { corridor: "danger", cohort: "danger", sanctuary: "danger", patrol: "danger" },
        cohortStatus: "FALLBACK",
        cohortStatusClass: "warning",
        cohortPaired: false,
        sosActive: true,
        biometrics: { gait: "Running", heart: "132 BPM", audio: "Noise Spike" },
        soundDb: 80,
        progressWidth: "40%",
        eta: "16 min",
        logMsg: "[ALERT] Commuter feedback timeout. Emergency dispatch loop active. Sanctuary Ramesh Kirana beacon signaled for emergency response."
    },
    {
        title: "Police Patrol Dispatch",
        time: "09:21 PM",
        phase: "PHASE 4: MUNICIPAL INTERCEPT",
        desc: "Police Patrol Unit 04 receives WSS emergency dispatch coordinates. The patrol car begins emergency driving from its starting location toward Priya's deviation coordinates.",
        stepNum: 5,
        agentReasoning: "Anomaly Agent: GPS trace intersection triggered on database. Dispatched Patrol Unit 04. ETA: 2 minutes.",
        techActive: ["ws", "iot", "postgis"],
        mobileScreen: "nav-active",
        commuterCoords: ROUTE_A_COORDS[2],
        patrolCoords: [12.9235, 77.6793],
        cohortActive: false,
        trustScore: 40,
        kpiUvi: "35%",
        kpiRouteDesc: "Patrol Dispatched",
        networkProtection: "30%",
        networkStatus: "PATROL TRANSIT",
        networkStatusClass: "red-tag",
        layers: { corridor: "danger", cohort: "danger", sanctuary: "danger", patrol: "danger" },
        cohortStatus: "FALLBACK",
        cohortStatusClass: "warning",
        cohortPaired: false,
        sosActive: true,
        biometrics: { gait: "Running", heart: "125 BPM", audio: "Noise Spike" },
        soundDb: 75,
        progressWidth: "40%",
        eta: "16 min",
        logMsg: "[Municipal dispatch] Sending Police Patrol Unit 04 to intercept coordinates. Patrol unit in transit."
    },
    {
        title: "Patrol Intercept & Secured",
        time: "09:24 PM",
        phase: "PHASE 4: MUNICIPAL INTERCEPT",
        desc: "Police Patrol Unit 04 arrives at Priya's location. Priya is secured and escorted safely. Telemetry and alarms are reset. The emergency event logs complete.",
        stepNum: 6,
        agentReasoning: "OCR Agent: Patrol unit visual contact established. Commuter safety verified. Terminating tracking loop.",
        techActive: ["ws", "postgis"],
        mobileScreen: "nav-active",
        commuterCoords: ROUTE_A_COORDS[2],
        patrolCoords: ROUTE_A_COORDS[2],
        cohortActive: false,
        trustScore: 98,
        kpiUvi: "100%",
        kpiRouteDesc: "Secured & Safe",
        networkProtection: "100%",
        networkStatus: "SECURED",
        networkStatusClass: "green-tag",
        layers: { corridor: "active", cohort: "active", sanctuary: "active", patrol: "active" },
        cohortStatus: "COMPLETED",
        cohortStatusClass: "online",
        cohortPaired: false,
        sosActive: false,
        securedPrompt: true,
        biometrics: { gait: "Normal", heart: "74 BPM", audio: "Quiet" },
        soundDb: 34,
        progressWidth: "100%",
        eta: "0 min",
        logMsg: "[ALERT RESOLVED] Patrol unit arrived at commuter coordinates. Priya secured. Risk level reset to Green."
    }
];

// ==========================================================================
// TECHNICAL SPECIFICATIONS DATA
// ==========================================================================

const SPEC_DOCS = {
    architecture: `
        <div class="spec-doc animate-fade-in">
            <h1>System Architecture & Database Specifications</h1>
            <div class="spec-alert warning">
                <strong>Proposed Architecture:</strong> The following database collections and API endpoints represent the design specifications. Dynamic assets are simulated in this console.
            </div>
            <p>This document specifies the database schemas and communications layer designed for high-concurrency, preventative safety operations.</p>
            
            <h2>Firestore NoSQL Database Schemas</h2>
            
            <h3>1. Users Document (Path: <code>/users/{userId}</code>)</h3>
            <p>Stores user demographics, authentication flags, and CommuteDNA physiological blueprints.</p>
            <pre><code>{
  "userId": "usr_94382",
  "name": "Priya Sharma",
  "phone": "+919876543210",
  "kycStatus": "VERIFIED",
  "gaitDNAProfile": {
    "averageStepLength": 0.68, // in meters
    "averageFrequency": 1.9,    // steps per second
    "baseDriftRate": 0.05
  },
  "createdAt": "2026-05-01T08:00:00Z"
}</code></pre>

            <h3>2. Trips Document (Path: <code>/trips/{tripId}</code>)</h3>
            <p>Updates dynamically via WebSockets, tracking route trails and layers.</p>
            <pre><code>{
  "tripId": "trip_b9843",
  "commuterId": "usr_94382",
  "status": "ACTIVE", // [INITIATED, ACTIVE, DEVATION_WARNING, SOS_ACTIVE, COMPLETED]
  "route": {
    "origin": { "lat": 12.9230, "lng": 77.6810 },
    "destination": { "lat": 12.9225, "lng": 77.6750 },
    "uviScore": 0.91,
    "plannedETA": 22
  },
  "cohortId": "cohort_c7382",
  "guardianNetwork": {
    "protectionScore": 0.85,
    "layersActive": ["CORRIDOR", "COHORTS", "SANCTUARIES", "POLICE"]
  },
  "biometrics": {
    "heartRateBpm": 82,
    "gaitSpeed": "NORMAL",
    "audioDb": 32
  }
}</code></pre>

            <h3>3. Sanctuaries Document (Path: <code>/sanctuaries/{sanctuaryId}</code>)</h3>
            <p>Maps verified safe havens with active BLE beacon nodes.</p>
            <pre><code>{
  "sanctuaryId": "sanc_02",
  "name": "Apollo Pharmacy",
  "type": "PHARMACY",
  "beaconNodeId": "beacon_node_02",
  "coordinates": { "lat": 12.9235, "lng": 77.6765 },
  "status": "ONLINE", // [ONLINE, ACTIVE_DEFENSE, OFFLINE]
  "trustRating": 4.9
}</code></pre>

            <h2>REST and Real-Time WebSocket APIs</h2>
            <div class="spec-alert info">
                <strong>POST /api/v1/routes/plan</strong><br>
                Validates origin/destination and calculates safe corridors via A* weighted graphs.
            </div>
            
            <div class="spec-alert info">
                <strong>POST /api/v1/sanctuary/checkin</strong><br>
                Processes BLE handshake verification and unlocks digital/hardware shelter locks.
            </div>

            <div class="spec-alert info">
                <strong>WSS URL: wss://api.aurapath.org/v1/trips/sync</strong><br>
                Accepts user JWT, opens socket stream, and accepts telemetry packets every 0.5s during anomalies.
            </div>
        </div>
    `,
    math: `
        <div class="spec-doc animate-fade-in">
            <h1>AI Algorithms & Mathematical Formulations</h1>
            <div class="spec-alert warning">
                <strong>Algorithmic Status:</strong> The mathematical models and GMM training parameters represent the proposed system design. Telemetries are simulated in real-time.
            </div>
            <p>The mathematical models enabling proactive prediction rather than post-incident reactions.</p>
            
            <h2>1. Urban Vitality Index (UVI) Edge Weighting</h2>
            <p>Calculates safety coefficient of any street edge segment based on multisource sensor fusion:</p>
            <div class="spec-math-block">
                UVI_e = 0.40 &middot; L_e + 0.25 &middot; C_e + 0.20 &middot; S_e + 0.10 &middot; T_e + 0.05 &middot; H_e
            </div>
            <p>Where:</p>
            <ul>
                <li><strong>L_e</strong>: Lighting index (streetlights density, lumen outputs).</li>
                <li><strong>C_e</strong>: Crowd vitality (real-time mobile device counts, transit throughput).</li>
                <li><strong>S_e</strong>: Storefront activity (active retail commercial store hours).</li>
                <li><strong>T_e</strong>: Transit presence (police beats frequency, transit stops).</li>
                <li><strong>H_e</strong>: Historical crime compliance rate (1.0 - normalized incidents).</li>
            </ul>

            <h3>Pathfinder Edge Optimization:</h3>
            <div class="spec-math-block">
                \\text{Cost}_e = \\text{Length}_e &middot; (1.5 - UVI_e)
            </div>
            <p>A higher UVI lowers the cost factor, guiding the pathfinder routing engine to secure streets.</p>

            <h2>2. TrustScore™ Formulation</h2>
            <p>Measures dynamic security profiles during ongoing active commutes:</p>
            <div class="spec-math-block">
                TrustScore = 0.25 &middot; D_{\\text{reliability}} + 0.30 &middot; R_{\\text{compliance}} + 0.20 &middot; A_{\\text{safety}} + 0.15 &middot; T_{\\text{day}} + 0.10 &middot; C_{\\text{feedback}}
            </div>
            <p>Where compliance <strong>R_compliance</strong> is evaluated using the Fréchet distance (threshold &gt; 15m sets compliance to 0.0).</p>

            <h2>3. Redis Cohort Matching Queue Pseudocode</h2>
            <pre><code>def find_cohort_match(new_commuter):
    # Retrieve candidates within 50m of origin
    candidates = Redis.georadius("cohort_queue_geo", new_commuter.lng, new_commuter.lat, 50, "m")
    
    for candidate_id in candidates:
        candidate = Firestore.get("cohort_queues", candidate_id)
        
        # Check destination proximity
        dest_dist = haversine(new_commuter.destination, candidate.destination)
        if dest_dist > 500: continue
        
        # Check departure time proximity
        time_delta = abs(new_commuter.time - candidate.time)
        if time_delta > 300: continue
        
        # Generate match bubble and pair
        cohort_id = generate_id("cohort_")
        create_cohort_bubble(cohort_id, new_commuter.userId, candidate.userId)
        return {"status": "PAIRED", "cohortId": cohort_id}
        
    Redis.geoadd("cohort_queue_geo", new_commuter.lng, new_commuter.lat, new_commuter.userId)
    return {"status": "QUEUED"}</code></pre>
        </div>
    `,
    deployment: `
        <div class="spec-doc animate-fade-in">
            <h1>Municipal Integration & Deployment Guide</h1>
            <div class="spec-alert warning">
                <strong>Deployment Status:</strong> The edge beacons, camera HLS streams, and streetlight OCR tags are proposed physical integrations. Beacons and feeds are simulated in this console.
            </div>
            <p>This specification details the dynamic hardware placement, physical sensor networks, and camera routing interfaces deployed across municipal jurisdictions.</p>
            
            <h2>1. Edge Infrastructure: BLE Beacons</h2>
            <p>Sanctuaries are equipped with dynamic edge controllers running on Nordic nRF52840 hardware platforms, broadcasting localized geofence indicators.</p>
            <table>
                <thead>
                    <tr>
                        <th>Parameter</th>
                        <th>Deployment Setting</th>
                        <th>Operational Impact</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td><strong>TX Power</strong></td>
                        <td>-4 dBm</td>
                        <td>Constrains coverage to a 15m radius to prevent overlap in dense layouts.</td>
                    </tr>
                    <tr>
                        <td><strong>Broadcast Interval</strong></td>
                        <td>100ms (10 Hz)</td>
                        <td>Ensures sub-second client handshake speeds when entering zones.</td>
                    </tr>
                    <tr>
                        <td><strong>Frequency Band</strong></td>
                        <td>2.4 GHz (BLE 5.2)</td>
                        <td>Optimizes signal penetration while limiting energy consumption.</td>
                    </tr>
                </tbody>
            </table>

            <h2>2. Direct RTSP Camera Stream Routing</h2>
            <p>To audit alert anomalies, the city control room secures real-time video validation tunnels using RTSP/VPN protocols.</p>
            <div class="spec-alert info">
                <strong>Camera Stream Endpoint Syntax:</strong><br>
                <code>rtsp://gateway.district.municipal.gov:554/live/feeds/camera_sec_948</code>
            </div>
            <p>The system transcodes the raw H.264 stream into secured, 0.5s-latency HLS segments directly onto the safety dashboard during escalations.</p>

            <h2>3. Streetlight Tagging & OCR Verification</h2>
            <p>To verify physical lighting infrastructure, city utility vehicles scan retroreflective tag plates placed on light poles using edge OCR engines:</p>
            <pre><code>[OCR Detection Pipeline]
Input: 1080p Mobile Patrol Feed
  └── Step 1: Detect reflective rectangle (MobileNetV3-SSD)
  └── Step 2: Perspective homography alignment
  └── Step 3: Character extraction (Tesseract/PaddleOCR)
  └── Output: Validated Serial Tag (e.g. SL-9438-BLR) -> Sync UVI</code></pre>
        </div>
    `,
    engineering: `
        <div class="spec-doc animate-fade-in">
            <h1>Engineering FAQ & Reliability Manual</h1>
            <div class="spec-alert warning">
                <strong>Reliability Status:</strong> The fail-safe protocols, Kalman filter parameters, and dynamic QR systems represent the engineering design specifications.
            </div>
            <p>Technical reference documenting fail-safes, signal correction filters, battery conservation, and cryptographic verification.</p>
            
            <h3>Q1: How does the platform maintain safety checks during cellular network dropouts?</h3>
            <p><strong>Answer:</strong> The client app shifts to Offline Guardian Mode. Telemetry anomaly parsing runs locally. If a threat is triggered, it broadcasts a localized ad-hoc SOS payload via BLE/Wi-Fi Direct. Concurrently, the backend initiates a 60-second connection dropout alert loop if the websocket drops unexpectedly.</p>
            
            <h3>Q2: How does the Kalman filter correct location drift in urban canyons?</h3>
            <p><strong>Answer:</strong> AuraPath passes raw coordinates through a linear Kalman filter. By model state calculations combining position and velocity vectors:
            <br><code>x_k = A * x_{k-1} + w_k</code>
            <br>The measurement noise covariance is adjusted dynamically according to GPS Horizontal Dilution of Precision (HDOP). This prevents noise spikes from triggering false route deviation events.</p>

            <h3>Q3: What are the battery-saving parameters for high-frequency tracking?</h3>
            <p><strong>Answer:</strong> The system applies dynamic polling intervals based on safety state:
            <ul>
                <li><strong>Safe Corridor:</strong> 15s GPS polling, sensor parsing off (battery consumption: ~2%/hr).</li>
                <li><strong>Dim Zone Entry:</strong> 5s GPS polling, 5 Hz accelerometer sensor monitoring (~6%/hr).</li>
                <li><strong>Route Deviation:</strong> 0.5s GPS polling, 20 Hz accelerometer and microphone audio analysis (~18%/hr).</li>
            </ul></p>

            <h3>Q4: How does the client verify merchant sanctuary registrations securely?</h3>
            <p><strong>Answer:</strong> Upon arrival, the commuter scans a time-based dynamic QR code generated on the merchant's screen. The QR contains a dynamic TOTP hash: <code>HMAC-SHA256(SecretKey, Timestamp)</code>. The client app verifies this hash against the database backend, ensuring that only physical, approved merchants can unlock sanctuary check-in events.</p>
        </div>
    `
};

// ==========================================================================
// SCREEN SWITCHING & VIEWS CONTROLLER
// ==========================================================================

function showScreen(screenId) {
    // Hide all screens
    document.querySelectorAll(".screen-view").forEach(s => {
        s.classList.remove("active");
    });
    
    // Show selected screen
    const target = document.getElementById(`${screenId}-screen`);
    if (target) {
        target.classList.add("active");
    }
    
    // Leaflet specific fix: Invalidate size when map goes visible
    if (screenId === 'simulator') {
        setTimeout(() => {
            if (map) {
                map.invalidateSize();
            }
        }, 100);

        // Show onboarding tour automatically on first visit
        if (!window.welcomeTourShown) {
            setTimeout(() => {
                const overlay = document.getElementById("welcome-tour-overlay");
                if (overlay) {
                    overlay.classList.remove("hidden");
                }
            }, 300); // Smooth transition delay
            window.welcomeTourShown = true;
        }
    }
    
    // Spec specific default tab
    if (screenId === 'specs') {
        switchSpecTab('architecture');
    }
}

function toggleWelcomeTour() {
    const overlay = document.getElementById("welcome-tour-overlay");
    if (overlay) {
        overlay.classList.toggle("hidden");
    }
}

function switchSpecTab(tabId) {
    // Update active tab button style
    document.querySelectorAll(".specs-tab-btn").forEach(btn => {
        btn.classList.remove("active");
    });
    
    // Find matching button and add active class
    const buttons = document.querySelectorAll(".specs-tab-btn");
    buttons.forEach(btn => {
        if (btn.getAttribute("onclick").includes(tabId)) {
            btn.classList.add("active");
        }
    });
    
    // Inject tab content
    const contentArea = document.getElementById("specs-content-area");
    if (contentArea) {
        contentArea.innerHTML = SPEC_DOCS[tabId] || `<p>Document not found.</p>`;
    }
}

// ==========================================================================
// MAP INITIALIZATION
// ==========================================================================

function initMap() {
    map = L.map('twin-map', {
        zoomControl: true,
        attributionControl: false
    }).setView(CENTER_COORDS, 16);

    // Dark tile layer inversion
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19
    }).addTo(map);

    // Place streetlights
    STREETLIGHTS.forEach(coords => {
        let light = L.circle(coords, {
            radius: 18,
            color: '#f59e0b',
            fillColor: '#fef08a',
            fillOpacity: 0.15,
            weight: 1.2
        }).addTo(map);
        streetlightCircles.push(light);
    });

    // Place sanctuaries
    SANCTUARIES.forEach(store => {
        const iconHtml = `<div class="pulse-marker-beacon" id="map-beacon-${store.id}" style="width: 14px; height: 14px;"></div>`;
        const customIcon = L.divIcon({
            html: iconHtml,
            className: 'custom-div-icon',
            iconSize: [14, 14],
            iconAnchor: [7, 7]
        });

        let marker = L.marker(store.coords, { icon: customIcon }).addTo(map);
        marker.bindPopup(`<b>${store.name}</b><br>BLE Beacon ID: ${store.beaconId}`);
        sanctuaryMarkers.push({ id: store.id, marker: marker });
        
        // Add ranges
        L.circle(store.coords, {
            radius: store.radius,
            color: '#06b6d4',
            fillColor: '#06b6d4',
            fillOpacity: 0.05,
            weight: 1,
            dashArray: '4,4'
        }).addTo(map);
    });

    // Setup Moving Markers
    const commuterIcon = L.divIcon({
        className: 'custom-div-icon',
        html: `<div class="pulse-marker-commuter" id="commuter-pulse-glow" style="width: 18px; height: 18px;"></div>`,
        iconSize: [18, 18],
        iconAnchor: [9, 9]
    });
    commuterMarker = L.marker(METRO_EXIT, { icon: commuterIcon }).addTo(map);

    const cohortIcon = L.divIcon({
        className: 'custom-div-icon',
        html: `<div class="pulse-marker-cohort" style="width: 18px; height: 18px;"></div>`,
        iconSize: [18, 18],
        iconAnchor: [9, 9]
    });
    cohortMarker = L.marker(METRO_EXIT, { icon: cohortIcon });

    const policeIcon = L.divIcon({
        className: 'custom-div-icon',
        html: `<div class="pulse-marker-police" style="width: 18px; height: 18px;"></div>`,
        iconSize: [18, 18],
        iconAnchor: [9, 9]
    });
    patrolMarker = L.marker(POLICE_START, { icon: policeIcon }).addTo(map);
}

// ==========================================================================
// SCENARIO REPLAY CONTROLLER LOGIC
// ==========================================================================

function selectCase(caseNum) {
    currentCase = caseNum;
    currentEventIndex = 0;
    
    // Toggle active tab button
    document.querySelectorAll(".case-tab").forEach(tab => {
        tab.classList.remove("active");
    });
    document.getElementById(`case-tab-${caseNum}`).classList.add("active");
    
    // Log event change
    logEvent(`Loaded CASE ${caseNum}: ${caseNum === 1 ? 'Standard Safe Commute' : 'Alley Deviation & SOS Intercept'}`, "purple");
    
    // Render first event of chosen case
    renderEvent(currentCase, currentEventIndex);
}

function nextEvent() {
    const events = currentCase === 1 ? CASE_1_EVENTS : CASE_2_EVENTS;
    
    // If QR code is awaiting scan, warn user to scan it or let them click next to auto-complete
    const currentEvent = events[currentEventIndex];
    if (currentCase === 1 && currentEventIndex === 4 && currentEvent.sanctuaryState === 'awaiting-scan') {
        // Run automated QR Scan and advance
        openQrScanner();
        return;
    }
    
    if (currentEventIndex < events.length - 1) {
        currentEventIndex++;
        renderEvent(currentCase, currentEventIndex);
    } else {
        logEvent("Scenario completed. Click Restart to run again.", "green");
    }
}

function resetReplay() {
    currentEventIndex = 0;
    
    // Clear modals
    document.getElementById("deviation-alert-modal").classList.add("hidden");
    document.getElementById("arrival-verification-modal").classList.add("hidden");
    document.getElementById("police-secured-modal").classList.add("hidden");
    document.getElementById("qr-scanner-modal").classList.add("hidden");
    document.getElementById("sanctuary-success-overlay").classList.add("hidden");
    
    // Clear countdown
    if (countdownInterval) clearInterval(countdownInterval);
    
    // Clear map overlay polylines
    if (pathLineSanctuary) map.removeLayer(pathLineSanctuary);
    if (map.hasLayer(cohortMarker)) map.removeLayer(cohortMarker);
    
    renderEvent(currentCase, currentEventIndex);
    logEvent("Scenario player restarted.", "purple");
}

function renderEvent(caseNum, eventIndex) {
    const events = caseNum === 1 ? CASE_1_EVENTS : CASE_2_EVENTS;
    const ev = events[eventIndex];
    
    // 1. Update Storyteller Narration details
    document.getElementById("replay-phase").innerText = ev.phase;
    document.getElementById("replay-time").innerText = ev.time;
    document.getElementById("replay-title").innerText = ev.title;
    document.getElementById("replay-desc").innerText = ev.desc;
    document.getElementById("replay-reasoning-box").innerText = ev.agentReasoning;
    
    // Update active platform tech badges
    document.querySelectorAll(".tech-badge-item").forEach(badge => {
        badge.classList.remove("active");
    });
    ev.techActive.forEach(tech => {
        const badgeElement = document.getElementById(`tech-badge-${tech}`);
        if (badgeElement) {
            badgeElement.classList.add("active");
        }
    });

    // Disable next button if at end
    const nextBtn = document.getElementById("btn-next-event");
    if (eventIndex === events.length - 1) {
        nextBtn.innerHTML = `COMPLETE <i class="fa-solid fa-circle-check"></i>`;
        nextBtn.disabled = true;
    } else {
        nextBtn.innerHTML = `ACKNOWLEDGE & CONTINUE <i class="fa-solid fa-chevron-right"></i>`;
        nextBtn.removeAttribute("disabled");
    }

    // 2. Clear old map polylines & redraw
    if (pathLineA) map.removeLayer(pathLineA);
    if (pathLineB) map.removeLayer(pathLineB);
    if (pathLineSanctuary) map.removeLayer(pathLineSanctuary);

    if (caseNum === 1) {
        // Redraw recommended Safe Route B in glowing green
        pathLineB = L.polyline(ROUTE_B_COORDS, {
            color: '#10b981',
            weight: 6,
            opacity: 0.8
        }).addTo(map);
    } else {
        // Case 2: shows standard path, then the deviation path in red
        pathLineB = L.polyline(ROUTE_B_COORDS, {
            color: '#10b981',
            weight: 5,
            opacity: eventIndex >= 2 ? 0.3 : 0.8
        }).addTo(map);

        if (eventIndex >= 2) {
            pathLineA = L.polyline(ROUTE_A_COORDS, {
                color: '#ef4444',
                weight: 6,
                opacity: 0.85,
                dashArray: '6,6'
            }).addTo(map);
        }
    }

    // Update marker positions
    commuterMarker.setLatLng(ev.commuterCoords);
    patrolMarker.setLatLng(ev.patrolCoords);
    
    if (ev.cohortActive) {
        cohortMarker.setLatLng(ev.cohortCoords).addTo(map);
    } else {
        if (map.hasLayer(cohortMarker)) map.removeLayer(cohortMarker);
    }

    // Draw sanctuary emergency polyline if target is active
    if (ev.sanctuaryTarget) {
        pathLineSanctuary = L.polyline([ev.commuterCoords, SANCTUARIES[1].coords], {
            color: '#06b6d4',
            weight: 5,
            opacity: 0.95,
            dashArray: '5,5'
        }).addTo(map);
    }

    // Commuter pulse indicator glow
    const glowDiv = document.getElementById("commuter-pulse-glow");
    if (glowDiv) {
        if (ev.biometrics.gait === 'Running' || ev.sosActive) {
            glowDiv.className = 'pulse-marker-danger';
        } else {
            glowDiv.className = 'pulse-marker-commuter';
        }
    }

    // Update Sanctuary markers on map
    resetMapBeacons();
    if (ev.sosActive) {
        const beaconDiv = document.getElementById("map-beacon-1");
        if (beaconDiv) {
            beaconDiv.className = 'pulse-marker-danger';
        }
    }
    if (ev.sanctuaryState === 'verified') {
        const beaconDiv = document.getElementById("map-beacon-2");
        if (beaconDiv) {
            beaconDiv.className = 'pulse-marker-beacon active';
            beaconDiv.style.backgroundColor = 'var(--color-green)';
        }
    }

    // 3. Update Mobile Phone companion simulator
    if (ev.mobileScreen === 'route-select') {
        document.getElementById("routing-selection-screen").classList.add("active");
        document.getElementById("navigation-screen").classList.remove("active");
    } else {
        document.getElementById("routing-selection-screen").classList.remove("active");
        document.getElementById("navigation-screen").classList.add("active");
    }

    // Progress details
    document.getElementById("mobile-eta").innerText = ev.eta || "22 min";
    document.getElementById("mobile-progress-bar").style.width = ev.progressWidth || "0%";
    document.getElementById("mobile-progress-marker").style.left = ev.progressWidth || "0%";

    // Phone Clock
    document.getElementById("phone-clock").innerText = ev.time;

    // Protection Score Gauge
    document.getElementById("network-protection-num").innerText = ev.networkProtection;
    const cleanPercent = parseInt(ev.networkProtection);
    document.getElementById("network-protection-circle").setAttribute("stroke-dasharray", `${cleanPercent}, 100`);
    document.getElementById("network-protection-status").innerText = ev.networkStatus;
    document.getElementById("network-protection-status").className = `widget-tag ${ev.networkStatusClass}`;

    // Layers
    setLayerStatus("layer-corridor", ev.layers.corridor);
    setLayerStatus("layer-cohort", ev.layers.cohort);
    setLayerStatus("layer-sanctuary", ev.layers.sanctuary);
    setLayerStatus("layer-patrol", ev.layers.patrol);

    // Cohort Paired Widget
    document.getElementById("mobile-cohort-status").innerText = ev.cohortStatus;
    document.getElementById("mobile-cohort-status").className = `status-indicator ${ev.cohortStatusClass}`;
    
    if (ev.cohortPaired) {
        document.getElementById("cohort-info-paired").classList.remove("hidden");
        document.getElementById("cohort-info-fallback").classList.add("hidden");
    } else {
        document.getElementById("cohort-info-paired").classList.add("hidden");
        document.getElementById("cohort-info-fallback").classList.remove("hidden");
    }

    // Biometrics
    document.getElementById("sensor-gait").innerText = ev.biometrics.gait;
    document.getElementById("sensor-gait").className = `sensor-status ${ev.biometrics.gait === 'Normal' ? 'text-green' : (ev.biometrics.gait === 'Running' ? 'text-red' : 'text-orange')}`;
    document.getElementById("sensor-heart").innerText = ev.biometrics.heart;
    document.getElementById("sensor-heart").className = `sensor-status ${ev.biometrics.heart === '76 BPM' || ev.biometrics.heart === '70 BPM' || ev.biometrics.heart === '74 BPM' || ev.biometrics.heart === '82 BPM' ? 'text-green' : 'text-red'}`;
    document.getElementById("audio-status-text").innerText = ev.biometrics.audio;
    document.getElementById("audio-status-text").className = `sensor-status ${ev.biometrics.audio === 'Quiet' ? 'text-green' : 'text-red'}`;

    // Sanctuary widget card on mobile
    const sanctuaryWidget = document.getElementById("mobile-sanctuary-widget");
    const sanctuarySuccess = document.getElementById("sanctuary-success-overlay");
    const btnEnter = document.getElementById("btn-sanctuary-enter");

    sanctuaryWidget.classList.remove("border-green-pulse");
    sanctuarySuccess.classList.add("hidden");

    if (ev.sanctuaryState === 'awaiting-scan') {
        document.getElementById("sanctuary-status-tag").innerHTML = `<i class="fa-solid fa-qrcode"></i> QR Awaiting Scan`;
        document.getElementById("sanctuary-status-tag").className = "widget-tag orange-tag";
        document.getElementById("mobile-sanctuary-name").innerText = "Apollo Pharmacy (BLE Connect)";
        document.getElementById("mobile-sanctuary-addr").innerText = "Beacon node_02 active. Scan QR code to verify.";
        btnEnter.disabled = true;
        btnEnter.innerHTML = `<i class="fa-solid fa-lock"></i> Locked (Scan QR)`;
    } else if (ev.sanctuaryState === 'verified') {
        document.getElementById("sanctuary-status-tag").innerHTML = `<i class="fa-solid fa-bluetooth"></i> Beacon Verified`;
        document.getElementById("sanctuary-status-tag").className = "widget-tag green-tag";
        document.getElementById("mobile-sanctuary-name").innerText = "Apollo Pharmacy (Verified)";
        document.getElementById("mobile-sanctuary-addr").innerText = "QR hash verified. Secure shield active.";
        btnEnter.removeAttribute("disabled");
        btnEnter.innerHTML = `<i class="fa-solid fa-circle-check"></i> Shelter Lock`;
        sanctuarySuccess.classList.remove("hidden");
        sanctuaryWidget.classList.add("border-green-pulse");
    } else if (ev.sanctuaryTarget) {
        document.getElementById("sanctuary-status-tag").innerHTML = `<i class="fa-solid fa-rss-feed fa-spin"></i> Approaching Node...`;
        document.getElementById("sanctuary-status-tag").className = "widget-tag beacon-search";
        document.getElementById("mobile-sanctuary-name").innerText = "Apollo Pharmacy (BLE Target)";
        document.getElementById("mobile-sanctuary-addr").innerText = "Distance: ~120m | beacon_node_02";
        btnEnter.disabled = true;
        btnEnter.innerHTML = `<i class="fa-solid fa-lock"></i> Out of range`;
    } else {
        document.getElementById("sanctuary-status-tag").innerHTML = `<i class="fa-solid fa-rss-feed fa-spin"></i> Scanning Beacons...`;
        document.getElementById("sanctuary-status-tag").className = "widget-tag beacon-search";
        document.getElementById("mobile-sanctuary-name").innerText = "Scanning Beacons...";
        document.getElementById("mobile-sanctuary-addr").innerText = "-";
        btnEnter.disabled = true;
        btnEnter.innerHTML = `<i class="fa-solid fa-lock"></i> Out of range`;
    }

    // SOS State
    if (ev.sosActive) {
        document.getElementById("mobile-sos-btn").classList.add("alarm-sos-flash");
    } else {
        document.getElementById("mobile-sos-btn").classList.remove("alarm-sos-flash");
    }

    // Dynamic Overlay Modals
    document.getElementById("deviation-alert-modal").classList.add("hidden");
    document.getElementById("arrival-verification-modal").classList.add("hidden");
    document.getElementById("police-secured-modal").classList.add("hidden");

    if (ev.deviationPrompt) {
        document.getElementById("deviation-alert-modal").classList.remove("hidden");
        startDeviationCountdown();
    }
    if (ev.arrivalPrompt) {
        document.getElementById("arrival-verification-modal").classList.remove("hidden");
    }
    if (ev.securedPrompt) {
        document.getElementById("police-secured-modal").classList.remove("hidden");
    }

    // 4. Update Digital Twin Sidebar parameters
    document.getElementById("twin-kpi-uvi").innerText = ev.kpiUvi;
    document.getElementById("twin-kpi-uvi").className = `kpi-val ${ev.kpiUvi === '35%' ? 'text-red' : 'text-green'}`;
    document.getElementById("twin-kpi-route-desc").innerText = ev.kpiRouteDesc;
    document.getElementById("twin-kpi-trust").innerText = `${ev.trustScore}/100`;
    document.getElementById("twin-kpi-trust").className = `kpi-val ${ev.trustScore >= 94 ? 'text-green' : (ev.trustScore >= 60 ? 'text-orange' : 'text-red')}`;

    // Agent logs
    if (caseNum === 1) {
        if (eventIndex >= 5) {
            document.getElementById("agent-merchant-badge").innerText = "Verified";
            document.getElementById("agent-merchant-badge").className = "badge badge-green";
            document.getElementById("agent-merchant-log").innerText = "Verified: Apollo Pharmacy (sanc_qr_9482)";
            document.getElementById("agent-merchant-log").style.color = "var(--color-green)";
        } else {
            document.getElementById("agent-merchant-badge").innerText = "Standby";
            document.getElementById("agent-merchant-badge").className = "badge badge-green";
            document.getElementById("agent-merchant-log").innerText = "Awaiting merchant QR / BLE pings";
            document.getElementById("agent-merchant-log").style.color = "var(--text-muted)";
        }
        document.getElementById("agent-dna-badge").innerText = "Active";
        document.getElementById("agent-dna-badge").className = "badge badge-green";
        document.getElementById("agent-dna-log").innerText = ev.agentReasoning.includes("GMM") || ev.agentReasoning.includes("Redis") ? "Matched pairing sequence verified." : "Fusing gait, audio, & trajectory inputs";
        document.getElementById("agent-dna-log").style.color = "var(--text-muted)";
    } else {
        // Case 2
        if (eventIndex >= 2) {
            document.getElementById("agent-dna-badge").innerText = "ALERT";
            document.getElementById("agent-dna-badge").className = "badge badge-red";
            document.getElementById("agent-dna-log").innerText = "CRITICAL: Trajectory mismatch (Fréchet deviation)";
            document.getElementById("agent-dna-log").style.color = "var(--color-red)";
        } else {
            document.getElementById("agent-dna-badge").innerText = "Active";
            document.getElementById("agent-dna-badge").className = "badge badge-green";
            document.getElementById("agent-dna-log").innerText = "Fusing gait, audio, & trajectory inputs";
            document.getElementById("agent-dna-log").style.color = "var(--text-muted)";
        }
    }

    // Map Overlays details
    document.getElementById("twin-bubble-partner").innerText = ev.cohortActive ? "Sarah M." : (ev.cohortStatus === "SEARCHING" ? "Searching..." : "Deactivated");
    document.getElementById("twin-patrol-units").innerText = eventIndex >= 4 && caseNum === 2 ? "Unit 04 (Intercepting)" : "Unit 04 (Standby)";

    // Update server status indicator text
    if (ev.sosActive) {
        document.getElementById("twin-indicator-light").className = "status-light-red animate-pulse";
        document.getElementById("twin-indicator-text").innerText = "EMERGENCY PANIC ALERT DISPATCH LOOP ACTIVE";
    } else {
        document.getElementById("twin-indicator-light").className = "status-light-green animate-pulse";
        document.getElementById("twin-indicator-text").innerText = "SYSTEM CORE: ACTIVE MONITORING";
    }

    // Write to websocket logs box
    logEvent(ev.logMsg, ev.trustScore < 50 ? 'red' : (ev.trustScore < 90 ? 'orange' : 'green'));
    
    // Update distances on map overlay panel
    updateSanctuaryDirectoryDistances(ev.commuterCoords);
    
    // Auto-scroll chat welcome context
    resetChatHistory();
}

function resetMapBeacons() {
    SANCTUARIES.forEach(s => {
        const beaconDiv = document.getElementById(`map-beacon-${s.id}`);
        if (beaconDiv) {
            beaconDiv.className = 'pulse-marker-beacon';
            beaconDiv.style.backgroundColor = 'var(--color-cyan)';
            beaconDiv.style.boxShadow = '0 0 8px var(--color-cyan-glow)';
        }
    });
}

function startDeviationCountdown() {
    if (countdownInterval) clearInterval(countdownInterval);
    countdownVal = 10;
    const countTxt = document.getElementById("countdown-val");
    if (countTxt) countTxt.innerText = countdownVal;
    
    countdownInterval = setInterval(() => {
        countdownVal--;
        if (countTxt) countTxt.innerText = countdownVal;
        if (countdownVal <= 0) {
            clearInterval(countdownInterval);
            // Go to next step which is Case 2 SOS escalation
            nextEvent();
        }
    }, 1000);
}

// ==========================================================================
// BUTTON CALLBACK HANDLERS
// ==========================================================================

function confirmSafeClick() {
    if (countdownInterval) clearInterval(countdownInterval);
    document.getElementById("deviation-alert-modal").classList.add("hidden");
    logEvent("Verification PIN authorized by commuter. Risk level reset to Green.", "green");
    
    // If they click safe, we transition them back to Route B safe commute flow (Case 1)
    selectCase(1);
    currentEventIndex = 3; // Cohort Pair step
    renderEvent(currentCase, currentEventIndex);
}

function confirmArrivalClick() {
    document.getElementById("arrival-verification-modal").classList.add("hidden");
    
    // Boost score to 100
    document.getElementById("network-protection-num").innerText = "100%";
    document.getElementById("network-protection-circle").setAttribute("stroke-dasharray", "100, 100");
    document.getElementById("network-protection-status").innerText = "COMPLETED";
    document.getElementById("mobile-cohort-status").innerText = "COMPLETED";
    
    logEvent("Trip closed successfully. Telemetry sync terminated.", "green");
}

function closeSecuredModal() {
    document.getElementById("police-secured-modal").classList.add("hidden");
    logEvent("Trip closed by dispatch officer. Status: SECURED.", "green");
}

// ==========================================================================
// QR CAMERA VIEWPORT SCANNER HANDLERS
// ==========================================================================

function openQrScanner() {
    document.getElementById("qr-scanner-modal").classList.remove("hidden");
    logEvent("[Camera Scanner] Viewfinder activated. Sweeping QR registry...", "cyan");
    
    // Auto-verify after 2 seconds
    setTimeout(() => {
        if (!document.getElementById("qr-scanner-modal").classList.contains("hidden")) {
            closeQrScanner();
            verifySanctuaryQR();
        }
    }, 2000);
}

function closeQrScanner() {
    document.getElementById("qr-scanner-modal").classList.add("hidden");
}

function verifySanctuaryQR() {
    logEvent("[Merchant Agent] Scanned QR Hash: sanc_qr_9482. Authenticating...", "purple");
    
    setTimeout(() => {
        // Advance replay index to step 6 (index 5)
        currentEventIndex = 5;
        renderEvent(currentCase, currentEventIndex);
    }, 800);
}

function shelterInSanctuaryClick() {
    logEvent("[AWS IoT MQTT] Commuter activated sanctuary safe-haven mode.", "green");
    
    const btnEnter = document.getElementById("btn-sanctuary-enter");
    btnEnter.disabled = true;
    btnEnter.innerHTML = `<i class="fa-solid fa-shield-halved"></i> SHELTER LOCKED (SAFE)`;
    
    // Change map beacon to pulsing safety orange/green
    const beaconDiv = document.getElementById("map-beacon-2");
    if (beaconDiv) {
        beaconDiv.className = 'pulse-marker-cohort';
        beaconDiv.style.backgroundColor = 'var(--color-green)';
        beaconDiv.style.boxShadow = '0 0 25px var(--color-green)';
    }

    logEvent("[Municipal Response] Sanctuary camera feed live. Local merchant alerted.", "green");
}

// ==========================================================================
// LOGS & HELPER UTILITIES
// ==========================================================================

function logEvent(message, type = 'cyan') {
    const logBox = document.getElementById("log-box");
    if (!logBox) return;
    
    const timestamp = new Date().toLocaleTimeString();
    const line = document.createElement("div");
    
    // Map colors
    let textClass = 'text-cyan';
    if (type === 'green') textClass = 'text-green';
    else if (type === 'red') textClass = 'text-red';
    else if (type === 'orange') textClass = 'text-orange';
    else if (type === 'purple') textClass = 'text-purple';

    line.className = `log-line ${textClass}`;
    line.innerHTML = `[${timestamp}] ${message}`;
    logBox.appendChild(line);
    logBox.scrollTop = logBox.scrollHeight;
}

function updateSanctuaryDirectoryDistances(pos) {
    SANCTUARIES.forEach(store => {
        const dist = getDistance(pos, store.coords);
        // Look up corresponding badge on mobile if exists (not needed in SRE list, but nice to have)
    });
}

function setLayerStatus(layerId, status) {
    const tag = document.getElementById(layerId);
    if (!tag) return;
    
    tag.className = "layer-tag";
    if (status === 'active') {
        tag.classList.add("active");
    } else if (status === 'warning') {
        tag.classList.add("warning");
    } else if (status === 'danger') {
        tag.classList.add("danger");
    }
}

function getDistance(p1, p2) {
    const R = 6371000;
    const dLat = (p2[0] - p1[0]) * Math.PI / 180;
    const dLon = (p2[1] - p1[1]) * Math.PI / 180;
    const a = 
        Math.sin(dLat/2) * Math.sin(dLat/2) +
        Math.cos(p1[0] * Math.PI / 180) * Math.cos(p2[0] * Math.PI / 180) * 
        Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c;
}

// ==========================================================================
// AUDIO SIMULATION & VOLTAGE VISUALIZER
// ==========================================================================

function startAudioVisualizer() {
    if (audioAnimInterval) clearInterval(audioAnimInterval);
    const dbText = document.getElementById("audio-db");
    const bars = document.querySelectorAll(".audio-visualizer .bar");
    
    audioAnimInterval = setInterval(() => {
        let maxDb = 45;
        const events = currentCase === 1 ? CASE_1_EVENTS : CASE_2_EVENTS;
        const ev = events[currentEventIndex];
        
        if (ev.biometrics.audio === 'Noise Spike') {
            maxDb = 82;
        } else if (ev.biometrics.audio === 'Alert') {
            maxDb = 55;
        }
        
        const randomDb = Math.floor(Math.random() * (maxDb - 30) + 30);
        if (dbText) dbText.innerText = `${randomDb} dB`;
        
        bars.forEach(bar => {
            const h = Math.floor(Math.random() * 85) + 15;
            bar.style.height = `${h}%`;
            if (randomDb > 70) {
                bar.style.backgroundColor = 'var(--color-red)';
            } else if (randomDb > 50) {
                bar.style.backgroundColor = 'var(--color-orange)';
            } else {
                bar.style.backgroundColor = 'var(--color-purple)';
            }
        });
    }, 200);
}

// --- Route Selection helper UI ---
function selectRouteOption(option) {
    selectedRouteOption = option;
    const cards = document.querySelectorAll(".route-compare-list .route-option-card");
    if (cards.length < 2) return;
    
    if (option === 'B') {
        cards[0].classList.add("active");
        cards[1].classList.remove("active");
    } else {
        cards[0].classList.remove("active");
        cards[1].classList.add("active");
    }
}

// ==========================================================================
// AI SAFETY ASSISTANT INTENT MATCHING
// ==========================================================================

const AI_RESPONSES = {
    case1: {
        route: "AuraPath selected Safe Corridor B because it possesses 95% verified streetlight coverage, 8 active commercial store beacons, and regular municipal patrol beats. Standard unlit layouts were rejected.",
        risk: "Your risk rating is low (Green). Vitals and gait footprints comply perfectly with calibration benchmarks.",
        protect: "You are actively shielded by the Aura Guardian Network (96%): Corridor Routing, Cohort matching, and active Police patrol loops.",
        sanctuary: "There are 3 sanctuaries registered on this sector: Ramesh Kirana (112m), Apollo Pharmacy (285m), and Family Mart (490m)."
    },
    case2: {
        route: "Route A is flagged for low lighting (35%) and zero commercial activity. Pathfinder strongly advises returning to the recommended Corridor B service road.",
        risk: "Your risk rating is CRITICAL. Trajectory matches dark shortcut corridor. physiological gait: Running; heart rate spiked to 132 BPM.",
        protect: "Corridor protection layers broken. Police patrol Unit 04 has been dispatched to your coordinates via real-time WebSocket routing.",
        sanctuary: "Ramesh Kirana Store sanctuary beacon is 65m behind you. Turn back to reconnect to the secure mesh network."
    }
};

function initChatDrawer() {
    const toggle = document.getElementById("chat-header-toggle");
    const drawer = document.getElementById("chat-drawer");
    const icon = document.getElementById("chat-toggle-icon");
    if (!toggle || !drawer || !icon) return;
    
    toggle.addEventListener("click", () => {
        drawer.classList.toggle("collapsed");
        if (drawer.classList.contains("collapsed")) {
            icon.className = "fa-solid fa-chevron-up";
        } else {
            icon.className = "fa-solid fa-chevron-down";
        }
    });
}

function resetChatHistory() {
    const chatHistory = document.getElementById("chat-history");
    if (!chatHistory) return;
    chatHistory.innerHTML = `<div class="message system-msg">Hello Priya. I am monitoring your commute. Click an option below to query my spatial safety context:</div>`;
}

function askAiQuestion(type) {
    const chatHistory = document.getElementById("chat-history");
    if (!chatHistory) return;
    
    // User query message
    let queryText = "";
    switch(type) {
        case 'route': queryText = "Why was this route selected?"; break;
        case 'risk': queryText = "What is my current risk level?"; break;
        case 'protect': queryText = "What currently protects me?"; break;
        case 'sanctuary': queryText = "Where is the nearest sanctuary?"; break;
    }
    
    const userMsg = document.createElement("div");
    userMsg.className = "message user-msg";
    userMsg.innerText = queryText;
    chatHistory.appendChild(userMsg);

    // Assistant response lookup
    const caseKey = currentCase === 1 ? "case1" : "case2";
    const answerText = AI_RESPONSES[caseKey][type];

    setTimeout(() => {
        const assistantMsg = document.createElement("div");
        assistantMsg.className = "message assistant-msg";
        assistantMsg.innerText = answerText;
        chatHistory.appendChild(assistantMsg);
        chatHistory.scrollTop = chatHistory.scrollHeight;
    }, 450);
}

// ==========================================================================
// INITIALIZATION
// ==========================================================================

document.addEventListener("DOMContentLoaded", () => {
    initMap();
    initChatDrawer();
    startAudioVisualizer();
    
    // Bind buttons
    document.getElementById("btn-start-navigation").addEventListener("click", () => {
        // Automatically advance SRE from Step 1 to Step 2
        nextEvent();
    });
    
    document.getElementById("btn-confirm-safe").addEventListener("click", confirmSafeClick);
    document.getElementById("btn-confirm-arrival").addEventListener("click", confirmArrivalClick);
    document.getElementById("btn-sanctuary-enter").addEventListener("click", shelterInSanctuaryClick);
    
    // QR Scanner Buttons
    document.getElementById("btn-scan-qr").addEventListener("click", openQrScanner);
    document.getElementById("btn-cancel-scan").addEventListener("click", closeQrScanner);

    // Load first case
    selectCase(1);
});
