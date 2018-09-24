var App = App || {};
App.Auth = {
    Login: function (form, onSuccess, onError) {
        var formData = App.Utils.SerializeForm($(form));
        var loginData = {
            grant_type: 'password',
            username: formData['login-name'],
            password: formData['login-password'],
            //TODO
            //Add to appsettings?
            client_id: "adminapp",
            client_secret: "C68C1A357B4CCE6D4565D69BB683F"
        };        
        App.Api.MakeParamPost('oauth/token',
            loginData,
            function (data) {               
                if (data['access_token']) {
                    App.Auth.SetAuthToken(data['access_token']);
                    if (data['refresh_token']) { App.Utils.SetLocal('refreshToken', data['refresh_token'], true); }
                    else { App.Utils.RemoveLocal('refreshToken'); }
                    //TODO
                    //Get user information?

                    //App.Api.MakeAuthedRequest('oauth/token', 'POST', null, function (userData) {
                    //    var imk_user = {
                    //        access_token: data['access_token'],
                    //    };

                    //    //Object.assign not supported in IE11
                    //    if (!Object.assign) {
                    //        Object.keys(userData)
                    //            .forEach(function (k) {
                    //                imk_user[k] = userData[k];
                    //            });
                    //    } else {
                    //        Object.assign(imk_user, userData);
                    //    }

                    //    App.Utils.SetSession('imk_user', JSON.stringify(imk_user), null);

                    //    onSuccess(userData);
                    //});
                }
            },
            onError
        );
    },
    SetAuthToken: function (token) {
        if (App.Utils.GetSession('imk_user') != undefined) {
            var bu = JSON.parse(App.Utils.GetSession('imk_user'));
            bu.access_token = token;

            App.Utils.SetSession('imk_user', JSON.stringify(bu), 86400);
        } else {
            var imk_user = {
                access_token: token
            }
            App.Utils.SetSession('imk_user', JSON.stringify(imk_user), 86400);
        }
    },
    GetAuthToken: function () {
        return App.Utils.GetSession('imk_user') != undefined
            ? JSON.parse(App.Utils.GetSession('imk_user')).access_token
            : undefined;
    },
    __buffering: false,
    __callBackBuffer: [],
    GetAuthTokenPromise: function (callback, skipAccessToken) {         
        var at = App.Utils.GetSession('imk_user') != undefined
            ? JSON.parse(App.Utils.GetSession('imk_user')).access_token
            : undefined;
        if (at && !skipAccessToken) {            
            callback(at);
        } else {            
            //Start buffer calls            
            if (App.Auth.__buffering) {
                App.Auth.__callBackBuffer.push(callback);
            } else {
                App.Auth.__buffering = true;
                App.Auth.__callBackBuffer.push(callback);
                //try get by refreshtoken                                
                var rt = App.Utils.GetLocal('refreshToken', true);
                if (rt) {
                    var tokenData = $.param({
                        grant_type: 'refresh_token',
                        refresh_token: rt,
                        client_id: "adminapp",
                        client_secret: "C68C1A357B4CCE6D4565D69BB683F"
                    });
                    App.Api.MakeParamPost('oauth/token',
                        tokenData,
                        function (data) {
                            if (data['access_token']) {
                                App.Auth.SetAuthToken(data['access_token']);
                                App.Utils.SetLocal('refreshToken', data['refresh_token'], true);
                                App.Auth.__buffering = false;
                                while (App.Auth.__callBackBuffer.length) {
                                    App.Auth.__callBackBuffer.shift()(data['access_token']);
                                }
                            } else {
                                App.Utils.RemoveLocal('refreshToken'); //Token not valid
                                App.Auth.__buffering = false;
                                while (App.Auth.__callBackBuffer.length) {
                                    App.Auth.__callBackBuffer.shift()();
                                }
                            }
                        }, function (error) {
                            App.Utils.RemoveLocal('refreshToken'); //Token not valid
                            App.Auth.__buffering = false;
                            while (App.Auth.__callBackBuffer.length) {
                                App.Auth.__callBackBuffer.shift()();
                            }
                        }
                    );
                } else {
                    App.Auth.__buffering = false;
                    App.Auth.__callBackBuffer = [];
                    callback();
                }
            }
        }
    },
}