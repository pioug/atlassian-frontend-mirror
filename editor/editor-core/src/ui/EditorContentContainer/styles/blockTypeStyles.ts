// eslint-disable-next-line @atlaskit/ui-styling-standard/use-compiled
import { css, type SerializedStyles } from '@emotion/react';

import { token } from '@atlaskit/tokens';

// eslint-disable-next-line @atlaskit/ui-styling-standard/no-exported-styles
export const blocktypeStyles: SerializedStyles = css({
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors
	'.ProseMirror': {
		// Block Quote Shared Styles
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors
		'& blockquote': {
			boxSizing: 'border-box',
			color: 'inherit',
			width: '100%',
			display: 'inline-block',
			paddingLeft: token('space.200', '16px'),
			borderLeftWidth: token('border.width.selected'),
			borderLeftStyle: 'solid',
			borderLeftColor: token('color.border'),
			margin: '0.75rem 0 0 0', // From https://docs.google.com/spreadsheets/d/1iYusRGCT4PoPfvxbJ8NrgjtfFgXLm5lpDWXzjua1W2E/edit#gid=93913128
			marginRight: 0,
			// eslint-disable-next-line @atlaskit/ui-styling-standard/no-unsafe-selectors, @atlaskit/ui-styling-standard/no-nested-selectors
			'[dir="rtl"] &': {
				paddingLeft: 0,
				paddingRight: token('space.200', '16px'),
			},
			// eslint-disable-next-line @atlaskit/ui-styling-standard/no-unsafe-selectors
			'&:first-child': {
				marginTop: 0,
			},
			'&::before': {
				content: "''",
			},
			'&::after': {
				content: 'none',
			},
			// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors
			'& p': {
				display: 'block',
			},
			// eslint-disable-next-line @atlaskit/ui-styling-standard/no-unsafe-selectors, @atlaskit/ui-styling-standard/no-nested-selectors
			'& table, & table:last-child': {
				display: 'inline-table',
			},
			// Workaround for overriding the inline-block display on last child of a blockquote set in CSS reset.
			// eslint-disable-next-line @atlaskit/ui-styling-standard/no-unsafe-selectors, @atlaskit/ui-styling-standard/no-nested-selectors
			'> .code-block:last-child, >.mediaSingleView-content-wrap:last-child, >.mediaGroupView-content-wrap:last-child':
				{
					display: 'block',
				},
			// eslint-disable-next-line @atlaskit/ui-styling-standard/no-unsafe-selectors, @atlaskit/ui-styling-standard/no-nested-selectors
			'> .extensionView-content-wrap:last-child': {
				display: 'block',
			},
		},
		// Headings Shared Styles -> Heading With Alignment Styles
		// Override marginTop: 0 with default margin found in headingsSharedStyles for first heading in alignment block that is not the first child
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-unsafe-selectors, @atlaskit/ui-styling-standard/no-nested-selectors
		'.fabric-editor-block-mark.fabric-editor-alignment:not(:first-child)': {
			// eslint-disable-next-line @atlaskit/ui-styling-standard/no-unsafe-selectors, @atlaskit/ui-styling-standard/no-nested-selectors
			'> h1:first-child': {
				// eslint-disable-next-line @atlaskit/design-system/use-tokens-space
				marginTop: '1.667em',
			},
			// eslint-disable-next-line @atlaskit/ui-styling-standard/no-unsafe-selectors, @atlaskit/ui-styling-standard/no-nested-selectors
			'> h2:first-child': {
				// eslint-disable-next-line @atlaskit/design-system/use-tokens-space
				marginTop: '1.8em',
			},
			// eslint-disable-next-line @atlaskit/ui-styling-standard/no-unsafe-selectors, @atlaskit/ui-styling-standard/no-nested-selectors
			'> h3:first-child': {
				// eslint-disable-next-line @atlaskit/design-system/use-tokens-space
				marginTop: '2em',
			},
			// eslint-disable-next-line @atlaskit/ui-styling-standard/no-unsafe-selectors, @atlaskit/ui-styling-standard/no-nested-selectors
			'> h4:first-child': {
				// eslint-disable-next-line @atlaskit/design-system/use-tokens-space
				marginTop: '1.357em',
			},
			// eslint-disable-next-line @atlaskit/ui-styling-standard/no-unsafe-selectors, @atlaskit/ui-styling-standard/no-nested-selectors
			'> h5:first-child': {
				// eslint-disable-next-line @atlaskit/design-system/use-tokens-space
				marginTop: '1.667em',
			},
			// eslint-disable-next-line @atlaskit/ui-styling-standard/no-unsafe-selectors, @atlaskit/ui-styling-standard/no-nested-selectors
			'> h6:first-child': {
				// eslint-disable-next-line @atlaskit/design-system/use-tokens-space
				marginTop: '1.455em',
			},
		},
		// Set marginTop: 0 if alignment block is next to a gap cursor or widget that is first child
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-unsafe-selectors, @atlaskit/ui-styling-standard/no-nested-selectors
		'.ProseMirror-gapcursor:first-child + .fabric-editor-block-mark.fabric-editor-alignment, .ProseMirror-widget:first-child + .fabric-editor-block-mark.fabric-editor-alignment, .ProseMirror-widget:first-child + .ProseMirror-widget:nth-child(2) + .fabric-editor-block-mark.fabric-editor-alignment':
			{
				// eslint-disable-next-line @atlaskit/ui-styling-standard/no-unsafe-selectors, @atlaskit/ui-styling-standard/no-nested-selectors
				'> :is(h1, h2, h3, h4, h5, h6):first-child': {
					marginTop: '0',
				},
			},
	},
});

// eslint-disable-next-line @atlaskit/ui-styling-standard/no-exported-styles
export const blocktypeStyles_fg_platform_editor_typography_ugc: SerializedStyles = css({
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors
	'.ProseMirror': {
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors
		'& h1': {
			// eslint-disable-next-line @atlaskit/design-system/use-tokens-typography
			font: 'var(--editor-font-ugc-token-heading-h1)',
			marginBottom: 0,
			// eslint-disable-next-line @atlaskit/design-system/use-tokens-space
			marginTop: '1.45833em',
			// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors
			'& strong': {
				// eslint-disable-next-line @atlaskit/design-system/use-tokens-typography
				fontWeight: 'var(--editor-font-ugc-token-weight-heading-bold)',
			},
		},
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors
		'& h2': {
			// eslint-disable-next-line @atlaskit/design-system/use-tokens-typography
			font: 'var(--editor-font-ugc-token-heading-h2)',
			marginBottom: 0,
			// eslint-disable-next-line @atlaskit/design-system/use-tokens-space
			marginTop: '1.4em',
			// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors
			'& strong': {
				// eslint-disable-next-line @atlaskit/design-system/use-tokens-typography
				fontWeight: 'var(--editor-font-ugc-token-weight-heading-bold)',
			},
		},
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors
		'& h3': {
			// eslint-disable-next-line @atlaskit/design-system/use-tokens-typography
			font: 'var(--editor-font-ugc-token-heading-h3)',
			marginBottom: 0,
			// eslint-disable-next-line @atlaskit/design-system/use-tokens-space
			marginTop: '1.31249em',
			// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors
			'& strong': {
				// eslint-disable-next-line @atlaskit/design-system/use-tokens-typography
				fontWeight: 'var(--editor-font-ugc-token-weight-heading-bold)',
			},
		},
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors
		'& h4': {
			// eslint-disable-next-line @atlaskit/design-system/use-tokens-typography
			font: 'var(--editor-font-ugc-token-heading-h4)',
			// eslint-disable-next-line @atlaskit/design-system/use-tokens-space
			marginTop: '1.25em',
			// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors
			'& strong': {
				// eslint-disable-next-line @atlaskit/design-system/use-tokens-typography
				fontWeight: 'var(--editor-font-ugc-token-weight-heading-bold)',
			},
		},
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors
		'& h5': {
			// eslint-disable-next-line @atlaskit/design-system/use-tokens-typography
			font: 'var(--editor-font-ugc-token-heading-h5)',
			// eslint-disable-next-line @atlaskit/design-system/use-tokens-space
			marginTop: '1.45833em',
			textTransform: 'none',
			// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors
			'& strong': {
				// eslint-disable-next-line @atlaskit/design-system/use-tokens-typography
				fontWeight: 'var(--editor-font-ugc-token-weight-heading-bold)',
			},
		},
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors
		'& h6': {
			// eslint-disable-next-line @atlaskit/design-system/use-tokens-typography
			font: 'var(--editor-font-ugc-token-heading-h6)',
			// eslint-disable-next-line @atlaskit/design-system/use-tokens-space
			marginTop: '1.59091em',
			textTransform: 'none',
			// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors
			'& strong': {
				// eslint-disable-next-line @atlaskit/design-system/use-tokens-typography
				fontWeight: 'var(--editor-font-ugc-token-weight-heading-bold)',
			},
		},
	},
});

// eslint-disable-next-line @atlaskit/ui-styling-standard/no-exported-styles
export const blocktypeStyles_without_fg_platform_editor_typography_ugc: SerializedStyles = css({
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors
	'.ProseMirror': {
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors
		'& h1': {
			// eslint-disable-next-line @atlaskit/design-system/use-tokens-typography
			fontSize: 'calc(24em / 14)',
			fontStyle: 'inherit',
			// eslint-disable-next-line @atlaskit/design-system/use-tokens-typography
			lineHeight: 'calc(28 / 24)',
			color: token('color.text'),
			fontWeight: token('font.weight.medium'),
			// eslint-disable-next-line @atlaskit/design-system/use-tokens-typography
			letterSpacing: `-0.01em`,
			marginBottom: 0,
			// eslint-disable-next-line @atlaskit/design-system/use-tokens-space
			marginTop: '1.667em',
		},
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors
		'& h2': {
			// eslint-disable-next-line @atlaskit/design-system/use-tokens-typography
			fontSize: 'calc(20em / 14)',
			fontStyle: 'inherit',
			// eslint-disable-next-line @atlaskit/design-system/use-tokens-typography
			lineHeight: 'calc(24 / 20)',
			color: token('color.text'),
			fontWeight: token('font.weight.medium'),
			// eslint-disable-next-line @atlaskit/design-system/use-tokens-typography
			letterSpacing: `-0.008em`,
			// eslint-disable-next-line @atlaskit/design-system/use-tokens-space
			marginTop: '1.8em',
			marginBottom: 0,
		},
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors
		'& h3': {
			// eslint-disable-next-line @atlaskit/design-system/use-tokens-typography
			fontSize: 'calc(16em / 14)',
			fontStyle: 'inherit',
			// eslint-disable-next-line @atlaskit/design-system/use-tokens-typography
			lineHeight: 'calc(20 / 16)',
			color: token('color.text'),
			fontWeight: token('font.weight.semibold'),
			// eslint-disable-next-line @atlaskit/design-system/use-tokens-typography
			letterSpacing: `-0.006em`,
			// eslint-disable-next-line @atlaskit/design-system/use-tokens-space
			marginTop: '2em',
			marginBottom: 0,
		},
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors
		'& h4': {
			// eslint-disable-next-line @atlaskit/design-system/use-tokens-typography
			fontSize: 'calc(14em / 14)',
			fontStyle: 'inherit',
			// eslint-disable-next-line @atlaskit/design-system/use-tokens-typography
			lineHeight: 'calc(16 / 14)',
			color: token('color.text'),
			fontWeight: token('font.weight.semibold'),
			// eslint-disable-next-line @atlaskit/design-system/use-tokens-typography
			letterSpacing: `-0.003em`,
			// eslint-disable-next-line @atlaskit/design-system/use-tokens-space
			marginTop: '1.357em',
		},
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors
		'& h5': {
			// eslint-disable-next-line @atlaskit/design-system/use-tokens-typography
			fontSize: 'calc(12em / 14)',
			fontStyle: 'inherit',
			// eslint-disable-next-line @atlaskit/design-system/use-tokens-typography
			lineHeight: 'calc(16 / 12)',
			color: token('color.text'),
			fontWeight: token('font.weight.semibold'),
			// eslint-disable-next-line @atlaskit/design-system/use-tokens-space
			marginTop: '1.667em',
			textTransform: 'none',
		},
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors
		'& h6': {
			// eslint-disable-next-line @atlaskit/design-system/use-tokens-typography
			fontSize: 'calc(11em / 14)',
			fontStyle: 'inherit',
			// eslint-disable-next-line @atlaskit/design-system/use-tokens-typography
			lineHeight: 'calc(16 / 11)',
			color: token('color.text.subtlest'),
			fontWeight: token('font.weight.bold'),
			// eslint-disable-next-line @atlaskit/design-system/use-tokens-space
			marginTop: '1.455em',
			textTransform: 'none',
		},
	},
});

// eslint-disable-next-line @atlaskit/ui-styling-standard/no-exported-styles
export const blocktypeStyles_fg_platform_editor_nested_dnd_styles_changes: SerializedStyles = css({
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors
	'.ak-editor-content-area.appearance-full-page .ProseMirror blockquote': {
		paddingLeft: token('space.250', '20px'),
	},
	// Don't want extra padding for inline editor (nested)
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors
	'.ak-editor-content-area .ak-editor-content-area .ProseMirror blockquote': {
		paddingLeft: token('space.200', '16px'),
	},
});
