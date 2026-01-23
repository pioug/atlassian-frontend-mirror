import invariant from 'tiny-invariant';

import { expect, test } from '@af/integration-testing';

test.describe('menu item drag and drop in the sidebar', () => {
	test.beforeEach(async ({ page }) => {
		await page.visitExample('navigation', 'side-nav-items', 'drag-and-drop-jira');
	});

	// This test helps give us confidence that our end to end story is working correctly
	test('smoke test (project reordering)', async ({ page }) => {
		const group = page.locator('[data-testid="project-group-starred"]');

		await expect(group.locator('a')).toHaveText([
			'Modernize typography',
			'F1 sponsorship',
			'Mobile application',
		]);

		const dropTargetBoundingBox = await page.getByText('Mobile application').boundingBox();
		invariant(dropTargetBoundingBox);

		await page.getByText('Modernize typography').dragTo(page.getByText('Mobile application'), {
			targetPosition: { x: 10, y: dropTargetBoundingBox.height - 4 },
		});

		await expect(group.locator('a')).toHaveText([
			'F1 sponsorship',
			'Mobile application',
			'Modernize typography', // Moved after "Mobile application"
		]);
	});
});
