import { BrowserTestCase } from '@atlaskit/webdriver-runner/runner';

import {
  goToEditorTestingWDExample,
  mountEditor,
} from '@atlaskit/editor-test-helpers/testing-example-page';
import { selectors } from '@atlaskit/editor-test-helpers/page-objects/expand';
import {
  fullpage,
  getProsemirrorSelection,
} from '@atlaskit/editor-test-helpers/integration/helpers';

import expandAdf from './__fixtures__/two-line-expand.json';
import { calcUserDragAndDropFromMidPoint } from '@atlaskit/editor-test-helpers/e2e-helpers';

BrowserTestCase(
  "doesn't select expand node if click and drag before releasing mouse",
  {},
  async (client: any) => {
    const page = await goToEditorTestingWDExample(client);
    await mountEditor(page, {
      appearance: fullpage.appearance,
      allowExpand: true,
      defaultValue: expandAdf,
    });

    // click and drag from centre of expand out to padding
    const boundingRect = await page.getBoundingRect(selectors.expand);
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
