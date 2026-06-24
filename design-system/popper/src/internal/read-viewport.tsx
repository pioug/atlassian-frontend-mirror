type TViewport = {
	width: number;
	height: number;
};

/**
 * Returns the current viewport size in CSS pixels, preferring the visual
 * viewport (which accounts for pinch-zoom on touch devices) over the
 * layout viewport. Returns `{ width: 0, height: 0 }` in non-DOM
 * environments so callers can use the result unconditionally.
 */
export function readViewport(): TViewport {
	if (typeof window === 'undefined') {
		return { width: 0, height: 0 };
	}
	const visual = window.visualViewport;
	if (visual) {
		return { width: visual.width, height: visual.height };
	}
	return { width: window.innerWidth, height: window.innerHeight };
}

export type { TViewport };
