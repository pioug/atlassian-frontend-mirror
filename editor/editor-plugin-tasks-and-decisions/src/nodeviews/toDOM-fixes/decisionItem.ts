import { decisionItem } from '@atlaskit/adf-schema';
import { convertToInlineCss } from '@atlaskit/editor-common/lazy-node-view';
import type { DOMOutputSpec, Node as PMNode } from '@atlaskit/editor-prosemirror/model';
import { editorExperiment } from '@atlaskit/tmp-editor-statsig/experiments';
import { token } from '@atlaskit/tokens';

// @nodeSpecException:toDOM patch
export const decisionItemSpecWithFixedToDOM = () => {
	if (editorExperiment('platform_editor_exp_lazy_node_views', false)) {
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
			};

			const showPlaceholder = node.content.size === 0;

			return [
				'li',
				attrs,
				[
					'div',
					{
						'data-decision-wrapper': true,
						'data-testid': 'elements-decision-item',
						// Styles to match `packages/elements/task-decision/src/components/styles.ts`
						style: convertToInlineCss({
							background: token('color.background.neutral'),
							padding: token('space.100', '8px'),
							paddingLeft: token('space.150', '12px'),
							margin: `${token('space.100', '8px')} 0 0 0`,
							display: 'flex',
							borderRadius: token('radius.small', '3px'),
						}),
					},
					[
						'span',
						{
							style: convertToInlineCss({
								width: '16px',
								height: '16px',
								margin: `${token('space.050', '4px')} ${token('space.150', '12px')} 0 0`,
								color: showPlaceholder ? token('color.icon.subtle') : token('color.icon.success'),
								display: 'flex',
								alignItems: 'center',
								justifyContent: 'center',
							}),
							contentEditable: 'false',
							'data-component': 'icon',
						},
						[
							'span',
							{
								role: 'img',
								'aria-label': 'Decision',
								style: convertToInlineCss({
									width: '32px',
									height: '32px',
								}),
							},
							[
								'http://www.w3.org/2000/svg svg',
								{
									viewBox: `0 0 24 24`,
									role: 'presentation',
									width: '24',
									height: '24',
									'data-icon-source': 'legacy',
									style: convertToInlineCss({
										width: '32px',
										height: '32px',
									}),
								},
								[
									'http://www.w3.org/2000/svg path',
									{
										fill: 'currentcolor',
										'fill-rule': 'evenodd',
										d: 'm9.414 8 3.293 3.293c.187.187.293.442.293.707v5a1 1 0 0 1-2 0v-4.586l-3-3V10.5a1 1 0 0 1-2 0V7a1 1 0 0 1 1-1h3.5a1 1 0 0 1 0 2zm8.293-1.707a1 1 0 0 1 0 1.414l-2.5 2.5a.997.997 0 0 1-1.414 0 1 1 0 0 1 0-1.414l2.5-2.5a1 1 0 0 1 1.414 0',
									},
								],
							],
						],
					],
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
