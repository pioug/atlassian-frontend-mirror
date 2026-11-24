import { editorTestCase as test } from '@af/editor-libra/editor-test-case';
import { expect } from '@af/editor-libra/matchers';
import { EditorMainToolbarModel } from '@af/editor-libra/page-models/editor-main-toolbar-model';

test.use({
	exampleName: 'testing' as keyof typeof import('../../../../examples/99-testing.tsx'),
	editorProps: {
		allowExtension: true,
		appearance: 'full-width',
		elementBrowser: { showModal: true, replacePlusMenu: true },
	},
	editorMountOptions: { withConfluenceMacrosExtensionProvider: true },
	platformFeatureFlags: { platform_editor_slash_command: true },
	viewport: { width: 1280, height: 520 },
});

test.beforeEach(async ({ editor }) => {
	await EditorMainToolbarModel.from(editor).openInsertMenu();
	await editor.page.getByRole('option', { name: 'View all elements' }).click();
});

test('scrolls a long category while keeping the focused option and inserts an offscreen element', async ({
	editor,
}) => {
	const modal = editor.page.getByTestId('registry-element-browser-modal');
	const scrollable = modal.getByTestId('registry-element-browser-modal--scrollable');
	const options = modal.getByRole('listbox', { name: 'Element results' }).getByRole('option');
	const selected = modal.getByRole('option', { selected: true });
	const resultsCount = modal.getByText(/^\d+ results available$/u);
	const search = modal.getByRole('textbox', { name: 'Search all elements', exact: true });
	const widget = modal.getByRole('option', { name: 'Widget Connector', exact: true });
	const firstRow = modal.locator('[data-virtual-row="0"]');

	await modal.getByRole('button', { name: 'Embed', exact: true }).click();
	await expect(resultsCount).toHaveText(/^(?:[3-9]\d|\d{3}) results available$/u);
	const total = Number.parseInt(await resultsCount.innerText(), 10);
	await search.focus();
	await expect(firstRow).toHaveCount(1);
	await expect
		.poll(async () => {
			await scrollable.evaluate((element) => {
				element.scrollTop = element.scrollHeight;
			});
			return firstRow.count();
		})
		.toBe(0);
	await scrollable.evaluate((element) => {
		element.scrollTop = 0;
	});
	await expect(firstRow).toHaveCount(1);

	await search.press('ArrowDown');
	await expect(selected).toBeFocused();
	const focusedId = (await selected.getAttribute('id')) ?? '';
	await expect(widget).toHaveCount(0);

	await expect
		.poll(async () => {
			await scrollable.evaluate((element) => {
				element.scrollTop = element.scrollHeight;
			});
			return widget.isVisible();
		})
		.toBe(true);
	await expect(selected).toHaveAttribute('id', focusedId);
	await expect(selected).toBeFocused();
	const mounted = await options.count();
	expect(mounted).toBeLessThan(total);
	await expect(widget).toHaveAttribute('aria-setsize', String(total));
	expect(Number(await widget.getAttribute('aria-posinset'))).toBeGreaterThan(mounted);

	await widget.click();
	await widget.press('Enter');
	await expect(modal).toBeHidden();
	await expect
		.poll(async () => {
			const doc = await editor.getProsemirrorDocument();
			let widgetCount = 0;
			doc.descendants((node) => {
				if (node.attrs.extensionKey === 'widget') {
					widgetCount++;
				}
			});
			return widgetCount;
		})
		.toBe(1);
});

test('moves focus past the initial search results and resets scrolling for a narrower search', async ({
	editor,
}) => {
	const modal = editor.page.getByTestId('registry-element-browser-modal');
	const scrollable = modal.getByTestId('registry-element-browser-modal--scrollable');
	const listbox = modal.getByRole('listbox', { name: 'Element results' });
	const options = listbox.getByRole('option');
	const selected = listbox.getByRole('option', { selected: true });
	const resultsCount = modal.getByText(/^\d+ results available$/u);
	const search = modal.getByRole('textbox', { name: 'Search all elements', exact: true });

	await search.fill('a');
	await expect(resultsCount).toHaveText(/^(?:[3-9]\d|\d{3}) results available$/u);
	const total = Number.parseInt(await resultsCount.innerText(), 10);
	await search.press('ArrowDown');
	await expect(selected).toBeFocused();
	const initialIds = new Set(await options.evaluateAll((elements) => elements.map(({ id }) => id)));
	expect(initialIds.size).toBeLessThan(total);

	const initialRows = Math.ceil(initialIds.size / 3);
	let selectedId = (await selected.getAttribute('id')) ?? '';
	for (let step = 0; step < initialRows; step++) {
		await selected.press('ArrowDown');
		await expect(selected).not.toHaveAttribute('id', selectedId);
		await expect(selected).toBeFocused();
		selectedId = (await selected.getAttribute('id')) ?? '';
	}
	expect(selectedId).not.toBe('');
	expect(initialIds.has(selectedId)).toBe(false);
	await expect.poll(() => scrollable.evaluate((element) => element.scrollTop)).toBeGreaterThan(0);

	await editor.page.setViewportSize({ width: 760, height: 520 });
	await expect(selected).toHaveAttribute('id', selectedId);
	await expect(selected).toBeFocused();
	await expect(selected).toBeInViewport();

	await search.fill('Widget Connector');
	await expect(modal.getByRole('option', { name: 'Widget Connector', exact: true })).toBeVisible();
	await expect.poll(() => scrollable.evaluate((element) => element.scrollTop)).toBe(0);
});
