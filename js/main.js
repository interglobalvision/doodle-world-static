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
  coordinateArray: [],

  init: function() {
    var _this = this;

    _this.map = L.map('map', {
      dragging: false
    }).setView([0, 0], 2);

    _this.tileMap();

    _this.flyToDevicePos();

    _this.draw();
  },

  tileMap: function() {
    var _this = this;

    L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token=pk.eyJ1IjoibWFwYm94IiwiYSI6ImNpandmbXliNDBjZWd2M2x6bDk3c2ZtOTkifQ._QA7i5Mpkd_m30IGElHziw', {
      maxZoom: 20,
      id: 'mapbox.streets'
    }).addTo(_this.map);
  },

  flyToDevicePos: function() {
    var _this = this;

    navigator.geolocation.getCurrentPosition(function(position) {
      _this.map.flyTo([position.coords.latitude, position.coords.longitude], 20, {
        animate: true
      });
    });
  },

  draw: function() {
    var _this = this;

    _this.map.on('mouseup', function() {
      _this.map.off("mousemove");
      L.polyline(_this.coordinateArray, {color: 'black'}).addTo(_this.map);
      _this.coordinateArray = [];
    }).on('mousedown', function() {
      _this.map.on("mousemove", function(e) {
        _this.trackMouse(e)
      });
    });
  },

  trackMouse: function(e) {
    var _this = this;

    _this.coordinateArray.push([e.latlng.lat, e.latlng.lng]);
  }
}

jQuery(document).ready(function () {
  'use strict';

  Site.init();

});