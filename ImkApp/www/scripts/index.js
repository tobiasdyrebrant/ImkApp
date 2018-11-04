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
        //App.Auth.GetAuthTokenPromise(function (token) {
        //    if (token != "" && token != undefined){
        //        $('#choose-action-div').show();
        //    }
        //    else {                
        //        $("#login-div").show();
        //    }
        //});

        //TODO
        //REMOVE
        $("#blog-form .form-group").show()

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
                $('#post-div').animate({ width: 'toggle' }, 350, "linear");
            });
        });

        $('#create-event-button').on("click", function () {
            $("#choose-action-div").animate({ width: 'toggle' }, 350, "linear", function () {
                $('#event-div').animate({ width: 'toggle' }, 350, "linear");
            });
        });



        $('#blog-camera-get-existing-button').on("click", function () {

            var options = {

                destinationType: Camera.DestinationType.DATA_URL,

            }     
            navigator.camera.getPicture(function (imageUri) {
                $('#blog-camera').val(imageUri);
                console.log(imageUri);
            }, function () {
                //TODO
                //Do something?
                console.log("failed");
                }, options);

        });

        $('#blog-camera-take-new-button').on("click", function () {    
            var options = {
                // Some common settings are 20, 50, and 100
                quality: 50,
                destinationType: Camera.DestinationType.FILE_URI,
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


        var lockNextClick = false;
        $('#blog-next-button').on("click", function (event) {
            event.preventDefault();
            if (!lockNextClick) {
                lockNextClick = true;

                var visibleElement = $('#blog-form').find("div:visible");        
                
                if (visibleElement.data("second-last") == true) {                    
                    $("#blog-next-button").animate({ width: 'toggle' }, 350, "linear", function () {
                        $("#blog-submit-button").animate({ width: 'toggle' }, 350, "linear", function () {
                            lockNextClick = false;
                        });
                    });
                }

                var nextElement = visibleElement.next();

                visibleElement.animate({ width: 'toggle' }, 350, "linear", function () {
                    nextElement.animate({ width: 'toggle' }, 350, "linear", function () {
                        lockNextClick = false;
                    });
                });                
            }
        });       

        $('#blog-submit-button').on("click", function (event) {
            event.preventDefault();      
            App.Persist.Blog(App.Utils.SerializeForm($("#blog-form")));
        })        

    };

    function onPause() {
        // TODO: This application has been suspended. Save application state here.
    };

    function onResume() {
        // TODO: This application has been reactivated. Restore application state here.
    };


} )();