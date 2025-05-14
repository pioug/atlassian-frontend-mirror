export interface AiSnippetsProps {
	/**
	 * When `true` AiSnippets will appear selected.
	 */
	isSelected?: boolean;

	/**
	 * A `testId` prop is provided for specified elements, which is a unique
	 * string that appears as a data attribute `data-testid` in the rendered code,
	 * serving as a hook for automated tests */
	testId?: string;

	/**
	 * Width of AiSnippets.
	 */
	width?: number;
}

export type ProgressBarProps = { value: number };
