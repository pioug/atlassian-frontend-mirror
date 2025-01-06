// eslint-disable-next-line @atlaskit/ui-styling-standard/use-compiled -- Ignored via go/DSP-18766
import type { CSSObject } from '@emotion/react';

import { token } from '@atlaskit/tokens';

import {
	CODE_FONT_SIZE,
	CODE_LINE_HEIGHT,
	HIGHLIGHT_BORDER_WIDTH,
	LINE_NUMBER_GUTTER,
	SPACING,
	VAR_CODE_BG_COLOR,
	VAR_CODE_LINE_NUMBER_BG_COLOR,
} from './constants';
import { getBaseTheme, getColorPalette } from './get-theme';
import type { CodeBlockTheme, CodeTheme } from './types';

export const getLineNumWidth = (numLines: number) => {
	if (!numLines) {
		return '1ch';
	}

	return `${numLines.toFixed(0).length}ch`;
};

const lineNumberStyle = (theme: CodeBlockTheme): CSSObject => ({
	// width of the line number gutter
	minWidth: `calc(${theme.lineNumberWidth} + ${LINE_NUMBER_GUTTER}px) !important`,
	// this needs to be important or it gets overwritten by inline styles
	fontStyle: 'normal !important',
	// this needs to be important or it gets overwritten by inline styles
	color: `${theme.lineNumberColor} !important`,
	flexShrink: 0,
	// needed to replicate existing design spec
	boxSizing: 'border-box',
	paddingRight: `${SPACING}px !important`,
	paddingLeft: SPACING,
	marginRight: SPACING,
	textAlign: 'right',
	userSelect: 'none',
	// this is to fix SSR spacing issue
	display: 'block',
	// This is how we are preventing line numbers being copied to clipboard.
	// (`user-select: none;` was not sufficent).
	// https://product-fabric.atlassian.net/browse/DSP-2729
	'&::after': {
		content: `attr(data-ds--line-number)`,
	},
});

// order of these keys does matter as it will affect the css precedence
const syntaxKeywordColors = (theme: CodeBlockTheme): CSSObject => ({
	'.token': {
		// this specifically stops prism css cascading.
		'&:not([class=token],[data-ds--code--row--highlight],[data-ds--code--row])': {
			all: 'unset',
		},
		// additional specificity required to match the all: unset
		'&.key,&.keyword': {
			color: theme.keywordColor,
			fontWeight: 'bolder',
		},
		'&.attr-name': {
			color: theme.attributeColor,
		},
		'&.selector': {
			color: theme.selectorTagColor,
		},
		'&.comment,&.block-comment': {
			color: theme.commentColor,
			fontFamily: theme.fontFamilyItalic,
			fontStyle: 'italic',
		},
		'&.function-name': {
			color: theme.sectionColor,
		},
		'&.doctype': {
			color: theme.docTagColor,
		},
		'&.substr': {
			color: theme.substringColor,
		},
		'&.namespace': {
			color: theme.nameColor,
		},
		'&.builtin': {
			color: theme.builtInColor,
		},
		'&.entity': {
			color: theme.literalColor,
		},
		'&.bullet': {
			color: theme.bulletColor,
		},
		'&.code': {
			color: theme.codeColor,
		},
		'&.regex': {
			color: theme.regexpColor,
		},
		'&.symbol': {
			color: theme.symbolColor,
		},
		'&.variable': {
			color: theme.variableColor,
		},
		'&.url': {
			color: theme.linkColor,
		},
		'&.selector-attr': {
			color: theme.selectorAttributeColor,
		},
		'&.selector-pseudo': {
			color: theme.selectorPseudoColor,
		},
		'&.type': {
			color: theme.typeColor,
		},
		'&.quote': {
			color: theme.quoteColor,
		},
		'&.tag': {
			color: theme.templateTagColor,
		},
		'&.string': {
			color: theme.stringColor,
		},
		'&.class-name': {
			color: theme.sectionColor,
		},
		'&.title': {
			color: theme.titleColor,
		},
		'&.section': {
			color: theme.sectionColor,
		},
		'&.meta-keyword': {
			color: theme.metaKeywordColor,
		},
		'&.meta': {
			color: theme.metaColor,
		},
		'&.italic': {
			fontStyle: 'italic',
		},
		'&.bold': {
			fontWeight: 'bolder',
		},
		'&.function': {
			color: theme.functionColor,
		},
		'&.number': {
			color: theme.numberColor,
		},
		'&.attr-value': {
			color: theme.attributeColor,
		},
		'&.prolog': {
			color: theme.prologColor,
		},
		'&.cdata': {
			color: theme.cdataColor,
		},
		'&.punctuation': {
			color: theme.punctuationColor,
		},
		'&.property': {
			color: theme.propertyColor,
		},
		'&.constant': {
			color: theme.constantColor,
		},
		'&.deleted': {
			color: theme.deletedColor,
		},
		'&.boolean': {
			color: theme.booleanColor,
		},
		'&.char': {
			color: theme.charColor,
		},
		'&.inserted': {
			color: theme.insertedColor,
		},
		'&.operator': {
			color: theme.operatorColor,
		},
		'&.atrule': {
			color: theme.atruleColor,
		},
		'&.important': {
			color: theme.importantColor,
			fontWeight: token('font.weight.bold'),
		},
	},
});

/**
 * Styles applied at the root element level, common across code/codeblock
 */
export const getBaseCodeStyles = (theme: CodeTheme) => ({
	fontSize: CODE_FONT_SIZE,
	// eslint-disable-next-line @atlaskit/design-system/use-tokens-typography
	fontFamily: theme.fontFamily,
	fontWeight: token('font.weight.regular'),
	backgroundColor: `var(${VAR_CODE_BG_COLOR},${theme.backgroundColor})`,
	color: theme.textColor,
	borderStyle: 'none',
	borderRadius: token('border.radius', '3px'),
});

/**
 * Takes an implemented CodeBlock theme, and returns styles required for
 * react-syntax-highlighter.
 *
 * @param theme
 */
export const getCodeBlockStyles =
	(theme: CodeBlockTheme) =>
	(
		highlightedStartText: string,
		highlightedEndText: string,
		showLineNumbers: boolean,
		shouldWrapLongLines: boolean,
	): CSSObject => ({
		// this is required to account for prismjs styles leaking into the codeblock
		'code[class*="language-"], pre[class*="language-"], code': {
			all: 'unset',
			padding: showLineNumbers ? `${SPACING}px 0` : SPACING,
			tabSize: 4,
		},
		display: 'flex',
		// eslint-disable-next-line @atlaskit/design-system/use-tokens-typography
		lineHeight: CODE_LINE_HEIGHT,
		overflowX: 'auto',
		whiteSpace: 'pre',
		direction: 'ltr',
		...getBaseCodeStyles(theme),
		...syntaxKeywordColors(theme),
		// this is to account for SSR spacing issue once loaded in browser
		'& .linenumber, .ds-sh-line-number': lineNumberStyle(theme),
		'& .linenumber': {
			display: 'inline-block !important',
			float: 'left',
		},
		// these styles are for line highlighting
		'& [data-ds--code--row]': {
			display: showLineNumbers ? 'flex' : 'block',
			paddingRight: `${SPACING}px !important`,
			marginRight: `-${SPACING}px`,
		},
		'& [data-ds--code--row--highlight]': {
			background: `${theme.highlightedLineBgColor}`,

			// eslint-disable-next-line @atlaskit/design-system/use-visually-hidden
			'&::before, &::after': {
				clipPath: 'inset(100%)',
				clip: 'rect(1px, 1px, 1px, 1px)',
				height: '1px',
				overflow: 'hidden',
				position: 'absolute',
				whiteSpace: 'nowrap',
				width: '1px',
			},
			// The formatting here is an accessibility convention
			'&::before': {
				content: `" [${highlightedStartText}] "`,
			},
			'&::after': {
				content: `" [${highlightedEndText}] "`,
			},
		},
		'& [data-ds--code--row--highlight] .linenumber': {
			borderLeft: `${HIGHLIGHT_BORDER_WIDTH} solid ${theme.highlightedLineBorderColor}`,
			paddingLeft: `${SPACING / 2}px !important`,
			position: 'relative',
		},
		// fill in space caused by parent border top
		'& [data-ds--code--row--highlight] .linenumber::before': {
			content: '""',
			position: 'absolute',
			width: HIGHLIGHT_BORDER_WIDTH,
			top: '-1px',
			left: `-${HIGHLIGHT_BORDER_WIDTH}`,
			borderTop: `1px solid ${theme.highlightedLineBorderColor}`,
		},
		'[data-ds--code--row--highlight] + [data-ds--code--row]:not([data-ds--code--row--highlight]), [data-ds--code--row]:not([data-ds--code--row--highlight]) + [data-ds--code--row--highlight]':
			{
				borderTop: '1px dashed transparent',
			},
		'[data-ds--code--row--highlight]:last-child': {
			borderBottom: '1px dashed transparent',
		},
		'& code:first-of-type': {
			paddingRight: `0px !important`,
			backgroundImage: showLineNumbers
				? `linear-gradient(to right, var(${VAR_CODE_LINE_NUMBER_BG_COLOR},${theme.lineNumberBgColor}), var(${VAR_CODE_LINE_NUMBER_BG_COLOR},${theme.lineNumberBgColor})
    calc(${theme.lineNumberWidth} + ${LINE_NUMBER_GUTTER}px), transparent calc(${theme.lineNumberWidth} + ${LINE_NUMBER_GUTTER}px), transparent)`
				: undefined,
		},
		// we need to use last-of-type because when Code is SSR'd
		// 2 <code> elements are created and we don't want this style
		// applied to the first one
		'& code:last-of-type': {
			paddingRight: `${SPACING}px !important`,
			flexBasis: 'auto',
			flexGrow: 1, // Needed for the highlight line to extend full-width
			flexShrink: shouldWrapLongLines ? 1 : 0,
			wordBreak: 'break-word',
		},

		// Prevents empty code blocks from vertically collapsing
		'code > span:only-child:empty:before, code > span:only-child > span:only-child:empty:before': {
			content: '" "',
		},
	});

export const getCodeStyles = (): CSSObject => {
	const theme = getBaseTheme();
	const baseStyles = getBaseCodeStyles(theme);
	return {
		...baseStyles,
		display: 'inline',
		padding: '2px 0.5ch',
		boxDecorationBreak: 'clone',
		// eslint-disable-next-line @atlaskit/design-system/use-tokens-typography
		fontSize: '0.875em',
		overflow: 'auto',
		overflowWrap: 'break-word',
		whiteSpace: 'pre-wrap',
	};
};

export const getCodeBlockTheme = (maxLines?: number): CodeBlockTheme => {
	return {
		...getBaseTheme(),
		...getColorPalette(),
		lineNumberWidth: maxLines ? getLineNumWidth(maxLines) : undefined,
	};
};
