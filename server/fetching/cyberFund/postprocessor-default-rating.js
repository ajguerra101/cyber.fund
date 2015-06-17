Meteor.startup(function() {

	CF.processing.addPostprocessor(function(source, timestamp, data) {
		if (source !== "cyberFund") {
			return;
		}

		CurrentData.update({
			rating: { $exists: 0 }
		}, {
			$set: { rating: 0 }
		}, {
			multi: true
		});
	});

});
