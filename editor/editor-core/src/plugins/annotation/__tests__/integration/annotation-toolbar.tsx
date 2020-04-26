import { BrowserTestCase } from '@atlaskit/webdriver-runner/runner';
import {
  mountEditor,
  goToEditorTestingExample,
} from '../../../../__tests__/__helpers/testing-example-helpers';
import {
  fullpage,
  setProseMirrorTextSelection,
} from '../../../../__tests__/integration/_helpers';
import * as paragraphWithEmoji from '../__fixtures__/paragraphWithEmoji.adf.json';
import { annotationSelectors } from '../_utils';

BrowserTestCase(
  `toolbar is disabled when selection includes inline nodes`,
  { skip: ['ie', 'edge'] },
  async (client: any) => {
    const page = await goToEditorTestingExample(client);

    await mountEditor(page, {
      defaultValue: paragraphWithEmoji,
      appearance: fullpage.appearance,
      annotationProvider: true,
    });

    await setProseMirrorTextSelection(page, { anchor: 1, head: 50 });
    await page.waitFor(annotationSelectors.floatingToolbarCreate);

    const disabledButton = await page.isExisting(
      `${annotationSelectors.floatingToolbarCreate}[disabled]`,
    );
    expect(disabledButton).toBe(true);
  },
);
