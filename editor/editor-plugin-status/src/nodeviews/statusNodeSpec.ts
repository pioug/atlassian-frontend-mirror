import { browser as browserLegacy, getBrowserInfo } from '@atlaskit/editor-common/browser';
import { convertToInlineCss } from '@atlaskit/editor-common/lazy-node-view';
import { ZERO_WIDTH_SPACE } from '@atlaskit/editor-common/whitespace';
import type { DOMOutputSpec, Node as PMNode } from '@atlaskit/editor-prosemirror/model';
import { fg } from '@atlaskit/platform-feature-flags';
import { expValEquals } from '@atlaskit/tmp-editor-statsig/exp-val-equals';

// eg. Version/4.0 Chrome/95.0.4638.50
const isAndroidChromium =
	// @ts-ignore - TS1501 TypeScript 5.9.2 upgrade
	typeof window !== 'undefined' && /Version\/.* Chrome\/.*/u.test(window.navigator.userAgent);

export const statusToDOM = (node: PMNode): DOMOutputSpec => {
	const browser = expValEquals('platform_editor_hydratable_ui', 'isEnabled', true)
		? getBrowserInfo()
		: browserLegacy;
	const { text, color, style, localId } = node.attrs;

	const editorNodeWrapperAttrs = {
		class: 'statusView-content-wrap inlineNodeView',
		'data-testid': 'statusContainerView',
		'data-prosemirror-node-name': 'status',
		localid: localId,
	};

	const statusElementAttrs = {
		style: convertToInlineCss(
			isAndroidChromium
				? {
						// eslint-disable-next-line @atlaskit/ui-styling-standard/no-important-styles -- Ignored via go/DSP-18766
						display: 'inline-block !important',
						verticalAlign: 'middle',
					}
				: {},
		),
		class: 'status-lozenge-span',
		'data-node-type': 'status',
		'data-color': color,
		'data-style': style,
	};

	const lozengeWrapperAttrs = {
		class: 'lozenge-wrapper',
	};

	const lozengeTextAttrs = {
		class: 'lozenge-text',
		style: convertToInlineCss({
			...(fg('platform-lozenge-custom-letterspacing')
				? {
						// eslint-disable-next-line @atlaskit/design-system/use-tokens-typography
						letterSpacing: '0.165px',
					}
				: {}),
		}),
	};

	return [
		'span',
		editorNodeWrapperAttrs,
		[
			'span',
			{ class: 'zeroWidthSpaceContainer' },
			['span', { class: 'inlineNodeViewAddZeroWidthSpace' }, ZERO_WIDTH_SPACE],
		],
		['span', statusElementAttrs, ['span', lozengeWrapperAttrs, ['span', lozengeTextAttrs, text]]],
		browser.android
			? [
					'span',
					{ class: 'zeroWidthSpaceContainer', contentEditable: 'false' },
					['span', { class: 'inlineNodeViewAddZeroWidthSpace' }, ZERO_WIDTH_SPACE],
				]
			: ['span', { class: 'inlineNodeViewAddZeroWidthSpace' }, ''],
	];
};
