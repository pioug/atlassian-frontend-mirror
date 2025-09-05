/* eslint-disable testing-library/prefer-screen-queries */
import { expect, type Page, test } from '@af/integration-testing';

const modalDialog = 'modal';
const modalPositioner = 'modal--positioner';

test.describe('AFBH-1489, when another (non-deduped) atomic-css `inset-block-start: 0;` ruleset get added to the page after the correctly extracted sheet', () => {
	const simulateNonDedupedSeparateRulesets = async (page: Page) => {
		await page.evaluate(() => {
			const styleElement = document.createElement('style');
			styleElement.innerHTML = '._152tidpf { inset-block-start: 0; }';
			document.head.append(styleElement);
		});
	};

	const openModal = async (page: Page) => {
		const open = page.getByText('Open Modal');
		await expect(open).toBeVisible();
		await open.click();

		const modal = page.getByTestId(modalDialog);
		await expect(modal).toBeVisible();
	};

	test(`effective inset-block-start value becomes 0 without '!important'`, async ({ page }) => {
		await page.visitExample('design-system', 'modal-dialog', 'default-modal');

		await simulateNonDedupedSeparateRulesets(page);
		await openModal(page);

		await expect(page.getByTestId(modalPositioner)).toHaveCSS('inset-block-start', '0px');
	});

	test(`inset-block-start rule should be set to 60px with '!important', when the feature flag is enabled`, async ({
		page,
	}) => {
		await page.visitExample('design-system', 'modal-dialog', 'default-modal', {
			featureFlag: 'platform_dst_modal_dialog_AFBH_1489',
		});

		await simulateNonDedupedSeparateRulesets(page);
		await openModal(page);

		await expect(page.getByTestId(modalPositioner)).toHaveCSS('inset-block-start', '60px');
	});
});
