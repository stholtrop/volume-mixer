var AudioContext = new (window.AudioContext || window.webkitAudioContext);
var gainNodes = [];
var currentGain = 1;
var priority = false;
var currentlyPlaying = 0;
var currentPriorities = 0;
var timeConstant = 0.1;

const MESSAGES = {
	SET_GAIN: 'SET_GAIN',
	GET_STATE: 'GET_GAIN',
	GIVE_PRIORITY: 'GIVE_PRIORITY',
	REMOVE_PRIORITY: 'REMOVE_PRIORITY',
	START_PRIORITY: 'START_PRIORITY',
	END_PRIORITY: 'END_PRIORITY'
} 

function playStarts() {
	currentlyPlaying++;
	if (priority && currentPlaying < 2 && currentPriorities < 1) {
		browser.runtime.sendMessage({key: MESSAGES.START_PRIORITY});
	}
}

function playEnds() {
	currentlyPlaying--;
	if (priority && currentPlaying < 1 && currentPriorities < 2) {
		browser.runtime.sendMessage({key: MESSAGES.END_PRIORITY});
	}
}

function addMedia(mediaElements) {
	for (var e of mediaElements) {
		e.onplay = playStarts;
		e.onended = playEnds, e.onpause = playEnds;
		var gainNode = AudioContext.createMediaStreamSource(e.mozCaptureStream()).connect(audioContext.createGain());
		gainNode.connect(audioContext.destination);
		gainNodes.push(gainNode);
	}

}

function getGains() {
	addMedia(document.getElementsByTagName('video'));
	addMedia(document.getElementsByTagName('audio'));
}

function setGains(target) {
	for (var gainNode of gainNodes) {
		gainNode.setTargetAtTime(target, AudioContext.currentTime, timeConstant);		
	}
}

getGains();

browser.runtime.onMessage.addListener(function (msg, sender, response) {
		switch (msg.key) {
			case MESSAGES.SET_GAIN:
				if (!msg.priority) 
					currentGain = msg.target;
				setGains(msg.target);
				break;
			case MESSAGES.GIVE_PRIORITY:
				priority = true;
				if (currentPriorities > 0)
					setGains(currentGain);
				if (currentlyPlaying > 0)
					browser.runtime.sendMessage({key: MESSAGES.START_PRIORITY});
				break;
			case MESSAGES.REMOVE_PRIORITY:
				priority = false;
				if (currentPriorities > 0)
					setGains(0);
				if (currentlyPlaying > 0)
					browser.runtime.sendMessage({key: MESSAGES.END_PRIORITY});
				break;
			case MESSAGES.GET_STATE:
				response({gain : currentGain, priority : priority});
				return true;
			case MESSAGES.START_PRIORITY:
				currentPriorities++;
				if (priority)
					break;
				setGains(0);
				break;
			case MESSAGES.END_PRIORITY:
				currentPriorities--;
				if (priority)
					break;
				setGains(currentGain);
				break;

		}
	});

