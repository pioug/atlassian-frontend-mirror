// ==============================
// Passive Event Detector
// ==============================
import __noop from '@atlaskit/ds-lib/noop';
const noop = __noop;

// https://github.com/rafgraph/detect-it/blob/main/src/index.ts#L19-L36
let passiveOptionAccessed = false;
const options = {
	get passive() {
		return (passiveOptionAccessed = true);
	},
};
// check for SSR
const w: typeof window | { addEventListener?: never; removeEventListener?: never } =
	typeof window !== 'undefined' ? window : {};
if (w.addEventListener && w.removeEventListener) {
	// eslint-disable-next-line @repo/internal/dom-events/no-unsafe-event-listeners
	w.addEventListener('p', noop, options);
	// eslint-disable-next-line @repo/internal/dom-events/no-unsafe-event-listeners
	w.removeEventListener('p', noop, false);
}

export const supportsPassiveEvents: boolean = passiveOptionAccessed;
