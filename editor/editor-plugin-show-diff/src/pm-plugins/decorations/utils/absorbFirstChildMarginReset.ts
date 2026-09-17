import { createBoxlessMarginAbsorber } from './createMarginAbsorber';

/**
 * Keeps a block node rendered inside a diff widget from losing its own top margin.
 *
 * The editor's leading-block margin reset is written against the parent element, not the document
 * position, so it fires wherever a text block is a first child — including inside the widget's own
 * `span`, which is what a whole-block deletion renders into. The widget then has no margin of its
 * own, and the block sits flush against whatever is above it, regardless of where in the document
 * the widget landed.
 *
 * The margin is not re-supplied; it is never taken away. Prepending an element the reset does not
 * select moves the real block off the leading position, so the ordinary `.ProseMirror p`,
 * `.ProseMirror h2` and similar rules go on applying to it untouched. That is why this needs no
 * knowledge of which margin the block should have — unlike `createNodeShapedMarginSpacer`, which
 * replicates a margin that has already been zeroed and cannot be read back.
 *
 * Unconditional, because the absorber generates no box: it costs nothing in a widget holding
 * inline content, which the reset was never going to match anyway. Deciding here instead would mean
 * restating the reset's selector list, and a copy of another package's CSS drifts silently.
 */
export const absorbFirstChildMarginReset = ({
	dom,
	testId,
}: {
	dom: HTMLElement;
	testId: string;
}): void => {
	dom.prepend(createBoxlessMarginAbsorber({ testId }));
};
