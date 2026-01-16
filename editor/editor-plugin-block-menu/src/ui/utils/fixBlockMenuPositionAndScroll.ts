import { getDocument } from '@atlaskit/browser-apis';

export const fixBlockMenuPositionAndScroll = (firstSelectedNode: Element | undefined) => {
	const doc = getDocument();
	if (!doc) {
		return;
	}

	const blockMenuEl = doc.querySelector('[data-testid="editor-block-menu"]');
	if (!blockMenuEl?.parentElement) {
		return;
	}

	const scrollableContainer = doc.querySelector('[data-testid="editor-content-container"]');

	if (!firstSelectedNode || !scrollableContainer) {
		return;
	}

	const parentElement = blockMenuEl.parentElement;
	const currentTop = parentElement.getBoundingClientRect().top;

	const distance =
		firstSelectedNode.getBoundingClientRect().top - blockMenuEl.getBoundingClientRect().top;

	scrollableContainer.scrollBy({
		behavior: 'instant',
		top: distance,
	});

	const newTop = parentElement.getBoundingClientRect().top;
	const topDifference = currentTop - newTop;

	const hasTopProperty = parentElement.style.top !== '';
	const hasBottomProperty = parentElement.style.bottom !== '';

	if (hasBottomProperty && !hasTopProperty) {
		const currentBottomValue = parseFloat(parentElement.style.bottom || '0');
		parentElement.style.bottom = `${currentBottomValue - topDifference}px`;
	} else {
		const currentTopValue = parseFloat(parentElement.style.top || '0');
		parentElement.style.top = `${currentTopValue + topDifference}px`;
	}
};
