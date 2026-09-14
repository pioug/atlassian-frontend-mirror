import { getDocument } from '@atlaskit/browser-apis';
import { BLOCK_MENU_TEST_ID } from '@atlaskit/editor-common/block-menu';
import { DRAG_HANDLE_SELECTOR } from '@atlaskit/editor-common/styles';
import { fg } from '@atlaskit/platform-feature-flags/fg';

const POPUP_WRAPPER_TEST_ID = 'popup-wrapper';
const EDITOR_CONTENT_CONTAINER_SELECTOR = '[data-testid="editor-content-container"]';
/**
 * Breathing room left between the revealed block and the fold it just crossed, so the block does
 * not end up flush against the edge of the viewport.
 */
const REVEAL_MARGIN = 8;

/**
 * Where the drag handle and the popup sit relative to their block. The drag handle is removed from
 * the DOM as soon as the pointer moves onto the block menu, so this has to be measured while the
 * menu opens rather than when a menu item is clicked.
 */
export type BlockMenuAnchorMetrics = {
	/**
	 * Moving a node can recreate its DOM, and node views that render asynchronously (media) report
	 * zero height for a frame or two afterwards - so the height is taken from before the move.
	 */
	blockHeight: number;
	dragHandleHeight: number;
	dragHandleOffsetFromBlock: number;
	popupHeight: number;
	popupOffsetFromBlock: number;
};

export type BlockMenuPositionSnapshot = BlockMenuAnchorMetrics & {
	scrollContainer: Element;
	scrollTop: number;
};

/**
 * Minimum scroll needed to bring the drag handle back inside the viewport.
 * Zero means the handle is already fully visible.
 */
export const getScrollDistanceToRevealAnchor = (
	dragHandleTop: number,
	dragHandleHeight: number,
	viewport: { bottom: number; top: number },
): number => {
	if (dragHandleTop < viewport.top) {
		return dragHandleTop - viewport.top;
	}
	const dragHandleBottom = dragHandleTop + dragHandleHeight;
	if (dragHandleBottom > viewport.bottom) {
		return dragHandleBottom - viewport.bottom;
	}
	return 0;
};

/**
 * The editor content container is not always the element that actually scrolls - depending on the
 * product it can be an ancestor, or the document itself. Pick the closest one that really scrolls.
 */
const getScrollContainer = (doc: Document, selectedBlock: Element): Element | null => {
	const editorContentContainer = doc.querySelector(EDITOR_CONTENT_CONTAINER_SELECTOR);
	if (
		editorContentContainer &&
		editorContentContainer.scrollHeight > editorContentContainer.clientHeight
	) {
		return editorContentContainer;
	}

	let ancestor = selectedBlock.parentElement;
	while (ancestor) {
		const overflowY = doc.defaultView?.getComputedStyle(ancestor).overflowY;
		if (
			(overflowY === 'auto' || overflowY === 'scroll') &&
			ancestor.scrollHeight > ancestor.clientHeight
		) {
			return ancestor;
		}
		ancestor = ancestor.parentElement;
	}

	return doc.scrollingElement;
};

const getScrollViewport = (
	doc: Document,
	scrollContainer: Element,
): { bottom: number; top: number } => {
	if (scrollContainer === doc.scrollingElement) {
		return { bottom: doc.defaultView?.innerHeight ?? 0, top: 0 };
	}

	const { top, bottom } = scrollContainer.getBoundingClientRect();
	return { bottom, top };
};

/**
 * Float based node views - a media group is one - collapse their top level wrapper to zero height,
 * so the visual bottom of the block has to come from its children.
 */
const getBlockBottom = (block: Element): number => {
	const rect = block.getBoundingClientRect();
	if (rect.height > 0) {
		return rect.bottom;
	}

	return Array.from(block.children).reduce(
		(bottom, child) => Math.max(bottom, child.getBoundingClientRect().bottom),
		rect.bottom,
	);
};

const setPopupTop = (blockMenuEl: Element, targetTop: number): void => {
	const popupWrapper =
		blockMenuEl.closest(`[data-testid="${POPUP_WRAPPER_TEST_ID}"]`) ?? blockMenuEl.parentElement;
	if (!(popupWrapper instanceof HTMLElement)) {
		return;
	}

	const distance = blockMenuEl.getBoundingClientRect().top - targetTop;
	const hasTopProperty = popupWrapper.style.top !== '';
	const hasBottomProperty = popupWrapper.style.bottom !== '';

	if (hasBottomProperty && !hasTopProperty) {
		popupWrapper.style.bottom = `${parseFloat(popupWrapper.style.bottom || '0') + distance}px`;
	} else {
		popupWrapper.style.top = `${parseFloat(popupWrapper.style.top || '0') - distance}px`;
	}
};

/**
 * Measured while the menu opens, when the popup is still aligned to the drag handle. Moves that
 * keep the handle visible deliberately leave the popup where it is, so this alignment - not the
 * drifted one - is what the popup is restored to when a fold is crossed.
 */
export const getBlockMenuAnchorMetrics = (
	selectedBlock: Element | undefined,
): BlockMenuAnchorMetrics | undefined => {
	const doc = getDocument();
	const blockMenuEl = doc?.querySelector(`[data-testid="${BLOCK_MENU_TEST_ID}"]`);
	if (!doc || !selectedBlock || !blockMenuEl) {
		return;
	}

	const blockMenuRect = blockMenuEl.getBoundingClientRect();
	const dragHandleRect = doc.querySelector(DRAG_HANDLE_SELECTOR)?.getBoundingClientRect();
	if (blockMenuRect.height === 0 || !dragHandleRect?.height) {
		return;
	}

	const blockTop = selectedBlock.getBoundingClientRect().top;
	return {
		blockHeight: getBlockBottom(selectedBlock) - blockTop,
		dragHandleHeight: dragHandleRect.height,
		dragHandleOffsetFromBlock: dragHandleRect.top - blockTop,
		popupOffsetFromBlock: blockMenuRect.top - blockTop,
		popupHeight: blockMenuRect.height,
	};
};

/**
 * Captured before the move transaction, so the popup can be realigned to the block after it.
 */
export const getBlockMenuPositionSnapshot = (
	selectedBlock: Element | undefined,
	anchorMetrics: BlockMenuAnchorMetrics | undefined,
): BlockMenuPositionSnapshot | undefined => {
	const doc = getDocument();
	if (!doc || !selectedBlock) {
		return;
	}

	const scrollContainer = getScrollContainer(doc, selectedBlock);
	const metrics = anchorMetrics ?? getBlockMenuAnchorMetrics(selectedBlock);
	if (!scrollContainer || !metrics) {
		return;
	}

	return { ...metrics, scrollContainer, scrollTop: scrollContainer.scrollTop };
};

/**
 * Called after a move up/down transaction.
 *
 * With a `positionSnapshot` the popup is only sticky when it has to be: the editor stays put while
 * the moved node's drag handle is still visible, and scrolls the minimum needed to reveal the
 * handle otherwise - realigning the popup to the revealed handle.
 */
export const fixBlockMenuPositionAndScroll = (
	selectedNode: Element | undefined,
	positionSnapshot?: BlockMenuPositionSnapshot,
): void => {
	const doc = getDocument();
	if (!doc) {
		return;
	}

	const blockMenuEl = doc.querySelector(`[data-testid="${BLOCK_MENU_TEST_ID}"]`);
	if (!blockMenuEl?.parentElement) {
		return;
	}

	if (positionSnapshot) {
		if (!selectedNode) {
			return;
		}
		// Reuse the container resolved when the snapshot was taken - re-resolving it independently
		// here could pick a different element (e.g. for a node near an overflow boundary), applying
		// positionSnapshot.scrollTop to the wrong container.
		const scrollContainer = positionSnapshot.scrollContainer;

		// The move transaction scrolls the new selection into view - undo that, only a drag handle
		// leaving the viewport is allowed to move the editor.
		scrollContainer.scrollTo({ behavior: 'instant', top: positionSnapshot.scrollTop });

		const viewport = getScrollViewport(doc, scrollContainer);
		const anchorTop =
			selectedNode.getBoundingClientRect().top + positionSnapshot.dragHandleOffsetFromBlock;

		// Whether to scroll at all is decided by the drag handle alone - a block taller than the
		// viewport is expected to be cut off while its handle stays usable.
		if (
			getScrollDistanceToRevealAnchor(anchorTop, positionSnapshot.dragHandleHeight, viewport) === 0
		) {
			return;
		}

		// Once we do scroll, reveal the block and the popup, not just the handle sized sliver of it.
		// popupOffsetFromBlock is relative to the block - re-express it relative to the handle (the
		// anchor everything else here is measured from) to build one span covering all three. The
		// handle itself (0 to dragHandleHeight) always stays inside that span, so its visibility is
		// never sacrificed to make room for the block or the popup.
		const popupTopFromHandle =
			positionSnapshot.popupOffsetFromBlock - positionSnapshot.dragHandleOffsetFromBlock;
		const revealTop = Math.min(0, popupTopFromHandle);
		const revealBottom = Math.max(
			positionSnapshot.dragHandleHeight,
			positionSnapshot.blockHeight - positionSnapshot.dragHandleOffsetFromBlock,
			popupTopFromHandle + positionSnapshot.popupHeight,
		);
		const revealHeight = Math.min(
			revealBottom - revealTop,
			Math.max(viewport.bottom - viewport.top - 2 * REVEAL_MARGIN, 0),
		);
		const scrollDistance = getScrollDistanceToRevealAnchor(
			anchorTop + revealTop - REVEAL_MARGIN,
			revealHeight + 2 * REVEAL_MARGIN,
			viewport,
		);

		scrollContainer.scrollBy({ behavior: 'instant', top: scrollDistance });
		setPopupTop(
			blockMenuEl,
			selectedNode.getBoundingClientRect().top + positionSnapshot.popupOffsetFromBlock,
		);
		return;
	}

	const scrollableContainer = doc.querySelector(EDITOR_CONTENT_CONTAINER_SELECTOR);
	if (!selectedNode || !scrollableContainer) {
		return;
	}

	const parentElement = blockMenuEl.parentElement;
	const currentTop = parentElement.getBoundingClientRect().top;

	const distance =
		selectedNode.getBoundingClientRect().top - blockMenuEl.getBoundingClientRect().top;

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

/**
 * Shared by move-up.tsx and move-down.tsx: schedules the post-move fix for the frame after
 * ProseMirror has re-rendered.
 *
 * Falls back to the pre-PR always-scroll path (matching gate-off, via `getFirstSelectedDomNode`)
 * whenever a `positionSnapshot` wasn't captured - e.g. a media/file thumbnail reporting zero height
 * for a frame when the menu opened - rather than silently doing nothing.
 */
export const scheduleBlockMenuPositionFix = (
	positionSnapshot: BlockMenuPositionSnapshot | undefined,
	getMovedBlockDomNode: () => Element | undefined,
	getFirstSelectedDomNode: () => Element | undefined,
): void => {
	requestAnimationFrame(() => {
		if (fg('platform_editor_blocks_patch_8') && positionSnapshot) {
			fixBlockMenuPositionAndScroll(getMovedBlockDomNode(), positionSnapshot);
			return;
		}
		fixBlockMenuPositionAndScroll(getFirstSelectedDomNode());
	});
};
