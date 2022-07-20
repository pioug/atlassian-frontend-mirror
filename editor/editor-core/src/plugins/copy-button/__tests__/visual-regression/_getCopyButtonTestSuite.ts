import {
  PuppeteerPage,
  waitForTooltip,
} from '@atlaskit/visual-regression/helper';
import { EditorProps } from '../../../../types/editor-props';

import {
  snapshot,
  initEditorWithAdf,
  Appearance,
} from '../../../../__tests__/visual-regression/_utils';

const copyButtonSelector = 'button[aria-label="Copy"]';

export async function _getCopyButtonTestSuite({
  nodeName,
  editorOptions,
  nodeSelector,
}: {
  nodeName: string;
  editorOptions: EditorProps;
  nodeSelector: string;
}) {
  describe(`Floating toolbar copy button: [${nodeName}]: `, () => {
    let page: PuppeteerPage;

    beforeAll(() => {
      page = global.page;
    });

    afterEach(async () => {
      await waitForTooltip(page);
      await snapshot(page);
    });

    beforeEach(async () => {
      await initEditorWithAdf(page, {
        adf: editorOptions.defaultValue,
        appearance: Appearance.fullPage,
        viewport: { width: 1040, height: 400 },
        editorProps: {
          featureFlags: {
            floatingToolbarCopyButton: true,
          },
          ...editorOptions,
        },
      });
    });

    it('target node displays blue border when copy button is hovered', async () => {
      await page.waitForSelector(nodeSelector);
      await page.click(nodeSelector);
      await page.waitForSelector(copyButtonSelector);
      await page.hover(copyButtonSelector);
    });
  });
}
