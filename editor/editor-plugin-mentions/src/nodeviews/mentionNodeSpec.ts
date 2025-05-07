import { mention } from '@atlaskit/adf-schema';
import { convertToInlineCss } from '@atlaskit/editor-common/lazy-node-view';
import type { DOMOutputSpec, Node as PMNode } from '@atlaskit/editor-prosemirror/model';
import { N30A } from '@atlaskit/theme/colors';
import { token } from '@atlaskit/tokens';

const isSSR = Boolean(process.env.REACT_SSR);

/**
 * Wrapper for ADF mention node spec to augment toDOM implementation
 * with fallback UI for lazy node view rendering / window virtualization
 * @nodeSpecException:toDOM patch
 * @returns
 */
export const mentionNodeSpec = () => {
	if (isSSR) {
		return mention;
	}
	return {
		...mention,
		toDOM: (node: PMNode): DOMOutputSpec => {
			// packages/elements/mention/src/components/Mention/index.tsx
			const mentionAttrs = {
				'aria-busy': 'true',
				contenteditable: 'false',
				'data-access-level': '',
				'data-mention-id': node.attrs.id,
				'data-prosemirror-content-type': 'node',
				'data-prosemirror-node-inline': 'true',
				'data-prosemirror-node-name': 'mention',
				style: convertToInlineCss({
					display: 'inline',
					border: `1px solid transparent`,
					background: token('color.background.neutral', N30A),
					color: token('color.text.subtle'),
					borderRadius: '20px',
					cursor: 'pointer',
					padding: '0 0.3em 2px 0.23em',
					wordBreak: 'break-word',
				}),
			};

			return ['span', mentionAttrs, node.attrs.text];
		},
	};
};
