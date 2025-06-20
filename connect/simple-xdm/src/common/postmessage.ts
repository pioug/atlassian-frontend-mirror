// @ts-nocheck
import Util from './util';
class PostMessage {
	constructor(data) {
		let d = data || {};
		this._registerListener(d.listenOn);
	}

	_registerListener(listenOn) {
		if (!listenOn || !listenOn.addEventListener) {
			listenOn = window;
		}
		// eslint-disable-next-line @repo/internal/dom-events/no-unsafe-event-listeners
		listenOn.addEventListener('message', Util._bind(this, this._receiveMessage), false);
	}

	_receiveMessage(event) {
		let handler = this._messageHandlers[event.data.type],
			extensionId = event.data.eid,
			reg;

		if (extensionId && this._registeredExtensions) {
			reg = this._registeredExtensions[extensionId];
		}

		if (!handler || !this._checkOrigin(event, reg)) {
			return false;
		}

		handler.call(this, event, reg);
	}
}

export default PostMessage;
