'use strict';

retrospective.service('retroService', function ($http, $location) {

    var service = {};

    var url;

    service.connect = function() {
        if(service.ws) { service.ws.close(); }

        var ws = new WebSocket(url);

        ws.onopen = function() {};

        ws.onerror = function() { service.callback("Failed to open a connection"); }

        ws.onmessage = function(message) { service.callback(JSON.parse(message.data)); };

        service.ws = ws;
    }

    service.subscribe = function(callback) { service.callback = callback; }

    function setUrl(sufix){
        console.log($location.host() + $location.port());
        //ws url sample: ws://16.103.103.3:9000/retrospectiveWS/"+retroId
        url = "ws://"+$location.host()+":"+$location.port()+"/"+sufix;
    }
    function getAll() {
       return $http.get('/retrospective');
    }

    function getById(retroId) {
        return $http.get('/retrospective/'+retroId);
    }

    function add(retro) {
        return $http.post('/retrospective', retro);
    }

    function addInput(retroId, input) {
        console.log(retroId);
        console.log(input);
        return $http.post('/retrospective/'+retroId+'/input', input);
    }

    return {
        getAll : getAll,
        getById: getById,
        add : add,
        addInput : addInput,
        setUrl : setUrl,
        service: service
    }


});