// eslint-disable-next-line import/no-extraneous-dependencies -- Removed import for fixing circular dependencies
import {
  initEditorWithAdf,
  Appearance,
} from '@atlaskit/editor-test-helpers/vr-utils/base-utils';
import mediaAdf from './__fixtures__/toolbar-adf-with-media.json';
import linkAdf from './__fixtures__/toolbar-adf-with-link.json';
import type { EditorProps } from '../../../types/editor-props';
// eslint-disable-next-line import/no-extraneous-dependencies -- Removed import for fixing circular dependencies
import type { PuppeteerPage } from '@atlaskit/editor-test-helpers/page-objects/types';
// eslint-disable-next-line import/no-extraneous-dependencies -- Removed import for fixing circular dependencies
import { pressKey } from '@atlaskit/editor-test-helpers/page-objects/keyboard';
import {
  waitForInlineCardSelection,
  waitForResolvedInlineCard,
} from '@atlaskit/media-integration-test-helpers';
// eslint-disable-next-line import/no-extraneous-dependencies -- Removed import for fixing circular dependencies
import { waitForCardToolbar } from '@atlaskit/editor-test-helpers/page-objects/smart-links';
// eslint-disable-next-line import/no-extraneous-dependencies -- Removed import for fixing circular dependencies
import { hyperlinkSelectors } from '@atlaskit/editor-test-helpers/page-objects/hyperlink';
// eslint-disable-next-line import/no-extraneous-dependencies -- Removed import for fixing circular dependencies
import {
  clickOnToolbarButton,
  LinkToolbarSelectors,
  mediaImageSelector,
  MediaToolbarButton,
  waitForMediaToBeLoaded,
} from '@atlaskit/editor-test-helpers/page-objects/media';

describe('ForceFocus plugin:', () => {
  let page: PuppeteerPage;

  async function initEditor(options: {
    editorProps?: EditorProps;
    adf: string;
  }) {
    await initEditorWithAdf(page, {
      appearance: Appearance.fullPage,
      viewport: { width: 1280, height: 700 },
      ...options,
    });
  }
  beforeEach(async () => {
    page = global.page;
  });

  const altTextBtnSelector = '[data-testid="alt-text-edit-button"]';
  const editLinkBtnIsFocused = `document.querySelector('${hyperlinkSelectors.editLinkBtn}') === document.activeElement;`;
  const addLinkBtnIsFocused = `document.querySelector('${LinkToolbarSelectors[0]}') === document.activeElement;`;
  const altTextBtnIsFocused = `document.querySelector('${altTextBtnSelector}') === document.activeElement;`;

  describe('should move focus back to the floating toolbar', () => {
    it('after pressing ESC from the EditLink menu', async () => {
      await initEditor({
        editorProps: {},
        adf: linkAdf,
      });

      await waitForResolvedInlineCard(page);
      await waitForInlineCardSelection(page);

      await waitForCardToolbar(page);

      await page.waitForSelector(hyperlinkSelectors.editLinkBtn);
      await page.click(hyperlinkSelectors.editLinkBtn);
      await page.waitForSelector('[data-testid="link-url"]');

      await pressKey(page, 'Escape');

      await page.waitForSelector(hyperlinkSelectors.editLinkBtn);

      expect(await page.evaluate(editLinkBtnIsFocused)).toBe(true);
    });

    it('after pressing ESC from the AddLink menu', async () => {
      await initEditor({
        editorProps: {
          media: {
            allowMediaSingle: true,
            allowLinking: true,
          },
        },
        adf: mediaAdf,
      });

      await waitForMediaToBeLoaded(page);

      await page.click(mediaImageSelector);
      await page.waitForSelector(LinkToolbarSelectors[0]);
      await clickOnToolbarButton(page, MediaToolbarButton.addLink);
      await page.waitForSelector('[data-testid="media-link-input"]');

      await pressKey(page, 'Escape');

      await page.waitForSelector(LinkToolbarSelectors[0]);
      expect(await page.evaluate(addLinkBtnIsFocused)).toBe(true);
    });
  });

  it('add alt text: should move focus back to the floating toolbar', async () => {
    await initEditor({
      editorProps: {
        media: {
          allowMediaSingle: true,
          allowAltTextOnImages: true,
        },
      },
      adf: mediaAdf,
    });

    await waitForMediaToBeLoaded(page);

    await page.click(mediaImageSelector);
    await page.waitForSelector(altTextBtnSelector);
    await page.click(altTextBtnSelector);
    await page.waitForSelector('[data-testid="alt-text-input"]');

    await pressKey(page, 'Escape');

    await page.waitForSelector(altTextBtnSelector);
    expect(await page.evaluate(altTextBtnIsFocused)).toBe(true);
  });
});
