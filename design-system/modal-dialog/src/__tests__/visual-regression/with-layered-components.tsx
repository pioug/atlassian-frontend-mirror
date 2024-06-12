import { getExampleUrl, takeElementScreenShot } from '@atlaskit/visual-regression/helper';

import { openModal, waitForTooltip } from './_helper';

const container = "div[data-testid='container']";
const openModalButton = "button[data-testid='open-modal']";
const modalDialog = "[role='dialog']";

const scrollToMiddle = "button[data-testid='scroll-to-middle']";
const scrollToBottom = "button[data-testid='scroll-to-bottom']";

const url = getExampleUrl(
	'design-system',
	'modal-dialog',
	'with-layered-components',
	global.__BASEURL__,
);

const options = {
	triggerSelector: openModalButton,
	modalSelector: modalDialog,
	scrollSelector: container,
	scrollTo: { x: 425, y: 0 },
	viewport: { width: 1200, height: 675 },
	allowedSideEffects: { tooltips: true },
};

describe('<Modal />', () => {
	it('with Popup', async () => {
		const page = await openModal(url, options);

		await page.click(scrollToMiddle);
		await page.click("[data-testid='popup-trigger']");

		const image = await takeElementScreenShot(page, 'body');
		expect(image).toMatchProdImageSnapshot();
	});

	it('with Tooltip', async () => {
		const page = await openModal(url, options);

		await page.click(scrollToMiddle);
		await page.hover("[data-testid='tooltip-trigger']");
		await waitForTooltip(page);

		const image = await takeElementScreenShot(page, 'body');
		expect(image).toMatchProdImageSnapshot();
	});

	it('with PopupSelect', async () => {
		const page = await openModal(url, options);

		await page.click(scrollToMiddle);
		await page.click("[data-testid='popup-select-trigger']");

		const image = await takeElementScreenShot(page, 'body');
		expect(image).toMatchProdImageSnapshot();
	});

	it('with Select (z-index: 9999, menuPortalTarget: document.body, menuPosition: fixed)', async () => {
		const page = await openModal(url, options);

		await page.click(scrollToMiddle);
		await page.click('.select-zindex-fixed');

		// Wait for the animation to finish
		await page.waitForTimeout(1000);

		const image = await takeElementScreenShot(page, 'body');
		expect(image).toMatchProdImageSnapshot();
	});

	it('with Select (menuPosition: fixed)', async () => {
		const page = await openModal(url, options);

		await page.click(scrollToMiddle);
		await page.click('.select-fixed');

		// Wait for the animation to finish
		await page.waitForTimeout(1000);

		const image = await takeElementScreenShot(page, 'body');
		expect(image).toMatchProdImageSnapshot();
	});

	it('with Select (menuPosition: absolute)', async () => {
		const page = await openModal(url, options);

		await page.click(scrollToMiddle);
		await page.click('.select-absolute');

		// Wait for the animation to finish
		await page.waitForTimeout(1000);

		const image = await takeElementScreenShot(page, 'body');
		expect(image).toMatchProdImageSnapshot();
	});

	// FIXME: This test was automatically skipped due to failure on 1/05/2024: https://bitbucket.org/atlassian/atlassian-frontend/pipelines/results/2906122/steps/%7B80db1e9a-4e82-467a-89af-3598287f4dbb%7D/test-report
	it.skip('with FlagGroup', async () => {
		const page = await openModal(url, options);

		await page.click(scrollToMiddle);
		await page.click("[data-testid='flag-trigger']");
		await page.waitForSelector("[data-testid='flag-1']");

		// DSP-860: Flag group has a known issue when multiple trigger clicks are executed in quick succession
		// that is why this timeout is currently needed... :(
		await page.waitForTimeout(1000);

		await page.click("[data-testid='flag-trigger']");
		await page.waitForSelector("[data-testid='flag-2']");

		const image = await takeElementScreenShot(page, 'body');
		expect(image).toMatchProdImageSnapshot();
	});

	// FIXME: Unskip via https://product-fabric.atlassian.net/browse/DSP-6503
	it.skip('with DropdownMenu', async () => {
		const page = await openModal(url, options);

		await page.click(scrollToBottom);
		await page.click("[data-testid='dropdown-menu--trigger']");
		await page.waitForSelector("[data-testid='dropdown-menu--content']");

		const image = await takeElementScreenShot(page, 'body');
		expect(image).toMatchProdImageSnapshot();
	});

	// FIXME: This test was automatically skipped due to failure on 02/03/2023: https://product-fabric.atlassian.net/browse/DSP-9055
	it.skip('with AvatarGroup', async () => {
		const page = await openModal(url, options);

		await page.click(scrollToBottom);
		await page.click("[data-testid='avatar-group--overflow-menu--trigger']");
		await page.waitForSelector("[data-testid='avatar-group--overflow-menu']");

		const image = await takeElementScreenShot(page, 'body');
		expect(image).toMatchProdImageSnapshot();
	});

	// FIXME: This test was automatically skipped due to failure on 13/03/2023: https://product-fabric.atlassian.net/browse/DSP-9180
	it.skip('with DatePicker', async () => {
		const page = await openModal(url, options);

		// wait date picket element before scroll to bottom.
		await page.waitForSelector("[data-testid='date-picker--container']");
		await page.click(scrollToBottom);
		await page.click("[data-testid='date-picker--container']");
		await page.waitForSelector("[data-testid='date-picker--calendar--container']");

		const image = await takeElementScreenShot(page, '[data-testid="modal--body"]');
		expect(image).toMatchProdImageSnapshot();
	});
});
