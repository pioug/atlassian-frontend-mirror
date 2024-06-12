import { darkResults, lightResults } from './check-pair-contrasts';

export const downloadResultsAsCSV = (customResults?: typeof lightResults.fullResults) => {
	const fullResults = [
		...Object.values(customResults || {}),
		...Object.values(lightResults.fullResults),
		...Object.values(darkResults.fullResults),
	];

	const headings = Object.keys(fullResults[0]);

	const csv: string = fullResults.reduce((accum, pair) => {
		return `${accum}\n${Object.values(pair).join(',')}`;
	}, headings.join(','));

	// Download string as CSV file in user's browser
	const blob = new Blob([csv], { type: 'text/csv' });

	const link = document.createElement('a');
	link.href = window.URL.createObjectURL(blob);
	link.download = 'contrast-results.csv';
	link.click();
	document.body.removeChild(link);
};
