import { skipAutoA11y } from '@atlassian/a11y-playwright-testing';
import { selectors } from '../__helpers/page-objects/_renderer';
import { rendererTestCase as test, expect } from './not-libra';
import { tableWith30rows5ColsWithNestedTable } from './table-sticky-scrollbar.spec.ts-fixtures';

test.use({ exampleName: 'testing' as keyof typeof import('../../../examples/99-testing.tsx') });
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
		// This test exposes one or more accessibility violations. Testing is currently skipped but violations need to
		// be fixed in a timely manner or result in escalation. Once all violations have been fixed, you can remove
		// the next line and associated import. For more information, see go/afm-a11y-tooling:playwright
		skipAutoA11y();
		// Last stickyScrollbar container is the parent table's scrollbar container
		const stickyScrollbar = renderer.page.locator(selectors.stickyScrollbar).last();
		await expect(stickyScrollbar).toBeVisible();
	});

	test('should capture and report a11y violations', async ({ renderer }) => {
		// This test exposes one or more accessibility violations. Testing is currently skipped but violations need to
		// be fixed in a timely manner or result in escalation. Once all violations have been fixed, you can remove
		// the next line and associated import. For more information, see go/afm-a11y-tooling:playwright
		skipAutoA11y();
		const stickyScrollbar = renderer.page.locator(selectors.stickyScrollbar).last();
		await expect(stickyScrollbar).toBeVisible();

		await expect(renderer.page).toBeAccessible({ violationCount: 1 });
	});
});
