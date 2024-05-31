//Reference: developer.mozilla.org/en-US/docs/Web/API/queueMicrotask#when_queuemicrotask_isnt_available
export const queueMicrotaskPolyfillImplementation = function (callback: () => void) {
	Promise.resolve()
		.then(callback)
		.catch((e) =>
			setTimeout(() => {
				throw e;
			}),
		);
};

const queueMicrotaskPolyfill = () => {
	if (typeof self.queueMicrotask !== 'function') {
		self.queueMicrotask = queueMicrotaskPolyfillImplementation;
	}
};

// REMOVE when "@babel/polyfill" upgraded to a package and version that supports
// queueMicrotask (this may involve upgrading to "core-js" directly)
export const tempPolyfills = () => {
	queueMicrotaskPolyfill();
};
