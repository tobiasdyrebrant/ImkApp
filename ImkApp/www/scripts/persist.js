var App = App || {};
App.Persist = {
    Blog: function (serializedForm, success, error) {
        var form = new FormData();
        form.append("", App.Utils.DataURItoBlob(serializedForm["blog-camera"]), App.Utils.GenerateRandomString() + ".jpeg");
        form.append("Heading", serializedForm["blog-heading"]);
        form.append("Color", serializedForm["blog-color"]);
        form.append("Category", serializedForm["blog-category"]);
        form.append("Text", serializedForm["blog-text"]);
        form.append("Preamble", serializedForm["blog-preamble"]);

        var options = {
            "async": true,
            "crossDomain": true,
            "processData": false,
            "contentType": false,
            "mimeType": "multipart/form-data",
            "data": form
        };

        App.Api.MakeAuthedRequest("umbraco/api/imkcontentapi/createblog", "POST", null, function () {
            success();
        }, function () {
            error();
        }, options);
    },
    Event: function (serializedForm, success, error) {
        var form = new FormData();
        form.append("", App.Utils.DataURItoBlob(serializedForm["event-camera"]), App.Utils.GenerateRandomString() + ".jpeg");
        form.append("Heading", serializedForm["event-heading"]);
        form.append("Color", serializedForm["event-color"]);        
        form.append("Text", serializedForm["event-text"]);
        form.append("Preamble", serializedForm["event-preamble"]);
        form.append("StartDate", serializedForm["event-startdate"]);

        var options = {
            "async": true,
            "crossDomain": true,
            "processData": false,
            "contentType": false,
            "mimeType": "multipart/form-data",
            "data": form
        };

        App.Api.MakeAuthedRequest("umbraco/api/imkcontentapi/createevent", "POST", null, function () {
            success();
        }, function () {
            error();
        }, options);


    },
}