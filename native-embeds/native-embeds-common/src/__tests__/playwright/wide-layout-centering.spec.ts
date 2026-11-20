import { expect, test } from '@af/integration-testing';

import { nativeEmbedAlignmentStyles } from '../../entry-points/native-embed-styles';

const PAGE_WIDTH = 1714;
const COLUMN_WIDTH = 760;
const COLUMN_LEFT = (PAGE_WIDTH - COLUMN_WIDTH) / 2;
const COLUMN_CENTRE = COLUMN_LEFT + COLUMN_WIDTH / 2;

// Mirror the full-page renderer on a default-width page: an inline-size container as wide as the
// page, a 760px text column, and the flex wrapper the renderer puts around a top-level extension
// with a wide or full-width layout (RendererStyleContainer centerWrapperStyles).
const rendererStyles = `
	body { margin: 0; }
	#page { width: ${PAGE_WIDTH}px; container-type: inline-size; }
	.ak-renderer-document { width: ${COLUMN_WIDTH}px; margin: 0 auto; }
	.ak-renderer-flex-center-wrapper {
		display: flex;
		justify-content: center;
		align-items: flex-start;
		width: 100%;
		flex: 1 1 0%;
		min-width: 0;
	}
	.ak-renderer-flex-center-wrapper > * { flex-shrink: 0; }
	.ak-renderer-extension-overflow-container { overflow-x: auto; }
	.frame { height: 100px; }
`;

type Embed = {
	id: string;
	layout: 'wide' | 'full-width';
	placeholder?: boolean;
	wideLayoutCentering?: boolean;
	width: number;
};

// The native embed UI writes the persisted width inline on the renderer wrapper, capped at 100cqw.
// Before it mounts, the placeholder shrink-wraps the same wrapper to its own persisted width.
const renderEmbed = ({
	id,
	layout,
	width,
	placeholder = false,
	wideLayoutCentering = true,
}: Embed) => `
	<div class="ak-renderer-sticky-safe-center-wrapper ak-renderer-flex-center-wrapper">
		<div id="${id}" class="ak-renderer-extension ak-renderer-extension-center-align" data-layout="${layout}" data-top-level="true"
			style="${placeholder ? 'width:100%' : `width:${width}px;max-width:100cqw`}">
			<div class="ak-renderer-extension-inner-wrapper ak-renderer-extension-overflow-container">
				<div data-native-embed-alignment="center" data-native-embed-width="${width}" data-native-embed-show-border="true"
					${placeholder ? 'data-native-embed-initial-placeholder="true"' : ''}
					${wideLayoutCentering ? 'data-native-embed-wide-layout-centering="true"' : ''}>
					<div class="frame" style="width:${width}px;max-width:100%"></div>
				</div>
			</div>
		</div>
	</div>
`;

const renderPage = (embeds: Embed[]) =>
	`<style>${rendererStyles}</style><div id="page"><div class="ak-renderer-document">${embeds
		.map(renderEmbed)
		.join('')}</div></div>`;

for (const { layout, width, placeholder } of [
	{ layout: 'wide', width: 1200 },
	{ layout: 'wide', width: 500 },
	{ layout: 'full-width', width: 1800 },
	{ layout: 'wide', width: 1200, placeholder: true },
	{ layout: 'full-width', width: 1800, placeholder: true },
] as const) {
	test(`renderer centres a ${width}px ${layout} ${placeholder ? 'placeholder' : 'embed'} on a default-width page`, async ({
		page,
	}) => {
		await page.setViewportSize({ width: PAGE_WIDTH, height: 800 });
		await page.setContent(renderPage([{ id: 'embed', layout, width, placeholder }]));
		await page.addStyleTag({ content: nativeEmbedAlignmentStyles.styles });

		const expectedWidth = Math.min(width, PAGE_WIDTH);
		await expect(page.locator('#embed')).toHaveCSS('width', `${expectedWidth}px`);
		await expect(page.locator('#embed')).toHaveCSS('transform', 'none');
		const box = await page.locator('#embed').boundingBox();
		expect(box!.x + box!.width / 2).toBeCloseTo(COLUMN_CENTRE, 0);
		expect(box!.x).toBeGreaterThanOrEqual(0);
		expect(box!.x + box!.width).toBeLessThanOrEqual(PAGE_WIDTH);
	});
}

test('renderer keeps the previous double centring when the killswitch removes the marker', async ({
	page,
}) => {
	await page.setViewportSize({ width: PAGE_WIDTH, height: 800 });
	await page.setContent(
		renderPage([{ id: 'embed', layout: 'wide', width: 1200, wideLayoutCentering: false }]),
	);
	await page.addStyleTag({ content: nativeEmbedAlignmentStyles.styles });

	await expect(page.locator('#embed')).toHaveCSS('transform', 'matrix(1, 0, 0, 1, -600, 0)');
	const box = await page.locator('#embed').boundingBox();
	expect(box!.x + box!.width).toBeCloseTo(COLUMN_LEFT + COLUMN_WIDTH, 0);
});
