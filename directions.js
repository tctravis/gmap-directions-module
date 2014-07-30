//============ 4. direction finder
(function($) {


  var methods = {
    init: function(options) {

      //define init variables
      var settings = $.extend({
        travelMode: 'DRIVING'
      }, options);

      return this.each(function() {

        var map,
          mapCanvas,
          directionsModule,
          directionsForm,
          originField,
          directionsDisplay,
          travelMode,
          directionsService = new google.maps.DirectionsService(),
          geocoder = new google.maps.Geocoder(),
          silverstoneLoc = new google.maps.LatLng(52.074706, -1.021693),
          visitorLoc = false;

        directionsModule = $(this);
        directionsForm = directionsModule.find('form');
        originField = directionsForm.find('#from');
        findLocation = directionsModule.find('#find-location');
        mapCanvas = directionsModule.find('#map-canvas')[0];
        travelMode = settings.travelMode,
        travelModeLinks = directionsModule.find('.travel-mode a'),

        directionsDisplay = new google.maps.DirectionsRenderer();

        //set default text for directions display options
        var travelModeText = {
          TRANSIT: 'by public transport',
          DRIVING: 'by car',
          WALKING: 'on foot',
          BICYCLING: 'by bike'
        };

        //Google Map default settings
        var mapOptions = {
          zoom: 10,
          mapTypeId: google.maps.MapTypeId.ROADMAP,
          center: silverstoneLoc
        };
        map = new google.maps.Map(mapCanvas, mapOptions);
        directionsDisplay.setMap(map);

        //add initial marker for silverstone
        addMarker(silverstoneLoc, 'Silverstone Circuit');

        bindUIActions();

        function bindUIActions() {
          originField.on('focus.directionsMap', function() {
            $(this).errorMessage('remove');
          });
          directionsForm.on('submit.directionsMap', function(e) {
            e.preventDefault();
            originField.errorMessage('remove');
            codeAddress();
          });
          travelModeLinks.on('click.directionsMap', function(e) {
            e.preventDefault();
            originField.errorMessage('remove');
            travelModeLinks.removeClass('current');
            $(this).addClass('current');
            if (visitorLoc !== false) {
              travelMode = $(this).attr('data-mode');
              calcRoute();
            } else {
              originField.errorMessage('show', 'Please enter your location');
            }
          });
          findLocation.on('click', function(e) {
            e.preventDefault();
            findUserLocation();
          });
        }

        function findUserLocation() {
          if (Modernizr.geolocation) {
            var timeoutVal = 10 * 1000 * 1000;
            navigator.geolocation.getCurrentPosition(
              function(position) {
                visitorLoc = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);

                geocoder.geocode({
                  'latLng': visitorLoc
                }, function(results, status) {
                  if (status == google.maps.GeocoderStatus.OK) {
                    if (results[1]) {
                      var placename = results[1].formatted_address;
                      originField.val(placename).focus();
                      calcRoute();
                    }
                  } else {
                    originField.errorMessage('show', 'Could not find your location');
                  }
                });
              },
              function() {
                originField.errorMessage('show', 'Your position could not be detected');
              }, {
                enableHighAccuracy: true,
                timeout: timeoutVal,
                maximumAge: 0
              }
            );
          } else {
            originField.errorMessage('show', 'Your device does not support this feature');
          }
        }

        function addMarker(coords, markerTitle) {
          var marker = new google.maps.Marker({
            position: coords,
            map: map,
            title: markerTitle
          });
        }

        function codeAddress() {
          geocoder.geocode({
            'address': originField.val()
          }, function(results, status) {
            if (status == google.maps.GeocoderStatus.OK) {
              visitorLoc = results[0].geometry.location;
              calcRoute();
            } else {
              visitorLoc = false;
              originField.errorMessage('show', 'This location has not been found');
            }
          });
        }


        function calcRoute() {
          var selectedMode = 'DRIVING';
          var directionsTextPanel = directionsModule.find('#directions-text')[0];
          var request = {
            origin: visitorLoc,
            destination: silverstoneLoc,
            travelMode: google.maps.TravelMode[travelMode]
          };
          directionsService.route(request, function(response, status) {
            if (status == google.maps.DirectionsStatus.OK) {
              directionsDisplay.setDirections(response);
              directionsDisplay.setPanel(directionsTextPanel);
            } else {
              originField.errorMessage('show', 'Directions ' + travelModeText[travelMode] + ' from your location not available');
            }
          });
        }

      });

    }
  };

  $.fn.directionsMap = function(method) {

    // Method calling logic
    if (methods[method]) {
      return methods[method].apply(this, Array.prototype.slice.call(arguments, 1));
    } else if (typeof method === 'object' || !method) {
      return methods.init.apply(this, arguments);
    } else {
      $.error('Method ' + method + ' does not exist on jQuery.directionsMap');
    }

  };

})(jQuery);