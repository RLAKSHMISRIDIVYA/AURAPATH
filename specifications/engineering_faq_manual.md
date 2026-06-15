# AuraPath: Engineering FAQ & Reliability Manual

This manual details the system fail-safes, algorithmic math, battery optimization, and verification logic used to ensure high operational reliability.

---

## 1. System Fail-Safes & Offline Operation

### Cellular Network Dropout Protocol
When a commuter enters a cellular signal dead zone:
*   **Local State Machine**: The client app transitions to **Offline Guardian Mode**.
*   **Local Anomaly Detection**: Biometric (heart rate) and gait telemetry continue to be parsed locally on-device.
*   **Offline SOS Routing**: If a dynamic threat is identified, the app utilizes Bluetooth ad-hoc networks to broadcast a cryptographic SOS payload to nearby node streetlights or sanctuaries, bypassing cellular networks.
*   **Heartbeat Timeout**: The backend monitors active socket connections. If a client's websocket drops without a clean "Safe Arrival" handshake, a grace period (configured to 60 seconds) is initiated. If communication is not restored, the server triggers an automated route-deviation alert.

---

## 2. Kalman Filters for GPS Drift Correction

In urban canyons (dense high-rise areas), GPS signals bounce, creating location drift anomalies. AuraPath passes raw coordinates through a linear Kalman filter to smooth trajectories.

### State Space Model
The system state is represented by position and velocity:
\[x_k = \begin{bmatrix} p_x \\ p_y \\ v_x \\ v_y \end{bmatrix}_k\]

The state transition model is defined as:
\[x_k = A x_{k-1} + w_k\]
\[z_k = H x_k + v_k\]

Where:
*   \(A\) is the state transition matrix:
    \[A = \begin{bmatrix} 1 & 0 & \Delta t & 0 \\ 0 & 1 & 0 & \Delta t \\ 0 & 0 & 1 & 0 \\ 0 & 0 & 0 & 1 \end{bmatrix}\]
*   \(H\) is the observation model mapping true state space to measured space:
    \[H = \begin{bmatrix} 1 & 0 & 0 & 0 \\ 0 & 1 & 0 & 0 \end{bmatrix}\]
*   \(w_k \sim \mathcal{N}(0, Q)\) is the process covariance (representing motion changes).
*   \(v_k \sim \mathcal{N}(0, R)\) is the measurement covariance (representing GPS accuracy).

By dynamically adjusting \(R\) based on the reported horizontal dilution of precision (HDOP) from the mobile GPS receiver, the filter dampens GPS noise, preventing false route-deviation flags.

---

## 3. Battery-Saving Throttles

Continuous GPS tracking and sensor reading can drain battery. AuraPath is designed to use a dynamic polling throttle:

| Safety Level | GPS Interval | Sensor Polling Frequency (Gait/Audio) | battery consumption Rate |
| :--- | :--- | :--- | :--- |
| **Green (Safe Corridor)** | 15 seconds | Off | Low (~2% / hour) |
| **Amber (Approaching Dim zone)**| 5 seconds | 5 Hz (Accelerometer only) | Medium (~6% / hour) |
| **Red (Route Deviation)** | 0.5 seconds | 20 Hz (Accelerometer + Microphone) | High (~18% / hour) |

The state transitions are managed by spatial geofences (e.g. UVI drop detection) calculated on the local device.

---

## 4. TFLite Audio Threat Detection & Noise Filtering

The proposed client application is designed to include an embedded TensorFlow Lite (TFLite) binary for local environment sound classification.

### Noise Cancellation Preprocessing
To prevent vehicle engines, horns, and street noise from triggering false threat flags, the incoming audio stream is passed through a bandpass filter (300 Hz to 3400 Hz), which isolates vocal distress frequencies.

### Multi-Sensory Fusion
To further reduce false dispatches:
*   A sound classification event (e.g. screaming detected) will **not** trigger an immediate alarm on its own.
*   It must be accompanied by either a biometric threshold breach (e.g. heart rate > 120 BPM) or a route compliance deviation (Fréchet distance > 15m).

---

## 5. Cryptographic QR Verification

Sanctuary check-ins are secured using time-based cryptographic verification tokens.

### Handshake Sequence
1.  **Merchant Token Generation**: The sanctuary node (merchant device or IoT gateway) generates a dynamic TOTP (Time-Based One-Time Password) combined with the sanctuary's unique private identifier:
    \[\text{Token} = \text{HMAC-SHA256}(\text{SecretKey}, \text{Timestamp})\]
2.  **QR Display**: The token is rendered as a QR code on the sanctuary's dynamic e-ink display.
3.  **Client Scan**: The commuter scans the QR code. The app encrypts the scanned token and uploads it to the database.
4.  **Verification**: The backend validates the HMAC token. Upon successful validation, the sanctuary status is updated to "Secure Shelter Occupied", unlocking the electronic locks and logging the arrival.
