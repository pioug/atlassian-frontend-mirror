import type { Locator, Page } from '@playwright/test';

import { expect as playwrightExpect } from '@af/integration-testing';
// oxlint-disable-next-line no-restricted-imports -- informational VR needs prepare() to wait for the async modal.
import { snapshotInformational } from '@af/visual-regression';

import {
	PreAuthValuePropositionModalTextOnly,
	PreAuthValuePropositionModalWithImage,
	PreAuthValuePropositionModalWithImageDefaultName,
} from '../../../examples/vr-pre-auth-value-proposition-modal/vr-pre-auth-value-proposition-modal.vr.ap';

const lightModeVariant = {
	name: 'light mode',
	environment: {
		colorScheme: 'light' as const,
	},
};

const mockPersonalizationRequests = [
	{
		urlPattern: /\/gateway\/api\/tap-delivery\/api\/v3\/personalization\//,
		body: JSON.stringify({
			attributes: [
				{
					name: 'sl_3p_connected_providers_site_pct',
					value: JSON.stringify({ 'google-object-provider': 45 }),
				},
			],
		}),
		contentType: 'application/json',
	},
];

const waitForModal = async (page: Page, providerName: string) => {
	await page
		.getByRole('heading', { name: `Connect ${providerName}`, exact: true })
		.waitFor({ state: 'visible' });
	const title = page.getByTestId('pre-auth-value-proposition-modal--title-text');
	await playwrightExpect(title).toHaveCSS('white-space', 'normal');
	await playwrightExpect(title).toHaveCSS('text-overflow', 'clip');
	await page
		.getByTestId('pre-auth-value-proposition-modal-social-proof')
		.waitFor({ state: 'visible' });
};

const waitForTextOnlyModal = async (page: Page, _component: Locator) => {
	await waitForModal(page, 'Google Drive');
};

const checkImageLayout = async (page: Page, socialProofGap: number) => {
	const illustration = page.locator(
		'[data-testid="pre-auth-value-proposition-modal-illustration"]',
	);
	await illustration.waitFor({ state: 'visible' });

	// Extra artwork must stay centered without adding blank space to the text column.
	await playwrightExpect
		.poll(() =>
			illustration.evaluate((image) => {
				const imageBounds = image.getBoundingClientRect();
				const paneBounds = image.parentElement!.parentElement!.getBoundingClientRect();
				return Math.abs(
					imageBounds.y + imageBounds.height / 2 - (paneBounds.y + paneBounds.height / 2),
				);
			}),
		)
		.toBeLessThan(1);

	const socialProof = page.locator('[data-testid="pre-auth-value-proposition-modal-social-proof"]');
	await playwrightExpect
		.poll(() =>
			socialProof.evaluate((element) => {
				const benefits = element.previousElementSibling!.querySelectorAll('p');
				const lastBenefit = benefits[benefits.length - 1];
				return Math.round(
					element.getBoundingClientRect().top - lastBenefit.getBoundingClientRect().bottom,
				);
			}),
		)
		.toBe(socialProofGap);
};

const waitForImageModal = async (page: Page, _component: Locator) => {
	await waitForModal(page, 'Google Drive Megalong Name Variant');
	await checkImageLayout(page, 24);
	await playwrightExpect
		.poll(async () => (await page.locator('[role="dialog"]').boundingBox())?.height)
		.toBeGreaterThan(450);
};

const waitForDefaultNameImageModal = async (page: Page, _component: Locator) => {
	await waitForModal(page, 'Google Drive');
	// The original 450px minimum leaves 6px of spare space in the copy column.
	await checkImageLayout(page, 30);
	await playwrightExpect(page.locator('[role="dialog"]')).toHaveCSS('height', '450px');
};

snapshotInformational(PreAuthValuePropositionModalTextOnly, {
	prepare: waitForTextOnlyModal,
	description: 'text-only',
	drawsOutsideBounds: true,
	mockRequests: mockPersonalizationRequests,
	variants: [lightModeVariant],
});

snapshotInformational(PreAuthValuePropositionModalWithImageDefaultName, {
	prepare: waitForDefaultNameImageModal,
	description: 'with-image-default-name',
	drawsOutsideBounds: true,
	mockRequests: mockPersonalizationRequests,
	waitForReactLazy: true,
	variants: [lightModeVariant],
});

snapshotInformational(PreAuthValuePropositionModalWithImage, {
	prepare: waitForImageModal,
	description: 'with-image',
	drawsOutsideBounds: true,
	mockRequests: mockPersonalizationRequests,
	waitForReactLazy: true,
	variants: [lightModeVariant],
});
