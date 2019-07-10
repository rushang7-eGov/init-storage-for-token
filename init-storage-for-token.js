function saveToLocalstorage(responseJSON) {

    var authToken = responseJSON["access_token"];
    var userInfo = responseJSON["UserRequest"];

    localStorage["Citizen.token"] = authToken;
    localStorage["Citizen.user-info"] = JSON.stringify(userInfo);

    localStorage["Citizen.chatbot"] = true;
}

function checkForSharedToken() {
    var urlParams = new URLSearchParams(location.search);
    if(urlParams.has("token")) {
        return true;
    }
    return false;
}

function removeURLParameter(url, parameter) {
    //prefer to use l.search if you have a location/link object
    var urlparts = url.split('?');   
    if (urlparts.length >= 2) {

        var prefix = encodeURIComponent(parameter) + '=';
        var pars = urlparts[1].split(/[&;]/g);

        //reverse iteration as may be destructive
        for (var i = pars.length; i-- > 0;) {    
            //idiom for string.startsWith
            if (pars[i].lastIndexOf(prefix, 0) !== -1) {  
                pars.splice(i, 1);
            }
        }

        return urlparts[0] + (pars.length > 0 ? '?' + pars.join('&') : '');
    }
    return url;
}

if(checkForSharedToken()) {
    var urlParams = new URLSearchParams(location.search);
    var refresh_token = urlParams.get("token");

    var path = '/user/oauth/token';
    var headers = {
        'Authorization' : 'Basic ZWdvdi11c2VyLWNsaWVudDplZ292LXVzZXItc2VjcmV0'
    }
    var params = {
        'grant_type' : 'refresh_token',
        'refresh_token' : refresh_token
    }
    var formData = new FormData();
    for(p in params) {
        formData.append(p, params[p]);
    }
    var request = {
        method: 'POST',
        body: formData, 
        headers: headers
    }

    var sharedURL = removeURLParameter(window.location.href, 'token');
    localStorage["sharedURL"] = sharedURL;

    fetch(path, request) 
    .then(response =>  {
        if(response.status === 200)
            return response.json()
        else
            throw new Error("Error in fetch user with refresh_token");
    })
    .then(responseJSON => { 
        saveToLocalstorage(responseJSON);
        window.location = localStorage["sharedURL"];
    })
    .catch(err => { console.error(err); })
}