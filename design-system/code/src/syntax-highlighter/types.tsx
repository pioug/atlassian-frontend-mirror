import React from 'react';

// eslint-disable-next-line @atlaskit/ui-styling-standard/use-compiled -- Ignored via go/DSP-18766
import { type SerializedStyles } from '@emotion/react';
import { type AST, type RefractorNode } from 'refractor';
export type { AST, RefractorNode } from 'refractor';

// This wrapper supports the async loading of refractor and language grammars. The internal Highlight is a memo() functional component as expected
// eslint-disable-next-line @repo/internal/react/no-class-components
export class SyntaxHighlighter extends React.PureComponent<SyntaxHighlighterProps> {}

/**
 * Function that receives current line number as argument and returns a
 * line props object to be applied to each `span` wrapping code line.
 */
type lineTagPropsFunction = (lineNumber?: number) => AST.Properties;
/**
 * Props to be passed to the `span` wrapping each code line. Can be an
 * object or a function that receives current line number as argument and
 * returns a props object.
 */
export type SyntaxHighlighterLineProps = lineTagPropsFunction | AST.Properties;

export interface SyntaxHighlighterProps {
	/**
	 * A unique string that appears as a data attribute `data-testid`
	 * in the rendered code. Serves as a hook for automated tests.
	 */
	testId?: string;
	/**
	 * Language reference designed to be populated from `SUPPORTED_LANGUAGES` in
	 * `design-system/code`. Run against language grammars from PrismJS (full list
	 * available at [PrismJS documentation](https://prismjs.com/#supported-languages)).
	 *
	 * When set to "text" will not perform highlighting. If unsupported language
	 * provided - code will be treated as "text" with no highlighting.
	 * @default 'text'
	 */
	language?: string;
	/**
	 * Props to be passed to the `span` wrapping each line if
	 * `shouldCreateParentElementForLines` is `true`. Can be an object or a function
	 * that receives current line number as argument and returns a props object.
	 */
	lineProps?: SyntaxHighlighterLineProps;
	/**
	 * Props to be passed to the `code` element that is the parent of all lines of code.
	 */
	codeTagProps?: React.HTMLProps<HTMLElement>;
	/**
	 * Sets whether to display code line numbers or not. Defaults to `true`
	 */
	// eslint-disable-next-line @repo/internal/react/boolean-prop-naming-convention
	showLineNumbers?: boolean;
	/**
	 * Sets the number of the first line, if showLineNumbers is set to true.
	 * @default 1
	 */
	firstLineNumber?: number;
	/**
	 * Determines whether or not each line of code should be wrapped in a parent
	 * element.
	 *
	 * When set to false, can not take action on an element on the line level,
	 * meaning, for example, that props will not be passed down.
	 *
	 * @default false
	 */
	shouldCreateParentElementForLines?: boolean;
	/**
	 * Sets whether long lines will create a horizontally scrolling container.
	 * When set to `true`, these lines will visually wrap instead.
	 *
	 * @default false
	 */
	shouldWrapLongLines?: boolean;
	/**
	 * Serialized styles returned from Emotion's `css()` function.
	 */
	styles?: SerializedStyles;
	/**
	 * `codeBidiWarnings` is set via a prop on @atlaskit/code/CodeBlock.
	 *
	 * When set to `false`, disables code decorating with bidi warnings.
	 *
	 * @default true
	 */
	// eslint-disable-next-line @repo/internal/react/boolean-prop-naming-convention
	codeBidiWarnings?: CodeBidiWarningConfig['codeBidiWarnings'];
	/**
	 * `codeBidiWarningLabel` is set via a prop on @atlaskit/code/CodeBlock.
	 *
	 * Label for the bidi warning tooltip.
	 *
	 * @default 'Bidirectional characters change the order that text is rendered. This could be used to obscure malicious code.'
	 */
	codeBidiWarningLabel?: CodeBidiWarningConfig['codeBidiWarningLabel'];
	/**
	 * `codeBidiWarningTooltipEnabled` is set via a prop on @atlaskit/code/CodeBlock.
	 *
	 * Sets whether to render tooltip with the warning or not.
	 * Intended to be disabled when used in a mobile view, such as in the editor via mobile bridge,
	 * where the tooltip could end up being cut off or otherwise not work as expected.
	 * @default true
	 */
	// eslint-disable-next-line @repo/internal/react/boolean-prop-naming-convention
	codeBidiWarningTooltipEnabled?: CodeBidiWarningConfig['codeBidiWarningTooltipEnabled'];
	/**
	 * Code to render; equivalent of `text` prop on @atlaskit/code/CodeBlock.
	 */
	// We are matching the API of CodeBlock here, hence the override
	// eslint-disable-next-line @repo/internal/react/consistent-props-definitions
	text?: string;
	[spread: string]: any;
}

export interface CodeBidiWarningConfig {
	/**
	 * `codeBidiWarnings` is set via a prop on @atlaskit/code/CodeBlock.
	 *
	 * When set to `false`, disables code decorating with bidi warnings.
	 * @default true
	 */
	// eslint-disable-next-line @repo/internal/react/boolean-prop-naming-convention
	codeBidiWarnings?: boolean;
	/**
	 * `codeBidiWarningLabel` is set via a prop on @atlaskit/code/CodeBlock.
	 *
	 * Label for the bidi warning tooltip.
	 *
	 * @default 'Bidirectional characters change the order that text is rendered. This could be used to obscure malicious code.'
	 */
	codeBidiWarningLabel?: string;
	/**
	 * `codeBidiWarningTooltipEnabled` is set via a prop on @atlaskit/code/CodeBlock.
	 *
	 * Sets whether to render tooltip with the warning or not.
	 * Intended to be disabled when used in a mobile view, such as in the editor via mobile bridge,
	 * where the tooltip could end up being cut off or otherwise not work as expected.
	 * @default true
	 */
	// eslint-disable-next-line @repo/internal/react/boolean-prop-naming-convention
	codeBidiWarningTooltipEnabled?: boolean;
}

interface IAstGenerator {
	highlight: (code: string, language: string) => RefractorNode[];
}
export type AstGenerator = IAstGenerator | null;
