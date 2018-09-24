var App = App || {};
App.Api = {
    MakeAuthedRequest: function (url, method, jsonData, onSuccess, onError) {
        App.Auth.GetAuthTokenPromise(function (token) {
            var headers = {};
            if (token) {
                headers.Authorization = 'Bearer ' + token;
            }
            return $.ajax({
                type: method,
                url: "https://imkorebro.se/" + url,
                data: jsonData,
                contentType: 'application/x-www-form-urlencoded; charset=UTF-8',
                headers: headers,
                cache: false
            }).done(onSuccess).fail(onError);
        });
    },
    MakeParamPost: function (url, data, onSuccess, onError) {        
        $.ajax({
            type: 'POST',
            url: "https://imkorebro.se/" + url,
            data: data,
            contentType: 'application/x-www-form-urlencoded; charset=UTF-8',
        }).done(onSuccess).fail(onError);
    },    
}