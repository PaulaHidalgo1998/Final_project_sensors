var client_Speed = new Paho.Client("10.5.3.101", 15677, "speed");
client_Speed.onConnectionLost = onConnectionLost_speed;
client_Speed.onMessageArrived = onMessageArrived_speed;
client_Speed.connect({onSuccess:onConnect_speed, cleanSession:true, keepAliveInterval:10});

function onConnect_speed() {
    // Once a connection has been made, make a subscription and send a message.
    console.log("onConnect_speed");
    client_Speed.subscribe("data/speed");
};
function onConnectionLost_speed(responseObject) {
    if (responseObject.errorCode !== 0){
        console.log("onConnectionLost_speed:"+responseObject.errorMessage);
    }
};
function onMessageArrived_speed(message) {
    document.getElementById("value").value = message.payloadString;
    //console.log("onMessageArrived_speed:"+message.payloadString);
    addData(message.payloadString, 0)
};

var client_reference = new Paho.Client("10.5.3.101", 15677, "reference");
client_reference.onConnectionLost = onConnectionLost_reference;
client_reference.onMessageArrived = onMessageArrived_reference;
client_reference.connect({onSuccess:onConnect_reference, cleanSession:true, keepAliveInterval:10});

function onConnect_reference() {
    // Once a connection has been made, make a subscription and send a message.
    console.log("onConnect_reference");
    client_reference.subscribe("data/reference");
};
function onConnectionLost_reference(responseObject) {
    if (responseObject.errorCode !== 0){
        console.log("onConnectionLost_reference:"+responseObject.errorMessage);
    }
};
function onMessageArrived_reference(message) {
    document.getElementById("setpoint").value = message.payloadString;
    //console.log("onMessageArrived_reference:"+message.payloadString);
    addData(message.payloadString, 1)
};

var client_send = new Paho.Client("10.5.3.101", 15677, "send");
client_send.onConnectionLost = onConnectionLost_send;
client_send.connect({onSuccess:onConnect_send, cleanSession:true, keepAliveInterval:10});

async function onConnect_send() {
    while (true){
        var msg = new Paho.Message(document.getElementById("desire_state").value);
        document.getElementById("desire_state_value").value = document.getElementById("desire_state").value
        console.log("onMessageArrived_reference:"+msg.payloadString);
        msg.destinationName="data/setpoint";
        client_send.send(msg);
        await new Promise(resolve => setTimeout(resolve, 1220));
        
    }
};
function onConnectionLost_send(responseObject) {
    if (responseObject.errorCode !== 0){
        console.log("onConnectionLost_time:"+responseObject.errorMessage);
    }
};