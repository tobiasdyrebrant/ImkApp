var App = App || {};
App.Api = {
    MakeAuthedRequest: function (url, method, data, onSuccess, onError, options) {
        App.Auth.GetAuthTokenPromise(function (token) {
            var headers = {};
            if (token) {
                headers.Authorization = 'Bearer ' + token;
            }           

            var settings = {
                type: method,
                url: "https://imkorebro.se/" + url,
                data: data,
                contentType: "application/x-www-form-urlencoded; charset=UTF-8",
                headers: headers,
                cache: false
            };
            
            if (options != undefined) {
                if (!Object.assign) {
                    Object.keys(options)
                        .forEach(function (k) {
                            settings[k] = options[k];
                        });
                } else {
                    Object.assign(settings, options);
                }
            }

            return $.ajax(settings).done(onSuccess).fail(function (error) {
                if (error.status == 401)
                    App.Utils.HandleUnauthorized();

                onError();
            });
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