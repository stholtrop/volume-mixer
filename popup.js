console.log("Runs");
const MESSAGES = {
	SET_GAIN: 'SET_GAIN',
	GET_STATE: 'GET_STATE',
	GIVE_PRIORITY: 'GIVE_PRIORITY',
	REMOVE_PRIORITY: 'REMOVE_PRIORITY',
	START_PRIORITY: 'START_PRIORITY',
	END_PRIORITY: 'END_PRIORITY'
} 

function buildItem(id, value) {
	var elem = document.createElement('li');
	var input = document.createElement('input');
	input.setAttribute("type", "range");
	input.setAttribute("min", 0);
	input.setAttribute("max", 400);
	input.setAttribute("value", value*100);
	input.setAttribute("id", id);
	input.oninput = function () {
		browser.tabs.sendMessage(id, {key : MESSAGES.SET_GAIN, target : document.getElementById(id).value/100});
	};
	elem.appendChild(document.createTextNode(id));
	elem.appendChild(input);
	return elem;
}

browser.tabs.query({active : true, currentWindow : true})
	.then(tab => {
			browser.tabs.sendMessage(tab[0].id, {key : MESSAGES.GET_STATE})
				.then(state => {
					document.getElementById("activeTab").appendChild(buildItem(tab[0].id, state.gain));
			});
		});

browser.tabs.query({active : false, currentWindow : true})
	.then(tabs => {
			for (const tab of tabs) {
				browser.tabs.sendMessage(tab.id, {key : MESSAGES.GET_STATE})
					.then(state => {
							document.getElementById("otherTabs").appendChild(buildItem(tab.id, state.gain));
						});
			}
		});
