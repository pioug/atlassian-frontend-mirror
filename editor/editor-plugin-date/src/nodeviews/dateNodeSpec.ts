import { createIntl } from 'react-intl-next';
import type { IntlShape } from 'react-intl-next';

import { convertToInlineCss } from '@atlaskit/editor-common/lazy-node-view';
import type { getPosHandlerNode } from '@atlaskit/editor-common/types';
import { browser, timestampToString } from '@atlaskit/editor-common/utils';
import { ZERO_WIDTH_SPACE } from '@atlaskit/editor-common/whitespace';
import type { DOMOutputSpec, Node as PMNode } from '@atlaskit/editor-prosemirror/model';
import { EditorState } from '@atlaskit/editor-prosemirror/state';
import { N30A, N800 } from '@atlaskit/theme/colors';
import { token } from '@atlaskit/tokens';

import { getDateInformation } from './utils';

let intlRef: ReturnType<typeof createIntl> | undefined;

export const dateNodeSpec = (node: PMNode): DOMOutputSpec => {
	intlRef = intlRef || createIntl({ locale: document.documentElement.lang || 'en-US' });
	const timestamp = node.attrs.timestamp;
	const displayString = timestampToString(timestamp, intlRef);
	const wrapperAttrs = {
		class: 'date-lozenger-container',
		'data-node-type': 'date',
		'data-timestamp': timestamp,
		'aria-busy': 'true',
	};
	const attrs = {
		style: convertToInlineCss({
			// Taken from @atlaskit/date Component
			backgroundColor: token('color.background.neutral', N30A),
			color: token('color.text', N800),
			borderRadius: token('border.radius.100'),
			padding: `${token('space.025')} ${token('space.050')}`,
			margin: '0 1px',
		}),
	};
	return ['span', wrapperAttrs, ['span', attrs, displayString]];
};

export const dateToDOM = (
	node: PMNode,
	state: EditorState,
	getPos: getPosHandlerNode,
	intl: IntlShape,
) => {
	const timestamp = node.attrs.timestamp;
	const pos = getPos?.();
	const { displayString, color } = getDateInformation(timestamp, intl, state, pos);

	const nodeWrapperAttrs: Record<string, string> = {
		contenteditable: 'false',
		timestamp: timestamp,
		class: 'dateView-content-wrap inlineNodeView',
		'data-prosemirror-content-type': 'node',
		'data-prosemirror-node-name': 'date',
		'data-prosemirror-node-inline': 'true',
		draggable: 'true',
	};
	const wrapperAttrs: Record<string, string> = {
		class: 'date-lozenger-container',
		'data-node-type': 'date',
		'data-timestamp': timestamp,
	};

	const attrs = {
		class: !color ? '' : `date-node-color-${color}`,
		style: `white-space: unset`,
	};

	return [
		'span',
		nodeWrapperAttrs,
		[
			'span',
			{ class: 'zeroWidthSpaceContainer' },
			['span', { class: 'inlineNodeViewAddZeroWidthSpace' }, ZERO_WIDTH_SPACE],
		],
		['span', wrapperAttrs, ['span', attrs, displayString]],
		browser.android
			? [
					'span',
					{ class: 'zeroWidthSpaceContainer', contentEditable: 'false' },
					['span', { class: 'inlineNodeViewAddZeroWidthSpace' }, ZERO_WIDTH_SPACE],
				]
			: ['span', { class: 'inlineNodeViewAddZeroWidthSpace' }, ''],
	] satisfies DOMOutputSpec;
};
