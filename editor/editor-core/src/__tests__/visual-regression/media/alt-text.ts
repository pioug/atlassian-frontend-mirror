import type { PuppeteerElementHandle } from '@atlaskit/visual-regression/helper';
/* eslint-disable import/no-extraneous-dependencies -- Removed from package.json to fix  circular depdencies */
import {
  snapshot,
  Appearance,
  initEditorWithAdf,
} from '@atlaskit/editor-test-helpers/vr-utils/base-utils';

import {
  waitForMediaToBeLoaded,
  clickMediaInPosition,
  scrollToMedia,
} from '@atlaskit/editor-test-helpers/page-objects/media';
import {
  clickEditableContent,
  animationFrame,
  scrollToBottom,
} from '@atlaskit/editor-test-helpers/page-objects/editor';
import { pressKeyCombo } from '@atlaskit/editor-test-helpers/page-objects/keyboard';
/* eslint-disable import/no-extraneous-dependencies -- Removed from package.json to fix  circular depdencies */
import type { PuppeteerPage } from '@atlaskit/visual-regression/helper';
import type { EditorProps } from '../../../types';
import mediaSingleAdf from './__fixtures__/mediaSingle-image.adf.json';

describe('Snapshot Test: Media with alt text', () => {
  let page: PuppeteerPage;
  const initEditorWithMedia = async (
    appearance: Appearance,
    viewport: { width: number; height: number },
    editorProps?: Partial<EditorProps>,
  ) => {
    await initEditorWithAdf(page, {
      appearance,
      viewport,
      editorProps,
      invalidAltTextValues: ['<'],
      adf: mediaSingleAdf,
    });

    // click into the editor
    await clickEditableContent(page);
    await waitForMediaToBeLoaded(page);
  };

  beforeEach(() => {
    page = global.page;
  });

  describe('in the toolbar', () => {
    describe('when the feature flag is disabled', () => {
      it('should not display the alt text option', async () => {
        await initEditorWithMedia(Appearance.fullPage, {
          width: 800,
          height: 700,
        });
        await clickMediaInPosition(page, 0);
        await page.waitForSelector(
          '[aria-label="Media floating controls"] [aria-label="Floating Toolbar"]',
          { visible: true },
        );
        await scrollToBottom(page);
        await snapshot(page);
      });
    });

    describe('when the feature flag is enabled', () => {
      beforeEach(async () => {
        await initEditorWithMedia(
          Appearance.fullPage,
          { width: 800, height: 700 },
          {
            media: {
              allowAltTextOnImages: true,
            },
          },
        );
        await scrollToMedia(page);
        await clickMediaInPosition(page, 0);
        await page.waitForSelector(
          '[aria-label="Media floating controls"] [aria-label="Floating Toolbar"]',
          { visible: true },
        );
        await scrollToBottom(page);
      });

      it('should display the alt text option', async () => {
        await snapshot(page);
      });

      // TODO: https://product-fabric.atlassian.net/browse/ED-13527
      describe.skip('when the shortcut is pressed', () => {
        it('should display the alt text description', async () => {
          await pressKeyCombo(page, ['Control', 'Alt', 'y']);
          await page.waitForSelector('[data-testid="alt-text-input"]', {
            visible: true,
          });
          await snapshot(page);
        });
      });

      describe('when the alt text button is clicked', () => {
        // TODO: https://product-fabric.atlassian.net/browse/ED-13527
        it.skip('should display the alt text description', async () => {
          const altTextButton = await page.waitForSelector(
            '[data-testid="alt-text-edit-button"]',
            { visible: true },
          );
          await altTextButton?.click();
          await snapshot(page);
        });
      });

      describe('when the user adds an alt text value', () => {
        let altTextInput: PuppeteerElementHandle<HTMLElement>;
        beforeEach(async () => {
          const altTextButton = await page.waitForSelector(
            '[data-testid="alt-text-edit-button"]',
            { visible: true },
          );
          await altTextButton?.click();

          altTextInput = (await page.waitForSelector(
            '[data-testid="alt-text-input"]',
            { visible: true },
          ))!;
        });

        // TODO: https://product-fabric.atlassian.net/browse/ED-13527
        describe.skip('when valid value is entered', () => {
          beforeEach(async () => {
            await altTextInput.press('y');
          });

          it('displays the clear alt text button', async () => {
            await snapshot(page);
          });

          it('clears alt text when the user click the alt text button', async () => {
            await page.waitForSelector('button[aria-label="Clear alt text"]');
            await page.click('button[aria-label="Clear alt text"]');
            await animationFrame(page);
            await snapshot(page);
          });
        });

        // TODO: https://product-fabric.atlassian.net/browse/ED-13527
        describe.skip('when invalid value is entered', () => {
          beforeEach(async () => {
            await altTextInput.press('<');
          });

          it('displays validation error if the value is invalid', async () => {
            const error = await page.waitForSelector('[aria-label="error"]');
            expect(error).toBeTruthy();
            await animationFrame(page);
            await scrollToBottom(page);
            await animationFrame(page);
            await snapshot(page);
          });
        });
      });
    });
  });
});
