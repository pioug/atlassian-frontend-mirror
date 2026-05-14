import { skipAutoA11y } from '@atlassian/a11y-playwright-testing';
import { adf } from './card.spec.ts-fixtures';
import { rendererTestCase as test, expect } from './not-libra';

test.use({ exampleName: 'testing' as keyof typeof import('../../../examples/99-testing.tsx') });
test.describe('smart card', () => {
	test.use({
		adf,
	});

	test('open preview from block card', async ({ renderer }) => {
		await renderer.waitForRendererStable();
		const previewButton = renderer.page.getByRole('button', {
			name: 'Open Preview',
		});
		await expect(previewButton).toBeVisible();
		await previewButton.click();
		const embedContent = renderer.page
			.frameLocator('[data-testid="smart-embed-preview-modal-embed"]')
			.getByText('I am an Embed Content!');
		await expect(embedContent).toBeVisible();
		const closePreviewButton = renderer.page.getByTestId('smart-embed-preview-modal--close-button');
		await closePreviewButton.click();
		await expect(embedContent).toBeHidden();
	});

	test('should capture and report a11y violations', async ({ renderer }) => {
		// This test exposes one or more accessibility violations. Testing is currently skipped but violations need to
		// be fixed in a timely manner or result in escalation. Once all violations have been fixed, you can remove
		// the skipAutoA11y wrapper and associated import. For more information, see go/afm-a11y-tooling:playwright
		skipAutoA11y();
		await renderer.waitForRendererStable();
		const previewButton = renderer.page.getByRole('button', {
			name: 'Open Preview',
		});
		await expect(previewButton).toBeVisible();

		await expect(renderer.page).toBeAccessible();
	});
});
