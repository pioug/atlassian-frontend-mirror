import { expect, test } from '@af/integration-testing';

test('keeps the 300px minimum card column width in wide containers when teams_a11y_20261102 is on', async ({
	page,
}) => {
	await page.visitExample<typeof import('../../examples/TeamContainers.example.tsx')>(
		'people-and-teams',
		'teams-public',
		'TeamContainers',
		{ featureFlag: 'teams_a11y_20261102' },
	);

	const cards = [
		page.getByRole('listitem').filter({ hasText: 'Jira Project' }),
		page.getByRole('listitem').filter({ hasText: 'Confluence Space' }),
	];

	for (const card of cards) {
		await expect(card).toBeVisible();
		const box = await card.boundingBox();
		expect(box?.width).toBeGreaterThanOrEqual(300);
	}
});
