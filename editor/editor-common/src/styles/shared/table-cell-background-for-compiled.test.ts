import { tableCellBackgroundColorVariablesForCompiled } from './table-cell-background-for-compiled';

describe('tableCellBackgroundColorVariablesForCompiled', () => {
	// If this snapshot test fails, that means the css variables are updated,
	// we need to update the tableCellBackgroundColorOverrides in EditorContentContainer-compiled.tsx accordingly.
	// for example, if new entry is added, we need to add new entry in tableCellBackgroundColorOverrides as well.
	it('derives CSS variables for every named table cell background color', () => {
		expect(tableCellBackgroundColorVariablesForCompiled).toMatchInlineSnapshot(`
{
  "--ak-editor-table-cell-background-blue": "var(--ds-background-accent-blue-subtler)",
  "--ak-editor-table-cell-background-dark-blue": "var(--ds-background-accent-blue-subtle)",
  "--ak-editor-table-cell-background-dark-green": "var(--ds-background-accent-green-subtle)",
  "--ak-editor-table-cell-background-dark-purple": "var(--ds-background-accent-purple-subtle)",
  "--ak-editor-table-cell-background-dark-red": "var(--ds-background-accent-red-subtle)",
  "--ak-editor-table-cell-background-dark-teal": "var(--ds-background-accent-teal-subtle)",
  "--ak-editor-table-cell-background-dark-yellow": "var(--ds-background-accent-orange-subtle)",
  "--ak-editor-table-cell-background-gray": "var(--ds-background-accent-gray-subtle)",
  "--ak-editor-table-cell-background-green": "var(--ds-background-accent-green-subtler)",
  "--ak-editor-table-cell-background-light-blue": "var(--ds-background-accent-blue-subtlest)",
  "--ak-editor-table-cell-background-light-gray": "var(--ds-background-accent-gray-subtlest)",
  "--ak-editor-table-cell-background-light-green": "var(--ds-background-accent-green-subtlest)",
  "--ak-editor-table-cell-background-light-purple": "var(--ds-background-accent-purple-subtlest)",
  "--ak-editor-table-cell-background-light-red": "var(--ds-background-accent-red-subtlest)",
  "--ak-editor-table-cell-background-light-teal": "var(--ds-background-accent-teal-subtlest)",
  "--ak-editor-table-cell-background-light-yellow": "var(--ds-background-accent-yellow-subtlest)",
  "--ak-editor-table-cell-background-purple": "var(--ds-background-accent-purple-subtler)",
  "--ak-editor-table-cell-background-red": "var(--ds-background-accent-red-subtler)",
  "--ak-editor-table-cell-background-teal": "var(--ds-background-accent-teal-subtler)",
  "--ak-editor-table-cell-background-white": "var(--ds-surface)",
  "--ak-editor-table-cell-background-yellow": "var(--ds-background-accent-yellow-subtler)",
}
`);
	});
});
