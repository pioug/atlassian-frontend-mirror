export const copyTextToClipboard = (text: string): Promise<void> =>
	new Promise<void>((resolve: () => void, reject: (str: string) => void) => {
		const isApiSupported =
			!!navigator.clipboard && typeof navigator.clipboard.writeText === 'function';

		if (isApiSupported) {
			navigator.clipboard.writeText(text).then(
				() => resolve(),
				(e) => reject(e),
			);
		} else {
			reject('Clipboard API is not supported');
		}
	});
