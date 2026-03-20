import { expect, test } from '@af/integration-testing';

test('Progress bar should pass base aXe audit', async ({ page }) => {
	await page.visitExample<typeof import('../../../examples/00-basic.tsx')>(
		'design-system',
		'progress-bar',
		'basic',
	);
	const progressBar = page.getByTestId('progress-bar');
	await expect(progressBar).toBeVisible();
});
