import { createIntl } from 'react-intl-next';
import type { IntlShape } from 'react-intl-next';

import { date } from '@atlaskit/adf-schema';
import { isSSR } from '@atlaskit/editor-common/core-utils';
import { convertToInlineCss } from '@atlaskit/editor-common/lazy-node-view';
import { getPosHandlerNode } from '@atlaskit/editor-common/types';
import { timestampToString } from '@atlaskit/editor-common/utils';
import { ZERO_WIDTH_SPACE } from '@atlaskit/editor-common/whitespace';
import type { DOMOutputSpec, Node as PMNode } from '@atlaskit/editor-prosemirror/model';
import { EditorState } from '@atlaskit/editor-prosemirror/state';
import { N30A, N800 } from '@atlaskit/theme/colors';
import { editorExperiment } from '@atlaskit/tmp-editor-statsig/experiments';
import { token } from '@atlaskit/tokens';

import { getDateInformation } from './utils';

let intlRef: ReturnType<typeof createIntl> | undefined;

/**
 * Wrapper for ADF date node spec to augment toDOM implementation
 * with fallback UI for lazy node view rendering / window virtualization
 * @nodeSpecException:toDOM patch
 * @returns
 */
export const dateNodeSpec = () => {
	if (isSSR() || editorExperiment('platform_editor_inline_node_virtualization', 'off')) {
		return date;
	}

	return {
		...date,
		toDOM: dateToDOMvirtualization,
	};
};

export const dateToDOMvirtualization = (node: PMNode): DOMOutputSpec => {
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
		'data-prosemirror-node-view-type': 'vanilla',
		draggable: 'true',
	};
	const wrapperAttrs: Record<string, string> = {
		class: 'date-lozenger-container',
		'data-node-type': 'date',
		'data-timestamp': timestamp,
	};

	const attrs =
		color === undefined
			? {}
			: {
					class: `date-node-color-${color}`,
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
		['span', { class: 'inlineNodeViewAddZeroWidthSpace' }, ZERO_WIDTH_SPACE],
	] satisfies DOMOutputSpec;
};
