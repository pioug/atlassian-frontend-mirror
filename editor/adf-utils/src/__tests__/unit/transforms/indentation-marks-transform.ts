/* eslint-disable
  @atlaskit/design-system/no-to-match-snapshot,
  @atlaskit/design-system/no-unsafe-inline-snapshot
  -- TODO(IND-4952): existing snapshot tests will be removed in a follow-up cleanup PR.
  See https://hello.atlassian.net/wiki/spaces/afm/pages/7146174189/LDR+Unit+Tests+-+Ban+Snapshot+tests+in+Platform
  and raise concerns in https://atlassian.enterprise.slack.com/archives/C0BD4K40BLH
*/

import { transformIndentationMarks } from '../../../transforms/indentation-marks-transform';

import tableCellWithIndentedHeadingInvalidAdf from './__fixtures__/table-cell-with-indented-heading-invalid-adf.json';
import tableCellWithIndentedHeadingAndContentInvalidAdf from './__fixtures__/table-cell-with-indented-heading-and-content-invalid-adf.json';
import complexDocWithIndentationMarksValidAdf from './__fixtures__/complex-doc-with-indentation-marks-valid-adf.json';
import tableHeaderWithIndentedHeadingInvalidAdf from './__fixtures__/table-header-with-indented-heading-invalid-adf.json';
import tableHeaderWithIndentedHeadingAndContentInvalidAdf from './__fixtures__/table-header-with-indented-heading-and-content-invalid-adf.json';

describe('transformIndentationMarks', () => {
	it('should remove indentation marks from headings inside table cells', () => {
		const { isTransformed, transformedAdf } = transformIndentationMarks(
			tableCellWithIndentedHeadingInvalidAdf,
		);
		expect(isTransformed).toEqual(true);
		expect(transformedAdf).toMatchSnapshot();
	});

	it('should remove indentation marks from headings (mutiple content) inside table cells', () => {
		const { isTransformed, transformedAdf } = transformIndentationMarks(
			tableCellWithIndentedHeadingAndContentInvalidAdf,
		);
		expect(isTransformed).toEqual(true);
		expect(transformedAdf).toMatchSnapshot();
	});

	it('should remove indentation marks from headings inside table headers', () => {
		const { isTransformed, transformedAdf } = transformIndentationMarks(
			tableHeaderWithIndentedHeadingInvalidAdf,
		);
		expect(isTransformed).toEqual(true);
		expect(transformedAdf).toMatchSnapshot();
	});

	it('should remove indentation marks from headings (mutiple content) inside table headers', () => {
		const { isTransformed, transformedAdf } = transformIndentationMarks(
			tableHeaderWithIndentedHeadingAndContentInvalidAdf,
		);
		expect(isTransformed).toEqual(true);
		expect(transformedAdf).toMatchSnapshot();
	});

	it('should not remove indentation marks in valid complex doc, transformedAdf should be unchanged', () => {
		const { isTransformed, transformedAdf } = transformIndentationMarks(
			complexDocWithIndentationMarksValidAdf,
		);
		expect(isTransformed).toEqual(false);
		expect(transformedAdf).toEqual(complexDocWithIndentationMarksValidAdf);
	});
});
