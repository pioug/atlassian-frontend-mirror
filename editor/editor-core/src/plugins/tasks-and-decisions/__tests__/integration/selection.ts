import { BrowserTestCase } from '@atlaskit/webdriver-runner/runner';

import {
  goToEditorTestingWDExample,
  mountEditor,
} from '@atlaskit/editor-test-helpers/testing-example-page';
import { decisionSelectors } from '@atlaskit/editor-test-helpers/page-objects/decision';
import {
  fullpage,
  getProsemirrorSelection,
} from '@atlaskit/editor-test-helpers/integration/helpers';
import decisionAdf from '../__fixtures__/basic-decisions-adf.json';
import { calcUserDragAndDropFromMidPoint } from '@atlaskit/editor-test-helpers/e2e-helpers';

BrowserTestCase(
  "doesn't select decision item node if click and drag before releasing mouse",
  { skip: [] },
  async (client: any) => {
    const page = await goToEditorTestingWDExample(client);
    await mountEditor(page, {
      appearance: fullpage.appearance,
      defaultValue: decisionAdf,
    });

    // click and drag from centre of decision item out to padding
    const boundingRect = await page.getBoundingRect(
      decisionSelectors.decisionItem,
    );
    await page.simulateUserDragAndDrop(
      ...calcUserDragAndDropFromMidPoint(boundingRect, 5),
    );

    const prosemirrorSelection = await getProsemirrorSelection(page);
    if (!prosemirrorSelection) {
      throw new Error('Unable to get Prosemirror selection');
    }
    expect(prosemirrorSelection.type).not.toBe('node');
  },
);
