import { BrowserTestCase } from '@atlaskit/webdriver-runner/runner';

import {
  goToEditorTestingWDExample,
  mountEditor,
} from '../../__helpers/testing-example-helpers';
import { panelSelectors } from '../../__helpers/page-objects/_panel';
import {
  editable,
  expectToMatchDocument,
  fullpage,
  getProsemirrorSelection,
} from '../_helpers';

import panelAdf from './__fixtures__/basic-panel-adf.json';
import { calcUserDragAndDropFromMidPoint } from '../../__helpers/utils';

BrowserTestCase(
  'selection.ts: Writing inside the panel, selecting panel and typing should drop text in panel',
  {},
  async (client: any, testName: string) => {
    const page = await goToEditorTestingWDExample(client);
    await mountEditor(page, {
      appearance: fullpage.appearance,
      allowPanel: true,
      defaultValue: panelAdf,
    });

    // Select the left margin of the panel, selecting the node
    await page.click(panelSelectors.icon);
    await page.type(editable, 'this text should be in doc root');

    await expectToMatchDocument(page, testName);
  },
);

BrowserTestCase(
  "doesn't select panel node if click and drag before releasing mouse",
  {},
  async (client: any) => {
    const page = await goToEditorTestingWDExample(client);
    await mountEditor(page, {
      appearance: fullpage.appearance,
      allowPanel: true,
      defaultValue: panelAdf,
    });

    // click and drag from centre of panel out to padding
    const boundingRect = await page.getBoundingRect(panelSelectors.panel);
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
