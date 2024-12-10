import { decisionItem } from '@atlaskit/adf-schema';
import { convertToInlineCss } from '@atlaskit/editor-common/lazy-node-view';
import type { DOMOutputSpec, Node as PMNode } from '@atlaskit/editor-prosemirror/model';
import { fg } from '@atlaskit/platform-feature-flags';
import { editorExperiment } from '@atlaskit/tmp-editor-statsig/experiments';
import { token } from '@atlaskit/tokens';

// @nodeSpecException:toDOM patch
export const decisionItemSpecWithFixedToDOM = () => {
	if (
		editorExperiment('platform_editor_exp_lazy_node_views', false) &&
		!fg('platform_editor_action_decisions_ssr_fix')
	) {
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

			// TODO: can copy raw SVG from DST later
			const decisionItemIcon = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
			decisionItemIcon.setAttribute('width', '24');
			decisionItemIcon.setAttribute('height', '24');
			decisionItemIcon.setAttribute('viewBox', '0 0 24 24');
			decisionItemIcon.setAttribute('role', 'presentation');
			const decisionItemSvgPath = document.createElementNS('http://www.w3.org/2000/svg', 'path');
			decisionItemSvgPath.setAttribute('fill', 'currentColor');
			decisionItemSvgPath.setAttribute('fill-rule', 'evenodd');
			decisionItemSvgPath.setAttribute(
				'd',
				'm9.414 8 3.293 3.293c.187.187.293.442.293.707v5a1 1 0 0 1-2 0v-4.586l-3-3V10.5a1 1 0 0 1-2 0V7a1 1 0 0 1 1-1h3.5a1 1 0 0 1 0 2zm8.293-1.707a1 1 0 0 1 0 1.414l-2.5 2.5a.997.997 0 0 1-1.414 0 1 1 0 0 1 0-1.414l2.5-2.5a1 1 0 0 1 1.414 0',
			);
			decisionItemIcon.setAttribute(
				'style',
				convertToInlineCss({
					width: '32px',
					height: '32px',
				}),
			);
			decisionItemIcon.appendChild(decisionItemSvgPath);

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
							borderRadius: token('border.radius.100', '3px'),
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
							}),
							contentEditable: 'false',
						},
						[
							'span',
							{
								style: convertToInlineCss({
									margin: token('space.negative.100', '-8px'),
									display: 'inline-block',
									width: '32px',
									height: '32px',
								}),
							},
							decisionItemIcon,
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
