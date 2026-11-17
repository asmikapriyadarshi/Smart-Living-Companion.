// ========================================
// SMART LIVING COMPANION
// MQTT DASHBOARD
// ========================================


// ========================================
// MQTT SETTINGS
// ========================================

const broker = "broker.hivemq.com";

const port = 8000;

const topic =
    "smartlivingcompanion/room1/sensors";


// ========================================
// CREATE UNIQUE DASHBOARD ID
// ========================================

const clientId =
    "dashboard-" +
    Math.random()
        .toString(16)
        .substring(2, 10);


// ========================================
// CREATE MQTT CLIENT
// ========================================

const client = new Paho.MQTT.Client(
    broker,
    port,
    "/mqtt",
    clientId
);


// ========================================
// TEMPERATURE CHART
// ========================================

const chartLabels = [];

const temperatureData = [];

const ctx =
    document
        .getElementById("temperatureChart")
        .getContext("2d");


const temperatureChart =
    new Chart(ctx, {

        type: "line",

        data: {

            labels: chartLabels,

            datasets: [

                {

                    label: "Room Temperature (DHT11)",

                    data: temperatureData,

                    borderWidth: 3,

                    tension: 0.4,

                    fill: true,

                    backgroundColor:
                        "rgba(56, 189, 248, 0.08)",

                    borderColor:
                        "#38bdf8",

                    pointBackgroundColor:
                        "#38bdf8",

                    pointRadius: 4

                }

            ]

        },

        options: {

            responsive: true,

            maintainAspectRatio: false,

            scales: {

                y: {

                    beginAtZero: false,

                    grid: {
                        color:
                            "rgba(255,255,255,0.06)"
                    },

                    ticks: {
                        color: "#94a3b8"
                    }

                },

                x: {

                    grid: {
                        display: false
                    },

                    ticks: {
                        color: "#94a3b8"
                    }

                }

            },

            plugins: {

                legend: {

                    labels: {
                        color: "#cbd5e1"
                    }

                }

            }

        }

    });


// ========================================
// CONNECTION LOST
// ========================================

client.onConnectionLost = function(response) {

    console.log(
        "MQTT Connection Lost:",
        response.errorMessage
    );


    document.getElementById(
        "connection"
    ).innerText = "Disconnected";


    document.getElementById(
        "connectionDot"
    ).style.background = "#ef4444";


    document.getElementById(
        "connectionDot"
    ).style.boxShadow =
        "0 0 10px #ef4444";
};


// ========================================
// MESSAGE RECEIVED
// ========================================

client.onMessageArrived = function(message) {

    console.log(
        "MQTT Message:",
        message.payloadString
    );


    try {

        const data =
            JSON.parse(
                message.payloadString
            );


        // ========================================
        // DHT11 ROOM TEMPERATURE
        // ========================================

        if (
            data.dht_temperature !== undefined &&
            data.dht_temperature >= 0
        ) {

            const temp =
                Number(
                    data.dht_temperature
                );


            document.getElementById(
                "dhtTemperature"
            ).innerText =
                temp.toFixed(1) + "°C";


            document.getElementById(
                "currentTemperature"
            ).innerText =
                temp.toFixed(1) + "°C";


            document.getElementById(
                "dhtStatus"
            ).innerText =
                getTemperatureStatus(temp);


            addTemperatureToChart(temp);
        }


        // ========================================
        // ROOM HUMIDITY
        // ========================================

        if (
            data.humidity !== undefined &&
            data.humidity >= 0
        ) {

            const humidity =
                Number(
                    data.humidity
                );


            document.getElementById(
                "humidity"
            ).innerText =
                humidity.toFixed(1) + "%";


            document.getElementById(
                "humidityBar"
            ).style.width =
                Math.min(
                    humidity,
                    100
                ) + "%";


            document.getElementById(
                "humidityStatus"
            ).innerText =
                getHumidityStatus(
                    humidity
                );
        }


        // ========================================
        // LM35 TEMPERATURE REFERENCE
        // ========================================

        if (
            data.lm35_temperature !== undefined
        ) {

            const lm35 =
                Number(
                    data.lm35_temperature
                );


            document.getElementById(
                "lm35Temperature"
            ).innerText =
                lm35.toFixed(1) + "°C";


            document.getElementById(
                "lm35Status"
            ).innerText =
                getTemperatureStatus(
                    lm35
                );
        }


        // ========================================
        // IR OBJECT DETECTION
        // ========================================

        if (
            data.object_detected !== undefined
        ) {

            const detected =
                data.object_detected;


            const irElement =
                document.getElementById(
                    "irStatus"
                );


            if (detected) {

                irElement.innerText =
                    "⚠️ Object Detected";

                irElement.style.color =
                    "#facc15";

            } else {

                irElement.innerText =
                    "✓ No Object";

                irElement.style.color =
                    "#4ade80";
            }
        }


        // ========================================
        // VIBRATION ACTIVITY
        // ========================================

        if (
            data.vibration_detected !== undefined
        ) {

            const vibration =
                data.vibration_detected;


            const vibrationElement =
                document.getElementById(
                    "vibrationStatus"
                );


            if (vibration) {

                vibrationElement.innerText =
                    "⚠️ Vibration Detected";

                vibrationElement.style.color =
                    "#f87171";

            } else {

                vibrationElement.innerText =
                    "✓ No Vibration";

                vibrationElement.style.color =
                    "#4ade80";
            }
        }


        // ========================================
        // LAST UPDATE
        // ========================================

        document.getElementById(
            "lastUpdate"
        ).innerText =
            new Date()
                .toLocaleTimeString();


    }

    catch(error) {

        console.error(
            "Invalid MQTT data:",
            error
        );

    }

};


// ========================================
// TEMPERATURE CHART
// ========================================

function addTemperatureToChart(
    temperature
) {

    const time =
        new Date()
            .toLocaleTimeString();


    chartLabels.push(time);

    temperatureData.push(
        temperature
    );


    // Keep only last 10 readings

    if (
        chartLabels.length > 10
    ) {

        chartLabels.shift();

        temperatureData.shift();

    }


    temperatureChart.update();

}


// ========================================
// TEMPERATURE STATUS
// ========================================

function getTemperatureStatus(
    temperature
) {

    if (temperature < 18) {

        return "❄️ Cool";

    }

    if (temperature <= 30) {

        return "✓ Normal";

    }

    if (temperature <= 35) {

        return "⚠️ Warm";

    }

    return "🔥 High Temperature";
}


// ========================================
// HUMIDITY STATUS
// ========================================

function getHumidityStatus(
    humidity
) {

    if (humidity < 30) {

        return "Dry";

    }

    if (humidity <= 60) {

        return "✓ Comfortable";

    }

    if (humidity <= 75) {

        return "Humid";

    }

    return "⚠️ Very Humid";
}


// ========================================
// CONNECT TO HIVEMQ
// ========================================

client.connect({

    useSSL: false,

    timeout: 10,

    keepAliveInterval: 30,


    onSuccess: function() {

        console.log(
            "Connected to HiveMQ"
        );


        document.getElementById(
            "connection"
        ).innerText =
            "Connected";


        document.getElementById(
            "connection"
        ).style.color =
            "#4ade80";


        document.getElementById(
            "connectionDot"
        ).style.background =
            "#4ade80";


        document.getElementById(
            "connectionDot"
        ).style.boxShadow =
            "0 0 10px #4ade80";


        // Subscribe

        client.subscribe(
            topic
        );


        console.log(
            "Subscribed to:",
            topic
        );

    },


    onFailure: function(error) {

        console.error(
            "MQTT Connection Failed:",
            error.errorMessage
        );


        document.getElementById(
            "connection"
        ).innerText =
            "Connection Failed";


        document.getElementById(
            "connection"
        ).style.color =
            "#ef4444";


        document.getElementById(
            "connectionDot"
        ).style.background =
            "#ef4444";

    }

});