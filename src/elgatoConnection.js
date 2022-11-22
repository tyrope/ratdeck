var websocket = null;
var pluginUUID = null;

var streamDeckEvents = new Reactor();

function connectElgatoStreamDeckSocket(inPort, inPluginUUID, inRegisterEvent, inInfo) {

    pluginUUID = inPluginUUID
    // Open the web socket
    websocket = new WebSocket("ws://127.0.0.1:" + inPort);

    websocket.onopen = function() {
        // WebSocket is connected, send message
        let json = {
            "event": inRegisterEvent,
            "uuid": inPluginUUID
        };
        websocket.send(JSON.stringify(json));
    };

    websocket.onclose = function() {
        // WebSocket is closed, call the clean-up crew.
        streamDeckEvents.dispatchEvent('onClose');
    };

    websocket.onmessage = function(evt) {
        let evtData = JSON.parse(evt.data);
        let evtType = evtData['event'];
        switch(evtType){
            case 'willAppear':
                if(devMode){
                    websocket.send(JSON.stringify({"event":"logMessage","payload":{"message":
                        "Firing event: "+evtType+" with data: "+JSON.stringify(evtData)
                    }}));
                }
                streamDeckEvents.dispatchEvent(evtType, evtData);
                break;
            default:
                // Ignore other events, for now.
            //end Switch
        }
    };
};

