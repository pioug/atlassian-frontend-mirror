import { expect, test } from '@af/integration-testing';

import {
	nativeEmbedAlignmentStyles,
	nativeEmbedInlineMauiWidthStyles,
} from '../../entry-points/native-embed-styles';

const embedStyles = nativeEmbedAlignmentStyles.styles + nativeEmbedInlineMauiWidthStyles.styles;

// Mirror the inline renderer's shrink-to-fit wrapper and a native embed's percentage-width iframe.
const fixtureStyles = `
	.inline-extension-renderer {
		display: inline-block;
		max-width: 100%;
		vertical-align: middle;
		margin: 0 1px 4px;
	}
	.inline-extension { display: inline-block; }
	.extension-container.inline { display: inline-flex; max-width: 100%; margin: 24px 0; position: relative; }
	.extension-container.inline::before, .extension-container.inline::after { content: ''; }
	.extension-overlay { position: absolute; inset: 0; }
	iframe { width: 100%; max-width: 100%; height: 40px; border: 0; }
	p { margin: 0; }
	table { width: 100%; table-layout: fixed; border-spacing: 0; }
	td { padding: 0; }
`;

const editorEmbed = (id: string, attributes: string) =>
	`<span class="inlineExtensionView-content-wrap"><span class="inline-extension" id="${id}"><div class="extension-container inline"><div class="extension-overlay"></div><div ${attributes}><iframe title="${id}"></iframe></div></div></span></span>`;

test('editor parsed SSR placeholder and loaded iframe fill the inline container without an owning span', async ({
	page,
}) => {
	// Parsing the editor's server HTML repairs the div inside its paragraph and span.
	await page.setContent(`<style>${fixtureStyles}${embedStyles}</style><div style="width:676px"><table><tr><td><p><span class="inline-extension">
		<div class="extension-container inline"><div class="extension-overlay"></div>
			<div id="native" data-native-embed-alignment="center" data-native-embed-experience="maui" data-native-embed-inline-width="true" data-native-embed-initial-placeholder="true">
				<div id="frame" style="width:100%;height:40px"></div>
			</div>
		</div>
	</span></p></td></tr></table></div>`);
	await expect(page.locator('.extension-container')).toHaveCSS('width', '676px');
	await expect(page.locator('#native')).toHaveCSS('width', '676px');
	await expect(page.locator('#frame')).toHaveCSS('width', '676px');
	await page.locator('#native').evaluate((element) => {
		element.removeAttribute('data-native-embed-initial-placeholder');
		const iframe = document.createElement('iframe');
		iframe.title = 'Loaded Remix';
		element.replaceChildren(iframe);
	});
	await expect(page.locator('iframe')).toHaveCSS('width', '676px');
});

for (const width of [240, 676]) {
	for (const inTable of [false, true]) {
		test(`editor unsized MAUI fills ${width}px ${inTable ? 'table cell' : 'paragraph'}`, async ({
			page,
		}) => {
			const content = '<p>Before <span id="slot"></span> After</p>';
			await page.setContent(`<style>${fixtureStyles}</style>
				<div style="width:${width}px">${inTable ? `<table><tr><td>${content}</td></tr></table>` : content}</div>
				<template id="markup">${editorEmbed('embed', 'data-native-embed-alignment="center" data-native-embed-experience="maui" data-native-embed-inline-width="true"')}</template>`);
			await page.locator('#slot').evaluate((slot) => {
				const template = document.getElementById('markup');
				if (template instanceof HTMLTemplateElement) {
					slot.append(template.content.cloneNode(true));
				}
			});
			await expect(page.locator('#embed')).toHaveCSS('width', `${Math.min(300, width)}px`);

			await page.addStyleTag({ content: embedStyles });

			await expect(page.locator('#embed')).toHaveCSS('width', `${width}px`);
			await expect(page.locator('.extension-container')).toHaveCSS('width', `${width}px`);
			await expect(page.locator('iframe')).toHaveCSS('width', `${width}px`);
			await expect(page.locator('.extension-container')).toHaveCSS('margin-top', '24px');
			const paragraph = await page.locator('p').boundingBox();
			const embed = await page.locator('#embed').boundingBox();
			expect(embed!.x + embed!.width).toBeLessThanOrEqual(paragraph!.x + paragraph!.width);
		});
	}
}

test('editor treatment leaves control, explicit widths, other experiences and enclosing macros unchanged', async ({
	page,
}) => {
	await page.setContent(`<style>${fixtureStyles}</style><div style="width:676px">
		${editorEmbed('control', 'data-native-embed-alignment="center" data-native-embed-experience="maui"')}
		${editorEmbed('resized', 'data-native-embed-alignment="center" data-native-embed-experience="maui" data-native-embed-inline-width="true" data-native-embed-width="480" style="width:480px"')}
		${editorEmbed('other', 'data-native-embed-alignment="center" data-native-embed-experience="whiteboard"')}
		<span class="inline-extension" id="outer" style="width:400px"><div>${editorEmbed('nested', 'data-native-embed-alignment="center" data-native-embed-experience="maui" data-native-embed-inline-width="true"')}</div></span>
		${editorEmbed('unknown', 'data-native-embed-initial-placeholder="true"')}
	</div>`);
	await page.addStyleTag({ content: nativeEmbedAlignmentStyles.styles });
	const selectors = ['#control', '#resized', '#other', '#outer', '#unknown'];
	const widths = await Promise.all(
		selectors.map((selector) => page.locator(selector).boundingBox()),
	);

	await page.addStyleTag({ content: nativeEmbedInlineMauiWidthStyles.styles });

	for (const [index, selector] of selectors.entries()) {
		expect((await page.locator(selector).boundingBox())?.width).toBe(widths[index]?.width);
	}
	await expect(page.locator('#resized')).toHaveCSS('width', '480px');
	await expect(page.locator('#nested')).toHaveCSS('width', '400px');
});

test('editor known placeholder keeps its width on load and releases it on explicit resize', async ({
	page,
}) => {
	await page.setContent(`<style>${fixtureStyles}${embedStyles}</style><div style="width:676px">
		<span class="inline-extension" id="embed"><div class="extension-container inline">
			<div class="extension-overlay"></div>
			<div data-native-embed-alignment="center" data-native-embed-experience="maui" data-native-embed-inline-width="true" data-native-embed-initial-placeholder="true" id="native">
				<div id="frame" style="width:100%;height:40px"></div>
			</div>
		</div></span>
	</div>`);
	await expect(page.locator('#frame')).toHaveCSS('width', '676px');
	await page.locator('#native').evaluate((element) => {
		element.removeAttribute('data-native-embed-initial-placeholder');
		const iframe = document.createElement('iframe');
		iframe.title = 'Loaded Remix';
		element.replaceChildren(iframe);
	});
	await expect(page.locator('iframe')).toHaveCSS('width', '676px');

	await page.locator('#native').evaluate((element) => {
		element.setAttribute('data-native-embed-width', '480');
		element.setAttribute('style', 'width:480px');
	});
	await expect(page.locator('#embed')).toHaveCSS('width', '480px');
	await expect(page.locator('iframe')).toHaveCSS('width', '480px');

	await page.locator('#native').evaluate((element) => {
		element.removeAttribute('data-native-embed-width');
		element.removeAttribute('style');
	});
	await expect(page.locator('#embed')).toHaveCSS('width', '676px');
	await expect(page.locator('iframe')).toHaveCSS('width', '676px');
});

for (const treatmentFirst of [false, true]) {
	test(`editor keeps mixed cohorts isolated with treatment first: ${treatmentFirst}`, async ({
		page,
	}) => {
		const control = editorEmbed(
			'control',
			'data-native-embed-alignment="center" data-native-embed-experience="maui"',
		);
		const treatment = editorEmbed(
			'treatment',
			'data-native-embed-alignment="center" data-native-embed-experience="maui" data-native-embed-inline-width="true"',
		);
		await page.setContent(`<style>${fixtureStyles}${embedStyles}</style><div style="width:676px">
			${treatmentFirst ? treatment + control : control + treatment}
		</div>`);
		await expect(page.locator('#control')).toHaveCSS('width', '300px');
		await expect(page.locator('#treatment')).toHaveCSS('width', '676px');
	});
}

for (const width of [240, 676]) {
	for (const inTable of [false, true]) {
		test(`unsized MAUI fills ${width}px ${inTable ? 'table cell' : 'paragraph'}`, async ({
			page,
		}) => {
			const content = '<p>Before <span id="slot"></span> After</p>';
			await page.setContent(`<style>${fixtureStyles}</style>
				<div style="width:${width}px">${inTable ? `<table><tr><td>${content}</td></tr></table>` : content}</div>
				<template id="markup"><div class="inline-extension-renderer" id="embed">
					<div data-native-embed-experience="maui" data-native-embed-inline-width="true"><iframe title="Remix"></iframe></div>
				</div></template>`);
			// The ADF renderer builds this DOM directly. Parsing a div inside a paragraph as HTML
			// would repair it into siblings and lose the real inline-extension ancestry.
			await page.locator('#slot').evaluate((slot) => {
				const template = document.getElementById('markup');
				if (template instanceof HTMLTemplateElement) {
					slot.append(template.content.cloneNode(true));
				}
			});
			await expect(page.locator('#embed')).toHaveCSS('width', `${Math.min(300, width - 2)}px`);

			await page.addStyleTag({ content: embedStyles });

			await expect(page.locator('#embed')).toHaveCSS('width', `${width}px`);
			await expect(page.locator('#embed')).toHaveCSS('margin-left', '0px');
			await expect(page.locator('#embed')).toHaveCSS('margin-right', '0px');
			await expect(page.locator('#embed')).toHaveCSS('margin-bottom', '4px');
			await expect(page.locator('iframe')).toHaveCSS('width', `${width}px`);
		});
	}
}

test('leaves explicit widths, other experiences, block embeds and enclosing macros unchanged', async ({
	page,
}) => {
	await page.setContent(`<style>${fixtureStyles}</style><div style="width:676px">
		<div class="inline-extension-renderer" id="resized">
			<div data-native-embed-experience="maui" data-native-embed-inline-width="true" data-native-embed-width="480" style="width:480px"><iframe title="Resized Remix"></iframe></div>
		</div>
		<div class="inline-extension-renderer" id="other">
			<div data-native-embed-experience="whiteboard"><iframe title="Whiteboard"></iframe></div>
		</div>
		<div class="inline-extension-renderer" id="outer" style="width:400px"><div>
			<div class="inline-extension-renderer" id="nested">
				<div data-native-embed-experience="maui" data-native-embed-inline-width="true"><iframe title="Nested Remix"></iframe></div>
			</div>
		</div></div>
		<div id="block"><div data-native-embed-experience="maui" data-native-embed-inline-width="true"><iframe title="Block Remix"></iframe></div></div>
		<div class="inline-extension-renderer" id="unrelated">Unrelated macro</div>
		<div class="inline-extension-renderer" id="unknown-placeholder">
			<div data-native-embed-initial-placeholder="true"><div style="width:100%;height:40px"></div></div>
		</div>
	</div>`);
	const selectors = [
		'#resized',
		'#other',
		'#outer',
		'#block',
		'#unrelated',
		'#unknown-placeholder',
	];
	const widths = await Promise.all(
		selectors.map((selector) => page.locator(selector).boundingBox()),
	);

	await page.addStyleTag({ content: embedStyles });

	for (const [index, selector] of selectors.entries()) {
		expect((await page.locator(selector).boundingBox())?.width).toBe(widths[index]?.width);
	}
	await expect(page.locator('#resized')).toHaveCSS('width', '480px');
});

test('keeps a known unsized MAUI loading placeholder and its iframe at the same width', async ({
	page,
}) => {
	await page.setContent(`<style>${fixtureStyles}${embedStyles}</style>
		<div style="width:676px"><div class="inline-extension-renderer" id="embed">
			<div data-native-embed-experience="maui" data-native-embed-inline-width="true" data-native-embed-initial-placeholder="true" id="native">
				<div id="frame" style="width:100%;height:40px"></div>
			</div>
		</div></div>`);
	await expect(page.locator('#frame')).toHaveCSS('width', '676px');

	await page.locator('#native').evaluate((element) => {
		element.removeAttribute('data-native-embed-initial-placeholder');
		const iframe = document.createElement('iframe');
		iframe.title = 'Loaded Remix';
		element.replaceChildren(iframe);
	});

	await expect(page.locator('iframe')).toHaveCSS('width', '676px');
});

test('releases full-width placement when an embed acquires an explicit width', async ({ page }) => {
	await page.setContent(`<style>${fixtureStyles}${embedStyles}</style>
		<div style="width:676px"><div class="inline-extension-renderer" id="embed">
			<div data-native-embed-experience="maui" data-native-embed-inline-width="true" id="native"><iframe title="Remix"></iframe></div>
		</div></div>`);
	await expect(page.locator('#embed')).toHaveCSS('width', '676px');

	await page.locator('#native').evaluate((element) => {
		element.setAttribute('data-native-embed-width', '480');
		element.setAttribute('style', 'width:480px');
	});

	await expect(page.locator('#embed')).toHaveCSS('width', '480px');
	await expect(page.locator('#embed')).toHaveCSS('margin-left', '1px');
});

for (const treatmentFirst of [false, true]) {
	test(`keeps mixed cohorts isolated with treatment first: ${treatmentFirst}`, async ({ page }) => {
		const control =
			'<div class="inline-extension-renderer" id="control"><div data-native-embed-experience="maui"><iframe title="Control"></iframe></div></div>';
		const treatment =
			'<div class="inline-extension-renderer" id="treatment"><div data-native-embed-experience="maui" data-native-embed-inline-width="true"><iframe title="Test"></iframe></div></div>';
		await page.setContent(`<style>${fixtureStyles}${embedStyles}</style>
			<div style="width:676px">${treatmentFirst ? treatment + control : control + treatment}</div>`);

		await expect(page.locator('#control')).toHaveCSS('width', '300px');
		await expect(page.locator('#control')).toHaveCSS('margin-left', '1px');
		await expect(page.locator('#treatment')).toHaveCSS('width', '676px');
		await expect(page.locator('#treatment')).toHaveCSS('margin-left', '0px');
	});
}
