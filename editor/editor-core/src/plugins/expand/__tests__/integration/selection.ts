import { BrowserTestCase } from '@atlaskit/webdriver-runner/runner';

import {
  goToEditorTestingWDExample,
  mountEditor,
} from '../../../../__tests__/__helpers/testing-example-helpers';
import { selectors } from '../../../../__tests__/__helpers/page-objects/_expand';
import {
  fullpage,
  getProsemirrorSelection,
} from '../../../../__tests__/integration/_helpers';

import expandAdf from './__fixtures__/two-line-expand.json';
import { calcUserDragAndDropFromMidPoint } from '../../../../__tests__/__helpers/utils';

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
