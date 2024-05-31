import { headingNodeSimpleAdf } from './heading.spec.ts-fixtures';
import { rendererTestCase as test, expect } from './not-libra';

test.describe('heading', () => {
	test.use({
		adf: headingNodeSimpleAdf,
		rendererProps: {
			allowHeadingAnchorLinks: true,
		},
	});

	test('should show tooltip in hover of anchor link', async ({ renderer }) => {
		const heading = renderer.page.getByRole('heading');
		const headingAnchorButton = renderer.page.getByRole('button');
		const copyLinkTooltip = renderer.page.getByRole('tooltip', {
			name: 'Copy link to heading',
		});

		await heading.hover();
		await headingAnchorButton.hover();

		await expect(copyLinkTooltip).toBeVisible();
	});
});
