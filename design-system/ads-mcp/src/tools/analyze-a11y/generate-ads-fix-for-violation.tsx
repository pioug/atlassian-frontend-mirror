// Helper function to provide ADS-specific guidance for axe-core violations
export function generateADSFixForViolation(violation: any): any {
	const { id, description, help, tags } = violation;

	// Provide general guidance without trying to map to specific fixes.ts keys
	const adsFix = `Use the ads_suggest_a11y_fixes tool to get specific ADS component solutions. Describe the issue using the violation details: "${help}" or in your own words (e.g., "button has no text", "missing alt text", "form field needs label").`;

	return {
		title: help, // Use axe-core's human-readable description
		description: description,
		adsFix,
		example:
			'The ads_suggest_a11y_fixes tool provides detailed code examples and ADS component solutions',
		violationId: id,
		axeHelp: help,
		tags,
		wcagTags: tags.filter((tag: string) => tag.startsWith('wcag')), // Extract WCAG compliance info
		reference: `https://atlassian.design/llms-a11y.txt`,
		recommendations: [
			'Use ADS components for better accessibility out of the box',
			'Reference the ads_suggest_a11y_fixes tool for specific solutions',
			'Test with keyboard navigation and screen readers',
			'Use automated accessibility testing tools',
		],
	};
}
