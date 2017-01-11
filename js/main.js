/* jshint browser: true, devel: true, indent: 2, curly: true, eqeqeq: true, futurehostile: true, latedef: true, undef: true, unused: true */
/* global jQuery, $, document, Site, L */

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
  map: null,
  pos: {
    lat: 0,
    long: 0
  },
  coordinateArray: [],

  init: function() {
    var _this = this;

    _this.map = L.map('map').setView([0, 0], 2);

    _this.tileMap();

    if (navigator.geolocation) {

      _this.flyToDevicePos();

    } else {
      alert('your browser sucks');
    }
  },

  tileMap: function() {
    var _this = this;

    var tileLayer = L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token=pk.eyJ1IjoibWFwYm94IiwiYSI6ImNpandmbXliNDBjZWd2M2x6bDk3c2ZtOTkifQ._QA7i5Mpkd_m30IGElHziw', {
      maxZoom: 20,
      id: 'mapbox.streets'
    }).addTo(_this.map);
  },

  getDevicePos: function(callback) {
    var _this = this;

    navigator.geolocation.getCurrentPosition(function(position) {
      _this.pos.lat = position.coords.latitude;
      _this.pos.long = position.coords.longitude;

      callback();
    });
  },

  flyToDevicePos: function() {
    var _this = this;

    _this.getDevicePos(function() {
      _this.map.flyTo([_this.pos.lat, _this.pos.long], 20, {
        animate: true
      });

      _this.stateDraw();
      _this.bindStates();
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
        _this.trackMouse(e);
      });
    });
  },

  trackMouse: function(e) {
    var _this = this;

    _this.coordinateArray.push([e.latlng.lat, e.latlng.lng]);
  },

  stateDraw: function() {
    var _this = this;

    $('#draw').prop('disabled', true);
    $('#move').prop('disabled', false);
    _this.map.locate({
      watch: true,
      setView: true
    });
    _this.moveDisable();
    _this.draw();
  },

  stateMove: function() {
    var _this = this;
    
    $('#draw').prop('disabled', false);
    $('#move').prop('disabled', true);
    _this.map.stopLocate();
    _this.moveEnable();
    _this.map.off('mouseup mousedown');
  },

  moveDisable: function() {
    var _this = this;

    _this.map.dragging.disable();
    _this.map.touchZoom.disable();
    _this.map.doubleClickZoom.disable();
    _this.map.scrollWheelZoom.disable();
    _this.map.boxZoom.disable();
    _this.map.keyboard.disable();
    _this.map.zoomControl.disable();
  },

  moveEnable: function() {
    var _this = this;

    _this.map.dragging.enable();
    _this.map.touchZoom.enable();
    _this.map.doubleClickZoom.enable();
    _this.map.scrollWheelZoom.enable();
    _this.map.boxZoom.enable();
    _this.map.keyboard.enable();
    _this.map.zoomControl.enable();
  },

  bindStates: function() {
    var _this = this;

    $('#move').on('click', function() {
      _this.stateMove();
    });

    $('#draw').on('click', function() {
      _this.stateDraw();
    });

    $('#toggle-map').on('click', function() {
      $('.leaflet-tile-container').toggleClass('u-invisible');
    });
  }
};

jQuery(document).ready(function () {
  'use strict';

  Site.init();

});