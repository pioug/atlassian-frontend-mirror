// eslint-disable-next-line import/no-extraneous-dependencies -- Removed import for fixing circular dependencies
import { waitForMediaToBeLoaded } from '@atlaskit/editor-test-helpers/page-objects/media';
// eslint-disable-next-line import/no-extraneous-dependencies -- Removed import for fixing circular dependencies
import {
  Appearance,
  initEditorWithAdf,
  snapshot,
} from '@atlaskit/editor-test-helpers/vr-utils/base-utils';
import type { PuppeteerPage } from '@atlaskit/visual-regression/helper';

import type { EditorProps } from '../../../types/editor-props';

export async function _getCopyButtonTestSuite({
  nodeName,
  editorOptions,
  nodeSelector,
  copyButtonText = 'Copy',
}: {
  nodeName: string;
  editorOptions: EditorProps;
  nodeSelector: string;
  copyButtonText?: string;
}) {
  // FIXME: This is failing in master-publish pipeline: https://bitbucket.org/atlassian/atlassian-frontend/pipelines/results/2440494/steps/%7B7c2a0f37-ea6f-4ffc-8a60-a5a7868dac4c%7D
  const describeFn = nodeName === 'Hyperlink' ? describe.skip : describe;
  describeFn(`Floating toolbar copy button: [${nodeName}]: `, () => {
    let page: PuppeteerPage;

    const copyButtonSelector = `button[aria-label="${copyButtonText}"]`;

    beforeAll(() => {
      page = global.page;
    });

    afterEach(async () => {
      await snapshot(page);
    });

    beforeEach(async () => {
      await initEditorWithAdf(page, {
        adf: editorOptions.defaultValue,
        appearance: Appearance.fullPage,
        viewport: { width: 1040, height: 400 },
        editorProps: {
          ...editorOptions,
        },
      });
    });

    it.skip('target node displays blue border when copy button is hovered', async () => {
      await page.waitForSelector(nodeSelector);
      await page.click(nodeSelector);
      await page.waitForSelector(copyButtonSelector);
      await page.hover(copyButtonSelector);
      if (nodeName === 'Media') {
        await waitForMediaToBeLoaded(page);
      }
    });
  });
}
