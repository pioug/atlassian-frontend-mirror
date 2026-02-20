/**
 * UFO Disabled Integration Tests
 *
 * These tests verify that UFO can be completely disabled via config.enabled = false,
 * controlled by the ?ufo_disabled=true query parameter.
 *
 * The kill switch functionality is gated behind the platform_ufo_enable_killswitch_config
 * feature flag.
 */

/* eslint-disable compat/compat */

import { test as base, expect as baseExpect, type Page } from '@af/integration-testing';

import type { WindowWithReactUFOTestGlobals } from './window-type';

const test = base.extend<{
	pageWithUFODisabled: Page;
}>({
	// Custom fixture that navigates to a page with UFO disabled
	pageWithUFODisabled: async ({ browser, baseURL }, use) => {
		const context = await browser.newContext();
		const page = await context.newPage();

		// Build URL with ufo_disabled=true and the required feature flag
		const searchParams = new URLSearchParams({
			groupId: 'react-ufo',
			packageId: 'atlaskit',
			exampleId: 'basic-three-sections',
			isTestRunner: 'true',
			mode: 'light',
			ufo_disabled: 'true',
		});

		// The feature flag is required for the kill switch to take effect
		const url = `${baseURL}/examples.html?${searchParams.toString()}&featureFlag=platform_ufo_enable_killswitch_config`;

		await page.setViewportSize({ width: 1920, height: 1080 });
		await page.goto(url, { waitUntil: 'domcontentloaded' });

		await use(page);
		await context.close();
	},
});

test.describe('UFO Disabled via config.enabled = false', () => {
	test('should not send any UFO payloads when ufo_disabled=true', async ({
		pageWithUFODisabled,
	}) => {
		const page = pageWithUFODisabled;

		// Wait for page content to render
		const mainDiv = page.locator('[data-testid="main"]');
		await baseExpect(mainDiv).toBeVisible({ timeout: 10000 });

		// Wait for all sections to render
		const sectionThree = page.locator('[data-testid="sectionThree"]');
		await baseExpect(sectionThree).toBeVisible({ timeout: 10000 });

		// Wait a bit for any potential UFO payloads to be sent
		// eslint-disable-next-line playwright/no-wait-for-timeout
		await page.waitForTimeout(3000);

		// Verify that UFO was marked as disabled
		const ufoDisabled = await page.evaluate(() => {
			return (window as WindowWithReactUFOTestGlobals).__websiteReactUfoDisabled;
		});
		baseExpect(ufoDisabled).toBe(true);

		// Verify no UFO payloads were sent
		const payloads = await page.evaluate(() => {
			return (window as WindowWithReactUFOTestGlobals).__websiteReactUfo || [];
		});
		baseExpect(payloads).toHaveLength(0);

		// Verify no post-interaction payloads were sent
		const postInteractionPayloads = await page.evaluate(() => {
			return (window as WindowWithReactUFOTestGlobals).__websiteReactUfoPostInteraction || [];
		});
		baseExpect(postInteractionPayloads).toHaveLength(0);

		// Verify no critical metrics payloads were sent
		const criticalMetricsPayloads = await page.evaluate(() => {
			return (window as WindowWithReactUFOTestGlobals).__websiteReactUfoCriticalMetrics || [];
		});
		baseExpect(criticalMetricsPayloads).toHaveLength(0);

		// Verify TTVC was never marked as ready (since no UFO events were sent)
		const ttvcReady = page.locator('[data-is-ttvc-ready="true"]');
		await baseExpect(ttvcReady).toBeHidden();
	});

	test('should still render page content correctly when UFO is disabled', async ({
		pageWithUFODisabled,
	}) => {
		const page = pageWithUFODisabled;

		// Verify all sections render correctly even with UFO disabled
		const mainDiv = page.locator('[data-testid="main"]');
		await baseExpect(mainDiv).toBeVisible({ timeout: 10000 });

		const sectionOne = page.locator('[data-testid="sectionOne"]');
		const sectionTwo = page.locator('[data-testid="sectionTwo"]');
		const sectionThree = page.locator('[data-testid="sectionThree"]');

		await baseExpect(sectionOne).toBeVisible();
		await baseExpect(sectionTwo).toBeVisible();
		await baseExpect(sectionThree).toBeVisible();

		// Verify sections have the expected content structure (shows rendered timing)
		await baseExpect(sectionOne).toContainText('Rendered at');
		await baseExpect(sectionTwo).toContainText('Rendered at');
		await baseExpect(sectionThree).toContainText('Rendered at');
	});

	test('should not have any console errors when UFO is disabled', async ({
		pageWithUFODisabled,
	}) => {
		const page = pageWithUFODisabled;
		const consoleErrors: string[] = [];

		// Listen for console errors
		page.on('console', (msg) => {
			if (msg.type() === 'error') {
				consoleErrors.push(msg.text());
			}
		});

		// Wait for page to fully load
		const mainDiv = page.locator('[data-testid="main"]');
		await baseExpect(mainDiv).toBeVisible({ timeout: 10000 });

		const sectionThree = page.locator('[data-testid="sectionThree"]');
		await baseExpect(sectionThree).toBeVisible({ timeout: 10000 });

		// Wait a bit more to catch any late errors
		// eslint-disable-next-line playwright/no-wait-for-timeout
		await page.waitForTimeout(2000);

		// Filter out unrelated errors (keep only UFO-related ones)
		const ufoErrors = consoleErrors.filter(
			(error) =>
				error.toLowerCase().includes('ufo') ||
				error.toLowerCase().includes('react-ufo') ||
				error.toLowerCase().includes('interaction'),
		);

		baseExpect(ufoErrors).toHaveLength(0);
	});
});

test.describe('UFO Enabled (control test)', () => {
	// This test verifies that UFO works normally when not disabled
	test('should send UFO payloads when ufo_disabled is not set', async ({ browser, baseURL }) => {
		const context = await browser.newContext();
		const page = await context.newPage();

		// Navigate WITHOUT ufo_disabled (normal behavior)
		const searchParams = new URLSearchParams({
			groupId: 'react-ufo',
			packageId: 'atlaskit',
			exampleId: 'basic-three-sections',
			isTestRunner: 'true',
			mode: 'light',
		});

		const url = `${baseURL}/examples.html?${searchParams.toString()}`;

		await page.setViewportSize({ width: 1920, height: 1080 });
		await page.goto(url, { waitUntil: 'domcontentloaded' });

		// Wait for TTVC to be ready (this indicates UFO sent a payload)
		const ttvcReady = page.locator('[data-is-ttvc-ready="true"]');
		await baseExpect(ttvcReady).toBeVisible({ timeout: 20000 });

		// Verify at least one UFO payload was sent
		const payloads = await page.evaluate(() => {
			return (window as WindowWithReactUFOTestGlobals).__websiteReactUfo || [];
		});
		baseExpect(payloads.length).toBeGreaterThan(0);

		await context.close();
	});
});
