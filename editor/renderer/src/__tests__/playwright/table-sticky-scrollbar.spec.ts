import { rendererTestCase as test, expect } from './not-libra';
import { tableWith30rows5ColsWithNestedTable } from './table-sticky-scrollbar.spec.ts-fixtures';
import { selectors } from '../__helpers/page-objects/_renderer';

test.use({
	editorExperiments: {
		platform_renderer_table_sticky_scrollbar: true,
	},
	adf: tableWith30rows5ColsWithNestedTable,
	platformFeatureFlags: {
		platform_editor_querySelector_fix_table_renderer: true,
	},
	rendererProps: {
		appearance: 'full-page',
	},
});

test.describe('Renderer - Table Sticky Scrollbar', () => {
	test('should be visible when table has a nested table and bottom of the table is below the viewport', async ({
		renderer,
	}) => {
		// Last stickyScrollbar container is the parent table's scrollbar container
		const stickyScrollbar = renderer.page.locator(selectors.stickyScrollbar).last();
		await expect(stickyScrollbar).toBeVisible();
	});

	test('should capture and report a11y violations', async ({ renderer }) => {
		const stickyScrollbar = renderer.page.locator(selectors.stickyScrollbar).last();
		await expect(stickyScrollbar).toBeVisible();

		await expect(renderer.page).toBeAccessible({ violationCount: 1 });
	});
});
