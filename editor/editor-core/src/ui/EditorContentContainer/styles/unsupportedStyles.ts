/* eslint-disable @atlaskit/ui-styling-standard/use-compiled,
	@repo/internal/deprecations/deprecation-ticket-required,
	@atlaskit/ui-styling-standard/no-exported-styles */

import { css } from '@emotion/react';
import type { SerializedStyles } from '@emotion/react';

import { token } from '@atlaskit/tokens';

import {
	backgroundSelectionStyles,
	borderSelectionStyles,
	hideNativeBrowserTextSelectionStyles,
} from './selectionStyles';

/**
 * @deprecated This style has been migrated to Compiled CSS, under experiment platform_editor_core_static_css
 * If you need to make changes here, also update the corresponding style in
 * packages/editor/editor-core/src/ui/EditorContentContainer/EditorContentContainer-compiled.tsx
 * See EDITOR-7600 for more details: https://hello.jira.atlassian.cloud/jira/browse/EDITOR-7600
 */
export const UnsupportedSharedCssClassName = {
	BLOCK_CONTAINER: 'unsupportedBlockView-content-wrap',
	INLINE_CONTAINER: 'unsupportedInlineView-content-wrap',
};

// eslint-disable-next-line @atlaskit/design-system/no-css-tagged-template-expression -- Ignored via go/DSP-18766
/**
 * @deprecated This style has been migrated to Compiled CSS, under experiment platform_editor_core_static_css
 * If you need to make changes here, also update the corresponding style in
 * packages/editor/editor-core/src/ui/EditorContentContainer/EditorContentContainer-compiled.tsx
 * See EDITOR-7600 for more details: https://hello.jira.atlassian.cloud/jira/browse/EDITOR-7600
 */
/**
 * Styles for UnsupportedBlockNodeView — gated behind platform_editor_vanilla_node_views_phase1.
 * Applied in EditorContentContainerEmotion — will be removed as part of compiled upgrade.
 *
 * The `unsupported-*-vanilla-*` class names are produced by `VanillaUnsupportedCssClassName` in
 * editor-plugin-unsupported-content/src/nodeviews/unsupported-block-node-view.ts — keep both in sync
 * when renaming.
 */
// eslint-disable-next-line @atlaskit/ui-styling-standard/no-exported-styles, @atlaskit/volt-strict-mode/no-multiple-exports
export const vanillaUnsupportedStyles: SerializedStyles = css({
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors
	'.ProseMirror': {
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors
		'.unsupported-block-vanilla-inner': {
			alignItems: 'center',
			background: token('color.background.disabled'),
			border: `${token('border.width')} dashed ${token('color.border.disabled')}`,
			borderRadius: token('radius.small', '3px'),
			boxSizing: 'border-box',
			cursor: 'pointer',
			display: 'flex',
			font: token('font.body'),
			margin: `${token('space.100')} 0`,
			minHeight: '24px',
			minWidth: '120px',
			padding: token('space.150'),
			textAlign: 'center',
			justifyContent: 'center',
		},
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors
		'.unsupported-inline-vanilla-inner': {
			alignItems: 'center',
			background: token('color.background.disabled'),
			border: `${token('border.width')} dashed ${token('color.border.disabled')}`,
			borderRadius: token('radius.small', '3px'),
			boxSizing: 'border-box',
			cursor: 'default',
			display: 'inline-flex',
			font: token('font.body'),
			margin: `0 ${token('space.025')}`,
			minHeight: '24px',
			padding: `0 ${token('space.100')}`,
			verticalAlign: 'middle',
			whiteSpace: 'nowrap',
		},
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors
		'.unsupported-vanilla-icon': {
			padding: token('space.050', '4px'),
			display: 'inline-flex',
			alignItems: 'center',
		},
	},
});

// eslint-disable-next-line @atlaskit/ui-styling-standard/no-exported-styles, @atlaskit/volt-strict-mode/no-multiple-exports
export const unsupportedStyles: SerializedStyles = css({
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors,@atlaskit/ui-styling-standard/no-unsafe-values
	[`.${UnsupportedSharedCssClassName.BLOCK_CONTAINER} > div, .${UnsupportedSharedCssClassName.INLINE_CONTAINER} > span:nth-of-type(2)`]:
		{
			cursor: 'pointer',
		},

	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors
	'.ak-editor-selected-node': {
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-unsafe-values
		[`&.${UnsupportedSharedCssClassName.BLOCK_CONTAINER} > div, &.${UnsupportedSharedCssClassName.INLINE_CONTAINER} > span:nth-of-type(2)`]:
			// eslint-disable-next-line @atlaskit/ui-styling-standard/no-unsafe-values
			[
				// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values
				backgroundSelectionStyles,
				// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values
				borderSelectionStyles,
				// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values
				hideNativeBrowserTextSelectionStyles,
			],
	},

	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors
	'.danger': {
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors
		'.ak-editor-selected-node': {
			// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors,@atlaskit/ui-styling-standard/no-unsafe-values
			[`&.${UnsupportedSharedCssClassName.BLOCK_CONTAINER} > div, &.${UnsupportedSharedCssClassName.INLINE_CONTAINER} > span:nth-of-type(2)`]:
				{
					border: `1px solid ${token('color.border.danger')}`,
					backgroundColor: token('color.blanket.danger'),
				},
		},
	},
});
