var App = App || {};
App.Utils = {
    GetCookie: function (key, domain) {
        return domain ? Cookies.get(key, { domain: domain }) : Cookies.get(key);
    },
    SetCookie: function (key, value, end, path, domain, secure) {
        var attr = {};
        if (end) {
            attr.expires = new Date(new Date().getTime() + end * 60 * 1000);
        }
        if (domain) {
            attr.domain = domain;
        }

        Cookies.remove(key, attr);
        Cookies.set(key, value, attr);

        return true;
    },
    RemoveCookie: function (key, path, domain) {
        domain ? Cookies.remove(key, { domain: domain }) : Cookies.remove(key);
        return true;
    },
    RemoveSession: function(key, domain) {
        return App.Utils.RemoveCookie(key, '/', domain);
    },
    SetSession: function (key, value, end, domain) {
        App.Utils.RemoveCookie(key, '/', domain);
        App.Utils.SetCookie(key, value, end || 86400, '/', domain);
    },
    GetSession: function (key) {
        return App.Utils.GetCookie(key);
    },
    SetLocal: function (key, value, encode) {
        if (Modernizr.localstorage)            
            window.localStorage.setItem(key, value);
        else
            App.Utils.SetCookie(key, value, 3600, '/');
    },
    GetLocal: function (key, decode) {
        if (Modernizr.localstorage) {
            var val = window.localStorage.getItem(key);
            if (!val) return null;
            return val;
        }
        else {
            return App.Utils.GetCookie(key);
        }
    },
    RemoveLocal: function (key) {
        if (Modernizr.localstorage)
            return window.localStorage.removeItem(key);
        else
            return App.Utils.RemoveCookie(key);
    },
    SerializeForm: function (obj, includeUnchecked, includeDisabled, notForm) {
        var o = {};
        var a = $(obj).serializeArray();

        $(':input', obj).each(function () {
            if ($(this).is(':file')) {
                a.push({ name: this.name, value: $(this).get(0).files.length > 0 ? $(this).get(0).files[0].name : "" });
            }
        });

        if (includeUnchecked) {
            (notForm ? $(obj, ':input') : $(':input', obj)).each(function () {
                if ($(this).is(':checkbox') && $(this).is(':checked') === false) {
                    a.push({ name: this.name, value: 'false' });
                }
            });
        }

        if (includeDisabled) {
            $(':disabled[name]', obj).each(function () {
                if ($(this).is(':checkbox') && $(this).is(':checked') === false && !includeUnchecked) {
                    a.push({ name: this.name, value: 'false' });
                } else {
                    if (!($(this).is(':checkbox') && !$(this).is(':checked')))
                        a.push({ name: this.name, value: $(this).val() });
                }

            });
        }

        jQuery.each(a, function () {
            if (o[this.name]) {
                if (!o[this.name].push) {
                    o[this.name] = [o[this.name]];
                }
                o[this.name].push(this.value || '');
            } else {
                o[this.name] = this.value || '';
            }
        });

        return o;
    },
    HandleUnauthorized: function () {
        App.Utils.RemoveSession('imk_user');
        App.Auth.GetAuthTokenPromise(function (token) {
            if (token != "" && token != undefined) {
                window.location.reload();                
            }
            else {
                App.Auth.Logout();                
            }
        });
        
    },
    GenerateRandomString: function () {
        function randomMax8HexChars() {
            return (((1 + Math.random()) * 0x100000000) | 0).toString(16).substring(1);
        }

        return randomMax8HexChars() + randomMax8HexChars();

    },
    DataURItoBlob: function (base64image) {
        var dataURI = "data:image/jpeg;base64," + base64image;

        // convert base64/URLEncoded data component to raw binary data held in a string
        var byteString;
        if (dataURI.split(',')[0].indexOf('base64') >= 0)
            byteString = atob(dataURI.split(',')[1]);
        else
            byteString = unescape(dataURI.split(',')[1]);
        // separate out the mime component
        var mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0];
        // write the bytes of the string to a typed array
        var ia = new Uint8Array(byteString.length);
        for (var i = 0; i < byteString.length; i++) {
            ia[i] = byteString.charCodeAt(i);
        }
        return new Blob([ia], { type: mimeString });
    },
    FormatDate: function (date) {        
        var d = new Date(date),
            month = '' + (d.getMonth() + 1),
            day = '' + d.getDate(),
            year = d.getFullYear();

        if (month.length < 2)
            month = '0' + month;
        if (day.length < 2)
            day = '0' + day;

        return [year, month, day].join('-');        
    }
}