// @ts-nocheck
import { expect, test } from '@af/integration-testing';

test.describe('Resize Listener', () => {
	test('triggers the callback on dimension change', async ({ page }) => {
		await page.visitExample('connect', 'simple-xdm', 'resize');

		await expect(page.getByText('Appended after resize')).toBeHidden();

		await page.setViewportSize({
			width: 200,
			height: 200,
		});

		await expect(page.getByText('Appended after resize')).toBeVisible();
	});
});

test.describe('Body Resize Listener', () => {
	// Couldn't get body resizing to work in Storybook, so skipping this test.
	// The original implementation is at https://bitbucket.org/atlassian/simple-xdm/src/cd3aff84772fc11d2e375b33682d56c6fa7ee637/spec/tests/resize-listener_spec.js#lines-39
});
