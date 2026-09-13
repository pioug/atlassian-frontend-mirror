import { type PackageChange } from '../types';

type CsvColumn = [[string]];

/** Generates a CSV of product package changes over time */
export const generateCSV = (packageChanges: PackageChange[]): string => {
	const csvData: CsvColumn = [['']];

	packageChanges.forEach((packageChange) => {
		const firstColumn = csvData[0];
		const currentRow = firstColumn.push(packageChange.date) - 1;

		Object.entries(packageChange.deps).forEach(([name, { version }]) => {
			let depColumnIndex = csvData.findIndex((item) => item[0] === name);
			if (depColumnIndex === -1) {
				depColumnIndex = csvData.push([name]) - 1;
			}

			csvData[depColumnIndex][currentRow] = version;
		});
	});

	for (let i = 0; i < csvData.length; i++) {
		for (let j = 0; j < csvData.length; j++) {
			if (typeof csvData[i][j] !== 'string') {
				csvData[i][j] = '';
			}
		}

		if (i !== 0 && csvData[0].length < csvData[i].length) {
		}
	}

	const csvStrings: string[] = [];

	csvData.forEach((column) => {
		if (!column) {
			return;
		}
		for (let rowIndex = 0; rowIndex < csvData[0].length; rowIndex++) {
			const rowItem = column[rowIndex] || '';

			if (typeof csvStrings[rowIndex] !== 'string') {
				csvStrings[rowIndex] = '';
			}

			csvStrings[rowIndex] += `"${rowItem}",`;
		}
	});

	return csvStrings.join('\n');
};
