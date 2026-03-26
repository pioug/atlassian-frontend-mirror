/* eslint-disable @typescript-eslint/no-non-null-assertion */
/* eslint-disable testing-library/prefer-screen-queries */
/* eslint-disable compat/compat */
import { expect, test, viewports } from './fixtures';

test.describe('ReactUFO: css display:contents (TTVC v4)', () => {
	test.use({
		examplePage: 'css-display-contents',
	});

	for (const viewport of viewports) {
		test.describe(`when view port is ${viewport.width}x${viewport.height}`, () => {
			test.use({
				viewport,
			});

			test('elements with display: contents css should be included in vc_next', async ({
				waitForReactUFOPayload,
			}) => {
				const reactUFOPayload = await waitForReactUFOPayload();
				expect(reactUFOPayload).toBeDefined();

				expect(typeof reactUFOPayload!.attributes.properties).toBe('object');
				const ufoProperties = reactUFOPayload!.attributes.properties;

				expect(typeof ufoProperties.interactionMetrics).toBe('object');
				const ufoVCRev = reactUFOPayload!.attributes.properties['ufo:vc:rev'];
				const vcNextRevision = ufoVCRev?.find(({ revision }) => revision === 'next');

				expect(vcNextRevision).toBeTruthy();

				// When raw data is included, vcDetails and ratios are intentionally deleted
				// and the data is carried in the raw-handler entry instead.
				// eslint-disable-next-line playwright/no-conditional-in-test
				if (vcNextRevision!.vcDetails) {
					expect(vcNextRevision!.vcDetails['90'].e).toContainEqual(
						'div[data-testid="sectionThree"]',
					);
					expect(Object.keys(vcNextRevision!.ratios!)).toContain('div[data-testid="sectionThree"]');
				} else {
					// Verify raw-handler revision carries the observation data
					const rawHandlerRev = ufoVCRev?.find((rev) => rev.revision === 'raw-handler');
					expect(rawHandlerRev).toBeTruthy();
					expect(rawHandlerRev!.rawData).toBeDefined();
					expect(rawHandlerRev!.rawData!.obs!.length).toBeGreaterThan(0);
					expect(rawHandlerRev!.rawData!.eid).toBeDefined();
					// Verify that the raw data contains the sectionThree element
					const eidValues = Object.values(rawHandlerRev!.rawData!.eid!) as string[];
					expect(eidValues.some((name: string) => name.includes('sectionThree'))).toBe(true);
				}
			});
		});
	}
});
