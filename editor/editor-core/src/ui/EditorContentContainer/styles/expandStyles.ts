// eslint-disable-next-line @atlaskit/ui-styling-standard/use-compiled
import { css, type SerializedStyles } from '@emotion/react';

import {
	akEditorFullPageDefaultFontSize,
	akEditorSwoopCubicBezier,
} from '@atlaskit/editor-shared-styles';
import { token } from '@atlaskit/tokens';

// eslint-disable-next-line @atlaskit/ui-styling-standard/no-exported-styles
export const expandStyles: SerializedStyles = css({
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors
	'.ak-editor-expand__icon > div': {
		display: 'flex',
	},
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors
	'.ak-editor-expand': {
		// sharedExpandStyles.containerStyles({ expanded: false, focused: false })(),
		borderWidth: token('border.width'),
		borderStyle: 'solid',
		borderColor: 'transparent',
		borderRadius: token('radius.small', '4px'),
		minHeight: '25px',
		background: token('color.background.neutral.subtle', 'transparent'),
		margin: `${token('space.050', '0.25rem')} 0 0`,
		transition:
			'background 0.3s cubic-bezier(0.15, 1, 0.3, 1), border-color 0.3s cubic-bezier(0.15, 1, 0.3, 1)',
		padding: token('space.100', '8px'),
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors, @atlaskit/ui-styling-standard/no-unsafe-selectors
		'td > :not(style):first-child, td > style:first-child + *': {
			marginTop: 0,
		},

		cursor: 'pointer',
		boxSizing: 'border-box',

		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors, @atlaskit/ui-styling-standard/no-unsafe-selectors
		'td > &': {
			marginTop: 0,
		},

		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors
		'.ak-editor-expand__icon-container svg': {
			color: token('color.icon.subtle'),
			transform: 'rotate(90deg)',
		},

		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors, @atlaskit/ui-styling-standard/no-unsafe-selectors
		'&.ak-editor-selected-node:not(.danger)': {
			// SelectionStyle.Blanket
			position: 'relative',
			// Fixes ED-9263, where emoji or inline card in panel makes selection go outside the panel
			// in Safari. Looks like it's caused by user-select: all in the emoji element
			WebkitUserSelect: 'text',
			'&::before': {
				position: 'absolute',
				content: "''",
				left: 0,
				right: 0,
				top: 0,
				bottom: 0,
				width: '100%',
				pointerEvents: 'none',
				zIndex: 12, // akEditorStickyheaderZIndex (11) + 1
				backgroundColor: token('color.blanket.selected'),
			},

			// SelectionStyle.Border (common case)
			border: `${token('border.width')} solid ${token('color.border.selected')}`,
			// If fg('platform_editor_nested_dnd_styles_changes') is true,
			// then we'll also need the rest of the selection styles for blanket

			// hideNativeBrowserTextSelectionStyles
			// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors
			'&::selection, *::selection': {
				backgroundColor: 'transparent',
			},
			// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors, @atlaskit/ui-styling-standard/no-unsafe-selectors
			'&::-moz-selection, *::-moz-selection': {
				backgroundColor: 'transparent',
			},
		},

		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors
		'&.danger': {
			background: token('color.background.danger'),
			borderColor: token('color.border.danger'),
		},
	},

	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors
	'.ProseMirror > .ak-editor-expand__type-expand, .fabric-editor-breakout-mark-dom > .ak-editor-expand__type-expand':
		{
			marginLeft: token('space.negative.150'),
			marginRight: token('space.negative.150'),
		},

	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors
	'.ak-editor-expand__content': {
		// sharedExpandStyles.contentStyles({ expanded: false, focused: false })(),
		paddingTop: token('space.0', '0px'),
		paddingRight: token('space.100', '8px'),
		paddingLeft: token('space.300', '24px'),
		marginLeft: token('space.050', '4px'),
		display: 'flow-root',
		/* The follow rules inside @supports block are added as a part of ED-8893
			The fix is targeting mobile bridge on iOS 12 or below,
			We should consider remove this fix when we no longer support iOS 12 */
		'@supports not (display: flow-root)': {
			width: '100%',
			boxSizing: 'border-box',
		},
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors
		'.expand-content-wrapper, .nestedExpand-content-wrapper': {
			/* We visually hide the content here to preserve the content during copy+paste */
			/* Do not add text nowrap here because inline comment navigation depends on the location of the text */
			width: '100%',
			display: 'block',
			height: 0,
			overflow: 'hidden',
			clip: 'rect(1px, 1px, 1px, 1px)',
			userSelect: 'none',
		},

		cursor: 'text',
	},

	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors
	'.ak-editor-expand__title-input': {
		// sharedExpandStyles.titleInputStyles(),
		outline: 'none',
		border: 'none',
		// eslint-disable-next-line @atlaskit/design-system/use-tokens-typography
		fontSize: 'calc(14rem / 16)', // relativeFontSizeToBase16(14),
		// eslint-disable-next-line @atlaskit/design-system/use-tokens-typography
		lineHeight: 1.714, // If fg('platform-visual-refresh-icons') then this needs to be overridden
		fontWeight: token('font.weight.regular'),
		color: token('color.text.subtlest'),
		background: 'transparent',
		display: 'flex',
		flex: 1,
		padding: `0 0 0 ${token('space.050', '4px')}`,
		width: '100%',
		'&::placeholder': {
			opacity: 1,
			color: token('color.text.subtlest'),
		},
	},

	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors
	'.ak-editor-expand__title-container': {
		// sharedExpandStyles.titleContainerStyles(),
		padding: 0,
		display: 'flex',
		// Omitting alignItems: 'flex-start' as it would be overridden
		background: 'none',
		border: 'none',
		// eslint-disable-next-line @atlaskit/design-system/use-tokens-typography
		fontSize: 'calc(14rem / 16)', // relativeFontSizeToBase16(14),
		width: '100%',
		color: token('color.text.subtle'),
		// Omitting overflow: 'hidden' as it would be overridden
		cursor: 'pointer',
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors
		'&:focus': {
			outline: 0,
		},

		alignItems: 'center',
		overflow: 'visible',
	},

	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors
	'.ak-editor-expand__icon-button': {
		appearance: 'none',
		width: token('space.300', '24px'),
		height: token('space.300', '24px'),
		border: 'none',
		borderRadius: token('radius.small', '4px'),
		background: token('color.background.neutral.subtle'),
		padding: 0,
		margin: 0,
		display: 'flex',
		alignItems: 'center',
		justifyContent: 'center',
		cursor: 'pointer',

		'&:disabled': {
			cursor: 'not-allowed',
		},

		'&:focus-visible': {
			outline: `${token('border.width.focused')} solid ${token('color.border.focused')}`,
			outlineOffset: token('space.025', '2px'),
		},

		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-unsafe-selectors
		'&:hover:not(:disabled)': {
			background: token('color.background.neutral.subtle.hovered'),
		},

		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors
		'.ak-editor-expand__icon-svg': {
			color: token('color.icon.subtle'),
			transform: 'rotate(0deg)',
			// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values,@atlaskit/ui-styling-standard/no-unsafe-values
			transition: `transform 0.2s ${akEditorSwoopCubicBezier};`,
		},
	},

	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors
	'.ak-editor-expand__expanded': {
		background: token('color.background.neutral.subtle'),
		borderColor: token('color.border'),

		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors
		'.ak-editor-expand__content': {
			paddingTop: token('space.100', '8px'),
			// If fg('platform_editor_nested_dnd_styles_changes') then this needs to be extended
		},

		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors
		'.ak-editor-expand__icon-button': {
			// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors
			'.ak-editor-expand__icon-svg': {
				transform: 'rotate(90deg)',
			},
		},
	},

	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors
	'.ak-editor-expand__input-container': {
		width: '100%',
	},

	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors, @atlaskit/ui-styling-standard/no-unsafe-selectors
	'.ak-editor-expand:not(.ak-editor-expand__expanded)': {
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors
		'.ak-editor-expand__content': {
			position: 'absolute',
			height: '1px',
			width: '1px',
			overflow: 'hidden',
			clip: 'rect(1px, 1px, 1px, 1px)',
			whiteSpace: 'nowrap',
		},

		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors
		'.ak-editor-expand__icon-container svg': {
			color: token('color.icon.subtle'),
			transform: 'rotate(0deg)',
		},

		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-unsafe-selectors
		'&:not(.ak-editor-selected-node):not(.danger)': {
			background: 'transparent',
			borderColor: 'transparent',

			'&:hover': {
				borderColor: token('color.border'),
				background: token('color.background.neutral.subtle'),
			},
		},
	},
});

/**
 * This function gets the dynamic styles that scale the expand title font size based on the base font size.
 * If the base font size is not the default font size, we want the expand title font size to match the base font size.
 * @param baseFontSize - The base font size in pixels. (e.g., 16 for default, 13 for dense mode)
 * @returns SerializedStyles with expand title font size override if baseFontSize is provided and different from default.
 */
export const getDenseExpandTitleStyles = (baseFontSize?: number): SerializedStyles => {
	if (!baseFontSize || baseFontSize === akEditorFullPageDefaultFontSize) {
		return css({});
	}

	return css({
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors
		'.ak-editor-expand__title-input': {
			// eslint-disable-next-line @atlaskit/design-system/use-tokens-typography, @atlaskit/ui-styling-standard/no-unsafe-values
			fontSize: `${baseFontSize}px`,
		},
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors
		'.ak-editor-expand__title-container': {
			// eslint-disable-next-line @atlaskit/design-system/use-tokens-typography, @atlaskit/ui-styling-standard/no-unsafe-values
			fontSize: `${baseFontSize}px`,
		},
	});
};

// eslint-disable-next-line @atlaskit/ui-styling-standard/no-exported-styles
export const expandStylesMixin_fg_platform_visual_refresh_icons: SerializedStyles = css({
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors
	'.ak-editor-expand__title-input': {
		// eslint-disable-next-line @atlaskit/design-system/use-tokens-typography
		lineHeight: 1,
		fontFamily: token('font.family.body'),
	},
});

// eslint-disable-next-line @atlaskit/ui-styling-standard/no-exported-styles
export const expandStylesMixin_fg_platform_editor_nested_dnd_styles_changes: SerializedStyles = css(
	{
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors
		'.ak-editor-content-area.appearance-full-page .ProseMirror > .ak-editor-expand__type-expand, .fabric-editor-breakout-mark-dom > .ak-editor-expand__type-expand':
			{
				marginLeft: token('space.negative.250'),
				marginRight: token('space.negative.250'),
			},

		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors
		'.ak-editor-expand__expanded': {
			// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors
			'.ak-editor-expand__content': {
				// firstNodeWithNotMarginTop
				// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors, @atlaskit/ui-styling-standard/no-unsafe-selectors
				'> :nth-child(1 of :not(style, .ProseMirror-gapcursor, .ProseMirror-widget, span))': {
					marginTop: 0,
				},
				// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors
				'> div.ak-editor-expand[data-node-type="nestedExpand"]': {
					marginTop: token('space.050', '0.25rem'),
				},
			},
		},
	},
);

// eslint-disable-next-line @atlaskit/ui-styling-standard/no-exported-styles
export const expandStylesMixin_without_fg_platform_editor_nested_dnd_styles_changes: SerializedStyles =
	css({
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors
		'.ak-editor-expand': {
			// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors, @atlaskit/ui-styling-standard/no-unsafe-selectors
			'&.ak-editor-selected-node:not(.danger)': {
				// SelectionStyle.Border (with fg('platform_editor_nested_dnd_styles_changes'))
				// Fixes ED-15246: Trello card is visible through a border of a table border
				'&::after': {
					height: '100%',
					content: "'\\00a0'",
					background: token('color.border.selected'),
					position: 'absolute',
					right: '-1px',
					top: 0,
					bottom: 0,
					width: '1px',
					border: 'none',
					display: 'inline-block',
				},
			},
		},
	});
