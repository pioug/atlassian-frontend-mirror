import { transformNestedTablesIncomingDocument } from '../../../transforms/nested-table-transform';
import nestedTableExtensionAdf from './__fixtures__/nested-table-extension-adf.json';
import nestedTableExtensionWithNoNestedContentAdf from './__fixtures__/nested-table-extension-with-no-nestedcontent-adf.json';
import nestedTableExtensionWithInvalidNestedContentAdf from './__fixtures__/nested-table-extension-with-invalid-nestedcontent-adf.json';
import nestedTableExtensionWithoutTableAdf from './__fixtures__/nested-table-extension-without-table-adf.json';
import nestedTableWithInvalidJsonAdf from './__fixtures__/nested-table-extension-with-invalid-json-adf.json';
import nestedTableWithArrayAdf from './__fixtures__/nested-table-extension-with-array-adf.json';

describe('nested-table-transform', () => {
	describe('transformNestedTablesIncomingDocument', () => {
		it('should transform nested table extension to nested table', () => {
			const result = transformNestedTablesIncomingDocument(nestedTableExtensionAdf);

			expect(result.isTransformed).toBe(true);
			expect(result.transformedAdf).toMatchSnapshot();
		});

		it('should clear the node if nested table extension is missing nestedContent', () => {
			const result = transformNestedTablesIncomingDocument(
				nestedTableExtensionWithNoNestedContentAdf,
			);

			expect(result.isTransformed).toBe(false);
			expect(result.transformedAdf).toMatchSnapshot();
		});

		it('should throw an error if nested table extension nestedContent is not a string', () => {
			expect(() => {
				transformNestedTablesIncomingDocument(nestedTableExtensionWithInvalidNestedContentAdf);
			}).toThrow('Invalid nested table content');
		});

		it('should throw an error if nested table extension nestedContent is not an object', () => {
			expect(() => {
				transformNestedTablesIncomingDocument(nestedTableWithArrayAdf);
			}).toThrow('Invalid nested table content');
		});

		it('should throw an error if nested table extension nestedContent is not a table', () => {
			expect(() => {
				transformNestedTablesIncomingDocument(nestedTableExtensionWithoutTableAdf);
			}).toThrow('Invalid nested table content');
		});

		it('should throw an error if nested table extension nestedContent is not valid JSON', () => {
			expect(() => {
				transformNestedTablesIncomingDocument(nestedTableWithInvalidJsonAdf);
			}).toThrow('Failed to parse nested table content');
		});
	});
});
