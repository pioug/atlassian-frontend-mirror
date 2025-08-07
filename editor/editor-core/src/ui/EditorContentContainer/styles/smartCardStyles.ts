import { css } from '@emotion/react'; // eslint-disable-line

import { akEditorFullPageNarrowBreakout } from '@atlaskit/editor-shared-styles';
import { token } from '@atlaskit/tokens';

import { boxShadowSelectionStyles, hideNativeBrowserTextSelectionStyles } from './selectionStyles';

export const DATASOURCE_INNER_CONTAINER_CLASSNAME = 'datasourceView-content-inner-wrap';

export const FLOATING_TOOLBAR_LINKPICKER_CLASSNAME = 'card-floating-toolbar--link-picker';

export const SmartCardSharedCssClassName = {
	INLINE_CARD_CONTAINER: 'inlineCardView-content-wrap',
	BLOCK_CARD_CONTAINER: 'blockCardView-content-wrap',
	EMBED_CARD_CONTAINER: 'embedCardView-content-wrap',
	DATASOURCE_CONTAINER: 'datasourceView-content-wrap',
	LOADER_WRAPPER: 'loader-wrapper',
};

// Move this into `smartCardStyles` below when cleaning up editor_controls_patch_15
// eslint-disable-next-line @atlaskit/ui-styling-standard/no-exported-styles
export const editorControlsSmartCardStyles = css({
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors, @atlaskit/ui-styling-standard/no-unsafe-values
	[`.${SmartCardSharedCssClassName.INLINE_CARD_CONTAINER}`]: {
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors
		'[data-inlinecard-button-overlay="icon-wrapper-line-height"] span': {
			// eslint-disable-next-line @atlaskit/design-system/use-tokens-typography
			lineHeight: 0,
		},
	},
});

// eslint-disable-next-line @atlaskit/design-system/no-css-tagged-template-expression, @atlaskit/ui-styling-standard/no-exported-styles -- Ignored via go/DSP-18766
export const smartCardStyles = css({
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors,@atlaskit/ui-styling-standard/no-unsafe-values
	[`.${SmartCardSharedCssClassName.INLINE_CARD_CONTAINER}`]: {
		maxWidth: 'calc(100% - 20px)',
		verticalAlign: 'top',
		wordBreak: 'break-all',

		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors
		'.card-with-comment': {
			background: token('color.background.accent.yellow.subtler'),
			borderBottom: `2px solid ${token('color.border.accent.yellow')}`,
			boxShadow: token('elevation.shadow.overlay'),
		},

		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors
		'.card': {
			paddingLeft: token('space.025', '2px'),
			paddingRight: token('space.025', '2px'),
			paddingTop: token('space.100', '0.5em'),
			paddingBottom: token('space.100', '0.5em'),
			marginBottom: token('space.negative.100', '-0.5em'),

			// eslint-disable-next-line @atlaskit/ui-styling-standard/no-unsafe-values
			[`.${SmartCardSharedCssClassName.LOADER_WRAPPER} > a:focus`]: [
				// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values
				boxShadowSelectionStyles,
				// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values
				hideNativeBrowserTextSelectionStyles,
			],
		},

		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-unsafe-values
		[`&.ak-editor-selected-node .${SmartCardSharedCssClassName.LOADER_WRAPPER} > a`]: [
			// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values
			boxShadowSelectionStyles,
			// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values
			hideNativeBrowserTextSelectionStyles,
		],

		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors,@atlaskit/ui-styling-standard/no-unsafe-values
		[`.${SmartCardSharedCssClassName.LOADER_WRAPPER} > a`]: {
			// EDM-1717: box-shadow Safari fix start
			zIndex: 1,
			position: 'relative',
		},

		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors
		'&.danger': {
			// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors,@atlaskit/ui-styling-standard/no-unsafe-values
			[`.${SmartCardSharedCssClassName.LOADER_WRAPPER} > a`]: {
				boxShadow: `0 0 0 1px ${token('color.border.danger')}`,
				// EDM-1717: box-shadow Safari fix start
				zIndex: 2,
				// EDM-1717: box-shadow Safari fix end
			},
		},
	},

	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors,@atlaskit/ui-styling-standard/no-unsafe-values
	[`.${SmartCardSharedCssClassName.BLOCK_CARD_CONTAINER}`]: {
		display: 'block',
		margin: '0.75rem 0 0',
		maxWidth: `${8 * 95}px`,

		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-unsafe-values
		[`&.ak-editor-selected-node .${SmartCardSharedCssClassName.LOADER_WRAPPER} > div`]: [
			// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values
			boxShadowSelectionStyles,
			// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values
			hideNativeBrowserTextSelectionStyles,
			{
				borderRadius: token('border.radius.200', '8px'),
			},
		],

		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors
		'&.danger': {
			// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors,@atlaskit/ui-styling-standard/no-unsafe-values
			[`.${SmartCardSharedCssClassName.LOADER_WRAPPER} > div`]: {
				// eslint-disable-next-line @atlaskit/ui-styling-standard/no-important-styles
				boxShadow: `0 0 0 1px ${token('color.border.danger')} !important`,
			},
		},
	},

	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors,@atlaskit/ui-styling-standard/no-unsafe-values
	[`.${SmartCardSharedCssClassName.DATASOURCE_CONTAINER}.${SmartCardSharedCssClassName.BLOCK_CARD_CONTAINER}`]:
		{
			maxWidth: '100%',
			display: 'flex',
			justifyContent: 'center',

			// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors,@atlaskit/ui-styling-standard/no-unsafe-values
			[`.${DATASOURCE_INNER_CONTAINER_CLASSNAME}`]: {
				cursor: 'pointer',
				backgroundColor: token('color.background.neutral.subtle'),
				borderRadius: token('border.radius.200', '8px'),
				border: `1px solid ${token('color.border')}`,
				overflow: 'hidden',
			},

			// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors
			'&.ak-editor-selected-node': {
				// eslint-disable-next-line @atlaskit/ui-styling-standard/no-unsafe-values
				[`.${DATASOURCE_INNER_CONTAINER_CLASSNAME}`]: [
					// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values
					boxShadowSelectionStyles,
					// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values
					hideNativeBrowserTextSelectionStyles,
					{
						'input::selection': {
							backgroundColor: token('color.background.selected.hovered'),
						},

						'input::-moz-selection': {
							backgroundColor: token('color.background.selected.hovered'),
						},
					},
				],
			},

			// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors
			'&.danger': {
				// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors,@atlaskit/ui-styling-standard/no-unsafe-values
				[`.${DATASOURCE_INNER_CONTAINER_CLASSNAME}`]: {
					boxShadow: `0 0 0 1px ${token('color.border.danger')}`,
				},
			},
		},

	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors,@atlaskit/ui-styling-standard/no-unsafe-values
	[`.${SmartCardSharedCssClassName.EMBED_CARD_CONTAINER}`]: {
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors,@atlaskit/ui-styling-standard/no-unsafe-values
		[`.${SmartCardSharedCssClassName.LOADER_WRAPPER} > div`]: {
			cursor: 'pointer',

			'&::after': {
				transition: 'box-shadow 0s',
			},
		},

		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-unsafe-values
		[`&.ak-editor-selected-node .${SmartCardSharedCssClassName.LOADER_WRAPPER} > div::after`]: [
			// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values
			boxShadowSelectionStyles,
			// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values
			hideNativeBrowserTextSelectionStyles,
		],

		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors
		'&.danger': {
			// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors
			'.media-card-frame::after': {
				// eslint-disable-next-line @atlaskit/ui-styling-standard/no-important-styles
				boxShadow: `0 0 0 1px ${token('color.border.danger')} !important`,
				// eslint-disable-next-line @atlaskit/ui-styling-standard/no-important-styles
				background: `${token('color.background.danger')} !important`,
			},

			// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors
			'.richMedia-resize-handle-right::after, .richMedia-resize-handle-left::after': {
				background: token('color.border.danger'),
			},
		},
	},

	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors,@atlaskit/ui-styling-standard/no-unsafe-values
	[`.${FLOATING_TOOLBAR_LINKPICKER_CLASSNAME}`]: {
		padding: 0,
	},
});

// eslint-disable-next-line @atlaskit/ui-styling-standard/no-exported-styles -- Ignored via go/DSP-18766
export const smartCardStylesWithSearchMatch = css({
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors,@atlaskit/ui-styling-standard/no-unsafe-values
	[`.${SmartCardSharedCssClassName.INLINE_CARD_CONTAINER}`]: {
		maxWidth: 'calc(100% - 20px)',
		verticalAlign: 'top',
		wordBreak: 'break-all',

		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors
		'.card-with-comment': {
			background: token('color.background.accent.yellow.subtler'),
			borderBottom: `2px solid ${token('color.border.accent.yellow')}`,
			boxShadow: token('elevation.shadow.overlay'),
		},

		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors
		'.card': {
			paddingLeft: token('space.025', '2px'),
			paddingRight: token('space.025', '2px'),
			paddingTop: token('space.100', '0.5em'),
			paddingBottom: token('space.100', '0.5em'),
			marginBottom: token('space.negative.100', '-0.5em'),

			// eslint-disable-next-line @atlaskit/ui-styling-standard/no-unsafe-values
			[`.${SmartCardSharedCssClassName.LOADER_WRAPPER} > a:focus`]: [
				// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values
				boxShadowSelectionStyles,
				// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values
				hideNativeBrowserTextSelectionStyles,
			],
		},

		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-unsafe-values
		[`&.ak-editor-selected-node .${SmartCardSharedCssClassName.LOADER_WRAPPER} > a`]: [
			// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values
			hideNativeBrowserTextSelectionStyles,
		],

		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-unsafe-values
		[`&.ak-editor-selected-node:not(.search-match-block) .${SmartCardSharedCssClassName.LOADER_WRAPPER} > a`]:
			// eslint-disable-next-line @atlaskit/ui-styling-standard/no-unsafe-values
			[
				// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values
				boxShadowSelectionStyles,
			],

		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors,@atlaskit/ui-styling-standard/no-unsafe-values
		[`.${SmartCardSharedCssClassName.LOADER_WRAPPER} > a`]: {
			// EDM-1717: box-shadow Safari fix start
			zIndex: 1,
			position: 'relative',
		},

		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors
		'&.danger': {
			// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors,@atlaskit/ui-styling-standard/no-unsafe-values
			[`.${SmartCardSharedCssClassName.LOADER_WRAPPER} > a`]: {
				boxShadow: `0 0 0 1px ${token('color.border.danger')}`,
				// EDM-1717: box-shadow Safari fix start
				zIndex: 2,
				// EDM-1717: box-shadow Safari fix end
			},
		},
	},

	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors,@atlaskit/ui-styling-standard/no-unsafe-values
	[`.${SmartCardSharedCssClassName.BLOCK_CARD_CONTAINER}`]: {
		display: 'block',
		margin: '0.75rem 0 0',
		maxWidth: `${8 * 95}px`,

		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-unsafe-values
		[`&.ak-editor-selected-node .${SmartCardSharedCssClassName.LOADER_WRAPPER} > div`]: [
			// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values
			boxShadowSelectionStyles,
			// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values
			hideNativeBrowserTextSelectionStyles,
			{
				borderRadius: token('border.radius.200', '8px'),
			},
		],

		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors
		'&.danger': {
			// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors,@atlaskit/ui-styling-standard/no-unsafe-values
			[`.${SmartCardSharedCssClassName.LOADER_WRAPPER} > div`]: {
				// eslint-disable-next-line @atlaskit/ui-styling-standard/no-important-styles
				boxShadow: `0 0 0 1px ${token('color.border.danger')} !important`,
			},
		},
	},

	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors,@atlaskit/ui-styling-standard/no-unsafe-values
	[`.${SmartCardSharedCssClassName.DATASOURCE_CONTAINER}.${SmartCardSharedCssClassName.BLOCK_CARD_CONTAINER}`]:
		{
			maxWidth: '100%',
			display: 'flex',
			justifyContent: 'center',

			// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors,@atlaskit/ui-styling-standard/no-unsafe-values
			[`.${DATASOURCE_INNER_CONTAINER_CLASSNAME}`]: {
				cursor: 'pointer',
				backgroundColor: token('color.background.neutral.subtle'),
				borderRadius: token('border.radius.200', '8px'),
				border: `1px solid ${token('color.border')}`,
				overflow: 'hidden',
			},

			// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors
			'&.ak-editor-selected-node': {
				// eslint-disable-next-line @atlaskit/ui-styling-standard/no-unsafe-values
				[`.${DATASOURCE_INNER_CONTAINER_CLASSNAME}`]: [
					// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values
					boxShadowSelectionStyles,
					// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values
					hideNativeBrowserTextSelectionStyles,
					{
						'input::selection': {
							backgroundColor: token('color.background.selected.hovered'),
						},

						'input::-moz-selection': {
							backgroundColor: token('color.background.selected.hovered'),
						},
					},
				],
			},

			// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors
			'&.danger': {
				// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors,@atlaskit/ui-styling-standard/no-unsafe-values
				[`.${DATASOURCE_INNER_CONTAINER_CLASSNAME}`]: {
					boxShadow: `0 0 0 1px ${token('color.border.danger')}`,
				},
			},
		},

	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors,@atlaskit/ui-styling-standard/no-unsafe-values
	[`.${SmartCardSharedCssClassName.EMBED_CARD_CONTAINER}`]: {
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors,@atlaskit/ui-styling-standard/no-unsafe-values
		[`.${SmartCardSharedCssClassName.LOADER_WRAPPER} > div`]: {
			cursor: 'pointer',

			'&::after': {
				transition: 'box-shadow 0s',
			},
		},

		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-unsafe-values
		[`&.ak-editor-selected-node .${SmartCardSharedCssClassName.LOADER_WRAPPER} > div::after`]: [
			// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values
			hideNativeBrowserTextSelectionStyles,
		],

		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-unsafe-values
		[`&.ak-editor-selected-node:not(.search-match-block) .${SmartCardSharedCssClassName.LOADER_WRAPPER} > div::after`]:
			// eslint-disable-next-line @atlaskit/ui-styling-standard/no-unsafe-values
			[
				// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values
				boxShadowSelectionStyles,
			],

		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors
		'&.danger': {
			// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors
			'.media-card-frame::after': {
				// eslint-disable-next-line @atlaskit/ui-styling-standard/no-important-styles
				boxShadow: `0 0 0 1px ${token('color.border.danger')} !important`,
				// eslint-disable-next-line @atlaskit/ui-styling-standard/no-important-styles
				background: `${token('color.background.danger')} !important`,
			},

			// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors
			'.richMedia-resize-handle-right::after, .richMedia-resize-handle-left::after': {
				background: token('color.border.danger'),
			},
		},
	},

	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors,@atlaskit/ui-styling-standard/no-unsafe-values
	[`.${FLOATING_TOOLBAR_LINKPICKER_CLASSNAME}`]: {
		padding: 0,
	},
});

// eslint-disable-next-line @atlaskit/ui-styling-standard/no-exported-styles
export const smartCardStylesWithSearchMatchAndPreviewPanelResponsiveness = css({
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-container-queries, @atlaskit/ui-styling-standard/no-unsafe-values, @atlaskit/ui-styling-standard/no-imported-style-values
	[`@container editor-area (max-width: ${akEditorFullPageNarrowBreakout}px)`]: {
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-unsafe-values, @atlaskit/ui-styling-standard/no-nested-selectors
		[`.${SmartCardSharedCssClassName.EMBED_CARD_CONTAINER}`]: {
			marginTop: token('space.150', '0.75rem'),
		},

		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-unsafe-values
		[`.${SmartCardSharedCssClassName.EMBED_CARD_CONTAINER}.ak-editor-selected-node .${SmartCardSharedCssClassName.LOADER_WRAPPER} > div`]:
			// eslint-disable-next-line @atlaskit/ui-styling-standard/no-unsafe-values
			[
				// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values
				boxShadowSelectionStyles,
				// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values
				hideNativeBrowserTextSelectionStyles,
				{
					borderRadius: token('border.radius.200', '8px'),
				},
			],
	},
});

// eslint-disable-next-line @atlaskit/ui-styling-standard/no-exported-styles
export const smartLinksInLivePagesStyles = css({
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors,@atlaskit/ui-styling-standard/no-unsafe-values
	[`.${SmartCardSharedCssClassName.BLOCK_CARD_CONTAINER}`]: {
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors,@atlaskit/ui-styling-standard/no-unsafe-values
		[`.${SmartCardSharedCssClassName.LOADER_WRAPPER} > div`]: {
			cursor: 'pointer',

			// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors
			a: {
				cursor: 'auto',
			},
		},
	},

	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors,@atlaskit/ui-styling-standard/no-unsafe-values
	[`.${SmartCardSharedCssClassName.EMBED_CARD_CONTAINER}`]: {
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors,@atlaskit/ui-styling-standard/no-unsafe-values
		[`.${SmartCardSharedCssClassName.LOADER_WRAPPER} > div`]: {
			// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors
			a: {
				cursor: 'auto',
			},
		},
	},
});

// eslint-disable-next-line @atlaskit/ui-styling-standard/no-exported-styles
export const linkingVisualRefreshV1Styles = css({
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors,@atlaskit/ui-styling-standard/no-unsafe-values
	[`.${SmartCardSharedCssClassName.BLOCK_CARD_CONTAINER}`]: {
		// EDM-11991: Fix list plugin adding padding to ADS AvatarGroup
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors
		'ul, ol': {
			paddingLeft: 'inherit',
		},
	},
});
