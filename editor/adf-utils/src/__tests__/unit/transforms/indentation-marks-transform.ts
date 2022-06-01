import { transformIndentationMarks } from '../../../transforms/indentation-marks-transform';

import tableCellWithIndentedHeadingInvalidAdf from './__fixtures__/table-cell-with-indented-heading-invalid-adf.json';
import tableCellWithIndentedHeadingAndContentInvalidAdf from './__fixtures__/table-cell-with-indented-heading-and-content-invalid-adf.json';
import complexDocWithIndentationMarksValidAdf from './__fixtures__/complex-doc-with-indentation-marks-valid-adf.json';

describe('transformIndentationMarks', () => {
  it('should remove indentation marks from headings inside table cells', () => {
    let { isTransformed, transformedAdf } = transformIndentationMarks(
      tableCellWithIndentedHeadingInvalidAdf,
    );
    expect(isTransformed).toEqual(true);
    expect(transformedAdf).toMatchSnapshot();
  });

  it('should remove indentation marks from headings (mutiple content) inside table cells', () => {
    let { isTransformed, transformedAdf } = transformIndentationMarks(
      tableCellWithIndentedHeadingAndContentInvalidAdf,
    );
    expect(isTransformed).toEqual(true);
    expect(transformedAdf).toMatchSnapshot();
  });

  it('should not remove indentation marks in valid complex doc, transformedAdf should be unchanged', () => {
    let { isTransformed, transformedAdf } = transformIndentationMarks(
      complexDocWithIndentationMarksValidAdf,
    );
    expect(isTransformed).toEqual(false);
    expect(transformedAdf).toEqual(complexDocWithIndentationMarksValidAdf);
  });
});
