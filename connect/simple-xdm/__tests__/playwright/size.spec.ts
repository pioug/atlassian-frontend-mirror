import { expect, test } from '@af/integration-testing';

test.describe('Size', () => {
	test('size calculates 100% width by default', async ({ page }) => {
		await page.visitExample('connect', 'simple-xdm', 'size');
		await page.click('[id="size-calc-100-width-by-default"]');

		const results = page.getByTestId('results');
		const resJson = JSON.parse(await results.innerText());
		expect(resJson.w).toEqual('100%');
	});

	test('size calculates the correct height', async ({ page }) => {
		await page.visitExample('connect', 'simple-xdm', 'size');

		await page.setViewportSize({
			width: 1024,
			height: 100,
		});

		await page.click('[id="size-calc-correct-height"]');

		const results = page.getByTestId('results');
		const resJson = JSON.parse(await results.innerText());

		expect(resJson.h).toEqual(110);
	});

	test('size calculates the correct height with margin', async ({ page }) => {
		await page.visitExample('connect', 'simple-xdm', 'size');

		await page.setViewportSize({
			width: 1024,
			height: 100,
		});

		await page.click('[id="size-calc-correct-height-margin"]');

		const results = page.getByTestId('results');
		const resJson = JSON.parse(await results.innerText());

		expect(resJson.h).toEqual(120);
	});

	test('size calculates the correct height with border', async ({ page }) => {
		await page.visitExample('connect', 'simple-xdm', 'size');

		await page.setViewportSize({
			width: 1024,
			height: 100,
		});

		await page.click('[id="size-calc-correct-height-border"]');

		const results = page.getByTestId('results');
		const resJson = JSON.parse(await results.innerText());

		expect(resJson.h).toEqual(114);
	});

	test('size calculates the correct height with padding', async ({ page }) => {
		await page.visitExample('connect', 'simple-xdm', 'size');

		await page.setViewportSize({
			width: 1024,
			height: 100,
		});

		await page.click('[id="size-calc-correct-height-padding"]');

		const results = page.getByTestId('results');
		const resJson = JSON.parse(await results.innerText());

		expect(resJson.h).toEqual(114);
	});

	test('size calculates the correct height with padding and margin', async ({ page }) => {
		await page.visitExample('connect', 'simple-xdm', 'size');

		await page.setViewportSize({
			width: 1024,
			height: 100,
		});

		await page.click('[id="size-calc-correct-height-padding-margin"]');

		const results = page.getByTestId('results');
		const resJson = JSON.parse(await results.innerText());

		expect(resJson.h).toEqual(118);
	});

	test('size gives the correct width with widthinpx', async ({ page }) => {
		await page.visitExample('connect', 'simple-xdm', 'size');

		await page.setViewportSize({
			width: 1024,
			height: 100,
		});

		await page.click('[id="size-calc-correct-width"]');

		const results = page.getByTestId('results');
		const resJson = JSON.parse(await results.innerText());

		expect(resJson.w).toEqual(120);
	});

	test.describe('Scroll bars', () => {
		// There were some additional tests that checked the width/height of scrollbars in an iframe that I didn't have time to port over.
		// They're here: https://bitbucket.org/atlassian/simple-xdm/src/cd3aff84772fc11d2e375b33682d56c6fa7ee637/spec/tests/size_spec.js#lines-72:159
		// If you're going to make changes to this file, please look at porting these across first.
	});

	test('should capture and report a11y violations', async ({ page }) => {
		await page.visitExample('connect', 'simple-xdm', 'size');

		await expect(page).toBeAccessible();
	});
});
