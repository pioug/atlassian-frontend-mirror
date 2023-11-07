import { BrowserTestCase } from '@atlaskit/webdriver-runner/runner';

// eslint-disable-next-line import/no-extraneous-dependencies -- Removed import for fixing circular dependencies
import {
  goToEditorTestingWDExample,
  mountEditor,
} from '@atlaskit/editor-test-helpers/testing-example-page';
// eslint-disable-next-line import/no-extraneous-dependencies -- Removed import for fixing circular dependencies
import { codeBlockSelectors } from '@atlaskit/editor-test-helpers/page-objects/code-block';
// eslint-disable-next-line import/no-extraneous-dependencies -- Removed import for fixing circular dependencies
import {
  fullpage,
  getProsemirrorSelection,
} from '@atlaskit/editor-test-helpers/integration/helpers';

import { basicCodeBlock } from '../../__fixtures__/code-block/basic-code-block';
// eslint-disable-next-line import/no-extraneous-dependencies -- Removed import for fixing circular dependencies
import { calcUserDragAndDropFromMidPoint } from '@atlaskit/editor-test-helpers/e2e-helpers';

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
