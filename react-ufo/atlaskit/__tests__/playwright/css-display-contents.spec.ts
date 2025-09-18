/* eslint-disable @typescript-eslint/no-non-null-assertion */
/* eslint-disable testing-library/prefer-screen-queries */
/* eslint-disable compat/compat */
import { expect, test, viewports } from './fixtures';

test.describe('ReactUFO: css display:contents (TTVC v4)', () => {
	test.use({
		examplePage: 'css-display-contents',
		featureFlags: ['platform_ufo_vcnext_v4_enabled'],
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
				expect(vcNextRevision!.vcDetails?.['90'].e).toContainEqual(
					'div[data-testid="sectionThree"]',
				);
				expect(Object.keys(vcNextRevision!.ratios!)).toContain('div[data-testid="sectionThree"]');
			});
		});
	}
});
