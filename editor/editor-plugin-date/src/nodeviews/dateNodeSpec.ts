import { createIntl } from 'react-intl';
import type { IntlShape } from 'react-intl';

import { getBrowserInfo } from '@atlaskit/editor-common/browser';
import { convertToInlineCss } from '@atlaskit/editor-common/lazy-node-view';
import type { getPosHandlerNode } from '@atlaskit/editor-common/types';
import { timestampToString } from '@atlaskit/editor-common/utils';
import { ZERO_WIDTH_SPACE } from '@atlaskit/editor-common/whitespace';
import type { DOMOutputSpec, Node as PMNode } from '@atlaskit/editor-prosemirror/model';
import type { EditorState } from '@atlaskit/editor-prosemirror/state';
import { fg } from '@atlaskit/platform-feature-flags';
import { expValEquals } from '@atlaskit/tmp-editor-statsig/exp-val-equals';
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
			backgroundColor: token('color.background.neutral'),
			color: token('color.text'),
			borderRadius: token('radius.small'),
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
): [
	string,
	Record<string, string>,
	(
		| string
		| {
				class: string;
		  }
		| (
				| string
				| {
						class: string;
				  }
		  )[]
	)[],
	(
		| string
		| Record<string, string>
		| (
				| string
				| {
						class: string;
						style: string;
				  }
		  )[]
	)[],
	(
		| (
				| string
				| {
						class: string;
						contentEditable: string;
				  }
				| (
						| string
						| {
								class: string;
						  }
				  )[]
		  )[]
		| (
				| string
				| {
						class: string;
				  }
		  )[]
	),
] => {
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
		...(expValEquals('platform_editor_copy_paste_issue_fix', 'isEnabled', true)
			? {
					'data-node-type': 'date',
					'data-timestamp': timestamp,
			  }
			: {}),
		draggable: 'true',
	};
	if (fg('platform_editor_adf_with_localid')) {
		nodeWrapperAttrs['data-local-id'] = node.attrs.localId;
	}
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
		getBrowserInfo().android
			? [
					'span',
					{ class: 'zeroWidthSpaceContainer', contentEditable: 'false' },
					['span', { class: 'inlineNodeViewAddZeroWidthSpace' }, ZERO_WIDTH_SPACE],
			  ]
			: ['span', { class: 'inlineNodeViewAddZeroWidthSpace' }, ''],
	] satisfies DOMOutputSpec;
};
