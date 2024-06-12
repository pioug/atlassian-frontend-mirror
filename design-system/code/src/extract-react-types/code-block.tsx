// below type is redeclared from ../types to appease ERT
export default function CodeBlock(__: {
	/**
	 * The code to be formatted.
	 */
	text: string;
	/**
	 * A unique string that appears as a data attribute `data-testid` in the rendered code. Serves as a hook for automated tests.
	 */
	testId?: string;
	/**
	 * Sets whether to display code line numbers or not. Defaults to `true`.
	 */
	showLineNumbers?: boolean;
	/* eslint-disable jsdoc/require-asterisk-prefix, jsdoc/check-alignment */
	/**
   Language reference designed to be populated from `SUPPORTED_LANGUAGES` in
   `design-system/code`. Run against language grammars from PrismJS (full list
   available at [PrismJS documentation](https://prismjs.com/#supported-languages)).

   When set to `text` will not perform highlighting. If unsupported language
   provided - code will be treated as "text" with no highlighting.

   Defaults to `text`.
   */
	language?: string;
	/**
   Comma delimited lines to highlight.

   Example uses:
   - To highlight one line `highlight="3"`
   - To highlight a group of lines `highlight="1-5"`
   - To highlight multiple groups `highlight="1-5,7,10,15-20"`
   */
	highlight?: string;
	/* eslint-enable jsdoc/require-asterisk-prefix, jsdoc/check-alignment */

	/**
	 * Screen reader text for the start of a highlighted line.
	 */
	highlightedStartText?: string;

	/**
	 * Screen reader text for the end of a highlighted line.
	 */
	highlightedEndText?: string;
	/**
	 * Sets whether long lines will create a horizontally scrolling container.
	 * When set to `true`, these lines will visually wrap instead. Defaults to `false`.
	 */
	shouldWrapLongLines?: boolean;
}) {
	return null;
}
