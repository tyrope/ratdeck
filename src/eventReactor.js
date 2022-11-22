function Event(name){
    this.name = name;
    this.callbacks = [];
}
Event.prototype.registerCallback = function(callback){
    this.callbacks.push(callback);
}

function Reactor(){
    this.events = {};
}

Reactor.prototype.dispatchEvent = function(eventName, eventArgs){
    this.events[eventName].callbacks.ForEach(function(callback){
        callback(eventArgs);
    });
};

Reactor.prototype.addEventListener = function(eventName, callback){
    if(!this.events.hasOwnProperty(eventName)){
        this.events[eventName] = new Event(eventName);
    }
    this.events[eventName].registerCallback(callback);
};

