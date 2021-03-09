import { BrowserTestCase } from '@atlaskit/webdriver-runner/runner';

import {
  goToEditorTestingWDExample,
  mountEditor,
} from '../../../../__tests__/__helpers/testing-example-helpers';
import { codeBlockSelectors } from '../../../../__tests__/__helpers/page-objects/_code-block';
import {
  fullpage,
  getProsemirrorSelection,
} from '../../../../__tests__/integration/_helpers';

import { basicCodeBlock } from '../__fixtures__/basic-code-block';
import { calcUserDragAndDropFromMidPoint } from '../../../../__tests__/__helpers/utils';

BrowserTestCase(
  "doesn't select codeblock node if click and drag before releasing mouse",
  {},
  async (client: any) => {
    const page = await goToEditorTestingWDExample(client);
    await mountEditor(page, {
      appearance: fullpage.appearance,
      defaultValue: basicCodeBlock,
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
