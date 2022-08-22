import { getURL, setup } from '../__utils__/vr-helpers';
import { MAX_MODAL_SIZE } from '../../view/EmbedModal/constants';

describe('EmbedModal', () => {
  const render = async () => {
    const height = 550;
    const width = 1200;
    const clip = { x: 0, y: 0, width, height };

    const url = getURL('vr-embed-modal');
    const page = await setup(url);
    await page.setViewport({ width, height });
    await page.waitForSelector('[data-testid="vr-test"]');

    return { clip, page };
  };

  it('renders', async () => {
    const { clip, page } = await render();
    const image = await page.screenshot({ clip });
    expect(image).toMatchProdImageSnapshot();
  });

  it('expands to max size', async () => {
    const { clip, page } = await render();
    await page.click('[data-testid="vr-test-resize-button"]');
    await page.waitForSelector(
      `[style*="--modal-dialog-width:${MAX_MODAL_SIZE};"]`,
    );
    const image = await page.screenshot({ clip });
    expect(image).toMatchProdImageSnapshot();
  });
});
