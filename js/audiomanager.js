function muteNow(event) {
	for (var i = 0; i < frameBufferLength; i++) {
		event.frameBuffer *= 0;
	}
}

for (var audio of document.getElementsByTagName("audio")) {
	audio.addEventListener('MozAudioAvailable', muteNow);
}
