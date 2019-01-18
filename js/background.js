browser.tabs.onCreated.addListener( function (tab) {
			browser.tabs.executeScript(tab.id, {file: 'audiomanager.js'});
		});
