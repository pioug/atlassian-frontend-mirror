export function debounce(func: Function, wait: number, immediate: boolean) {
	let timeout: NodeJS.Timeout | undefined;
	return function () {
		// @ts-ignore -- This is just a debounce function used in an example.
		// eslint-disable-next-line @typescript-eslint/no-this-alias
		const context = this;
		const args = arguments;
		clearTimeout(timeout);
		if (immediate && !timeout) {
			func.apply(context, args);
		}
		timeout = setTimeout(function () {
			timeout = undefined;
			if (!immediate) {
				func.apply(context, args);
			}
		}, wait);
	};
}
