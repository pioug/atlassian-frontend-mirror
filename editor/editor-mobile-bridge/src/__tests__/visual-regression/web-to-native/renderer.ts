// eslint-disable-next-line import/no-extraneous-dependencies
import type { PuppeteerPage } from '@atlaskit/visual-regression/helper';
import { renderer } from '../../integration/_utils';

describe('Should test mobile bridge for renderer', () => {
  let page: PuppeteerPage;
  beforeEach(async () => {
    page = global.page;
  });

  it('Calls onContentRendered() on native bridge', async () => {
    await page.goto(renderer.path);
    await page.waitForSelector('.ak-renderer-document', { visible: true });
    const onContentRendererOutput = await page.evaluate(function () {
      const logs = window.logBridge;
      const bridge = 'renderBridge';
      const bridgeFn = 'onContentRendered';
      if (logs[`${bridge}:${bridgeFn}`]) {
        return logs[`${bridge}:${bridgeFn}`];
      }
    });
    expect(onContentRendererOutput).toEqual([{}]);
  });
});
