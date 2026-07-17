import { transformNodesMissingContent } from '../../../transforms/nodes-missing-content-transform';
import type { ADFEntity } from '../../../types';

import tableRowInvalidEmptyAdf from './__fixtures__/table-row-invalid-empty-adf.json';
import tableRowInvalidEmptyExpectedAdf from './__fixtures__/table-row-invalid-empty-expected-adf.json';
import tableRowsNonEmptyAndInvalidEmptyAdf from './__fixtures__/table-rows-non-empty-and-invalid-empty-adf.json';
import tableRowsNonEmptyAndInvalidEmptyExpectedAdf from './__fixtures__/table-rows-non-empty-and-invalid-empty-expected-adf.json';
import tableCellInvalidEmptyAdf from './__fixtures__/table-cell-invalid-empty-adf.json';
import tableCellInvalidEmptyExpectedAdf from './__fixtures__/table-cell-invalid-empty-expected-adf.json';
import tableCellWithAttrsInvalidEmptyAdf from './__fixtures__/table-cell-with-attrs-invalid-empty-adf.json';
import tableCellWithAttrsInvalidEmptyExpectedAdf from './__fixtures__/table-cell-with-attrs-invalid-empty-expected-adf.json';
import bulletListInvalidEmptyAdf from './__fixtures__/bullet-list-invalid-empty-adf.json';
import bulletListInvalidEmptyExpectedAdf from './__fixtures__/bullet-list-invalid-empty-expected-adf.json';
import orderedListInvalidEmptyAdf from './__fixtures__/ordered-list-invalid-empty-adf.json';
import orderedListInvalidEmptyExpectedAdf from './__fixtures__/ordered-list-invalid-empty-expected-adf.json';
import bulletListWithTextInvalidAdf from './__fixtures__/bullet-list-with-text-invalid-adf.json';
import bulletListWithTextExpectedAdf from './__fixtures__/bullet-list-with-text-expected-adf.json';
import orderedListWithTextInvalidAdf from './__fixtures__/ordered-list-with-text-invalid-adf.json';
import orderedListWithTextExpectedAdf from './__fixtures__/ordered-list-with-text-expected-adf.json';
import tableWithTextInvalidAdf from './__fixtures__/table-with-text-invalid-adf.json';
import tableWithTextExpectedAdf from './__fixtures__/table-with-text-expected-adf.json';
import complexTableValidAdf from './__fixtures__/complex-table-valid-adf.json';
import complexListsValidAdf from './__fixtures__/complex-lists-valid-adf.json';
import mediaSingleInvalidEmptyContent from './__fixtures__/mediasingle-invalid-empty-content-adf.json';
import mediaSingleInvalidEmptyContentExpected from './__fixtures__/mediasingle-invalid-empty-content-expected-adf.json';
import mediaSingleInvalidNullContent from './__fixtures__/mediasingle-invalid-null-content-adf.json';
import mediaSingleInvalidNullContentExpected from './__fixtures__/mediasingle-invalid-null-content-expected-adf.json';

describe('transformNodesMissingContent', () => {
	describe('lists', () => {
		describe('when nodes are invalidly empty', () => {
			it.each([
				['bulletList', bulletListInvalidEmptyAdf, bulletListInvalidEmptyExpectedAdf],
				['orderedList', orderedListInvalidEmptyAdf, orderedListInvalidEmptyExpectedAdf],
			])('should create valid filler content for %s', (_, adf, expected) => {
				const { isTransformed, transformedAdf } = transformNodesMissingContent(adf);
				expect(isTransformed).toEqual(true);
				expect(transformedAdf).toEqual(expected);
			});
		});

		describe('when list nodes have invalid children', () => {
			it.each([
				['bulletList with text', bulletListWithTextInvalidAdf, bulletListWithTextExpectedAdf],
				['orderedList with text', orderedListWithTextInvalidAdf, orderedListWithTextExpectedAdf],
			])('should create valid listItem nodes for %s', (_, adf, expected) => {
				const { isTransformed, transformedAdf } = transformNodesMissingContent(adf);
				expect(isTransformed).toEqual(true);
				expect(transformedAdf).toEqual(expected);
			});
		});

		describe('when complex lists are valid', () => {
			it('should not transform any content, transformedAdf should be unchanged', () => {
				const { isTransformed, transformedAdf } =
					transformNodesMissingContent(complexListsValidAdf);
				expect(isTransformed).toEqual(false);
				expect(transformedAdf).toEqual(complexListsValidAdf);
			});
		});
	});

	describe('tables', () => {
		describe('when nodes are invalidly empty', () => {
			it.each([
				['tableRow', tableRowInvalidEmptyAdf, tableRowInvalidEmptyExpectedAdf],
				[
					'tableRow (while alongside valid non-empty tableRows)',
					tableRowsNonEmptyAndInvalidEmptyAdf,
					tableRowsNonEmptyAndInvalidEmptyExpectedAdf,
				],
				['tableCell', tableCellInvalidEmptyAdf, tableCellInvalidEmptyExpectedAdf],
				[
					'tableCell (with attributes)',
					tableCellWithAttrsInvalidEmptyAdf,
					tableCellWithAttrsInvalidEmptyExpectedAdf,
				],
			])('should create valid filler content for %s', (_, adf, expected) => {
				const { isTransformed, transformedAdf } = transformNodesMissingContent(adf);
				expect(isTransformed).toEqual(true);
				expect(transformedAdf).toEqual(expected);
			});
		});

		describe('when table nodes have invalid children', () => {
			it.each([['table with text', tableWithTextInvalidAdf, tableWithTextExpectedAdf]])(
				'should create valid tableRow nodes for %s',
				(_, adf, expected) => {
					const { isTransformed, transformedAdf } = transformNodesMissingContent(adf);
					expect(isTransformed).toEqual(true);
					expect(transformedAdf).toEqual(expected);
				},
			);
		});

		describe('when complex table is valid', () => {
			it('should not transform any content, transformedAdf should be unchanged', () => {
				const { isTransformed, transformedAdf } =
					transformNodesMissingContent(complexTableValidAdf);
				expect(isTransformed).toEqual(false);
				expect(transformedAdf).toEqual(complexTableValidAdf);
			});
		});
	});

	describe('mediaSingle', () => {
		describe('is removed when has no children', () => {
			it.each([
				[
					'when content is an empty array',
					mediaSingleInvalidEmptyContent,
					mediaSingleInvalidEmptyContentExpected,
				],
				[
					'when content is null',
					mediaSingleInvalidNullContent,
					mediaSingleInvalidNullContentExpected,
				],
			])('%s', (_, adf, expected) => {
				const { isTransformed, transformedAdf } = transformNodesMissingContent(adf as ADFEntity);
				expect(isTransformed).toEqual(true);
				expect(transformedAdf).toEqual(expected);
			});
		});
	});
});
