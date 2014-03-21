"use strict";



// Draw plugin
(function (Kartago) {

	// Constructor
	var draw = function (core) {
		// configuration
		this.enablePoint = true;
		this.enableLine = true;
		this.enablePolygon = true;
		this.enableText = true;

		// private fields
		var _core = core;
		var _layers = null;
		var _controls = null;
		var _activeControl = null;
		var _that = this;

		// private methods
		function activateControl(control) {
			if (_activeControl !== null) {
				_activeControl.deactivate();
			}

			control.activate();
			_activeControl = control;
		}

		// public instance methods
		this.init = function () {
			_layers = {
				'line': new OpenLayers.Layer.Vector("_drawline"),
				'polygon': new OpenLayers.Layer.Vector("_drawpolygon"),
				'point': new OpenLayers.Layer.Vector("_drawpoint"),
				'text': new OpenLayers.Layer.Vector("_drawtext")
			};

			for (var lKey in _layers) {
				_core.addLayer(_layers[lKey]);
			}

			_controls = {
				'line': new OpenLayers.Control.DrawFeature(_layers['line'], OpenLayers.Handler.Path),
				'polygon': new OpenLayers.Control.DrawFeature(_layers['polygon'], OpenLayers.Handler.Polygon),
				'point': new OpenLayers.Control.DrawFeature(_layers['point'], OpenLayers.Handler.Point),
				'text': new OpenLayers.Control.DrawFeature(_layers['text'], OpenLayers.Handler.Point)
			};

			for (var cKey in _controls) {
				_core.addControl(_controls[cKey]);
			}
		};

		this.commandDraw = function (data, event) {
			_that.inactive(false);
			_that.name(data.name);
			_that.iconClass("glyphicon glyphicon-remove");
			activateControl(_controls[data.id]);
		};

		this.commandClear = function (data, event) {
			for (var lKey in _layers) {
				_layers[lKey].removeAllFeatures();
			}
		};

		// View Model
		this.viewId = "draw-command";

		this.name = ko.observable("Rita");

		this.iconClass = ko.observable("glyphicon glyphicon-pencil");

		this.inactive = ko.observable(true);

		this.defaultCommand = function (data, event) {
			if (_activeControl !== null) {
				// The drop down should not be dropped down...
				event.stopPropagation();

				_that.name("Rita");
				_that.iconClass("glyphicon glyphicon-pencil");
				_that.inactive(true);

				_activeControl.deactivate();
				_activeControl = null;
			}
		};

		this.commands = [{
			"id": "point",
			"name": "Punkt",
			"handler": this.commandDraw
		}, {
			"id": "line",
			"name": "Linje",
			"handler": this.commandDraw
		}, {
			"id": "polygon",
			"name": "Yta",
			"handler": this.commandDraw
		}, {
			"id": "clear",
			"name": "Rensa",
			"handler": this.commandClear
		}];
	};

	// public shared methods
	draw.prototype = {
		getStyle: function (drawType) {

		}
	};

	// register module with Kartago core
	Kartago.registerModule("draw", draw);
})(Kartago);