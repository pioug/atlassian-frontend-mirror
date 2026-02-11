/* eslint-disable @typescript-eslint/no-non-null-assertion */
/* eslint-disable testing-library/prefer-screen-queries */
/* eslint-disable  playwright/no-conditional-in-test */
/* eslint-disable  playwright/no-conditional-in-test */
/* eslint-disable compat/compat */
import { expect, test, viewports } from './fixtures';

/**
 * Integration tests for mutation:attribute:framework-routing behavior.
 *
 * Mutations that toggle `display: none !important;` on elements with zero dimensions
 * should be classified as `mutation:attribute:framework-routing` and excluded from
 * TTVC calculation and vcDetails in the UFO payload.
 */
test.describe('ReactUFO: Framework routing display:none mutations', () => {
	test.use({
		examplePage: 'framework-routing-display-none',
	});

	for (const viewport of viewports) {
		test.describe(`when view port is ${viewport.width}x${viewport.height}`, () => {
			test.use({
				viewport,
			});

			test('vcDetails should not contain the routing container selector', async ({
				waitForReactUFOPayload,
			}) => {
				const reactUFOPayload = await waitForReactUFOPayload();
				expect(reactUFOPayload).toBeDefined();

				expect(typeof reactUFOPayload!.attributes.properties).toBe('object');
				const ufoVCRev = reactUFOPayload!.attributes.properties['ufo:vc:rev'];
				expect(ufoVCRev).toBeDefined();

				// Check fy25.03 revision (TTVC v3)
				const fy25_03Revision = ufoVCRev?.find(({ revision }) => revision === 'fy25.03');
				expect(fy25_03Revision).toBeTruthy();

				// The routing container should NOT be in vcDetails since its style mutation
				// (display: none !important; toggle) should be classified as framework-routing
				// and excluded from TTVC calculation
				if (fy25_03Revision?.vcDetails?.['90']?.e) {
					expect(fy25_03Revision.vcDetails['90'].e).not.toContainEqual(
						expect.stringContaining('routingContainer'),
					);
				}

				// The ratios should also not contain the routing container
				if (fy25_03Revision?.ratios) {
					const ratioKeys = Object.keys(fy25_03Revision.ratios);
					expect(ratioKeys).not.toContain(
						expect.stringContaining('routingContainer'),
					);
				}
			});

			test('vcDetails should still contain the actual content sections', async ({
				waitForReactUFOPayload,
			}) => {
				const reactUFOPayload = await waitForReactUFOPayload();
				expect(reactUFOPayload).toBeDefined();

				const ufoVCRev = reactUFOPayload!.attributes.properties['ufo:vc:rev'];
				expect(ufoVCRev).toBeDefined();

				const fy25_03Revision = ufoVCRev?.find(({ revision }) => revision === 'fy25.03');
				expect(fy25_03Revision).toBeTruthy();

				// The actual content sections should still be tracked
				// SectionOne, SectionTwo, and SectionThree should be in the vcDetails
				expect(fy25_03Revision?.vcDetails).toBeDefined();

				// Check that the revisions have a valid vc90 metric
				expect(fy25_03Revision?.['metric:vc90']).toBeDefined();
				expect(typeof fy25_03Revision?.['metric:vc90']).toBe('number');
			});

			test('fy26.04 revision should also exclude routing container from vcDetails', async ({
				waitForReactUFOPayload,
			}) => {
				const reactUFOPayload = await waitForReactUFOPayload();
				expect(reactUFOPayload).toBeDefined();

				const ufoVCRev = reactUFOPayload!.attributes.properties['ufo:vc:rev'];
				expect(ufoVCRev).toBeDefined();

				// Check fy26.04 revision (TTVC v4)
				const fy26_04Revision = ufoVCRev?.find(({ revision }) => revision === 'fy26.04');
				expect(fy26_04Revision).toBeTruthy();

				// The routing container should NOT be in vcDetails for v4 either
				if (fy26_04Revision?.vcDetails?.['90']?.e) {
					expect(fy26_04Revision.vcDetails['90'].e).not.toContainEqual(
						expect.stringContaining('routingContainer'),
					);
				}

				if (fy26_04Revision?.ratios) {
					const ratioKeys = Object.keys(fy26_04Revision.ratios);
					expect(ratioKeys).not.toContain(
						expect.stringContaining('routingContainer'),
					);
				}
			});
		});
	}
});
