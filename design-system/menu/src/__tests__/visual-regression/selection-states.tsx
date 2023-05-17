import {
  getExampleUrl,
  loadPage,
  takeElementScreenShot,
} from '@atlaskit/visual-regression/helper';
import { ffTest } from '@atlassian/feature-flags-test-utils';

describe('section state snapshots', () => {
  ffTest(
    'platform.design-system-team.menu-selected-state-change_0see9',
    async () => {
      const url = getExampleUrl(
        'design-system',
        'menu',
        'selection-states',
        undefined,
        'light',
      );
      const { page } = global;

      await loadPage(page, url);

      const image = await takeElementScreenShot(
        page,
        '[data-testid="example"]',
      );
      expect(image).toMatchProdImageSnapshot();
    },
  );
});
