import { transformDedupeMarks } from '../../../transforms/dedupe-marks-transform';

import docWithDuplicateMarksInvalidAdf from './__fixtures__/doc-with-duplicate-marks-invalid-adf.json';
import docWithNoDuplicateMarksValidAdf from './__fixtures__/doc-with-no-duplicate-marks-valid-adf.json';

describe('transformDedupeMarks', () => {
  it('should remove duplicate marks', () => {
    let { isTransformed, transformedAdf } = transformDedupeMarks(
      docWithDuplicateMarksInvalidAdf,
    );
    expect(isTransformed).toEqual(true);
    expect(transformedAdf).toMatchSnapshot();
  });

  it('should not remove marks in valid complex doc, transformedAdf should remain unchanged', () => {
    let { isTransformed, transformedAdf } = transformDedupeMarks(
      docWithNoDuplicateMarksValidAdf,
    );
    expect(isTransformed).toEqual(false);
    expect(transformedAdf).toEqual(docWithNoDuplicateMarksValidAdf);
  });
});
