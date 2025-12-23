// Adapted from https://github.com/GoogleChrome/web-vitals/blob/main/src/lib/onHidden.ts

export const onHidden = (cb: () => void) => {
	const handleVisibilityChange = () => {
		if (document.visibilityState === 'hidden') {
			cb();
		}
	};

	// eslint-disable-next-line @repo/internal/dom-events/no-unsafe-event-listeners
	document.addEventListener('visibilitychange', handleVisibilityChange);

	return (): void => {
		// eslint-disable-next-line @repo/internal/dom-events/no-unsafe-event-listeners
		document.removeEventListener('visibilitychange', handleVisibilityChange);
	};
};
