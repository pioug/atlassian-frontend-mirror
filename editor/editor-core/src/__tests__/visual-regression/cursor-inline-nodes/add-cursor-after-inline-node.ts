import { Appearance, initEditorWithAdf, snapshot } from '../_utils';
import { PuppeteerPage } from '@atlaskit/visual-regression/helper';
import { adfs } from './__fixtures__/inline-nodes';
import {
  animationFrame,
  getBoundingRect,
} from '../../__helpers/page-objects/_editor';

const initEditor = async (_adf: Object, page: PuppeteerPage) =>
  initEditorWithAdf(page, {
    adf: _adf,
    appearance: Appearance.fullPage,
    editorProps: {
      featureFlags: {
        displayInlineBlockForInlineNodes: true,
      },
    },
  });

describe('Cursor/status:', () => {
  let page: PuppeteerPage;
  beforeEach(async () => {
    page = global.page;
  });

  describe.each(['status', 'emoji', 'inlineExtension', 'mention', 'date'])(
    'when mouse is clicked after the %s node and the backspace key is pressed',
    (inlineNode) => {
      it('should delete the inline node', async () => {
        const adfWithInlineNode = adfs[inlineNode];
        await initEditor(adfWithInlineNode, page);

        await animationFrame(page);

        const FIRST_LIST_ITEM = '.ProseMirror ul li:nth-child(1)';
        await page.waitForSelector(FIRST_LIST_ITEM);

        // Get the first task item with the status node
        const bounds = await getBoundingRect(page, FIRST_LIST_ITEM);

        // Click after the inline node
        const x = bounds.left + Math.ceil(bounds.width / 2);
        const y = bounds.top + 1;
        await page.mouse.click(x, y);
        await animationFrame(page);

        // try to delete the inline node
        await page.keyboard.press('Backspace');

        await snapshot(page, {}, '.ProseMirror ul');
      });
    },
  );
});
