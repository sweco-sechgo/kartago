"use strict";

(function () {
	$(function () {
		var map = new Kartago("map", {
			"name": "kartago demo",

			"modules": [{
				"name": "draw",
				"type": "dropdown",
				"options": {
					"enableText": false
				}
			}]
		});

		map.init();
	});

	// $.getJSON("config.js", function (config) {
	// 	var map = new Kartago("map");
	// 	map.init(config);
	// });

})();