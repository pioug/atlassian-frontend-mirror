// eslint-disable-next-line @atlaskit/ui-styling-standard/use-compiled
import { css } from '@emotion/react';

import { token } from '@atlaskit/tokens';

// eslint-disable-next-line @atlaskit/ui-styling-standard/no-exported-styles
export const panelStyles = css({
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors
	'.ProseMirror': {
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors
		'.ak-editor-panel': {
			cursor: 'pointer',

			/* Danger when top level node */
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
			},

			// panelSharedStyles()
			// panelSharedStylesWithoutPrefix()
			borderRadius: token('border.radius', '3px'),
			margin: `0.75rem 0 0`,
			paddingTop: token('space.100', '8px'),
			paddingRight: token('space.200', '16px'),
			paddingBottom: token('space.100', '8px'),
			paddingLeft: token('space.100', '8px'),
			minWidth: '48px',
			display: 'flex',
			position: 'relative',
			alignItems: 'normal',
			wordBreak: 'break-word',

			// mainDynamicStyles(PanelType.INFO)
			// > getPanelTypeBackground(PanelType.INFO)
			backgroundColor: token('color.background.accent.blue.subtlest'),
			color: 'inherit',

			// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors
			'.ak-editor-panel__icon': {
				flexShrink: 0,
				height: token('space.300', '24px'),
				width: token('space.300', '24px'),
				boxSizing: 'content-box',
				paddingRight: token('space.100', '8px'),
				textAlign: 'center',
				userSelect: 'none',
				'-moz-user-select': 'none',
				'-webkit-user-select': 'none',
				'-ms-user-select': 'none',
				// eslint-disable-next-line @atlaskit/design-system/use-tokens-space
				marginTop: '0.1em',

				// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors
				'> span': {
					verticalAlign: 'middle',
					display: 'inline-flex',
				},

				// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors
				'.emoji-common-emoji-sprite': {
					verticalAlign: '-2px', // -(8*3-20)/2 [px]
				},

				// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors
				'.emoji-common-emoji-image': {
					verticalAlign: '-3px', // panelEmojiSpriteVerticalAlignment - 1 [px]

					/* Vertical align only works for inline-block elements in Firefox */
					// eslint-disable-next-line @atlaskit/ui-styling-standard/no-unsafe-selectors
					'@-moz-document url-prefix()': {
						// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors
						img: {
							display: 'inline-block',
						},
					},
				},
			},

			// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors
			'.ak-editor-panel__content': {
				margin: `${token('space.025', '2px')} 0 ${token('space.025', '2px')}`,
				flex: '1 0 0',
				/*
					https://ishadeed.com/article/min-max-css/#setting-min-width-to-zero-with-flexbox
					The default value for min-width is auto, which is computed to zero.
					When an element is a flex item, the value of min-width doesn’t compute to zero.
					The minimum size of a flex item is equal to the size of its contents.
				*/
				minWidth: 0,
			},

			// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors
			'&[data-panel-type="note"]': {
				// mainDynamicStyles(PanelType.NOTE)
				backgroundColor: token('color.background.accent.purple.subtlest'),
				color: 'inherit',
			},
			// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors
			'&[data-panel-type="tip"]': {
				// mainDynamicStyles(PanelType.TIP)
				backgroundColor: token('color.background.accent.green.subtlest'),
				color: 'inherit',
			},
			// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors
			'&[data-panel-type="warning"]': {
				// mainDynamicStyles(PanelType.WARNING)
				backgroundColor: token('color.background.accent.yellow.subtlest'),
				color: 'inherit',
			},
			// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors
			'&[data-panel-type="error"]': {
				// mainDynamicStyles(PanelType.ERROR)
				backgroundColor: token('color.background.accent.red.subtlest'),
				color: 'inherit',
			},
			// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors
			'&[data-panel-type="success"]': {
				// mainDynamicStyles(PanelType.SUCCESS)
				backgroundColor: token('color.background.accent.green.subtlest'),
				color: 'inherit',
			},
		},

		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors
		'.ak-editor-panel__content': {
			cursor: 'text',
		},

		/* Danger when nested node */
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors
		'.danger .ak-editor-panel': {
			// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors
			'&[data-panel-type]': {
				backgroundColor: token('color.blanket.danger'),

				// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors
				'.ak-editor-panel__icon': {
					color: token('color.icon.danger'),
				},
			},
		},
	},

	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors, @atlaskit/ui-styling-standard/no-unsafe-selectors
	'.ak-editor-panel.ak-editor-selected-node:not(.danger)': {
		// getSelectionStyles([SelectionStyle.BoxShadow, SelectionStyle.Blanket]),
		// SelectionStyle.BoxShadow
		boxShadow: `0 0 0 1px ${token('color.border.selected')}`,
		borderColor: 'transparent',
		// SelectionStyle.Blanket
		position: 'relative',
		// Fixes ED-9263, where emoji or inline card in panel makes selection go outside the panel
		// in Safari. Looks like it's caused by user-select: all in the emoji element
		'-webkit-user-select': 'text',
		'&::before': {
			position: 'absolute',
			content: '""',
			left: 0,
			right: 0,
			top: 0,
			bottom: 0,
			width: '100%',
			pointerEvents: 'none',
			zIndex: 12, // akEditorSmallZIndex
			backgroundColor: token('color.blanket.selected'),
		},
		// hideNativeSelectionStyles
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors
		'&::selection, *::selection': {
			backgroundColor: 'transparent',
		},
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors, @atlaskit/ui-styling-standard/no-unsafe-selectors
		'&::-moz-selection, *::-moz-selection': {
			backgroundColor: 'transparent',
		},
	},
});

// eslint-disable-next-line @atlaskit/ui-styling-standard/no-exported-styles
export const panelStylesMixin_fg_platform_editor_add_border_for_nested_panel = css({
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors
	'.ProseMirror': {
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors
		'.ak-editor-panel': {
			// Support nested panel
			// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors
			'.ak-editor-panel__content .ak-editor-panel': {
				border: `1px solid ${token('color.border')}`,
			},
		},
	},
});

// eslint-disable-next-line @atlaskit/ui-styling-standard/no-exported-styles
export const panelStylesMixin_fg_platform_editor_nested_dnd_styles_changes = css({
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors
	'.ProseMirror': {
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors
		'.ak-editor-panel': {
			// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors
			'&.ak-editor-panel__no-icon': {
				paddingRight: token('space.150', '12px'),
				paddingLeft: token('space.150', '12px'),
			},
		},
	},
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors
	'.ak-editor-content-area.appearance-full-page .ProseMirror': {
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors
		'.ak-editor-panel .ak-editor-panel__icon': {
			paddingRight: token('space.150', '12px'),
		},
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors
		'.ak-editor-panel.ak-editor-panel__no-icon': {
			paddingLeft: token('space.250', '20px'),
			paddingRight: token('space.250', '20px'),
		},
	},
	/* Don't want extra padding for inline editor (nested) */
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors
	'.ak-editor-content-area .ak-editor-content-area .ProseMirror': {
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors
		'.ak-editor-panel .ak-editor-panel__icon': {
			paddingRight: token('space.100', '8px'),
		},
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors
		'.ak-editor-panel.ak-editor-panel__no-icon': {
			paddingRight: token('space.150', '12px'),
			paddingLeft: token('space.150', '12px'),
		},
	},
});

// eslint-disable-next-line @atlaskit/ui-styling-standard/no-exported-styles
export const panelStylesMixin_fg_platform_editor_lcm_nested_panel_icon_fix = css({
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors
	'.ProseMirror': {
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors
		'.ak-editor-panel': {
			// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors
			'&[data-panel-type="info"]': {
				// getIconStyles(PanelType.INFO),
				// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors
				'.ak-editor-panel__icon[data-panel-type="info"]': {
					color: token('color.icon.information'),
				},
			},
			// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors
			'&[data-panel-type="note"]': {
				// getIconStyles(PanelType.NOTE),
				// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors
				'.ak-editor-panel__icon[data-panel-type="note"]': {
					color: token('color.icon.discovery'),
				},
			},
			// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors
			'&[data-panel-type="tip"]': {
				// getIconStyles(PanelType.TIP),
				// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors
				'.ak-editor-panel__icon[data-panel-type="tip"]': {
					color: token('color.icon.success'),
				},
			},
			// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors
			'&[data-panel-type="warning"]': {
				// getIconStyles(PanelType.WARNING),
				// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors
				'.ak-editor-panel__icon[data-panel-type="warning"]': {
					color: token('color.icon.warning'),
				},
			},
			// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors
			'&[data-panel-type="error"]': {
				// getIconStyles(PanelType.ERROR),
				// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors
				'.ak-editor-panel__icon[data-panel-type="error"]': {
					color: token('color.icon.danger'),
				},
			},
			// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors
			'&[data-panel-type="success"]': {
				// getIconStyles(PanelType.SUCCESS),
				// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors
				'.ak-editor-panel__icon[data-panel-type="success"]': {
					color: token('color.icon.success'),
				},
			},
		},
	},
});

// eslint-disable-next-line @atlaskit/ui-styling-standard/no-exported-styles
export const panelStylesMixin_without_fg_platform_editor_lcm_nested_panel_icon_fix = css({
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors
	'.ProseMirror': {
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors
		'.ak-editor-panel': {
			// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors
			'&[data-panel-type="info"]': {
				// getIconStyles(PanelType.INFO),
				// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors
				'.ak-editor-panel__icon': {
					color: token('color.icon.information'),
				},
			},
			// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors
			'&[data-panel-type="note"]': {
				// getIconStyles(PanelType.NOTE),
				// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors
				'.ak-editor-panel__icon': {
					color: token('color.icon.discovery'),
				},
			},
			// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors
			'&[data-panel-type="tip"]': {
				// getIconStyles(PanelType.TIP),
				// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors
				'.ak-editor-panel__icon': {
					color: token('color.icon.success'),
				},
			},
			// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors
			'&[data-panel-type="warning"]': {
				// getIconStyles(PanelType.WARNING),
				// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors
				'.ak-editor-panel__icon': {
					color: token('color.icon.warning'),
				},
			},
			// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors
			'&[data-panel-type="error"]': {
				// getIconStyles(PanelType.ERROR),
				// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors
				'.ak-editor-panel__icon': {
					color: token('color.icon.danger'),
				},
			},
			// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors
			'&[data-panel-type="success"]': {
				// getIconStyles(PanelType.SUCCESS),
				// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors
				'.ak-editor-panel__icon': {
					color: token('color.icon.success'),
				},
			},
		},
	},
});
