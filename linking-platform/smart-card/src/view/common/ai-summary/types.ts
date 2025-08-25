export type AISummaryProps = {
	/**
	 * For compiled css
	 */
	className?: string;
	/* Raw markdown format text to display.*/
	content?: string;
	/**
	 * Minimum height requirement for the AISummary component to prevent fluctuations in a card size on the summary action.
	 */
	minHeight?: number;
	/**
	 * appears as a data attribute `data-testid` in the rendered code,
	 * serving as a hook for automated tests
	 */
	testId?: string;
};
