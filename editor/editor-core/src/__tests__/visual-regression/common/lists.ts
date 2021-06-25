import { PuppeteerPage } from '@atlaskit/visual-regression/helper';
import {
  snapshot,
  Device,
  initEditorWithAdf,
  Appearance,
  deviceViewPorts,
} from '../_utils';
import { waitForMediaToBeLoaded } from '../../__helpers/page-objects/_media';
import { traverse } from '@atlaskit/adf-utils/traverse';
import smartLinksAdf from './__fixtures__/smart-link-nested-in-list.adf.json';
import extensionAdf from './__fixtures__/inline-extension-inside-lists.adf.json';
import statusAdf from './__fixtures__/status-inside-lists.adf.json';
import dateAdf from './__fixtures__/date-inside-lists.adf.json';
import floatsAdf from './__fixtures__/lists-adjacent-floats-adf.json';
import floatsAdf2 from './__fixtures__/action-decision-lists-adjacent-floats-adf.json';
import list100ItemsAdf from './__fixtures__/lists-100-items.adf';
import {
  waitForCardToolbar,
  clickOnCard,
} from '../../__helpers/page-objects/_smart-links';
import {
  waitForExtensionToolbar,
  clickOnExtension,
} from '../../__helpers/page-objects/_extensions';
import {
  waitForStatusToolbar,
  clickOnStatus,
} from '../../__helpers/page-objects/_status';
import {
  waitForDatePicker,
  clickOnDate,
} from '../../__helpers/page-objects/_date';
import {
  animationFrame,
  scrollToBottom,
} from '../../__helpers/page-objects/_editor';
import { EditorTestCardProvider } from '@atlaskit/editor-test-helpers/card-provider';
import { waitForResolvedInlineCard } from '@atlaskit/media-integration-test-helpers';

describe('Lists', () => {
  let page: PuppeteerPage;
  const cardProvider = new EditorTestCardProvider();

  const initEditor = async (
    page: PuppeteerPage,
    adf: any,
    viewport: { width: number; height: number } = deviceViewPorts[
      Device.Default
    ],
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
    await clickOnExtension(
      page,
      'com.atlassian.confluence.macro.core',
      'inline-eh',
    );
    await waitForExtensionToolbar(page);
  });

  it('should render status toolbar on click when its nested inside lists', async () => {
    await initEditor(page, statusAdf, { width: 800, height: 400 });
    await clickOnStatus(page);
    await waitForStatusToolbar(page);
  });

  it('should render date picker on click when its nested inside lists', async () => {
    await initEditor(page, dateAdf);
    await clickOnDate(page);
    await waitForDatePicker(page);
  });

  it('should not cut off numbers in long ordered lists', async () => {
    await initEditor(page, list100ItemsAdf);
    await scrollToBottom(page);
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
