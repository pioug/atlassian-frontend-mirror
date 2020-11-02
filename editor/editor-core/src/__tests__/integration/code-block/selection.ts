import { BrowserTestCase } from '@atlaskit/webdriver-runner/runner';

import {
  goToEditorTestingExample,
  mountEditor,
} from '../../__helpers/testing-example-helpers';
import { codeBlockSelectors } from '../../__helpers/page-objects/_code-block';
import { fullpage, getProsemirrorSelection } from '../_helpers';

import codeblockAdf from './__fixtures__/basic-codeblock-adf.json';
import { calcUserDragAndDropFromMidPoint } from '../../__helpers/utils';

BrowserTestCase(
  "doesn't select codeblock node if click and drag before releasing mouse",
  {},
  async (client: any) => {
    const page = await goToEditorTestingExample(client);
    await mountEditor(page, {
      appearance: fullpage.appearance,
      defaultValue: codeblockAdf,
    });

    // click and drag from centre of codeblock out to padding
    const boundingRect = await page.getBoundingRect(codeBlockSelectors.content);
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
