// For an introduction to the Blank template, see the following documentation:
// http://go.microsoft.com/fwlink/?LinkID=397704
// To debug code on page load in cordova-simulate or on Android devices/emulators: launch your app, set breakpoints, 
// and then run "window.location.reload()" in the JavaScript Console.
(function () {
    "use strict";

    document.addEventListener( 'deviceready', onDeviceReady.bind( this ), false );

    function onDeviceReady() {
        // Handle the Cordova pause and resume events
        document.addEventListener( 'pause', onPause.bind( this ), false );
        document.addEventListener( 'resume', onResume.bind( this ), false );
        
        // TODO: Cordova has been loaded. Perform any initialization that requires Cordova here.
        //var parentElement = document.getElementById('deviceready');
        //var listeningElement = parentElement.querySelector('.listening');
        //var receivedElement = parentElement.querySelector('.received');
        //listeningElement.setAttribute('style', 'display:none;');
        //receivedElement.setAttribute('style', 'display:block;');


        //TODO
        //Enable when finished
        App.Auth.GetAuthTokenPromise(function (token) {
            if (token != "" && token != undefined){
                $('#choose-action-div').show();
                $('#logout-div').show();
            }
            else {                
                $("#login-div").show();
            }
        });

        $('#logout').on("click", function() {
            App.Auth.Logout();
        });

        //TODO
        //REMOVE
        //$("#blog-form .form-group").show()
        //$("#blog-submit-button").show()

        $('#login-submit').on("click", function (event) {
            event.preventDefault();            
            App.Auth.Login($('#login-form'), function (msg) {                
                $("#login-div").animate({ width: 'toggle' }, 350, "linear", function () {
                    $('#choose-action-div').animate({ width: 'toggle' }, 350, "linear");
                });
            }, function (msg) {
                console.log(msg);
            });

            
        });

        $('#test-submit').on("click", function (event) {
            event.preventDefault();

            App.Api.MakeAuthedRequest("umbraco/api/Imkcontentapi/hello", "GET", null, function (msg) {
                console.log(msg);
            }, function (msg) {
                console.log(msg);
            })
        });

        $('#create-post-button').on("click", function () {
            $("#choose-action-div").animate({ width: 'toggle' }, 350, "linear", function () {
                $('#blog-div').animate({ width: 'toggle' }, 350, "linear");
            });
        });

        $('#create-event-button').on("click", function () {
            $("#choose-action-div").animate({ width: 'toggle' }, 350, "linear", function () {
                $('#event-div').animate({ width: 'toggle' }, 350, "linear");
            });
        });


        //Blog-functionality

        $('#blog-camera-get-existing-button').on("click", function () {
            var options = {
                destinationType: Camera.DestinationType.DATA_URL,
            }     

            navigator.camera.getPicture(function (imageUri) {
                $('#blog-camera').val(imageUri);                
            }, function () {
                //TODO
                //Do something?                
            }, options);

        });

        $('#blog-camera-take-new-button').on("click", function () {    
            var options = {
                // Some common settings are 20, 50, and 100
                quality: 50,
                destinationType: Camera.DestinationType.DATA_URL,
                // In this app, dynamically set the picture source, Camera or photo gallery
                sourceType: Camera.PictureSourceType.CAMERA,
                encodingType: Camera.EncodingType.JPEG,
                mediaType: Camera.MediaType.PICTURE,
                allowEdit: true,
                correctOrientation: true  //Corrects Android orientation quirks
            }            

            navigator.camera.getPicture(function cameraSuccess(imageUri) {
                $('#blog-camera').val(imageUri);   

            }, function cameraError(error) {
                console.log("Unable to obtain picture: " + error, "app");

            }, options);
        });

        var lockNextClickBlog = false;
        $('#blog-next-button').on("click", function (event) {
            event.preventDefault();
            if (!lockNextClickBlog) {
                lockNextClickBlog = true;

                var visibleElement = $('#blog-form').find("div:visible");        

                var value = $("#" + $(visibleElement[0]).data("value-element")).val();                
                if (value == undefined || value == "") {
                    lockNextClickBlog = false;
                    $(visibleElement[0]).find(".errorLabel").show();
                }
                else {
                    $(".errorLabel").hide();
                    if (visibleElement.data("second-last") == true) {
                        $("#blog-next-button").animate({ width: 'toggle' }, 350, "linear", function () {
                            $("#blog-submit-button").animate({ width: 'toggle' }, 350, "linear", function () {
                                lockNextClickBlog = false;
                            });
                        });
                    }

                    var nextElement = visibleElement.next();

                    console.log(visibleElement);
                    console.log(nextElement);

                    visibleElement.animate({ width: 'toggle' }, 350, "linear", function () {
                        nextElement.animate({ width: 'toggle' }, 350, "linear", function () {
                            lockNextClickBlog = false;
                        });
                    });
                }
            }
        });       

        $('#blog-submit-button').on("click", function (event) {
            event.preventDefault();      
            App.Persist.Blog(App.Utils.SerializeForm($("#blog-form")));
        })        


        //Event-functionality

        $('#event-camera-take-new-button').on("click", function () {
            var options = {
                // Some common settings are 20, 50, and 100
                quality: 50,
                destinationType: Camera.DestinationType.DATA_URL,
                // In this app, dynamically set the picture source, Camera or photo gallery
                sourceType: Camera.PictureSourceType.CAMERA,
                encodingType: Camera.EncodingType.JPEG,
                mediaType: Camera.MediaType.PICTURE,
                allowEdit: true,
                correctOrientation: true  //Corrects Android orientation quirks
            }

            navigator.camera.getPicture(function cameraSuccess(imageUri) {
                $('#event-camera').val(imageUri);

            }, function cameraError(error) {
                console.log("Unable to obtain picture: " + error, "app");

            }, options);
        });

        $('#event-camera-get-existing-button').on("click", function () {
            var options = {
                destinationType: Camera.DestinationType.DATA_URL,
            }

            navigator.camera.getPicture(function (imageUri) {
                $('#event-camera').val(imageUri);
            }, function () {
                //TODO
                //Do something?                
            }, options);

        });     


        var lockNextClickEvent = false;
        $('#event-next-button').on("click", function (event) {
            event.preventDefault();
            if (!lockNextClickEvent) {
                lockNextClickEvent = true;

                var visibleElement = $('#event-form').find("div:visible");

                var value = $("#" + $(visibleElement[0]).data("value-element")).val();
                if (value == undefined || value == "") {
                    lockNextClickEvent = false;
                    $(visibleElement[0]).find(".errorLabel").show()
                }
                else {
                    $(".errorLabel").hide();
                    if (visibleElement.data("second-last") == true) {
                        $("#event-next-button").animate({ width: 'toggle' }, 350, "linear", function () {
                            $("#event-submit-button").animate({ width: 'toggle' }, 350, "linear", function () {
                                lockNextClickEvent = false;
                            });
                        });
                    }

                    var nextElement = visibleElement.next();

                    visibleElement.animate({ width: 'toggle' }, 350, "linear", function () {
                        nextElement.animate({ width: 'toggle' }, 350, "linear", function () {
                            lockNextClickEvent = false;
                        });
                    });
                }
            }
        });     


        $('#event-submit-button').on("click", function (event) {
            event.preventDefault();
            App.Persist.Event(App.Utils.SerializeForm($("#event-form")));
        })        


    };

    function onPause() {
        // TODO: This application has been suspended. Save application state here.
    };

    function onResume() {
        // TODO: This application has been reactivated. Restore application state here.
    };


} )();