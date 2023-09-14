import { BrowserTestCase } from '@atlaskit/webdriver-runner/runner';
// eslint-disable-next-line import/no-extraneous-dependencies -- Removed import for fixing circular dependencies
import {
  mountEditor,
  goToEditorTestingWDExample,
} from '@atlaskit/editor-test-helpers/testing-example-page';
// eslint-disable-next-line import/no-extraneous-dependencies -- Removed import for fixing circular dependencies
import {
  fullpage,
  setProseMirrorTextSelection,
  editable,
} from '@atlaskit/editor-test-helpers/integration/helpers';
import * as paragraphWithEmoji from '../__fixtures__/paragraph-with-emoji.adf.json';
import * as paragraphADF from '../__fixtures__/paragraph.adf.json';
import { annotationSelectors } from '../_utils';
import type { BrowserObject } from '@atlaskit/webdriver-runner/wd-wrapper';

// FIXME: This test was automatically skipped due to failure on 10/06/2023: https://product-fabric.atlassian.net/browse/ED-18763
BrowserTestCase(
  `toolbar is disabled when selection includes inline nodes`,
  {
    skip: ['*'],
  },
  async (client: any) => {
    const page = await goToEditorTestingWDExample(client);

    await mountEditor(page, {
      defaultValue: paragraphWithEmoji,
      appearance: fullpage.appearance,
      annotationProviders: true,
    });

    await setProseMirrorTextSelection(page, { anchor: 1, head: 50 });
    await page.waitFor(annotationSelectors.floatingToolbarCreate);

    const disabledButton = await page.isExisting(
      `${annotationSelectors.floatingToolbarCreate}[disabled]`,
    );
    expect(disabledButton).toBe(true);
  },
);

BrowserTestCase(
  `toolbar shows up when selecting whole paragraph and releasing mouse outside editor`,
  {},
  async (client: BrowserObject) => {
    const page = await goToEditorTestingWDExample(client);

    await mountEditor(page, {
      defaultValue: paragraphADF,
      appearance: fullpage.appearance,
      annotationProviders: true,
    });

    const bounds = await page.getBoundingRect(editable + ' > p');
    await page.simulateUserDragAndDrop(
      bounds.left + bounds.width - 4,
      bounds.top + bounds.height - 4,
      bounds.left - 4,
      bounds.top,
    );
    const buttonExists = await page.waitFor(
      annotationSelectors.floatingToolbarCreate,
    );

    expect(buttonExists).toBe(true);
  },
);
