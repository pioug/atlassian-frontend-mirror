import { BrowserTestCase } from '@atlaskit/webdriver-runner/runner';

import {
  goToEditorTestingWDExample,
  mountEditor,
} from '../../__helpers/testing-example-helpers';
import { layoutSelectors } from '../../__helpers/page-objects/_layouts';
import { fullpage, getProsemirrorSelection } from '../_helpers';

import layoutAdf from './__fixtures__/basic-layout-adf.json';
import { calcUserDragAndDropFromMidPoint } from '../../__helpers/utils';

BrowserTestCase(
  "doesn't select layout section node if click and drag before releasing mouse",
  {},
  async (client: any) => {
    const page = await goToEditorTestingWDExample(client);
    await mountEditor(page, {
      appearance: fullpage.appearance,
      allowLayouts: true,
      defaultValue: layoutAdf,
    });

    // click and drag from centre of layout col out to padding
    const boundingRect = await page.getBoundingRect(layoutSelectors.column);
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
