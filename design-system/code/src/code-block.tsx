/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import { memo, useCallback, useMemo } from 'react';

// eslint-disable-next-line @atlaskit/ui-styling-standard/use-compiled -- Ignored via go/DSP-18766
import { css, jsx } from '@emotion/react';

import { useHighlightLines } from './internal/hooks/use-highlight';
import { getCodeBlockStyles, getCodeBlockTheme } from './internal/theme/styles';
import type { CodeBlockProps } from './internal/types';
import { normalizeLanguage } from './internal/utils/get-normalized-language';
import SyntaxHighlighter from './syntax-highlighter';

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
	firstLineNumber = 1,
	language: providedLanguage = 'text',
	highlight = '',
	highlightedStartText = 'Highlight start',
	highlightedEndText = 'Highlight end',
	testId,
	text,
	codeBidiWarnings = true,
	codeBidiWarningLabel,
	codeBidiWarningTooltipEnabled = true,
	shouldWrapLongLines = false,
}) {
	const numLines =
		(text || '').split('\n').length + (firstLineNumber > 0 ? firstLineNumber : 1) - 1;
	const theme = useMemo(() => getCodeBlockTheme(numLines), [numLines]);

	const getStyles = useMemo(() => getCodeBlockStyles(theme), [theme]);
	const styles = useMemo(
		() =>
			css(
				// eslint-disable-next-line @atlaskit/ui-styling-standard/no-unsafe-values -- Ignored via go/DSP-18766
				getStyles(highlightedStartText, highlightedEndText, showLineNumbers, shouldWrapLongLines),
			),
		[highlightedStartText, highlightedEndText, showLineNumbers, shouldWrapLongLines, getStyles],
	);

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
			css={styles}
			showLineNumbers={showLineNumbers}
			firstLineNumber={firstLineNumber}
			lineProps={getLineProps}
			// shouldCreateParentElementForLines is needed to pass down props to each line.
			// This is necessary for both line highlighting and testId's, as each of
			// these rely on a data attribute being passed down to lines.
			shouldCreateParentElementForLines={highlight.length > 0 || !!testId}
			shouldWrapLongLines={shouldWrapLongLines}
			codeBidiWarnings={codeBidiWarnings}
			codeBidiWarningLabel={codeBidiWarningLabel}
			codeBidiWarningTooltipEnabled={codeBidiWarningTooltipEnabled}
			text={text}
		/>
	);
});

CodeBlock.displayName = 'CodeBlock';

export default CodeBlock;
