import { snapshotInformational } from '@af/visual-regression';
// eslint-disable-next-line import/no-extraneous-dependencies
import type { Page, Locator } from '@playwright/test';
import {
  EditorDecisionModel,
  EditorNodeContainerModel,
  EditorPageModel,
} from '@af/editor-libra/page-models';

import { CONTENT_AREA_TEST_ID } from '../../../ui/Appearance/FullPage/FullPageContentArea';

import { EditorWithDecision } from './decision.fixtures';

snapshotInformational(EditorWithDecision, {
  description: 'Descision selected styles',
  selector: {
    byTestId: CONTENT_AREA_TEST_ID,
  },
  prepare: async (page: Page, component: Locator) => {
    const editor = await EditorPageModel.from({ page });
    const nodes = EditorNodeContainerModel.from(editor);
    const decision = EditorDecisionModel.from(nodes.decisionList);
    await decision.selectItem(0);
  },
});

snapshotInformational(EditorWithDecision, {
  description: 'Descision selected styles when clicked on',
  selector: {
    byTestId: CONTENT_AREA_TEST_ID,
  },
  prepare: async (page: Page, component: Locator) => {
    const editor = await EditorPageModel.from({ page });
    const nodes = EditorNodeContainerModel.from(editor);
    const decision = EditorDecisionModel.from(nodes.decisionList);
    const decisionItem = await decision.getItem(0);
    const boundingBox = await decisionItem.boundingBox();
    await page.mouse.click(boundingBox!.x, boundingBox!.y);
  },
});
