export type WidthObserverProps = {
	setWidth: (width: number) => void;
	/**
	 * Whether to limit update events to when the sentinel element is in the viewport.
	 * Set this to true for cases where the sentinel scrolls off screen but you still need width udpates.
	 * Defaults to false
	 */
	// eslint-disable-next-line @repo/internal/react/boolean-prop-naming-convention
	offscreen?: boolean;
};
