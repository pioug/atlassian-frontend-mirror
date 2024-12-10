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

export const toDOM = (view: EditorView, getPos: () => number | undefined) => {
	const selection = view.state.selection as GapCursorSelection;
	const { $from, side } = selection;
	const isRightCursor = side === Side.RIGHT;
	const node = isRightCursor ? $from.nodeBefore : $from.nodeAfter;
	const nodeStart = getPos();
	// @ts-ignore - [unblock prosemirror bump] nodeStart can be undefined
	const dom = view.nodeDOM(nodeStart);

	const element = document.createElement('span');
	element.className = `ProseMirror-gapcursor ${isRightCursor ? '-right' : '-left'}`;
	element.appendChild(document.createElement('span'));

	if (dom instanceof HTMLElement && element.firstChild) {
		const style = computeNestedStyle(dom) || window.getComputedStyle(dom);

		const gapCursor = element.firstChild as HTMLSpanElement;
		gapCursor.style.height = `${measureHeight(style)}px`;

		const layoutMode = node && getLayoutModeFromTargetNode(node);

		// TODO remove this table specific piece. need to figure out margin collapsing logic
		if (nodeStart !== 0 || layoutMode || node?.type.name === 'table') {
			gapCursor.style.marginTop = style.getPropertyValue('margin-top');
		}

		if (layoutMode) {
			gapCursor.setAttribute('layout', layoutMode);
			const breakoutModeStyle = getComputedStyleForLayoutMode(dom, node, style);
			gapCursor.style.width = `${measureWidth(breakoutModeStyle)}px`;
		} else {
			mutateElementStyle(gapCursor, style, selection.side);
		}
	}

	return element;
};
