import React from 'react';

export function useId(): string {
	// React uses `:` or `«»` in selectors which breaks `document.querySelector(…)`.
	// Replace with `_` to match future React 19 functionality.
	return React.useId().replace(/[:«»]/g, '_');
}
