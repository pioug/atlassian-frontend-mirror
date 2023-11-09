import { snapshotInformational } from '@af/visual-regression';
// eslint-disable-next-line import/no-extraneous-dependencies
import type { Page } from '@playwright/test';
import {
  EditorBreakoutModel,
  EditorLayoutModel,
  EditorNodeContainerModel,
  EditorPageModel,
} from '@af/editor-libra/page-models';

import { CONTENT_AREA_TEST_ID } from '../../../ui/Appearance/FullPage/FullPageContentArea';

import { EditorWithBeakout } from './breakout.fixtures';

snapshotInformational(EditorWithBeakout, {
  description: 'Display breakout button',
  selector: {
    byTestId: CONTENT_AREA_TEST_ID,
  },
  prepare: async (page: Page) => {
    const editor = await EditorPageModel.from({ page });
    const nodes = EditorNodeContainerModel.from(editor);
    const breakout = EditorBreakoutModel.from(editor);
    const layout = EditorLayoutModel.from(nodes.layout);
    await layout.focusColumn(0);
    await breakout.toWide();
  },
});
