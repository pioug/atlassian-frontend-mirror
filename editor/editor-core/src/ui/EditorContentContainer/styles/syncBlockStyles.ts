// eslint-disable-next-line @atlaskit/ui-styling-standard/use-compiled
import { css, type SerializedStyles } from '@emotion/react';

import {
	BodiedSyncBlockSharedCssClassName,
	SyncBlockSharedCssClassName,
	SyncBlockLabelSharedCssClassName,
	SyncBlockStateCssClassName,
} from '@atlaskit/editor-common/sync-block';
import { token } from '@atlaskit/tokens';

// eslint-disable-next-line @atlaskit/ui-styling-standard/no-exported-styles
export const syncBlockStyles: SerializedStyles = css({
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors
	'.ProseMirror': {
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors, @atlaskit/ui-styling-standard/no-unsafe-values, @atlaskit/ui-styling-standard/no-imported-style-values
		[`.${SyncBlockSharedCssClassName.prefix}, .${BodiedSyncBlockSharedCssClassName.prefix}`]: {
			position: 'relative',
			cursor: 'pointer',
			borderRadius: token('radius.small', '3px'),
			marginRight: `-18px`,
			marginLeft: `-18px`,
			marginBottom: 0,
			marginTop: token('space.075', '6px'),
			paddingBlock: token('space.150', '12px'),
			color: 'inherit',

			/* Hover state */
			'&:hover': {
				// eslint-disable-next-line @atlaskit/design-system/ensure-design-token-usage
				boxShadow: `0px 0px 0px 1px ${token('color.border')}`,
				transition: 'box-shadow 200ms ease-in',

				// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors, @atlaskit/ui-styling-standard/no-unsafe-values, @atlaskit/ui-styling-standard/no-imported-style-values
				[`.${SyncBlockLabelSharedCssClassName.labelClassName}`]: {
					opacity: 1,
					visibility: 'visible',
					transition: 'opacity 200ms ease-in, visibility 200ms ease-in',
				},
			},

			/* Selection state when cursor inside sync block */
			// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors, @atlaskit/ui-styling-standard/no-unsafe-values, @atlaskit/ui-styling-standard/no-imported-style-values
			[`&.${BodiedSyncBlockSharedCssClassName.selectionInside}`]: {
				boxShadow: `0 0 0 1px ${token('color.border')}`,

				// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors, @atlaskit/ui-styling-standard/no-unsafe-values, @atlaskit/ui-styling-standard/no-imported-style-values
				[`.${SyncBlockLabelSharedCssClassName.labelClassName}`]: {
					opacity: 1,
					visibility: 'visible',
				},
			},

			/* Node selection state */
			// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors
			'&.ak-editor-selected-node': {
				boxShadow: `0 0 0 1px ${token('color.border.focused')}`,

				// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors, @atlaskit/ui-styling-standard/no-unsafe-values, @atlaskit/ui-styling-standard/no-imported-style-values
				[`.${SyncBlockLabelSharedCssClassName.labelClassName}`]: {
					opacity: 1,
					visibility: 'visible',
					backgroundColor: token('color.background.selected'),
					top: '-14px',
					paddingBottom: token('space.050', '4px'),
					paddingTop: token('space.050', '4px'),
					// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors
					'> span': {
						// eslint-disable-next-line @atlaskit/ui-styling-standard/no-important-styles
						color: `${token('color.text.selected')} !important`,
					},
				},
			},

			/* Danger state */
			// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors
			'&.danger': {
				boxShadow: `0 0 0 1px ${token('color.border.danger')}`,

				// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors
				'.ak-editor-panel__icon': {
					// eslint-disable-next-line @atlaskit/ui-styling-standard/no-important-styles
					color: `${token('color.icon.danger')} !important`,
				},

				// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors, @atlaskit/ui-styling-standard/no-unsafe-values, @atlaskit/ui-styling-standard/no-imported-style-values
				[`.${SyncBlockLabelSharedCssClassName.labelClassName}`]: {
					backgroundColor: token('color.background.danger'),
					top: '-14px',
					paddingBottom: token('space.050', '4px'),
					paddingTop: token('space.050', '4px'),
					// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors
					'> span': {
						// eslint-disable-next-line @atlaskit/ui-styling-standard/no-important-styles
						color: `${token('color.text.danger')} !important`,
					},
				},
			},

			/* Node disabled state */
			// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors, @atlaskit/ui-styling-standard/no-unsafe-selectors, @atlaskit/ui-styling-standard/no-unsafe-values, @atlaskit/ui-styling-standard/no-imported-style-values
			[`&.${SyncBlockStateCssClassName.disabledClassName}`]: {
				backgroundColor: token('color.background.disabled'),
				boxShadow: `0 0 0 1px ${token('color.border.disabled')}`,
				userSelect: 'none',

				// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors, @atlaskit/ui-styling-standard/no-unsafe-values,  @atlaskit/ui-styling-standard/no-imported-style-values
				[`.${SyncBlockLabelSharedCssClassName.labelClassName}`]: {
					backgroundColor: token('elevation.surface'),

					'&::before': {
						border: 'none',
					},
				},
			},

			/* Error state */
			/* In error state sync block should have disabled background colour */
			// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors, @atlaskit/ui-styling-standard/no-unsafe-values, @atlaskit/ui-styling-standard/no-imported-style-values
			[`:has(.${SyncBlockSharedCssClassName.error})`]: {
				backgroundColor: token('color.background.disabled'),
			},

			// eslint-disable-next-line @atlaskit/ui-styling-standard/no-unsafe-values, @atlaskit/ui-styling-standard/no-imported-style-values
			[`:has(.${SyncBlockSharedCssClassName.loading})`]: {
				boxShadow: `0 0 0 1px ${token('color.border')}`,

				// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors, @atlaskit/ui-styling-standard/no-unsafe-values, @atlaskit/ui-styling-standard/no-imported-style-values
				[`.${SyncBlockLabelSharedCssClassName.labelClassName}`]: {
					opacity: 0,
					visibility: 'hidden',
				},
			},

			/* Live doc view mode state */
			// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors, @atlaskit/ui-styling-standard/no-unsafe-selectors, @atlaskit/ui-styling-standard/no-unsafe-values, @atlaskit/ui-styling-standard/no-imported-style-values
			[`&.${SyncBlockStateCssClassName.viewModeClassName}`]: {
				boxShadow: 'none',
				backgroundColor: 'unset',

				// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors, @atlaskit/ui-styling-standard/no-unsafe-values, @atlaskit/ui-styling-standard/no-imported-style-values
				[`.${SyncBlockLabelSharedCssClassName.labelClassName}`]: {
					opacity: 0,
					visibility: 'hidden',
				},
			},

			// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors, @atlaskit/ui-styling-standard/no-unsafe-values, @atlaskit/ui-styling-standard/no-imported-style-values
			[`.${BodiedSyncBlockSharedCssClassName.content}`]: {
				padding: '0 18px',
				cursor: 'text',
			},

			// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors, @atlaskit/ui-styling-standard/no-unsafe-values, @atlaskit/ui-styling-standard/no-imported-style-values
			[`.${SyncBlockSharedCssClassName.renderer}`]: {
				padding: '0 18px',
			},
		},
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors, @atlaskit/ui-styling-standard/no-unsafe-values, @atlaskit/ui-styling-standard/no-imported-style-values
		[`.${BodiedSyncBlockSharedCssClassName.content}`]: {
			// First child node that has drag handle widget next to it is overridden with marginTop: 0, see globalStyles in editor-plugin-block-controls/src/ui/global-styles.tsx
			// Hence we set marginTop: 0 when by default to avoid flickering when hovering on and off the first node
			// eslint-disable-next-line @atlaskit/ui-styling-standard/no-unsafe-selectors, @atlaskit/ui-styling-standard/no-nested-selectors
			'> :nth-child(1 of :not(style, .ProseMirror-gapcursor, .ProseMirror-widget, span))': {
				marginTop: 0,
			},
		},
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors, @atlaskit/ui-styling-standard/no-unsafe-selectors, @atlaskit/ui-styling-standard/no-unsafe-values, @atlaskit/ui-styling-standard/no-imported-style-values
		[`.${SyncBlockSharedCssClassName.renderer}`]: {
			// First child node in bodiedSyncBlock is overridden with marginTop: 0, hence apply the same style to syncBlock for consistency
			// eslint-disable-next-line @atlaskit/ui-styling-standard/no-unsafe-selectors, @atlaskit/ui-styling-standard/no-nested-selectors
			'.ak-renderer-document > :first-child': {
				marginTop: 0,
			},
		},
	},

	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors, @atlaskit/ui-styling-standard/no-unsafe-values, @atlaskit/ui-styling-standard/no-imported-style-values
	[`.${SyncBlockLabelSharedCssClassName.labelClassName}`]: {
		borderRadius: token('radius.small', '3px'),
		position: 'absolute',
		gap: token('space.050', '4px'),
		justifyContent: 'center',
		alignItems: 'center',
		display: 'flex',
		opacity: 0,
		visibility: 'hidden',
		boxShadow: 'none',
		zIndex: 1,

		paddingLeft: token('space.100', '8px'),
		paddingRight: token('space.100', '8px'),

		top: '-10px',
		right: token('space.150', '12px'),
		backgroundColor: token('elevation.surface'),
		maxWidth: '140px',
	},
});

// eslint-disable-next-line @atlaskit/ui-styling-standard/no-exported-styles
export const syncBlockOverflowStyles: SerializedStyles = css({
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors
	'.ProseMirror': {
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors, @atlaskit/ui-styling-standard/no-unsafe-values, @atlaskit/ui-styling-standard/no-imported-style-values
		[`.${BodiedSyncBlockSharedCssClassName.content}`]: {
			// Contain floated elements (wrap-left/wrap-right) within synced block borders
			overflow: 'hidden',
		},
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors, @atlaskit/ui-styling-standard/no-unsafe-values, @atlaskit/ui-styling-standard/no-imported-style-values
		[`.${SyncBlockSharedCssClassName.renderer}`]: {
			// Contain floated elements (wrap-left/wrap-right) within synced block borders
			overflow: 'hidden',
		},
	},
});
