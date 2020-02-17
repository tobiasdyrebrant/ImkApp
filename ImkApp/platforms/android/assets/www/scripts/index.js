// For an introduction to the Blank template, see the following documentation:
// http://go.microsoft.com/fwlink/?LinkID=397704
// To debug code on page load in cordova-simulate or on Android devices/emulators: launch your app, set breakpoints, 
// and then run "window.location.reload()" in the JavaScript Console.
(function () {
    "use strict";

    document.addEventListener( 'deviceready', onDeviceReady.bind( this ), false );

    function onDeviceReady() {
        // Constants
        var animateShowOptions = {
            opacity: 1,
            height: "toggle"
        };

        var animateHideOptions = {
            opacity: 0.25,
            height: "toggle"
        }

        var datePickerOptions = {
            date: new Date(),
            mode: 'datetime',
            is24Hour: true,
            androidTheme: 5
        }

        $('#error-retry-button').on("click",
            function () {                
                window.location.reload();
            });

        $('#success-back-button').on("click",
            function() {
                window.location.reload();
            });

        $('#cancel').on("click", function () {
            window.location.reload();
        })



        // Handle the Cordova pause and resume events
        document.addEventListener( 'pause', onPause.bind( this ), false );
        document.addEventListener( 'resume', onResume.bind( this ), false );
        
        // TODO: Cordova has been loaded. Perform any initialization that requires Cordova here.
        //var parentElement = document.getElementById('deviceready');
        //var listeningElement = parentElement.querySelector('.listening');
        //var receivedElement = parentElement.querySelector('.received');
        //listeningElement.setAttribute('style', 'display:none;');
        //receivedElement.setAttribute('style', 'display:block;');

        App.Auth.GetAuthTokenPromise(function (token) {
            if (token != "" && token != undefined) {
                //Attempt handshake to validate token.
                App.Api.MakeAuthedRequest("umbraco/api/Imkcontentapi/hello", "GET", null, function (msg) {
                    //console.log(msg);
                }, function (msg) {
                    //console.log(msg);
                });

                $('#choose-action-div').show();
                $('#logout').show();                
            }
            else {                          

                $("#login-div").show();
            }
        });

        $('#logout').on("click", function() {
            App.Auth.Logout();
        });        

        $('#login-submit').on("click", function (event) {
            event.preventDefault();                        
            App.Auth.Login($('#login-form'), function (msg) {                
                $("#login-div").animate(animateHideOptions, 350, "linear", function () {
                    $('#choose-action-div').animate(animateShowOptions, 350, "linear");
                    $("#logout").show();
                });
            }, function (msg) {
                //console.log(msg);
            });

            
        });

        $('#create-post-button').on("click", function () {
            $("#choose-action-div").animate(animateHideOptions, 350, "linear", function () {
                $('#blog-div').animate(animateShowOptions, 350, "linear");
                $('#cancel').show();
            });
        });

        $('#create-event-button').on("click", function () {
            $("#choose-action-div").animate(animateHideOptions, 350, "linear", function () {
                $('#event-div').animate(animateShowOptions, 350, "linear");
                $('#cancel').show();
            });
        });


        //Blog-functionality

        var nextAfterCameraBlog = function() {
            $('#blog-next-button').click();
            $('#blog-next-button').show();
            $('#blog-previous-button').show();
        }

        $('#blog-camera-get-existing-button').on("click", function () {
            var options = {
                destinationType: Camera.DestinationType.DATA_URL,
                sourceType: Camera.PictureSourceType.PHOTOLIBRARY
            }     

            navigator.camera.getPicture(function (imageUri) {
                $('#blog-camera').val(imageUri);
                nextAfterCameraBlog();
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
                nextAfterCameraBlog();
            }, function cameraError(error) {
                //console.log("Unable to obtain picture: " + error, "app");

            }, options);
        });


        $('#blog-camera-no-image-button').on("click",
            function () {
                $('#blog-camera').val("");
                nextAfterCameraBlog();
            });

        var lockNextClickBlog = false;
        $('#blog-next-button').on("click", function (event) {
            event.preventDefault();
            if (!lockNextClickBlog) {
                lockNextClickBlog = true;

                var visibleElement = $('#blog-form').find("div:visible");        

                var value = $("#" + $(visibleElement[0]).data("value-element")).val();

                if ((value == undefined || value == "") && $(visibleElement[0]).data("possibly-empty") !== true) {
                    lockNextClickBlog = false;
                    $(visibleElement[0]).find(".errorLabel").show();
                }
                else {

                    $(".errorLabel").hide();
                    if (visibleElement.data("second-last") == true) {
                        $("#blog-next-button").animate(animateHideOptions, 350, "linear", function () {
                            $("#blog-submit-button").animate(animateShowOptions, 350, "linear", function () {
                                lockNextClickBlog = false;
                            });
                        });
                    }


                    var nextElement = visibleElement.next();

                    $("#blog-div .step-counter h4").text($(nextElement[0]).data("step"));

                    visibleElement.animate(animateHideOptions, 350, "linear", function () {
                        nextElement.animate(animateShowOptions, 350, "linear", function () {
                            lockNextClickBlog = false;
                        });
                    });
                }
            }
        });

        var lockPreviousClickBlog = false;
        $('#blog-previous-button').on("click",
            function(event) {
                event.preventDefault();
                if (!lockPreviousClickBlog) {
                    lockPreviousClickBlog = true;

                    var visibleElement = $('#blog-form').find("div:visible");

                    if (visibleElement.data("last-item")) {
                        $("#blog-next-button").animate(animateShowOptions, 350, "linear");

                        $('#blog-submit-button').hide();
                    }

                    var previousElement = visibleElement.prev();

                    $("#blog-div .step-counter h4").text($(previousElement[0]).data("step"));

                    if (previousElement.data("first-item") == true) {
                        $('#blog-next-button').hide();
                        $('#blog-previous-button').hide();
                    }

                    visibleElement.animate(animateHideOptions,
                        350,
                        "linear",
                        function() {
                            previousElement.animate(animateShowOptions,
                                350,
                                "linear",
                                function() {
                                    lockPreviousClickBlog = false;
                                });
                        });
                    
                }
            });


        $('#blog-submit-button').on("click",
            function(event) {
                event.preventDefault();
                App.Persist.Blog(App.Utils.SerializeForm($("#blog-form")), function () {
                    $('#blog-div').hide();
                    $('#success-div').show();
                    $('#success-div-text-blog').show();
                }, function () {
                    $('#blog-div').hide();
                    $('#error-div').show();
                });
            });  


        //Event-functionality

        var nextAfterCameraEvent = function() {
            $('#event-next-button').click();
            $('#event-next-button').show();
            $('#event-previous-button').show();
        }


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
                nextAfterCameraEvent();

            }, function cameraError(error) {
                //console.log("Unable to obtain picture: " + error, "app");

            }, options);
        });

        $('#event-camera-get-existing-button').on("click", function () {
            var options = {
                destinationType: Camera.DestinationType.DATA_URL,
                sourceType: Camera.PictureSourceType.PHOTOLIBRARY
            }

            navigator.camera.getPicture(function (imageUri) {
                $('#event-camera').val(imageUri);
                nextAfterCameraEvent();
            }, function () {
                //TODO
                //Do something?                
            }, options);
        });

        $('#event-camera-no-image-button').on("click", function () {
            $('#event-camera').val("");
            nextAfterCameraEvent();
        });

        function datePickerSuccess(date) {            
            $('#event-startdate').val(moment(date).format("YYYY-MM-DD HH:mm"));
        }

        function datePickerError(error) { // Android only
            console.log(error);
        }


        $('#event-startdate').on("click",
            function() {
                datePicker.show(datePickerOptions, datePickerSuccess, datePickerError);
            });


        var lockNextClickEvent = false;
        $('#event-next-button').on("click", function (event) {
            if (!lockNextClickEvent) {
                lockNextClickEvent = true;

                var visibleElement = $('#event-form').find("div:visible");

                var value = $("#" + $(visibleElement[0]).data("value-element")).val();
                if ((value == undefined || value == "") && $(visibleElement[0]).data("possibly-empty") !== true) {
                    lockNextClickEvent = false;
                    $(visibleElement[0]).find(".errorLabel").show();
                }
                else {
                    $(".errorLabel").hide();
                    if (visibleElement.data("second-last") == true) {
                        $("#event-next-button").animate(animateHideOptions, 350, "linear", function () {
                            $("#event-submit-button").animate(animateShowOptions, 350, "linear", function () {
                                lockNextClickEvent = false;
                            });
                        });
                    }

                    $('#event-next-button').show();

                    var nextElement = visibleElement.next();
                    $("#event-div .step-counter h4").text($(nextElement[0]).data("step"));

                    visibleElement.animate(animateHideOptions, 350, "linear", function () {
                        nextElement.animate(animateShowOptions, 350, "linear", function () {
                            lockNextClickEvent = false;
                        });
                    });
                }
            }
        });

        var lockPreviousClickEvent = false;
        $('#event-previous-button').on("click",
            function(event) {
                event.preventDefault();
                if (!lockPreviousClickEvent) {
                    lockPreviousClickEvent = true;

                    var visibleElement = $('#event-form').find("div:visible");

                    if (visibleElement.data("last-item")) {
                        $("#event-next-button").animate(animateShowOptions, 350, "linear");

                        $('#event-submit-button').hide();
                    }

                    var previousElement = visibleElement.prev();
                    $("#event-div .step-counter h4").text($(previousElement[0]).data("step"));

                    if (previousElement.data("first-item") == true) {
                        $('#event-next-button').hide();
                        $('#event-previous-button').hide();
                    }

                    visibleElement.animate(animateHideOptions,
                        350,
                        "linear",
                        function() {
                            previousElement.animate(animateShowOptions,
                                350,
                                "linear",
                                function() {
                                    lockPreviousClickEvent = false;
                                });
                        });

                }
            });



        $('#event-submit-button').on("click",
            function(event) {
                event.preventDefault();
                App.Persist.Event(App.Utils.SerializeForm($("#event-form")),
                    function() {
                        $('#event-div').hide();
                        $('#success-div').show();
                        $('#success-div-text-event').show();
                    },
                    function() {
                        $('#event-div').hide();
                        $('#error-div').show();
                    });
            });


    };

    function onPause() {
        // TODO: This application has been suspended. Save application state here.
    };

    function onResume() {
        // TODO: This application has been reactivated. Restore application state here.
    };


} )();