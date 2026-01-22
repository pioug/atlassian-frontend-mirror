// eslint-disable-next-line import/no-extraneous-dependencies -- Removed import for fixing circular dependencies
import { p, table, td, tr } from '@atlaskit/editor-test-helpers/doc-builder';
// eslint-disable-next-line import/no-extraneous-dependencies -- Removed import for fixing circular dependencies
import { defaultSchema } from '@atlaskit/editor-test-helpers/schema';
import { skipAutoA11yFile } from '@atlassian/a11y-jest-testing';

const originWeakMap = window.WeakMap;
Object.defineProperty(window, 'WeakMap', {
	value: undefined,
});
import { TableMap } from '../../table-map';

// This file exposes one or more accessibility violations. Testing is currently skipped but violations need to
// be fixed in a timely manner or result in escalation. Once all violations have been fixed, you can remove
// the next line and associated import. For more information, see go/afm-a11y-tooling:jest
skipAutoA11yFile();

const tableCell = td({})(p('1'));

describe('TableMap', () => {
	describe('WeakMap is not supported', () => {
		afterAll(() => {
			// restore Weakmap
			Object.defineProperty(window, 'WeakMap', {
				value: originWeakMap,
			});
		});
		it('able the cache TableMap correctly', () => {
			const tableNode = table()(
				tr(tableCell, tableCell, tableCell),
				tr(tableCell, tableCell, tableCell),
				tr(tableCell, tableCell, tableCell),
				tr(tableCell, tableCell, tableCell),
			)(defaultSchema);
			// Update the cache
			TableMap.get(tableNode);

			// Should get from the cache
			const tableMapA = TableMap.get(tableNode).map.join(', ');

			expect(tableMapA).toBe('1, 6, 11, 18, 23, 28, 35, 40, 45, 52, 57, 62');
		});
	});
});
