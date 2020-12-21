import { BrowserTestCase } from '@atlaskit/webdriver-runner/runner';

import {
  goToEditorTestingWDExample,
  mountEditor,
} from '../../../../__tests__/__helpers/testing-example-helpers';
import { decisionSelectors } from '../../../../__tests__/__helpers/page-objects/_decision';
import {
  fullpage,
  getProsemirrorSelection,
} from '../../../../__tests__/integration/_helpers';
import decisionAdf from '../__fixtures__/basic-decisions-adf.json';
import { calcUserDragAndDropFromMidPoint } from '../../../../__tests__/__helpers/utils';

BrowserTestCase(
  "doesn't select decision item node if click and drag before releasing mouse",
  { skip: ['safari'] }, // impacted by https://product-fabric.atlassian.net/browse/ED-9974
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
