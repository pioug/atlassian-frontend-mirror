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
			marginTop: token('space.150', '12px'),
			// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values, @atlaskit/ui-styling-standard/no-unsafe-values
			marginRight: `-18px`,
			// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values, @atlaskit/ui-styling-standard/no-unsafe-values
			marginLeft: `-18px`,
			marginBottom: 0,
			paddingTop: token('space.050', '4px'),
			paddingBottom: token('space.050', '4px'),
			color: 'inherit',

			/* Hover state */
			'&:hover': {
				// eslint-disable-next-line @atlaskit/design-system/ensure-design-token-usage
				boxShadow: `0px 0px 0px 1px ${token('color.border')}`,

				// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors, @atlaskit/ui-styling-standard/no-unsafe-values, @atlaskit/ui-styling-standard/no-imported-style-values
				[`.${SyncBlockLabelSharedCssClassName.labelClassName}`]: {
					opacity: 1,
					visibility: 'visible',
				},
			},

			/* Selection state when cursor inside sync block */
			// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors, @atlaskit/ui-styling-standard/no-unsafe-values, @atlaskit/ui-styling-standard/no-imported-style-values
			[`&.${BodiedSyncBlockSharedCssClassName.selectionInside}`]: {
				boxShadow: `0 0 0 1px ${token('color.border.focused')}`,

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
				backgroundColor: token('color.background.selected'),

				// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors, @atlaskit/ui-styling-standard/no-unsafe-values, @atlaskit/ui-styling-standard/no-imported-style-values
				[`.${SyncBlockLabelSharedCssClassName.labelClassName}`]: {
					opacity: 1,
					visibility: 'visible',
					backgroundColor: token('color.background.selected'),

					'&::before': {
						content: '""',
						position: 'absolute',
						top: '-1px',
						left: '-1px',
						right: '-1px',
						bottom: '-1px',
						border: `1px solid ${token('color.border.focused')}`,
						borderRadius: token('radius.small', '3px'),
						mask: 'linear-gradient(to bottom, black 55%, transparent 55%)',
						WebkitMask: 'linear-gradient(to bottom, black 55%, transparent 55%)',
						pointerEvents: 'none',
						zIndex: -1,
					},
				},
			},

			/* Danger state */
			// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors
			'&.danger': {
				boxShadow: `0 0 0 1px ${token('color.border.danger')}`,
				// eslint-disable-next-line @atlaskit/ui-styling-standard/no-important-styles
				backgroundColor: `${token('color.background.danger')} !important`,

				// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors
				'.ak-editor-panel__icon': {
					// eslint-disable-next-line @atlaskit/ui-styling-standard/no-important-styles
					color: `${token('color.icon.danger')} !important`,
				},

				// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors, @atlaskit/ui-styling-standard/no-unsafe-values, @atlaskit/ui-styling-standard/no-imported-style-values
				[`.${SyncBlockLabelSharedCssClassName.labelClassName}`]: {
					backgroundColor: token('color.background.danger'),

					'&::before': {
						content: '""',
						position: 'absolute',
						top: '-1px',
						left: '-1px',
						right: '-1px',
						bottom: '-1px',
						border: `1px solid ${token('color.border.danger')}`,
						borderRadius: token('radius.small', '3px'),
						mask: 'linear-gradient(to bottom, black 55%, transparent 55%)',
						WebkitMask: 'linear-gradient(to bottom, black 55%, transparent 55%)',
						pointerEvents: 'none',
						zIndex: -1,
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
			/* In error state sync block should not have hover styles or show the label */
			// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors, @atlaskit/ui-styling-standard/no-unsafe-values, @atlaskit/ui-styling-standard/no-imported-style-values
			[`:has(.${SyncBlockSharedCssClassName.error})`]: {
				backgroundColor: token('color.background.disabled'),
				boxShadow: `0 0 0 1px ${token('color.border')}`,

				// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors, @atlaskit/ui-styling-standard/no-unsafe-values, @atlaskit/ui-styling-standard/no-imported-style-values
				[`.${SyncBlockLabelSharedCssClassName.labelClassName}`]: {
					opacity: 1,
					visibility: 'visible',
					backgroundColor: token('elevation.surface'),

					'&::before': {
						border: 'none',
					},
				}
			},

			// eslint-disable-next-line @atlaskit/ui-styling-standard/no-unsafe-values, @atlaskit/ui-styling-standard/no-imported-style-values
			[`:has(.${SyncBlockSharedCssClassName.loading})`]: {
				boxShadow: `0 0 0 1px ${token('color.border')}`,

				// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors, @atlaskit/ui-styling-standard/no-unsafe-values, @atlaskit/ui-styling-standard/no-imported-style-values
				[`.${SyncBlockLabelSharedCssClassName.labelClassName}`]: {
					opacity: 0,
					visibility: 'hidden',
				}
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
	},

	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors, @atlaskit/ui-styling-standard/no-unsafe-values, @atlaskit/ui-styling-standard/no-imported-style-values
	[`.${SyncBlockLabelSharedCssClassName.labelClassName}`]: {
		color: token('color.text.subtle'),
		borderRadius: token('radius.small', '3px'),
		position: 'absolute',
		gap: token('space.050', '4px'),
		justifyContent: 'center',
		alignItems: 'center',
		display: 'flex',
		opacity: 0,
		visibility: 'hidden',

		paddingLeft: token('space.100', '8px'),
		paddingRight: token('space.100', '8px'),
		paddingBottom: token('space.050', '4px'),
		paddingTop: token('space.050', '4px'),

		top: token('space.negative.200', '-16px'),
		right: token('space.150', '12px'),
		backgroundColor: token('elevation.surface'),
		maxWidth: '140px',
	},
});
