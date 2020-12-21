import { BrowserTestCase } from '@atlaskit/webdriver-runner/runner';
import {
  mountEditor,
  goToEditorTestingWDExample,
} from '../../../../__tests__/__helpers/testing-example-helpers';
import {
  fullpage,
  setProseMirrorTextSelection,
  editable,
} from '../../../../__tests__/integration/_helpers';
import * as paragraphWithEmoji from '../__fixtures__/paragraph-with-emoji.adf.json';
import * as paragraphADF from '../__fixtures__/paragraph.adf.json';
import { annotationSelectors } from '../_utils';
import { BrowserObject } from '@atlaskit/webdriver-runner/wd-wrapper';

BrowserTestCase(
  `toolbar is disabled when selection includes inline nodes`,
  { skip: ['edge'] },
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
  { skip: ['edge'] },
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
