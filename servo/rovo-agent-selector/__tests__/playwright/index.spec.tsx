import { expect, test } from '@af/integration-testing';

const exampleComponent = "[data-testid='rovo-agent-selector']";

test('RovoAgentSelector should be able to be identified by data-testid', async ({ page }) => {
	await page.visitExample('servo', 'rovo-agent-selector', 'basic');
	await expect(page.locator(exampleComponent).first()).toBeVisible();
});
