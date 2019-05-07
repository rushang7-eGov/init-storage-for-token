function saveToLocalstorage(responseJSON) {

    var authToken = responseJSON["access_token"];
    var refresh_token = responseJSON["refresh_token"];
    var userInfo = responseJSON["UserRequest"];

    localStorage["Citizen.token"] = authToken;
    localStorage["Citizen.refresh-token"] = refresh_token;
    localStorage["Citizen.user-info"] = JSON.stringify(userInfo);

    localStorage["token"] = authToken;
    localStorage["refresh-token"] = refresh_token;
    localStorage["user-info"] = JSON.stringify(userInfo);

    localStorage["Citizen.chatbot"] = true;
}

function checkForSharedToken() {
    var urlParams = new URLSearchParams(location.search);
    if(urlParams.has("token")) {
        if(localStorage["refresh-token"] == urlParams.get("token")) {
            return false;
        }
        return true;
    }
    return false;
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

    localStorage["sharedURL"] = window.location;

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