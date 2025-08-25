import { transformNodesMissingContent } from '../../../transforms/nodes-missing-content-transform';

import tableRowInvalidEmptyAdf from './__fixtures__/table-row-invalid-empty-adf.json';
import tableRowsNonEmptyAndInvalidEmptyAdf from './__fixtures__/table-rows-non-empty-and-invalid-empty-adf.json';
import tableCellInvalidEmptyAdf from './__fixtures__/table-cell-invalid-empty-adf.json';
import tableCellWithAttrsInvalidEmptyAdf from './__fixtures__/table-cell-with-attrs-invalid-empty-adf.json';
import bulletListInvalidEmptyAdf from './__fixtures__/bullet-list-invalid-empty-adf.json';
import orderedListInvalidEmptyAdf from './__fixtures__/ordered-list-invalid-empty-adf.json';
import bulletListWithTextInvalidAdf from './__fixtures__/bullet-list-with-text-invalid-adf.json';
import orderedListWithTextInvalidAdf from './__fixtures__/ordered-list-with-text-invalid-adf.json';
import tableWithTextInvalidAdf from './__fixtures__/table-with-text-invalid-adf.json';
import complexTableValidAdf from './__fixtures__/complex-table-valid-adf.json';
import complexListsValidAdf from './__fixtures__/complex-lists-valid-adf.json';
import mediaSingleInvalidEmptyContent from './__fixtures__/mediasingle-invalid-empty-content-adf.json';
import mediaSingleInvalidNullContent from './__fixtures__/mediasingle-invalid-null-content-adf.json';

describe('transformNodesMissingContent', () => {
	describe('lists', () => {
		describe('when nodes are invalidly empty', () => {
			it.each([
				['bulletList', bulletListInvalidEmptyAdf],
				['orderedList', orderedListInvalidEmptyAdf],
			])('should create valid filler content for %s', (_, adf) => {
				const { isTransformed, transformedAdf } = transformNodesMissingContent(adf);
				expect(isTransformed).toEqual(true);
				expect(transformedAdf).toMatchSnapshot();
			});
		});

		describe('when list nodes have invalid children', () => {
			it.each([
				['bulletList with text', bulletListWithTextInvalidAdf],
				['orderedList with text', orderedListWithTextInvalidAdf],
			])('should create valid listItem nodes for %s', (_, adf) => {
				const { isTransformed, transformedAdf } = transformNodesMissingContent(adf);
				expect(isTransformed).toEqual(true);
				expect(transformedAdf).toMatchSnapshot();
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
				['tableRow', tableRowInvalidEmptyAdf],
				[
					'tableRow (while alongside valid non-empty tableRows)',
					tableRowsNonEmptyAndInvalidEmptyAdf,
				],
				['tableCell', tableCellInvalidEmptyAdf],
				['tableCell (with attributes)', tableCellWithAttrsInvalidEmptyAdf],
			])('should create valid filler content for %s', (_, adf) => {
				const { isTransformed, transformedAdf } = transformNodesMissingContent(adf);
				expect(isTransformed).toEqual(true);
				expect(transformedAdf).toMatchSnapshot();
			});
		});

		describe('when table nodes have invalid children', () => {
			it.each([['table with text', tableWithTextInvalidAdf]])(
				'should create valid tableRow nodes for %s',
				(_, adf) => {
					const { isTransformed, transformedAdf } = transformNodesMissingContent(adf);
					expect(isTransformed).toEqual(true);
					expect(transformedAdf).toMatchSnapshot();
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
				['when content is an empty array', mediaSingleInvalidEmptyContent],
				['when content is null', mediaSingleInvalidNullContent],
			])('%s', (_, adf) => {
				const { isTransformed, transformedAdf } = transformNodesMissingContent(adf);
				expect(isTransformed).toEqual(true);
				expect(transformedAdf).toMatchSnapshot();
			});
		});
	});
});
