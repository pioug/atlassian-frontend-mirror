/* eslint-disable import/no-extraneous-dependencies -- Removed from package.json to fix  circular depdencies */
import { clickEditableContent } from '@atlaskit/editor-test-helpers/page-objects/editor';
import { pressKey } from '@atlaskit/editor-test-helpers/page-objects/keyboard';
import { retryUntilStablePosition } from '@atlaskit/editor-test-helpers/page-objects/toolbar';
import {
  initFullPageEditorWithAdf,
  snapshot,
} from '@atlaskit/editor-test-helpers/vr-utils/base-utils';
import { Device } from '@atlaskit/editor-test-helpers/vr-utils/device-viewport';
import type { PuppeteerPage } from '@atlaskit/visual-regression/helper';

import * as adfWithExpand from './__fixtures__/simple-expand.adf.json';
/* eslint-disable import/no-extraneous-dependencies -- Removed from package.json to fix  circular depdencies */

// FIXME: This is failing in master-publish pipeline: https://bitbucket.org/atlassian/atlassian-frontend/pipelines/results/2440494/steps/%7B7c2a0f37-ea6f-4ffc-8a60-a5a7868dac4c%7D
describe.skip('Expand: tab navigation', () => {
  let page: PuppeteerPage;

  beforeAll(async () => {
    page = global.page;
  });

  afterEach(async () => {
    await snapshot(page);
  });

  beforeEach(async () => {
    await page.evaluate((data) => {
      // window.matchMedia('(any-hover: hover)').matches returns false on headless chrome
      // @ts-ignore
      window.matchMedia = () => ({ matches: true });
    });
  });

  describe('given the gap cursor is on the left of the expand', () => {
    beforeEach(async () => {
      await initFullPageEditorWithAdf(page, adfWithExpand, Device.LaptopMDPI);
      await page.waitForSelector('.ak-editor-expand__content');
      await retryUntilStablePosition(
        page,
        () => clickEditableContent(page),
        '[aria-label="Expand toolbar"]',
        1000,
      );
      await pressKey(page, ['ArrowUp', 'ArrowUp']);
    });

    describe('when tab is pressed once', () => {
      it('should focus on the button', async () => {
        await pressKey(page, ['Tab']);
      });
    });

    describe('when tab is pressed twice', () => {
      it('should focus on title', async () => {
        await pressKey(page, ['Tab', 'Tab']);
        await page.keyboard.type('I am here');
      });
    });

    describe('when tab is pressed thrice', () => {
      describe('when expand is opened', () => {
        it('should focus on content', async () => {
          await pressKey(page, ['Tab', 'Tab', 'Tab']);
          await page.keyboard.type('I am here');
        });
      });

      describe('when expand is closed', () => {
        it('should focus outside', async () => {
          await pressKey(page, ['Tab', 'Space', 'Tab', 'Tab']);
          await page.keyboard.type('I am here');
        });
      });
    });
  });
});
