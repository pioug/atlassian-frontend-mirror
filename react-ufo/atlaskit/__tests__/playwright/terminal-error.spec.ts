/* eslint-disable @typescript-eslint/no-non-null-assertion */
/* eslint-disable testing-library/prefer-screen-queries */
/* eslint-disable compat/compat */
import { expect, test } from './fixtures';

test.describe('ReactUFO: Terminal Error Reporting', () => {
	test.use({
		examplePage: 'basic-with-terminal-error',
		featureFlags: ['platform_ufo_enable_terminal_errors'],
	});

	test('custom.terminal-error metric should be fired when terminal error is reported after hold is finished', async ({
		page,
		waitForAllTerminalErrorPayloads,
	}) => {
		const mainDiv = page.locator('[data-testid="main"]');
		const sectionOne = page.locator('[data-testid="sectionOne"]');

		await expect(mainDiv).toBeVisible();
		await expect(sectionOne).toBeVisible();

		// Wait for both terminal error payloads (SectionOne and SectionTwo)
		const terminalErrorPayloads = await waitForAllTerminalErrorPayloads(2);
		expect(terminalErrorPayloads.length).toBeGreaterThanOrEqual(2);

		const postHoldErrorPayload = terminalErrorPayloads.find(
			(p) => p.attributes.properties.terminalError.errorBoundaryId === 'section-one-boundary',
		);
		expect(postHoldErrorPayload).toBeDefined();

		expect(postHoldErrorPayload!.attributes.properties['experience:key']).toBe(
			'custom.terminal-error',
		);

		const terminalError = postHoldErrorPayload!.attributes.properties.terminalError;
		expect(terminalError).toBeDefined();
		expect(terminalError.errorType).toBe('Error');
		expect(terminalError.errorMessage).toBe('Terminal error occurred in SectionOne');
		expect(terminalError.teamName).toBe('ufo-team');
		expect(terminalError.packageName).toBe('react-ufo');
		expect(terminalError.errorBoundaryId).toBe('section-one-boundary');
		expect(terminalError.fallbackType).toBe('page');

		expect(postHoldErrorPayload?.actionSubject).toBe('experience');
		expect(postHoldErrorPayload?.action).toBe('measured');
		expect(postHoldErrorPayload?.eventType).toBe('operational');
		expect(postHoldErrorPayload?.tags).toContain('observability');

		const properties = postHoldErrorPayload!.attributes.properties;
		expect(properties.activeInteractionName).toBe('test-UFO');
		expect(properties.activeInteractionId).toBeDefined();
		expect(properties.activeInteractionType).toBe('page_load');
	});

	test('terminal error should be fired when triggered during active hold', async ({
		page,
		waitForAllTerminalErrorPayloads,
	}) => {
		const mainDiv = page.locator('[data-testid="main"]');

		await expect(mainDiv).toBeVisible();

		// Wait for both terminal error payloads (SectionOne and SectionTwo)
		const terminalErrorPayloads = await waitForAllTerminalErrorPayloads(2);
		expect(terminalErrorPayloads.length).toBeGreaterThanOrEqual(2);

		const activeHoldErrorPayload = terminalErrorPayloads.find(
			(p) =>
				p.attributes.properties.terminalError.errorBoundaryId === 'section-two-boundary-with-hold',
		);
		expect(activeHoldErrorPayload).toBeDefined();

		expect(activeHoldErrorPayload!.attributes.properties['experience:key']).toBe(
			'custom.terminal-error',
		);

		const terminalError = activeHoldErrorPayload!.attributes.properties.terminalError;
		expect(terminalError).toBeDefined();
		expect(terminalError.errorType).toBe('Error');
		expect(terminalError.errorMessage).toBe(
			'Terminal error occurred in SectionTwo while hold active',
		);
		expect(terminalError.teamName).toBe('ufo-team');
		expect(terminalError.packageName).toBe('react-ufo');
		expect(terminalError.errorBoundaryId).toBe('section-two-boundary-with-hold');
		expect(terminalError.fallbackType).toBe('flag');

		expect(activeHoldErrorPayload?.actionSubject).toBe('experience');
		expect(activeHoldErrorPayload?.action).toBe('measured');
		expect(activeHoldErrorPayload?.eventType).toBe('operational');
		expect(activeHoldErrorPayload?.tags).toContain('observability');

		const properties = activeHoldErrorPayload!.attributes.properties;
		expect(properties.activeInteractionName).toBe('test-UFO');
		expect(properties.activeInteractionId).toBeDefined();
		expect(properties.activeInteractionType).toBe('page_load');
	});

	test('should capture and report a11y violations', async ({ page }) => {
		const mainDiv = page.locator('[data-testid="main"]');
		await expect(mainDiv).toBeVisible();

		await expect(page).toBeAccessible();
	});
});

test.describe('ReactUFO: Terminal Error Reporting (feature gate disabled)', () => {
	test.use({
		examplePage: 'basic-with-terminal-error',
		featureFlags: [],
	});

	test('no terminal errors should be fired when feature gate is disabled', async ({
		page,
		waitForReactUFOPayload,
	}) => {
		const mainDiv = page.locator('[data-testid="main"]');
		const sectionOne = page.locator('[data-testid="sectionOne"]');
		const sectionTwo = page.locator('[data-testid="sectionTwo"]');
		const sectionThree = page.locator('[data-testid="sectionThree"]');

		await expect(mainDiv).toBeVisible();
		await expect(sectionOne).toBeVisible();
		await expect(sectionTwo).toBeVisible();
		await expect(sectionThree).toBeVisible();

		// Wait for the main UFO payload to ensure the interaction has completed
		const reactUFOPayload = await waitForReactUFOPayload();
		expect(reactUFOPayload).toBeDefined();

		const terminalErrorPayloads = await page.evaluate(() => {
			return (window as any).__websiteReactUfoTerminalErrors || [];
		});

		expect(terminalErrorPayloads.length).toBe(0);
	});
});
