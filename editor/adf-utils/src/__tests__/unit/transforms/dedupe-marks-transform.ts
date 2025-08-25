import { transformDedupeMarks } from '../../../transforms/dedupe-marks-transform';

import docWithDuplicateMarksInvalidAdf from './__fixtures__/doc-with-duplicate-marks-invalid-adf.json';
import docWithNoDuplicateMarksValidAdf from './__fixtures__/doc-with-no-duplicate-marks-valid-adf.json';

describe('transformDedupeMarks', () => {
	it('should remove duplicate marks', () => {
		const { isTransformed, transformedAdf, discardedMarks } = transformDedupeMarks(
			docWithDuplicateMarksInvalidAdf,
		);

		expect(discardedMarks.length).not.toEqual(0);

		// We should get all duplicate marks, not just the latest dropped mark
		expect(discardedMarks).toEqual(
			expect.arrayContaining([
				expect.objectContaining({
					attrs: { annotationType: 'inlineComment', id: '789' },
					type: 'annotation',
				}),
				expect.objectContaining({
					attrs: {
						type: 'sub',
					},
					type: 'subsup',
				}),
			]),
		);

		expect(isTransformed).toEqual(true);
		expect(transformedAdf).toMatchSnapshot();
	});

	it('should not remove marks in valid complex doc, transformedAdf should remain unchanged', () => {
		const { isTransformed, transformedAdf, discardedMarks } = transformDedupeMarks(
			docWithNoDuplicateMarksValidAdf,
		);
		expect(discardedMarks.length).toEqual(0);
		expect(isTransformed).toEqual(false);
		expect(transformedAdf).toEqual(docWithNoDuplicateMarksValidAdf);
	});
});
