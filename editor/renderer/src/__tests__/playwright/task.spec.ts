import { taskWithDateAdf } from '../__fixtures__/task-with-date';
import { rendererTestCase as test, expect } from './not-libra';

test.describe('task', () => {
	test.use({
		adf: taskWithDateAdf,
	});

	test('should format date correctly in task item', async ({ renderer }) => {
		const checkbox = renderer.page.getByRole('checkbox');
		const taskItem = renderer.page.locator('[data-task-local-id]');
		await checkbox.waitFor({ state: 'visible' });
		await expect(taskItem).toHaveText('Today');

		await checkbox.click();
		await expect(taskItem).toHaveText('Aug 16, 2017');
	});

	test('should capture and report a11y violations', async ({ renderer }) => {
		const checkbox = renderer.page.getByRole('checkbox');
		const taskItem = renderer.page.locator('[data-task-local-id]');
		await checkbox.waitFor({ state: 'visible' });
		await expect(taskItem).toBeVisible();

		await expect(renderer.page).toBeAccessible();
	});
});
