"use strict";

// Measure plugin
(function (Kartago) {
	// Constructor
	var measure =  function () {
		this.settingA = 1;

		this.settingB = 3;
	};

	// public (shared across instances)
	measure.prototype = {
		render: function () {
		}
	};

	Kartago.registerModule("measure", measure);
})(Kartago);