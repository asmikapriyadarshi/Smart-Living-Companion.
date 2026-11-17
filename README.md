# Smart Living Companion

### An IoT-Based Room Monitoring and Automation System Using ESP32 and MQTT

## About the Project

Smart Living Companion is an IoT-based room monitoring system designed to monitor room conditions using multiple sensors and display real-time sensor readings through a web dashboard.

The ESP32 collects sensor data and uses MQTT communication through HiveMQ to transmit readings to the dashboard.

## Features

- Real-time room temperature monitoring using DHT11.
- Room humidity monitoring.
- Temperature reference using LM35.
- Object detection using an IR sensor.
- Vibration activity detection.
- Real-time MQTT communication.
- Interactive web dashboard.
- Temperature trend visualization.

## Hardware Components

- ESP32-WROOM-32
- DHT11 Sensor
- LM35 Temperature Sensor
- IR Sensor
- Vibration Sensor
- Connecting wires and breadboard

## Technologies Used

- HTML
- CSS
- JavaScript
- ESP32 Arduino IDE
- MQTT Protocol
- HiveMQ
- Chart.js
- Paho MQTT Client

## Sensor Connections

| Component | ESP32 GPIO |
|---|---|
| DHT11 Data | GPIO 4 |
| LM35 Output | GPIO 34 |
| IR Sensor Output | GPIO 21 |
| Vibration Sensor DO | GPIO 23 |

## System Architecture

1. Sensors collect room data.
2. ESP32 reads sensor values.
3. ESP32 publishes data using MQTT.
4. HiveMQ receives the sensor data.
5. The web dashboard subscribes to the MQTT topic.
6. Sensor readings are displayed in real time.

## MQTT Configuration

- Broker: broker.hivemq.com
- ESP32 MQTT Port: 1883
- Dashboard WebSocket Port: 8000
- Topic: smartlivingcompanion/room1/sensors
- Publishing Interval: 2 seconds

## Project Structure

```text
smart-living-dashboard/
├── index.html
├── style.css
├── script.js
└── README.md