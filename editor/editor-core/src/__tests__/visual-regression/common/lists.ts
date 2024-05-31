import { traverse } from '@atlaskit/adf-utils/traverse';
// eslint-disable-next-line import/no-extraneous-dependencies -- Removed import for fixing circular dependencies
import { EditorTestCardProvider } from '@atlaskit/editor-test-helpers/card-provider';
// eslint-disable-next-line import/no-extraneous-dependencies -- Removed import for fixing circular dependencies
import { animationFrame, scrollToBottom } from '@atlaskit/editor-test-helpers/page-objects/editor';
// eslint-disable-next-line import/no-extraneous-dependencies -- Removed import for fixing circular dependencies
import {
	clickOnExtension,
	hoverOverTrashButton,
	waitForExtensionToolbar,
} from '@atlaskit/editor-test-helpers/page-objects/extensions';
// eslint-disable-next-line import/no-extraneous-dependencies -- Removed import for fixing circular dependencies
import { waitForMediaToBeLoaded } from '@atlaskit/editor-test-helpers/page-objects/media';
// eslint-disable-next-line import/no-extraneous-dependencies -- Removed import for fixing circular dependencies
import {
	clickOnCard,
	waitForCardToolbar,
} from '@atlaskit/editor-test-helpers/page-objects/smart-links';
// eslint-disable-next-line import/no-extraneous-dependencies -- Removed import for fixing circular dependencies
import {
	clickOnStatus,
	waitForStatusToolbar,
} from '@atlaskit/editor-test-helpers/page-objects/status';
// eslint-disable-next-line import/no-extraneous-dependencies -- Removed import for fixing circular dependencies
import {
	Appearance,
	initEditorWithAdf,
	snapshot,
} from '@atlaskit/editor-test-helpers/vr-utils/base-utils';
// eslint-disable-next-line import/no-extraneous-dependencies -- Removed import for fixing circular dependencies
import type { ViewportSize } from '@atlaskit/editor-test-helpers/vr-utils/device-viewport';
// eslint-disable-next-line import/no-extraneous-dependencies -- Removed import for fixing circular dependencies
import { Device, deviceViewPorts } from '@atlaskit/editor-test-helpers/vr-utils/device-viewport';
import { waitForResolvedInlineCard } from '@atlaskit/media-integration-test-helpers';
import type { PuppeteerPage } from '@atlaskit/visual-regression/helper';

import floatsAdf2 from './__fixtures__/action-decision-lists-adjacent-floats-adf.json';
import extensionAdf from './__fixtures__/inline-extension-inside-lists.adf.json';
import floatsAdf from './__fixtures__/lists-adjacent-floats-adf.json';
import listsOlUlAdf from './__fixtures__/lists-ordered-unordered-adf.json';
import listsWithOrderAndNestedListsAdf from './__fixtures__/lists-with-order-and-nested-lists-adf.json';
import smartLinksAdf from './__fixtures__/smart-link-nested-in-list.adf.json';
import statusAdf from './__fixtures__/status-inside-lists.adf.json';
import { createListWithNItems } from './__fixtures__/very-long-lists.adf';

describe('Lists', () => {
	let page: PuppeteerPage;
	const cardProvider = new EditorTestCardProvider();

	const initEditor = async (
		page: PuppeteerPage,
		adf: any,
		viewport: ViewportSize = deviceViewPorts[Device.Default],
		editorProps = {},
	) =>
		await initEditorWithAdf(page, {
			appearance: Appearance.fullPage,
			adf,
			viewport,
			editorProps,
		});

	beforeAll(async () => {
		page = global.page;
	});

	afterEach(async () => {
		await animationFrame(page);
		await snapshot(page);
	});

	it('should render card toolbar on click when its nested inside lists', async () => {
		await initEditor(
			page,
			smartLinksAdf,
			{ width: 800, height: 300 },
			{
				smartLinks: { provider: Promise.resolve(cardProvider) },
			},
		);
		await waitForResolvedInlineCard(page);
		await clickOnCard(page);
		await waitForCardToolbar(page);
		await page.mouse.move(0, 0);
	});

	it('should render extension toolbar on click when its nested inside lists', async () => {
		await initEditor(page, extensionAdf, { width: 800, height: 300 });
		await clickOnExtension(page, 'com.atlassian.confluence.macro.core', 'inline-eh');
		await waitForExtensionToolbar(page);
	});

	it('should render red outline when hovering trash button for inline extensions and nested inside list', async () => {
		await initEditor(page, extensionAdf, { width: 800, height: 300 });
		await clickOnExtension(page, 'com.atlassian.confluence.macro.core', 'inline-eh');
		await waitForExtensionToolbar(page);
		await hoverOverTrashButton(page);
	});

	it('should render status toolbar on click when its nested inside lists', async () => {
		await initEditor(page, statusAdf, { width: 800, height: 400 });
		await clickOnStatus(page);
		await waitForStatusToolbar(page);
	});

	// TODO: Add back 9999 case (flaky timing out VR test: https://product-fabric.atlassian.net/browse/ED-16361)
	const totalListItemsTestCases = [1, 9, 99, 999];

	// FIXME: Skipping theses tests as it has been failing on master on CI due to "Screenshot comparison failed" issue.
	// Build URL: https://bitbucket.org/atlassian/atlassian-frontend/pipelines/results/2319963/steps/%7B31b3ca1c-6917-4861-88ed-d816d6fae22f%7D
	totalListItemsTestCases.forEach((totalListItems) => {
		it.skip(`should not cut off numbers in long ordered lists (list with ${totalListItems} items)`, async () => {
			const listWithNItems = createListWithNItems(totalListItems);
			await initEditor(page, listWithNItems, undefined);
			await scrollToBottom(page);
		});
	});
	totalListItemsTestCases.forEach((totalListItems) => {
		it.skip(`should not cut off numbers in long ordered lists inside tables (list with ${totalListItems} items)`, async () => {
			const listInTableWithNItems = createListWithNItems(totalListItems, true);
			await initEditor(page, listInTableWithNItems, undefined, {
				allowTables: { advanced: true },
			});
			await scrollToBottom(page);
		});
	});
	it('should render indented lists inside ordered lists with specific padding', async () => {
		await initEditor(page, listsWithOrderAndNestedListsAdf, undefined, {
			allowTables: { advanced: true },
		});
	});

	it('should render ul and ol lists with numbers below 100 with the same left padding', async () => {
		await initEditor(page, listsOlUlAdf, { width: 200, height: 400 });
	});
});

describe('Lists adjacent floated media', () => {
	let page: PuppeteerPage;

	const initEditor = async (page: PuppeteerPage, adf: any) =>
		await initEditorWithAdf(page, {
			appearance: Appearance.fullPage,
			adf,
			device: Device.LaptopMDPI,
			viewport: { width: 900, height: 1100 },
		});

	beforeAll(async () => {
		page = global.page;
	});

	afterEach(async () => {
		await waitForMediaToBeLoaded(page);
		await snapshot(page);
	});

	it('action & decision lists should clear image', async () => {
		await initEditor(page, floatsAdf2);
		await visualiseListItemBoundingBoxes(page);
	});

	/**
	 * Note:
	 * Be aware that these tests injects additional CSS which will persist
	 * on subsequent test runs.
	 * If you test doesn't require this CSS they should be added above this
	 * point in the test suite.
	 */
	it('ordered list should not overlap image', async () => {
		const orderedListFloatsAdf = floatsAdf;
		await initEditor(page, orderedListFloatsAdf);
		await visualiseListItemBoundingBoxes(page);
	});

	it('bullet list should not overlap image', async () => {
		// Reuse ordered list ADF and replace with bullet list.
		const bulletListFloatsAdf = traverse(Object.assign({}, floatsAdf), {
			orderedList: (node: any) => {
				node.type = 'bulletList';
				return node;
			},
		});
		await initEditor(page, bulletListFloatsAdf);
		await visualiseListItemBoundingBoxes(page);
	});
});

async function visualiseListItemBoundingBoxes(page: PuppeteerPage) {
	const css = `
      li > *,
      .taskItemView-content-wrap > * {
        /*
        Visualise the bounding box of list item content.
        Using green to ensure it doesn't clash with the red
        and yellow used by jest-image-snapshot.
        */
        background: rgba(0, 100, 50, 0.2);
      }
    `;
	await page.addStyleTag({ content: css });
}
