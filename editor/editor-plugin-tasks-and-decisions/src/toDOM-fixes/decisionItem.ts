import { decisionItem } from '@atlaskit/adf-schema';
import { convertToInlineCss } from '@atlaskit/editor-common/lazy-node-view';
import type { DOMOutputSpec, Node as PMNode } from '@atlaskit/editor-prosemirror/model';
import { fg } from '@atlaskit/platform-feature-flags';
import { token } from '@atlaskit/tokens';

// @nodeSpecException:toDOM patch
export const decisionItemSpecWithFixedToDOM = () => {
	if (!fg('platform_editor_lazy-node-views')) {
		return decisionItem;
	}

	return {
		...decisionItem,
		toDOM: (node: PMNode): DOMOutputSpec => {
			const { localId, state } = node.attrs;
			const attrs = {
				'data-decision-local-id': localId || 'local-decision',
				'data-decision-state': state,
				class: 'decisionItemView-content-wrap',
				// Styles to match `packages/elements/task-decision/src/components/styles.ts`
				style: convertToInlineCss({
					background: token('color.background.neutral', 'rgba(9, 30, 66, 0.04)'),
					padding: token('space.100'),
					margin: `${token('space.100')} 0 0 0`,
					display: 'flex',
					borderRadius: token('border.radius'),
				}),
			};
			return [
				'li',
				attrs,
				[
					'span',
					{
						style: convertToInlineCss({
							width: '16px',
							height: '16px',
							margin: `${token('space.050')} ${token('space.200')} 0 0`,
						}),
					},
				],
				[
					'div',
					{
						'data-decision-wrapper': true,
						'data-testid': 'elements-decision-item',
					},
					[
						'div',
						{
							'data-component': 'content',
						},
						[
							'div',
							{
								class: 'decision-item',
							},
							0,
						],
					],
				],
			];
		},
	};
};
