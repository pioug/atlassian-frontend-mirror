import { expect, test } from '@af/integration-testing';

import { nativeEmbedAlignmentStyles } from '../../entry-points/native-embed-styles';

for (const wrapper of ['extension-container', 'ak-renderer-extension']) {
	for (const alignment of ['left', 'center', 'right', 'wrap-left', 'wrap-right']) {
		test(`${wrapper} preserves enclosing tabs with a ${alignment} native embed`, async ({
			page,
		}) => {
			await page.setContent(`
				<style>
					#tabs { width: 600px; padding: 8px 20px; margin: 16px; border-radius: 3px; }
				</style>
				<div id="tabs" class="${wrapper}">
					<div data-native-tabs>
						<div data-extension-frame="true">
							<div id="embed" class="${wrapper}">
								<div data-native-embed-alignment="${alignment}" data-native-embed-show-border="true">Whiteboard</div>
							</div>
						</div>
					</div>
				</div>
			`);
			await page.addStyleTag({ content: nativeEmbedAlignmentStyles.styles });

			await expect(page.locator('#tabs')).toHaveCSS('padding-left', '20px');
			await expect(page.locator('#tabs')).toHaveCSS('padding-right', '20px');
			await expect(page.locator('#tabs')).toHaveCSS('margin-top', '16px');
			await expect(page.locator('#tabs')).toHaveCSS('float', 'none');
			await expect(page.locator('#tabs')).toHaveCSS('transform', 'none');
			await expect(page.locator('#tabs')).toHaveCSS('border-radius', '3px');
			await expect(page.locator('#embed')).toHaveCSS('padding-left', '0px');
			await expect(page.locator('#embed')).toHaveCSS('padding-right', '0px');
			await expect(page.locator('#embed')).toHaveCSS(
				'margin-top',
				alignment.startsWith('wrap-') ? '12px' : '24px',
			);
		});
	}
}
