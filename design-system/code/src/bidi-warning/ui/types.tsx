export type CodeBidiWarningProps = {
	/**
	 * A unique string that appears as a data attribute `data-testid`
	 * in the rendered code. Serves as a hook for automated tests.
	 */
	testId?: string;
	/**
	 * A bidi character which can be used to perform a "bidi override attack". See https://hello.atlassian.net/wiki/spaces/PRODSEC/pages/1347434677/PSHELP-2943+Investigate+Trojan+Source+Attack+Vulnerability#1
	 */
	bidiCharacter: string;
	/**
	 * Sets whether to render tooltip with the warning or not.
	 * Intended to be disabled when used in a mobile view, such as in the editor via mobile bridge,
	 * where the tooltip could end up being cut off or otherwise not work as expected.
	 * @default true
	 * @deprecated Use `isTooltipEnabled` instead
	 */
	// eslint-disable-next-line @repo/internal/react/boolean-prop-naming-convention
	tooltipEnabled?: boolean;
	/**
	 * Sets whether to render tooltip with the warning or not.
	 * Intended to be disabled when used in a mobile view, such as in the editor via mobile bridge,
	 * where the tooltip could end up being cut off or otherwise not work as expected.
	 * @default true
	 */
	isTooltipEnabled?: boolean;
	/**
	 * Sets whether bidi character should be wrapped in decorator.
	 * Useful when wrapping the bidi character with the decoration is not achievable.
	 * @default false
	 * @deprecated Use `shouldSkipChildren` instead
	 */
	// eslint-disable-next-line @repo/internal/react/boolean-prop-naming-convention
	skipChildren?: boolean;
	/**
	 * Sets whether bidi character should be wrapped in decorator.
	 * Useful when wrapping the bidi character with the decoration is not achievable.
	 * @default false
	 */
	shouldSkipChildren?: boolean;
	/**
	 * Label for the bidi warning tooltip.
	 * @default "Bidirectional characters change the order that text is rendered. This could be used to obscure malicious code."
	 */
	label?: string;
};
