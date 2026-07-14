import { transformIndentationMarks } from '../../../transforms/indentation-marks-transform';

import tableCellWithIndentedHeadingInvalidAdf from './__fixtures__/table-cell-with-indented-heading-invalid-adf.json';
import tableCellWithIndentedHeadingAndContentInvalidAdf from './__fixtures__/table-cell-with-indented-heading-and-content-invalid-adf.json';
import complexDocWithIndentationMarksValidAdf from './__fixtures__/complex-doc-with-indentation-marks-valid-adf.json';
import tableHeaderWithIndentedHeadingInvalidAdf from './__fixtures__/table-header-with-indented-heading-invalid-adf.json';
import tableHeaderWithIndentedHeadingAndContentInvalidAdf from './__fixtures__/table-header-with-indented-heading-and-content-invalid-adf.json';

describe('transformIndentationMarks', () => {
	it('should remove indentation marks from headings inside table cells', () => {
		const { isTransformed } = transformIndentationMarks(tableCellWithIndentedHeadingInvalidAdf);
		expect(isTransformed).toEqual(true);
	});

	it('should remove indentation marks from headings (mutiple content) inside table cells', () => {
		const { isTransformed } = transformIndentationMarks(
			tableCellWithIndentedHeadingAndContentInvalidAdf,
		);
		expect(isTransformed).toEqual(true);
	});

	it('should remove indentation marks from headings inside table headers', () => {
		const { isTransformed } = transformIndentationMarks(tableHeaderWithIndentedHeadingInvalidAdf);
		expect(isTransformed).toEqual(true);
	});

	it('should remove indentation marks from headings (mutiple content) inside table headers', () => {
		const { isTransformed } = transformIndentationMarks(
			tableHeaderWithIndentedHeadingAndContentInvalidAdf,
		);
		expect(isTransformed).toEqual(true);
	});

	it('should not remove indentation marks in valid complex doc, transformedAdf should be unchanged', () => {
		const { isTransformed, transformedAdf } = transformIndentationMarks(
			complexDocWithIndentationMarksValidAdf,
		);
		expect(isTransformed).toEqual(false);
		expect(transformedAdf).toEqual(complexDocWithIndentationMarksValidAdf);
	});
});
