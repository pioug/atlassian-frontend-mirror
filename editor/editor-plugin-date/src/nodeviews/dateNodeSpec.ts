import { createIntl } from 'react-intl-next';

import { date } from '@atlaskit/adf-schema';
import { convertToInlineCss } from '@atlaskit/editor-common/lazy-node-view';
import { timestampToString } from '@atlaskit/editor-common/utils';
import type { DOMOutputSpec, NodeSpec, Node as PMNode } from '@atlaskit/editor-prosemirror/model';
import { N30A, N800 } from '@atlaskit/theme/colors';
import { editorExperiment } from '@atlaskit/tmp-editor-statsig/experiments';
import { token } from '@atlaskit/tokens';

const isSSR = Boolean(process.env.REACT_SSR);
let intl: ReturnType<typeof createIntl> | undefined;

/**
 * Wrapper for ADF date node spec to augment toDOM implementation
 * with fallback UI for lazy node view rendering / window virtualization
 * @nodeSpecException:toDOM patch
 * @returns
 */
export const dateNodeSpec = () => {
	if (isSSR || editorExperiment("platform_editor_inline_node_virtualization", "off")) {
		return date;
	}

	return {
		...date,
		toDOM: (node: PMNode): DOMOutputSpec => {
			intl = intl || createIntl({ locale: document.documentElement.lang || 'en-US' });
			const timestamp = node.attrs.timestamp;
			const displayString = timestampToString(timestamp, intl);
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
		},
	} as NodeSpec;
};
