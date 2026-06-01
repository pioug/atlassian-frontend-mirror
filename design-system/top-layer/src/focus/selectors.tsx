export const selectors: { focusable: string; focused: string } = (() => {
	// Common exclusion filter applied to every selector.
	const not = ':not([tabindex="-1"]):not([aria-disabled="true"]):not([aria-hidden="true"])';
	const notDisabled = `:not([disabled])${not}`;

	const focusable = [
		`a[href]${not}`,
		`area[href]${not}`,
		`input${notDisabled}:not([type="hidden"])`,
		`select${notDisabled}`,
		`textarea${notDisabled}`,
		`button${notDisabled}`,
		`iframe${not}`,
		`audio[controls]${not}`,
		`video[controls]${not}`,
		`[contenteditable]:not([contenteditable="false"])${not}`,
		`[tabindex]${notDisabled}${not}`,
	];

	return {
		focusable: focusable.join(','),
		// Build the `:focus` selector
		focused: focusable.map((selector) => `${selector}:focus`).join(','),
	};
})();
