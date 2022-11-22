var lastCall = "N/A"
var latestCaseNumInstances = [];

class LatestCaseNum {
    static type = "nl.tyrope.ratdeck.latestcasenum";
    context;

    constructor(context) {
        this.context = context;
    };

    function OnDisplay(evtData) {
        this.SetTitle(lastCall);
    };

    function SetTitle(newTitle) {
        websocket.send(JSON.stringify({
            "event": "setTitle",
            "context": this.contxt,
            "payload": {
                "title": newTitle
            }
        }));
     };
};

streamDeckEvents.addEventListener("willAppear", function(evtData){
    if(devMode){
        websocket.send(JSON.stringify({"event":"logMessage","payload":{"message":
            "LatestcaseNum received event "+evtType+" with data: "+JSON.stringify(evtData)
        }}));
    }

    if(evtData['action'] != LatestCaseNum.type){
        return; // Not one of latestcasenum.
    }

    // Check if it's a context we know of.
    for(let inst of latestCaseNumInstances){
        if(inst.context == evtData['context']){
            // Known context, pass it on.
            inst.OnDisplay(evtData);
            return;
        }
    }

    // New context.
    let newInst = new LatestCaseNum(evtData['context']);
    latestCaseNumInstances.push(newInst);
    newInst.OnDisplay(evtData);
});

