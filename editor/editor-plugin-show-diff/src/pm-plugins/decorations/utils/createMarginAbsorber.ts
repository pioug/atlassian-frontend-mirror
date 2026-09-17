/**
 * An empty, invisible element whose only job is to occupy a position in the DOM.
 *
 * At the top of the document `firstBlockNodeStyles` zeroes the top margin of whatever element
 * follows a leading `.ProseMirror-widget`, and it does so with `!important` — which no inline style
 * can outrank. This takes that hit so the shaped spacer after it, one position further along, keeps
 * the margin it is there to supply.
 *
 * It contributes no height (no content, border or padding) and margins collapse through it, so it
 * cannot affect layout beyond the selector it absorbs.
 */
export const createMarginAbsorber = ({ testId }: { testId: string }): HTMLElement => {
	// Block-level: an empty inline element takes the match just as well, but collapses to a
	// zero-height line box, and the following margin then lands in the wrong place.
	const absorber = document.createElement('div');
	absorber.dataset.testid = testId;
	absorber.setAttribute('aria-hidden', 'true');
	absorber.contentEditable = 'false';

	return absorber;
};

/**
 * An absorber that occupies a DOM position without generating a box.
 *
 * Not interchangeable with `createMarginAbsorber`: a rule that selects the *rendered* sibling of a
 * leading widget needs an element that generates a box, and this one does not.
 */
export const createBoxlessMarginAbsorber = ({ testId }: { testId: string }): HTMLElement => {
	const absorber = document.createElement('div');
	absorber.dataset.testid = testId;
	absorber.setAttribute('aria-hidden', 'true');
	absorber.contentEditable = 'false';
	absorber.style.display = 'contents';

	return absorber;
};
