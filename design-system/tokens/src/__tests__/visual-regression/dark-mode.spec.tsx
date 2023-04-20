import {
  getExampleUrl,
  loadPage,
  takeElementScreenShot,
} from '@atlaskit/visual-regression/helper';
import { ffTest } from '@atlassian/feature-flags-test-utils';

// eslint-disable-next-line @atlaskit/platform/ensure-feature-flag-prefix
ffTest('design-system-team.dark-theme-iteration_dk1ln', async () => {
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
