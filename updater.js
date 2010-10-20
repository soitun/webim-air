(function() {
	var updater = new air.update.ApplicationUpdaterUI();
	updater.configurationFile = new air.File("app:/updateConfig.xml");
	updater.isCheckForUpdateVisible = true;
	updater.initialize();
	// updater.currentVersion;

	setTimeout( function() {
		updater.checkNow();
	}, 30000 );
} )();
