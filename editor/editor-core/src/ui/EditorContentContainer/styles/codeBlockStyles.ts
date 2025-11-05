// eslint-disable-next-line @atlaskit/ui-styling-standard/use-compiled
import { css, type SerializedStyles } from '@emotion/react';

import { token } from '@atlaskit/tokens';

import { overflowShadowStyles } from './overflowShadowStyles';
import {
	blanketSelectionStyles,
	boxShadowSelectionStyles,
	hideNativeBrowserTextSelectionStyles,
} from './selectionStyles';

export const CodeBlockSharedCssClassName = {
	CODEBLOCK_CONTAINER: 'code-block',
	CODEBLOCK_START: 'code-block--start',
	CODEBLOCK_END: 'code-block--end',
	CODEBLOCK_CONTENT_WRAPPER: 'code-block-content-wrapper',
	CODEBLOCK_LINE_NUMBER_GUTTER: 'line-number-gutter',
	CODEBLOCK_CONTENT: 'code-content',
	DS_CODEBLOCK: '[data-ds--code--code-block]',
	CODEBLOCK_CONTENT_WRAPPED: 'code-content--wrapped',
	CODEBLOCK_CONTAINER_LINE_NUMBER_WIDGET: 'code-content__line-number--wrapped',
};

const fontSize14px = `${14 / 16}rem`;
const blockNodesVerticalMargin = '0.75rem';

const gutterDangerOverlay: SerializedStyles = css({
	'&::after': {
		height: '100%',
		content: "''",
		position: 'absolute',
		left: 0,
		top: 0,
		width: '24px',
		backgroundColor: token('color.blanket.danger'),
	},
});

// eslint-disable-next-line @atlaskit/ui-styling-standard/no-exported-styles
export const codeBlockStyles: SerializedStyles = css({
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors
	'.ProseMirror': {
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors,@atlaskit/ui-styling-standard/no-unsafe-values
		[`.${CodeBlockSharedCssClassName.CODEBLOCK_CONTENT_WRAPPED} > .${CodeBlockSharedCssClassName.CODEBLOCK_CONTENT_WRAPPER} > .${CodeBlockSharedCssClassName.CODEBLOCK_CONTENT}`]:
			{
				marginRight: token('space.100', '8px'),

				// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors
				code: {
					display: 'block',
					wordBreak: 'break-word',
					whiteSpace: 'pre-wrap',
				},
			},

		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors,@atlaskit/ui-styling-standard/no-unsafe-values
		[`.${CodeBlockSharedCssClassName.CODEBLOCK_CONTENT_WRAPPER} > .${CodeBlockSharedCssClassName.CODEBLOCK_CONTENT}`]:
			{
				display: 'flex',
				flex: 1,

				// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors
				code: {
					flexGrow: 1,
					whiteSpace: 'pre',
				},
			},

		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors,@atlaskit/ui-styling-standard/no-unsafe-values
		[`.${CodeBlockSharedCssClassName.CODEBLOCK_CONTAINER}`]: {
			position: 'relative',
			backgroundColor: token('elevation.surface.raised'),
			borderRadius: token('radius.small', '3px'),
			// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values,@atlaskit/ui-styling-standard/no-unsafe-values
			margin: `${blockNodesVerticalMargin} 0 0 0`,
			fontFamily: token('font.family.code'),
			// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values,@atlaskit/ui-styling-standard/no-unsafe-values
			minWidth: 48,
			cursor: 'pointer',
			clear: 'both',
			// This is necessary to allow for arrow key navigation in/out of code blocks in Firefox.
			whiteSpace: 'normal',

			// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors
			'.code-block-gutter-pseudo-element::before': {
				content: 'attr(data-label)',
			},

			// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors,@atlaskit/ui-styling-standard/no-unsafe-values
			[`.${CodeBlockSharedCssClassName.CODEBLOCK_START}`]: {
				position: 'absolute',
				visibility: 'hidden',
				height: '1.5rem',
				top: 0,
				left: 0,
			},

			// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors,@atlaskit/ui-styling-standard/no-unsafe-values
			[`.${CodeBlockSharedCssClassName.CODEBLOCK_END}`]: {
				position: 'absolute',
				visibility: 'hidden',
				height: '1.5rem',
				bottom: 0,
				right: 0,
			},

			// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors,@atlaskit/ui-styling-standard/no-unsafe-values
			[`.${CodeBlockSharedCssClassName.CODEBLOCK_CONTENT_WRAPPER}`]: [
				// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values
				overflowShadowStyles,
				{
					position: 'relative',
					backgroundColor: token('color.background.neutral'),
					display: 'flex',
					borderRadius: token('radius.small', '3px'),
					width: '100%',
					counterReset: 'line',
					overflowX: 'auto',
					backgroundRepeat: 'no-repeat',
					backgroundAttachment: 'local, local, local, local, scroll, scroll, scroll, scroll',
					backgroundSize: `${token('space.300')} 100%,
	                         ${token('space.300')} 100%,
	                         ${token('space.100')} 100%,
	                         ${token('space.100')} 100%,
	                         ${token('space.100')} 100%,
	                         1px 100%,
	                         ${token('space.100')} 100%,
	                         1px 100%`,
					backgroundPosition: `0 0,
	                             0 0,
                               100% 0,
                               100% 0,
                               100% 0,
                               100% 0,
	                             0 0,
	                             0 0`,
					// Be careful if refactoring this; it is needed to keep arrow key navigation in Firefox consistent with other browsers.
					overflowY: 'hidden',
				},
			],

			// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors,@atlaskit/ui-styling-standard/no-unsafe-values
			[`.${CodeBlockSharedCssClassName.CODEBLOCK_LINE_NUMBER_GUTTER}`]: {
				backgroundColor: token('color.background.neutral'),
				position: 'relative',
				width: 'var(--lineNumberGutterWidth, 2rem)',
				padding: token('space.100', '8px'),
				flexShrink: 0,
				// eslint-disable-next-line @atlaskit/design-system/use-tokens-typography
				fontSize: fontSize14px,
				boxSizing: 'content-box',
			},

			// This is a fix of marker of list item with code block.
			// The list item marker in Chrome is aligned by the baseline of the text,
			// that's why we need to add a text (content: "1") to the line number gutter to align
			// the list item marker with the text.
			// Without it, the list item marker will be aligned by the bottom of the code block. */
			// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors,@atlaskit/ui-styling-standard/no-unsafe-values
			[`.${CodeBlockSharedCssClassName.CODEBLOCK_LINE_NUMBER_GUTTER}::before`]: {
				content: "'1'",
				visibility: 'hidden',
				// eslint-disable-next-line @atlaskit/design-system/use-tokens-typography
				fontSize: fontSize14px,
				// eslint-disable-next-line @atlaskit/design-system/use-tokens-typography
				lineHeight: '1.5rem',
			},

			// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors,@atlaskit/ui-styling-standard/no-unsafe-values
			[`.${CodeBlockSharedCssClassName.CODEBLOCK_CONTENT}`]: {
				// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors
				code: {
					tabSize: 4,
					cursor: 'text',
					color: token('color.text'),
					borderRadius: token('radius.small', '3px'),
					margin: token('space.100', '8px'),
					// eslint-disable-next-line @atlaskit/design-system/use-tokens-typography
					fontSize: fontSize14px,
					// eslint-disable-next-line @atlaskit/design-system/use-tokens-typography
					lineHeight: '1.5rem',
				},
			},

			// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors,@atlaskit/ui-styling-standard/no-unsafe-values
			[`.${CodeBlockSharedCssClassName.CODEBLOCK_CONTAINER_LINE_NUMBER_WIDGET}`]: {
				pointerEvents: 'none',
				userSelect: 'none',
				width: 'var(--lineNumberGutterWidth, 2rem)',
				left: 0,
				position: 'absolute',
				// eslint-disable-next-line @atlaskit/design-system/use-tokens-typography
				fontSize: fontSize14px,
				padding: `0px ${token('space.100', '8px')}`,
				// eslint-disable-next-line @atlaskit/design-system/use-tokens-typography
				lineHeight: '1.5rem',
				textAlign: 'right',
				color: token('color.text.subtlest', '#505F79'),
				boxSizing: 'content-box',
			},
		},

		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors
		li: {
			// if same list item has multiple code blocks we need top margin for all but first
			// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors
			'> .code-block': {
				// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values,@atlaskit/ui-styling-standard/no-unsafe-values
				margin: `${blockNodesVerticalMargin} 0 0 0`,
			},
			// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors,@atlaskit/ui-styling-standard/no-unsafe-selectors
			'> .code-block:first-child, > .ProseMirror-gapcursor:first-child + .code-block': {
				marginTop: 0,
			},

			// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors,@atlaskit/ui-styling-standard/no-unsafe-selectors
			'> div:last-of-type.code-block, > pre:last-of-type.code-block': {
				// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values,@atlaskit/ui-styling-standard/no-unsafe-values
				marginBottom: blockNodesVerticalMargin,
			},
		},

		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-unsafe-values,@atlaskit/ui-styling-standard/no-imported-style-values
		[`.code-block.ak-editor-selected-node:not(.danger)`]: [
			// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values
			boxShadowSelectionStyles,
			// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values
			blanketSelectionStyles,
			// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values
			hideNativeBrowserTextSelectionStyles,
		],

		// Danger when top level node
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors
		'.danger.code-block': {
			// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values,@atlaskit/ui-styling-standard/no-unsafe-values
			boxShadow: `0 0 0 1px ${token('color.border.danger')}`,

			// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors,@atlaskit/ui-styling-standard/no-unsafe-values
			[`.${CodeBlockSharedCssClassName.CODEBLOCK_LINE_NUMBER_GUTTER}`]: [
				{
					backgroundColor: token('color.background.danger'),
					// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values
					color: token('color.text.danger'),
				},
				gutterDangerOverlay,
			],

			// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors,@atlaskit/ui-styling-standard/no-unsafe-values
			[`.${CodeBlockSharedCssClassName.CODEBLOCK_CONTENT}`]: {
				// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values
				backgroundColor: token('color.blanket.danger'),
			},
		},

		// Danger when nested node
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors
		'.danger .code-block': {
			// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors,@atlaskit/ui-styling-standard/no-unsafe-values
			[`.${CodeBlockSharedCssClassName.CODEBLOCK_LINE_NUMBER_GUTTER}`]: [
				{
					backgroundColor: token('color.background.danger'),
					// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values
					color: token('color.text.danger'),
				},
				gutterDangerOverlay,
			],

			// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors,@atlaskit/ui-styling-standard/no-unsafe-values
			[`.${CodeBlockSharedCssClassName.CODEBLOCK_CONTENT}`]: {
				backgroundColor: token('color.blanket.danger'),
			},
		},
	},
});

// eslint-disable-next-line @atlaskit/ui-styling-standard/no-exported-styles
export const codeBlockStylesWithEmUnits: SerializedStyles = css({
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors
	'.ProseMirror': {
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors, @atlaskit/ui-styling-standard/no-unsafe-values
		[`.${CodeBlockSharedCssClassName.CODEBLOCK_CONTAINER}`]: {
			// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors
			'.code-block-gutter-pseudo-element::before': {
				display: 'flow',
				// eslint-disable-next-line @atlaskit/design-system/use-tokens-typography
				lineHeight: '1.5em',
			},

			// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors,@atlaskit/ui-styling-standard/no-unsafe-values
			[`.${CodeBlockSharedCssClassName.CODEBLOCK_CONTENT}`]: {
				// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors
				code: {
					// eslint-disable-next-line @atlaskit/design-system/use-tokens-typography
					fontSize: '0.875em',
					// eslint-disable-next-line @atlaskit/design-system/use-tokens-typography
					lineHeight: '1.5em',
				},
			},
		},
	},
});

// eslint-disable-next-line @atlaskit/ui-styling-standard/no-exported-styles
export const codeBgColorStyles: SerializedStyles = css({
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors,@atlaskit/ui-styling-standard/no-unsafe-values
	[`.${CodeBlockSharedCssClassName.CODEBLOCK_CONTAINER}`]: {
		'--ds--code--bg-color': 'transparent',
	},
});

// eslint-disable-next-line @atlaskit/ui-styling-standard/no-exported-styles
export const firstCodeBlockWithNoMargin: SerializedStyles = css({
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors
	'.ProseMirror': {
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors
		'.ak-editor-panel__content': {
			// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors,@atlaskit/ui-styling-standard/no-unsafe-selectors
			'> .code-block:first-child, > .ProseMirror-widget:first-child + .code-block, > .ProseMirror-widget:first-child + .ProseMirror-widget + .code-block':
				{
					// eslint-disable-next-line @atlaskit/design-system/use-tokens-space,@atlaskit/ui-styling-standard/no-important-styles
					margin: '0!important',
				},
		},
	},
});

// eslint-disable-next-line @atlaskit/ui-styling-standard/no-exported-styles
export const firstCodeBlockWithNoMarginOld: SerializedStyles = css({
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors
	'.ProseMirror': {
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors
		'.ak-editor-panel__content': {
			// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors,@atlaskit/ui-styling-standard/no-unsafe-selectors
			'> .code-block:first-child': {
				// eslint-disable-next-line @atlaskit/design-system/use-tokens-space,@atlaskit/ui-styling-standard/no-important-styles
				margin: '0!important',
			},
		},
	},
});
