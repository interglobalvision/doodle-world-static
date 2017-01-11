/* jshint browser: true, devel: true, indent: 2, curly: true, eqeqeq: true, futurehostile: true, latedef: true, undef: true, unused: true */
/* global jQuery, $, document, Site, Modernizr */

Site = {
  mobileThreshold: 601,
  init: function() {
    var _this = this;

    $(window).resize(function(){
      _this.onResize();
    });

    _this.Map.init();
  },

  onResize: function() {
    var _this = this;

  },

  fixWidows: function() {
    // utility class mainly for use on headines to avoid widows [single words on a new line]
    $('.js-fix-widows').each(function(){
      var string = $(this).html();
      string = string.replace(/ ([^ ]*)$/,'&nbsp;$1');
      $(this).html(string);
    });
  },
};

Site.Map = {
  map,

  init: function() {
    var _this = this;

    navigator.geolocation.getCurrentPosition(function(position) {
      _this.initMap(position.coords.latitude, position.coords.longitude);
    });
  },

  initMap: function(lat, long) {
    var _this = this;

    _this.map = L.map('map', {
      dragging: false
    }).setView([lat, long], 20);

    L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token=pk.eyJ1IjoibWFwYm94IiwiYSI6ImNpandmbXliNDBjZWd2M2x6bDk3c2ZtOTkifQ._QA7i5Mpkd_m30IGElHziw', {
      maxZoom: 20,
      id: 'mapbox.streets'
    }).addTo(_this.map);

    var coordinateArray = [];

    _this.map.on('mouseup', function() {

      _this.map.off("mousemove");

      L.polyline(coordinateArray, {color: '#f94000'}).addTo(_this.map);

      console.log(coordinateArray);

      coordinateArray = [];

      navigator.geolocation.getCurrentPosition(function(position) {
        _this.map.panTo(new L.LatLng(position.coords.latitude, position.coords.longitude));
      });
     

    }).on('mousedown', function() {

      _this.map.on("mousemove", function(e) {
        trackPoints(e)
      });

    });

    function trackPoints(e) {
      coordinateArray.push([e.latlng.lat, e.latlng.lng]);
    }
  },
}

jQuery(document).ready(function () {
  'use strict';

  Site.init();

});