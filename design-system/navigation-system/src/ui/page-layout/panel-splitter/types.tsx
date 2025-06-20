/**
 * Called when the user begins resizing the panel.
 * Intended for analytics.
 */
export type ResizeStartCallback = ({ initialWidth }: { initialWidth: number }) => void;

/**
 * Called when the user finishes resizing the panel.
 */
export type ResizeEndCallback = ({
	initialWidth,
	finalWidth,
}: {
	initialWidth: number;
	finalWidth: number;
}) => void;

// Optimising type for CSS usage, so we can use this value directly with CSS functions like `clamp()` on drag,
// wiithout needing to parse it.
export type ResizeBound = `${number}px` | `${number}vw`;
export type ResizeBounds = { min: ResizeBound; max: ResizeBound };

// Numeric values for resize bounds, in pixel units.
// Optimised for the `min` and `max` attributes of the range input (slider).
export type PixelResizeBounds = { min: number; max: number };
