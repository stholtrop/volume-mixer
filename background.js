const MESSAGES = {
	SET_GAIN: 'SET_GAIN',
	GET_STATE: 'GET_STATE',
	GIVE_PRIORITY: 'GIVE_PRIORITY',
	REMOVE_PRIORITY: 'REMOVE_PRIORITY',
	START_PRIORITY: 'START_PRIORITY',
	END_PRIORITY: 'END_PRIORITY'
} 

browser.runtime.onMessage.addListener(function (msg, sender, response) {
		switch (msg.key) {
			case MESSAGES.START_PRIORITY:
			case MESSAGES.END_PRIORITY:
				browser.tabs.query({}).then((tabs) => {
						for (const tab of tabs) 
							browser.tabs.sendMessage(tab.id, msg);
					});
				break;
		}
	});
