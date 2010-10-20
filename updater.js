//http://help.adobe.com/en_US/air/build/WS5b3ccc516d4fbf351e63e3d118666ade46-7ff2.html#WS96E10DFB-39A5-4488-A666-15B9B46C5EE8
( function() {
	var updater = new air.update.ApplicationUpdaterUI();
	updater.configurationFile = new air.File("app:/updateConfig.xml");
	updater.isCheckForUpdateVisible = true;
	updater.initialize();
	// updater.currentVersion;
	setTimeout( function() {
		updater.checkNow();
	}, 30000 );
} )();
