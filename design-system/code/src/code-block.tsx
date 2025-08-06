/* eslint-disable @atlaskit/ui-styling-standard/no-unsafe-selectors */
/* eslint-disable @atlaskit/ui-styling-standard/no-nested-selectors */
/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import { memo, useCallback, useEffect, useMemo, useRef, useState } from 'react';

import { cssMap, jsx } from '@compiled/react';
import { bind } from 'bind-event-listener';
import rafSchedule from 'raf-schd';

import { token } from '@atlaskit/tokens';

import { useHighlightLines } from './internal/hooks/use-highlight';
import { getLineNumWidth } from './internal/theme/styles';
import type { CodeBlockProps } from './internal/types';
import { normalizeLanguage } from './internal/utils/get-normalized-language';
import SyntaxHighlighter from './syntax-highlighter';

const getCodeBlockStyles = cssMap({
	root: {
		// Prevents empty code blocks from vertically collapsing
		'code > span:only-child:empty::before, code > span:only-child > span:only-child:empty::before':
			{
				content: '" "',
			},
		// we need to use last-of-type because when Code is SSR'd
		// 2 <code> elements are created and we don't want this style
		// applied to the first one
		'& code:last-of-type': {
			// eslint-disable-next-line @atlaskit/ui-styling-standard/no-important-styles
			paddingRight: `${token('space.100')} !important`,
			flexBasis: 'auto',
			flexGrow: 1, // Needed for the highlight line to extend full-width
			wordBreak: 'break-word',
		},

		'& code:first-of-type': {
			// eslint-disable-next-line @atlaskit/ui-styling-standard/no-important-styles
			paddingRight: `0px !important`,
		},
		'[data-ds--code--row--highlight]:last-child': {
			borderBottom: '1px dashed transparent',
		},
		'[data-ds--code--row--highlight] + [data-ds--code--row]:not([data-ds--code--row--highlight]), [data-ds--code--row]:not([data-ds--code--row--highlight]) + [data-ds--code--row--highlight]':
			{
				borderTop: '1px dashed transparent',
			},
		// fill in space caused by parent border top
		'& [data-ds--code--row--highlight] .linenumber::before': {
			borderTop: `1px solid ${token('color.border.focused')}`,
			left: '-4px',
			top: '-1px',
			width: '4px',
			position: 'absolute',
			content: '""',
		},

		'& [data-ds--code--row--highlight] .linenumber': {
			position: 'relative',
			// eslint-disable-next-line @atlaskit/ui-styling-standard/no-important-styles
			paddingLeft: `${token('space.050')} !important`,
			borderLeft: `4px solid ${token('color.border.focused')}`,
		},
		'& [data-ds--code--row--highlight]': {
			backgroundColor: token('color.background.neutral'),
			'&::before, &::after': {
				clipPath: 'inset(100%)',
				clip: 'rect(1px, 1px, 1px, 1px)',
				height: '1px',
				overflow: 'hidden',
				position: 'absolute',
				whiteSpace: 'nowrap',
				width: '1px',
			},
			'&::after': {
				content: `" [var(--ads-highlighted-end-text)] "`,
			},
			'&::before': {
				content: `" [var(--ads-highlighted-start-text)] "`,
			},
		},
		// these styles are for line highlighting
		'& [data-ds--code--row]': {
			marginRight: `-${token('space.100')}`,
			// eslint-disable-next-line @atlaskit/ui-styling-standard/no-important-styles
			paddingRight: `${token('space.100')} !important`,
		},
		'& .linenumber': {
			float: 'left',
			// eslint-disable-next-line @atlaskit/ui-styling-standard/no-important-styles
			display: 'inline-block !important',
		},
		// eslint-disable-next-line @atlaskit/design-system/use-tokens-typography
		fontSize: '12px',
		fontWeight: token('font.weight.regular'),
		borderStyle: 'none',
		borderRadius: token('border.radius'),
		// this is required to account for prismjs styles leaking into the codeblock
		'code[class*="language-"], pre[class*="language-"], code': {
			all: 'unset',
			paddingTop: token('space.100'),
			paddingBottom: token('space.100'),
			tabSize: 4,
		},
		display: 'flex',
		// eslint-disable-next-line @atlaskit/design-system/use-tokens-typography
		lineHeight: '20px',
		overflowX: 'auto',
		whiteSpace: 'pre',
		direction: 'ltr',
		// this is to account for SSR spacing issue once loaded in browser
		'& .linenumber, .ds-sh-line-number': {
			// This is how we are preventing line numbers being copied to clipboard.
			// (`user-select: none;` was not sufficent).
			// https://product-fabric.atlassian.net/browse/DSP-2729
			'&::after': {
				content: `attr(data-ds--line-number)`,
			},
			// this is to fix SSR spacing issue
			display: 'block',
			userSelect: 'none',
			textAlign: 'right',
			marginRight: token('space.100'),
			paddingLeft: token('space.100'),
			// eslint-disable-next-line @atlaskit/ui-styling-standard/no-important-styles
			paddingRight: `${token('space.100')} !important`,
			// needed to replicate existing design spec
			boxSizing: 'border-box',
			flexShrink: 0,
			// this needs to be important or it gets overwritten by inline styles
			// eslint-disable-next-line @atlaskit/ui-styling-standard/no-important-styles
			color: `${token('color.text.subtlest')} !important`,
			// this needs to be important or it gets overwritten by inline styles
			// eslint-disable-next-line @atlaskit/ui-styling-standard/no-important-styles
			fontStyle: 'normal !important',
			// eslint-disable-next-line @atlaskit/ui-styling-standard/no-important-styles
			minWidth: 'var(--ads-code-line-number-width) !important',
		},
		'.token.important': { fontWeight: token('font.weight.bold') },
		// eslint-disable-next-line @atlaskit/design-system/use-tokens-typography
		'.token.bold:not(.important)': { fontWeight: 'bolder' },
		'.token.italic': { fontStyle: 'italic' },
		'.token.comment:not(.italic) ,.token.block-comment:not(.italic)': {
			fontStyle: 'italic',
			fontFamily: `SFMono-MediumItalic, ${token('font.family.code')}`,
		},
		'.token.key:not(.important, .bold) ,.token.keyword:not(.important, .bold)': {
			// eslint-disable-next-line @atlaskit/design-system/use-tokens-typography
			fontWeight: 'bolder',
		},
		// &s are used to create a definitive order of specificity for the styles as compiled may sort
		// the styles differently we cannot rely on line order
		'.token': {
			'&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&.important': {
				color: token('color.text.accent.yellow'),
			},
			'&&&&&&&&&&&&&&&&&&&&&&&&&&&&&.atrule': {
				color: token('color.text.accent.green'),
			},
			'&&&&&&&&&&&&&&&&&&&&&&&&&&&&.operator': { color: token('color.text') },
			'&&&&&&&&&&&&&&&&&&&&&&&&&&&.inserted': { color: token('color.text.accent.green') },
			'&&&&&&&&&&&&&&&&&&&&&&&&&&.char': { color: token('color.text') },
			'&&&&&&&&&&&&&&&&&&&&&&&&&.boolean': { color: token('color.text.accent.blue') },
			'&&&&&&&&&&&&&&&&&&&&&&&&.deleted': { color: token('color.text.accent.red') },
			'&&&&&&&&&&&&&&&&&&&&&&&.constant': { color: token('color.text.accent.teal') },
			'&&&&&&&&&&&&&&&&&&&&&&.property': { color: token('color.text.accent.purple') },
			'&&&&&&&&&&&&&&&&&&&&&.punctuation': { color: token('color.text') },
			'&&&&&&&&&&&&&&&&&&&&.cdata': { color: token('color.text.subtlest') },
			'&&&&&&&&&&&&&&&&&&&.prolog': { color: token('color.text.accent.blue') },
			'&&&&&&&&&&&&&&&&&&.attr-value': { color: token('color.text.accent.teal') },
			'&&&&&&&&&&&&&&&&&.number': { color: token('color.text.accent.blue') },
			'&&&&&&&&&&&&&&&&.function': { color: token('color.text') },
			'&&&&&&&&&&&&&&&.meta': { color: token('color.text.subtlest') },
			'&&&&&&&&&&&&&&.meta-keyword': { color: token('color.text.accent.green') },
			'&&&&&&&&&&&&&.section, &&&&&&&&&&&&&.title, &&&&&&&&&&&&&.class-name': {
				color: token('color.text.accent.purple'),
			},
			'&&&&&&&&&&&&.string': { color: token('color.text.accent.green') },
			'&&&&&&&&&&&.tag, &&&&&&&&&&&.quote, &&&&&&&&&&&.type, &&&&&&&&&&&.selector-pseudo, &&&&&&&&&&&.selector-attr':
				{
					color: token('color.text.accent.teal'),
				},
			'&&&&&&&&&&.url': { color: token('color.text.accent.purple') },
			'&&&&&&&&&.variable, &&&&&&&&&.symbol, &&&&&&&&&.regex': {
				color: token('color.text.accent.teal'),
			},
			'&&&&&&&&.code, &&&&&&&&.bullet, &&&&&&&&.entity, &&&&&&&&.builtin, &&&&&&&&.namespace': {
				color: token('color.text.accent.blue'),
			},
			'&&&&&&&.substr': { color: token('color.text.subtlest') },
			'&&&&&&.doctype': { color: token('color.text.accent.yellow') },
			'&&&&&.function-name': { color: token('color.text.accent.purple') },
			'&&&&.comment,&&&&.block-comment': {
				color: token('color.text.subtlest'),
			},
			'&&&.selector': { color: token('color.text.accent.blue') },
			'&&.attr-name': { color: token('color.text.accent.teal') },
			// additional specificity required to match the all: unset
			'&.key,&.keyword': {
				color: token('color.text.accent.blue'),
			},
			// this specifically stops prism css cascading.
			'&:not([class=token],[data-ds--code--row--highlight],[data-ds--code--row])': {
				all: 'unset',
			},
		},
		backgroundColor: `var(--ds--code--bg-color,${token('color.background.neutral')})`,
		color: token('color.text'),
		fontFamily: token('font.family.code'),
	},
	showLineNumbers: {
		'& code:first-of-type': {
			backgroundImage: `linear-gradient(to right, var(--ds--code--line-number-bg-color,${token('color.background.neutral')}), var(--ds--code--line-number-bg-color,${token('color.background.neutral')})
			var(--ads-code-line-number-width), transparent var(--ads-code-line-number-width), transparent)`,
		},
		'& [data-ds--code--row]': {
			display: 'flex',
		},
		'code[class*="language-"], pre[class*="language-"], code': {
			paddingRight: 0,
			paddingLeft: 0,
		},
	},
	dontShowLineNumbers: {
		'& [data-ds--code--row]': {
			display: 'block',
		},
		'code[class*="language-"], pre[class*="language-"], code': {
			paddingRight: token('space.100'),
			paddingLeft: token('space.100'),
		},
	},
	shouldWrapLongLines: {
		'& code:last-of-type': {
			flexShrink: 1,
		},
	},
	dontWrapLongLines: {
		'& code:last-of-type': {
			flexShrink: 1,
		},
	},
});

/**
 * __Code block__
 *
 * A code block highlights an entire block of code and keeps the formatting.
 *
 * - [Examples](https://atlassian.design/components/code/code-block/examples)
 * - [Code](https://atlassian.design/components/code/code-block/code)
 * - [Usage](https://atlassian.design/components/code/code-block/usage)
 */
const CodeBlock = memo<CodeBlockProps>(function CodeBlock({
	showLineNumbers = true,
	shouldShowLineNumbers,
	firstLineNumber = 1,
	language: providedLanguage = 'text',
	highlight = '',
	highlightedStartText = 'Highlight start',
	highlightedEndText = 'Highlight end',
	testId,
	text,
	codeBidiWarnings = true,
	hasBidiWarnings,
	codeBidiWarningLabel,
	codeBidiWarningTooltipEnabled = true,
	isBidiWarningTooltipEnabled,
	shouldWrapLongLines = false,
	label = 'Scrollable content',
}) {
	const scrollableRef = useRef<HTMLSpanElement>(null);
	const [showContentFocus, setShowContentFocus] = useState(false);

	// Use children if provided, otherwise fall back to deprecated text prop
	const numLines =
		(text || '').split('\n').length + (firstLineNumber > 0 ? firstLineNumber : 1) - 1;
	const lineNumberWidth = numLines ? getLineNumWidth(numLines) : 0;

	// Use new props if provided, otherwise fall back to deprecated props
	const shouldShowLineNumbersValue =
		shouldShowLineNumbers !== undefined ? shouldShowLineNumbers : showLineNumbers;
	const shouldShowBidiWarnings = hasBidiWarnings !== undefined ? hasBidiWarnings : codeBidiWarnings;
	const shouldEnableTooltip =
		isBidiWarningTooltipEnabled !== undefined
			? isBidiWarningTooltipEnabled
			: codeBidiWarningTooltipEnabled;

	// Schedule a content focus on the target element
	// WARNING: In theory, `target` may not be available when `rafSchedule` hits in concurrent rendering
	useEffect(() => {
		const schedule = rafSchedule(() => {
			const target = scrollableRef.current;
			target && setShowContentFocus(target.scrollWidth > target.clientWidth);
		});

		schedule();

		const unbindWindowEvent = bind(window, {
			type: 'resize',
			listener: schedule,
		});

		return unbindWindowEvent;
	}, [scrollableRef]);

	const { getHighlightStyles, highlightedLines } = useHighlightLines({
		highlight,
		testId,
	});

	const getLineProps = useCallback(
		(line: number) => getHighlightStyles(line, highlightedLines),
		[getHighlightStyles, highlightedLines],
	);

	const language = useMemo(() => normalizeLanguage(providedLanguage), [providedLanguage]);

	// https://product-fabric.atlassian.net/browse/DST-2472
	const languageToUse = text ? language : 'text';

	return (
		<SyntaxHighlighter
			data-code-lang={language}
			data-ds--code--code-block=""
			testId={testId}
			language={languageToUse}
			css={[
				getCodeBlockStyles.root,
				shouldWrapLongLines
					? getCodeBlockStyles.shouldWrapLongLines
					: getCodeBlockStyles.dontWrapLongLines,
				shouldShowLineNumbersValue
					? getCodeBlockStyles.showLineNumbers
					: getCodeBlockStyles.dontShowLineNumbers,
			]}
			style={{
				'--ads-code-line-number-width': `calc(${lineNumberWidth} + 16px)`,
				'--ads-highlighted-start-text': highlightedStartText,
				'--ads-highlighted-end-text': highlightedEndText,
			}}
			showLineNumbers={shouldShowLineNumbersValue}
			firstLineNumber={firstLineNumber}
			lineProps={getLineProps}
			// shouldCreateParentElementForLines is needed to pass down props to each line.
			// This is necessary for both line highlighting and testId's, as each of
			// these rely on a data attribute being passed down to lines.
			shouldCreateParentElementForLines={highlight.length > 0 || !!testId}
			shouldWrapLongLines={shouldWrapLongLines}
			codeBidiWarnings={shouldShowBidiWarnings}
			codeBidiWarningLabel={codeBidiWarningLabel}
			codeBidiWarningTooltipEnabled={shouldEnableTooltip}
			text={text}
			tabIndex={showContentFocus ? '0' : undefined}
			aria-label={showContentFocus ? label : undefined}
			role={showContentFocus ? 'region' : undefined}
			scrollRef={scrollableRef}
		/>
	);
});

export default CodeBlock;
