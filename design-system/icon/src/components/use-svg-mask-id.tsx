import { useId } from 'react';

/**
 * Returns an id for an SVG `<mask>` inside an animated icon's glyph, unique to this instance.
 *
 * `url(#id)` resolves to the first element with that id in the document, so a shared id would draw every
 * instance of the icon through the first instance's mask, and animate them all together. The `useId()` value
 * is stripped to characters that are safe inside `url(#…)`, since it includes `:` or non-ASCII characters
 * depending on the React version.
 */
export const useSvgMaskId = (name: string): string => {
	const id = useId().replace(/[^A-Za-z0-9_-]/g, '');
	return `${name}-${id}`;
};
