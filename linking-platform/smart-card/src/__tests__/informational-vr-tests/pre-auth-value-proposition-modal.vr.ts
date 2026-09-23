import type { Locator, Page } from '@playwright/test';

// oxlint-disable-next-line no-restricted-imports -- informational VR needs prepare() to wait for the async modal.
import { snapshotInformational } from '@af/visual-regression';

import {
	PreAuthValuePropositionModalTextOnly,
	PreAuthValuePropositionModalWithImage,
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

const waitForTextOnlyModal = async (page: Page, _component: Locator) => {
	await page.getByRole('heading', { name: 'Connect Google Drive' }).waitFor({ state: 'visible' });
	await page
		.getByTestId('pre-auth-value-proposition-modal-social-proof')
		.waitFor({ state: 'visible' });
};

const waitForImageModal = async (page: Page, _component: Locator) => {
	await page.getByRole('heading', { name: 'Connect Google Drive' }).waitFor({ state: 'visible' });
	await page
		.getByTestId('pre-auth-value-proposition-modal-social-proof')
		.waitFor({ state: 'visible' });
	await page
		.getByTestId('pre-auth-value-proposition-modal-illustration')
		.waitFor({ state: 'visible' });
};

snapshotInformational(PreAuthValuePropositionModalTextOnly, {
	prepare: waitForTextOnlyModal,
	description: 'text-only',
	drawsOutsideBounds: true,
	mockRequests: mockPersonalizationRequests,
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
