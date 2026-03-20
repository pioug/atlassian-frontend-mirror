import { expect, test } from '@af/integration-testing';

const exampleComponent = "[data-testid='giveKudosLauncher']";

test('GiveKudos should be able to be identified by data-testid', async ({ page }) => {
	await page.visitExample<typeof import('../../examples/01-giveKudosLauncher.tsx')>(
		'team-central',
		'give-kudos',
		'giveKudosLauncher',
	);
	expect(await page.webdriverCompatUtils.isAttached(exampleComponent)).toBe(true);
});

test('should capture and report a11y violations', async ({ page }) => {
	await page.visitExample<typeof import('../../examples/01-giveKudosLauncher.tsx')>(
		'team-central',
		'give-kudos',
		'giveKudosLauncher',
	);

	await expect(page).toBeAccessible();
});
