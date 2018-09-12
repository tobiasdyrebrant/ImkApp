﻿// For an introduction to the Blank template, see the following documentation:
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


        //$('#test').on("click", function () {
        //    console.log(navigator.camera);
        //    navigator.camera.getPicture(function () {
        //        console.log("success");
        //    }, function () {
        //        console.log("failed");
        //    });
        //})

        $('#login-submit').on("click", function (event) {
            event.preventDefault();
            $("#login-div").hide("slide", { direction: "right" }, 350, function () {
                $('#choose-action-div').show("slide", { direction: "left" }, 350);
            });

            //$("#login-div").animate({ width: 'toggle' }, 350, "linear", function () {
            //    $('#choose-action-div').animate({ width: 'toggle' }, 350, "linear");
            //});
            
        });

        

    };

    function onPause() {
        // TODO: This application has been suspended. Save application state here.
    };

    function onResume() {
        // TODO: This application has been reactivated. Restore application state here.
    };


} )();