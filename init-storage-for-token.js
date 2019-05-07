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
    console.log("Successfully saved to localstorage");

}

var urlParams = new URLSearchParams(location.search);
if(urlParams.has("token")) {

    var refresh_token = urlParams.get("token");

    var path = '/user/oauth/token';

    var params = {
        'grant_type' : 'refresh_token',
        'refresh_token' : refresh_token
    }

    var formData = new FormData();

    for(p in params) {
        formData.append(p, params[p]);
    }
    
    var httpRequest = new XMLHttpRequest();
    httpRequest.open('POST', path, false);  // `false` makes the request synchronous
    
    httpRequest.setRequestHeader("Authorization", "Basic ZWdvdi11c2VyLWNsaWVudDplZ292LXVzZXItc2VjcmV0");

    httpRequest.send(formData);
    
    if (httpRequest.status === 200) {
        var responseJSON = JSON.parse(httpRequest.responseText);
        saveToLocalstorage(responseJSON);
    }

    console.log("next statement");
}