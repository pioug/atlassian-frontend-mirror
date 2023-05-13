import {
  getExampleUrl,
  loadPage,
  takeElementScreenShot,
} from '@atlaskit/visual-regression/helper';
import { ffTest } from '@atlassian/feature-flags-test-utils';
describe('border.input: Neutral600 | DarkNeutral600', () => {
  ffTest('platform.design-system-team.update-border-input_ff9l1', async () => {
    const url = getExampleUrl(
      'design-system',
      'tokens',
      'color-roles',
      global.__BASEURL__,
      'light',
    );
    await loadPage(global.page, url);
    const image = await takeElementScreenShot(
      global.page,
      '[data-testid="tokens"]',
    );
    expect(image).toMatchProdImageSnapshot();
  });
  ffTest('platform.design-system-team.update-border-input_ff9l1', async () => {
    const url = getExampleUrl(
      'design-system',
      'tokens',
      'color-roles',
      global.__BASEURL__,
      'dark',
    );
    await loadPage(global.page, url);
    const image = await takeElementScreenShot(
      global.page,
      '[data-testid="tokens"]',
    );
    expect(image).toMatchProdImageSnapshot();
  });
});
