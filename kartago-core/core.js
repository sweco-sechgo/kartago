"use strict";

window.Kartago = (function () {
	// private static
	var modules = {};

	function getMenuItem(type, id) {
		if (type === "dropdown") {
			return $('<li id="' + id + '" class="dropdown" data-bind="template: \'dropdown-template\'"></li>');
		} else {
			throw "Unknown menu type: " + type;
		}
	}

	// constructor
	var core = function (mapId, config) {
		// private fields
		var _mapId = mapId;
		var _config = config;
		var _modules = [];
		var _map = null;
		var $wrapper = $("#" + mapId);
		var $toolContainer = null;
		var $map = null;


		// public fields (this instance only)

		// public methods (this instance only)
		this.init = function () {
			this.initGui();
			this.initMap();
			this.initModules();
		};

		this.initGui = function () {

			var $toolbar =
				$('<div class="navbar navbar-default kartago-menu" role="navigation">\
					<div class="container">\
						<ul class="nav navbar-nav tool-container">\
							<a class="navbar-brand" href="#">kartago</a>\
						</ul>\
					</div>\
				</div>');

			$toolbar.appendTo($wrapper);
			$toolContainer = $(".tool-container");
		};

		this.initMap = function () {
			$('<div id="map1" class="kartago-map"/>').appendTo($wrapper);

			_map = new OpenLayers.Map("map1", {
				controls: []
			});

			var layer = new OpenLayers.Layer.OSM("Simple OSM Map");
			_map.addLayer(layer);
			_map.setCenter(
				new OpenLayers.LonLat(-71.147, 42.472).transform(
				new OpenLayers.Projection("EPSG:4326"),
				_map.getProjectionObject()
			), 12);

			_map.addControl(new OpenLayers.Control.Navigation());
		};

		this.initModules = function () {
			for (var i = 0; i < _config.modules.length; i++) {
				var cfg = _config.modules[i];
				var module = core.getModuleInstance(cfg.name, cfg.options, this);

				module.init();
				_modules.push(module);

				getMenuItem(cfg.type, module.viewId).appendTo($toolContainer);

				ko.applyBindings(module, document.getElementById(module.viewId));
			}

			console.log("Loaded modules", _modules);
		};

		this.addLayer = function (layer) {
			_map.addLayer(layer);
		};

		this.addControl = function (layer) {
			_map.addControl(layer);
		};
	};



	// public static
	core.registerModule = function (name, module) {
		if (modules[name]) {
			throw "Module already registered";
		}

		modules[name] = module;
	};

	core.getModules = function () {
		return modules;
	};

	core.getModuleInstance = function (name, config, coreRef) {
		if (!modules[name]) {
			throw "Module not registered: " + name;
		}

		var module = new modules[name](coreRef);

		_.extend(module, config);

		return module;
	};

	// public (shared across instances), extension points
	core.prototype = {
		announce: function () {
			alert('Hi there! My name is "' + this.getName());
		}
	};

	return core;
})();
// "use strict";

// // Core
// (function (window) {

// 	var testAttr = 10;

// 	// window.Kartago =
// 	var cls =  function (mapId, config) {
// 		var _mapId = mapId;
// 		//var _config = config;
// 		//var $map = $(mapId);
		
// 		var _map = new OpenLayers.Map(mapId);
// 		var layer = new OpenLayers.Layer.OSM("Simple OSM Map");
// 		_map.addLayer(layer);
// 		_map.setCenter(
// 			new OpenLayers.LonLat(-71.147, 42.472).transform(
// 			new OpenLayers.Projection("EPSG:4326"),
// 			_map.getProjectionObject()
// 		), 12);



// 		// console.log(window.Kartago);

// 		// var measure = new window.Kartago.plugins.measure();
// 		// _.extend(measure, config.plugins.measure);
// 		// console.log(measure);
// 	};

// 	// window.Kartago
// 	cls.test = function () {
// 		console.log(testAttr);
// 	};

// 	// window.Kartago
// 	cls.prototype = {
// 		getMapId: function () {
// 			return this._mapId;
// 		},

// 		on: function () {

// 		},
// 		setCursor: function (cursor) {
// 			$('#map').css({cursor: cursor});
// 		}
// 	};

// 	//window.Kartago.plugins = {};
// 	window.Kartago = cls;
// })(window);
