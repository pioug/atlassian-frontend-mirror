import type { GapCursorSelection } from '@atlaskit/editor-common/selection';
import { Side } from '@atlaskit/editor-common/selection';
import type { EditorView } from '@atlaskit/editor-prosemirror/view';

import { getComputedStyleForLayoutMode, getLayoutModeFromTargetNode, isLeftCursor } from '../utils';

/**
 * We have a couple of nodes that require us to compute style
 * on different elements, ideally all nodes should be able to
 * compute the appropriate styles based on their wrapper.
 */
const nestedCases: Record<string, string> = {
	'tableView-content-wrap': 'table',
	'mediaSingleView-content-wrap': '.rich-media-item',
	'bodiedExtensionView-content-wrap': '.extension-container',
	'multiBodiedExtensionView-content-wrap': '.multiBodiedExtension--container',
	'embedCardView-content-wrap': '.rich-media-item',
	'datasourceView-content-wrap': '.datasourceView-content-inner-wrap',
};

const computeNestedStyle = (dom: HTMLElement) => {
	const foundKey = Object.keys(nestedCases).find((className) => dom.classList.contains(className));
	const nestedSelector = foundKey && nestedCases[foundKey];

	if (nestedSelector) {
		const nestedElement = dom.querySelector(nestedSelector);
		if (nestedElement) {
			return window.getComputedStyle(nestedElement);
		}
	}
};

const measureHeight = (style: CSSStyleDeclaration) => {
	return measureValue(style, [
		'height',
		'padding-top',
		'padding-bottom',
		'border-top-width',
		'border-bottom-width',
	]);
};

const measureWidth = (style: CSSStyleDeclaration) => {
	return measureValue(style, [
		'width',
		'padding-left',
		'padding-right',
		'border-left-width',
		'border-right-width',
	]);
};

const measureValue = (style: CSSStyleDeclaration, measureValues: Array<string>) => {
	const [base, ...contentBoxValues] = measureValues;
	const measures = [style.getPropertyValue(base)];

	const boxSizing = style.getPropertyValue('box-sizing');
	if (boxSizing === 'content-box') {
		contentBoxValues.forEach((value) => {
			measures.push(style.getPropertyValue(value));
		});
	}

	let result = 0;
	for (let i = 0; i < measures.length; i++) {
		result += parseFloat(measures[i]);
	}
	return result;
};

const mutateElementStyle = (element: HTMLElement, style: CSSStyleDeclaration, side: Side) => {
	element.style.transform = style.getPropertyValue('transform');

	if (isLeftCursor(side)) {
		element.style.width = style.getPropertyValue('width');
		element.style.marginLeft = style.getPropertyValue('margin-left');
	} else {
		const marginRight = parseFloat(style.getPropertyValue('margin-right'));
		if (marginRight > 0) {
			element.style.marginLeft = `-${Math.abs(marginRight)}px`;
		} else {
			element.style.paddingRight = `${Math.abs(marginRight)}px`;
		}
	}
};

/**
 * For nested elements (e.g. .extension-container inside
 * .extensionView-content-wrap), use getBoundingClientRect to compute
 * the exact pixel offset between the gap cursor's position in the
 * flow and the inner element's visual position.
 */
const positionFromRect = (
	gapCursor: HTMLElement,
	cursorParent: HTMLElement,
	nestedElement: Element,
) => {
	const cursorRect = cursorParent.getBoundingClientRect();
	const innerRect = nestedElement.getBoundingClientRect();

	gapCursor.style.marginTop = `${innerRect.top - cursorRect.top}px`;
	gapCursor.style.left = `${innerRect.left - cursorRect.left}px`;
	gapCursor.style.width = `${innerRect.width}px`;
};

export const toDOM = (view: EditorView, getPos: () => number | undefined): HTMLSpanElement => {
	const selection = view.state.selection as GapCursorSelection;
	const { $from, side } = selection;
	const isRightCursor = side === Side.RIGHT;
	const node = isRightCursor ? $from.nodeBefore : $from.nodeAfter;

	const element = document.createElement('span');
	element.className = `ProseMirror-gapcursor ${isRightCursor ? '-right' : '-left'}`;
	element.appendChild(document.createElement('span'));

	if (element.firstChild) {
		const gapCursor = element.firstChild as HTMLSpanElement;

		// The DOM from view.nodeDOM() might be stale after paste
		// Use requestAnimationFrame to wait for DOM to update, then fetch and measure
		requestAnimationFrame(() => {
			const nodeStart = getPos();
			if (nodeStart === undefined) {
				return;
			}

			// if selection has changed, we no longer need to compute the styles for the gapcursor
			if (!view.state.selection.eq(selection)) {
				return;
			}

			const dom = view.nodeDOM(nodeStart);

			if (dom instanceof HTMLElement) {
				// For native embed extensions only, use getBoundingClientRect
				// to position the gap cursor precisely relative to the inner
				// .extension-container
				if (dom.classList.contains('extensionView-content-wrap')) {
					const nativeEmbed = dom.querySelector(
						'.extension-container:has([data-native-embed-alignment])',
					);
					if (nativeEmbed) {
						const nativeEmbedStyle = window.getComputedStyle(nativeEmbed);
						gapCursor.style.height = `${measureHeight(nativeEmbedStyle)}px`;
						positionFromRect(gapCursor, element, nativeEmbed);
						return;
					}
				}

				const style = computeNestedStyle(dom) || window.getComputedStyle(dom);
				gapCursor.style.height = `${measureHeight(style)}px`;

				const layoutMode = node && getLayoutModeFromTargetNode(node);
				if (nodeStart !== 0 || layoutMode || node?.type.name === 'table') {
					gapCursor.style.marginTop = style.getPropertyValue('margin-top');
				}

				const isNestedTable = node?.type.name === 'table' && selection.$to.depth > 0;

				if (layoutMode && !isNestedTable) {
					gapCursor.setAttribute('layout', layoutMode);
					const breakoutModeStyle = getComputedStyleForLayoutMode(dom, node, style);
					gapCursor.style.width = `${measureWidth(breakoutModeStyle)}px`;
				} else {
					mutateElementStyle(gapCursor, style, selection.side);
				}
			}
		});
	}

	return element;
};
