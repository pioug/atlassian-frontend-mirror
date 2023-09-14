import { THEME_MODES } from '@atlaskit/theme/constants';
import type { PuppeteerPage } from '@atlaskit/visual-regression/helper';
// eslint-disable-next-line import/no-extraneous-dependencies -- Removed import for fixing circular dependencies
import { Device } from '@atlaskit/editor-test-helpers/vr-utils/device-viewport';

import * as adfWithDivider from './__fixtures__/divider.adf.json';

// eslint-disable-next-line import/no-extraneous-dependencies -- Removed import for fixing circular dependencies
import {
  initFullPageEditorWithAdf,
  snapshot,
} from '@atlaskit/editor-test-helpers/vr-utils/base-utils';

describe('Snapshot Test: Divider', () => {
  let page: PuppeteerPage;
  beforeAll(() => {
    page = global.page;
  });

  describe.each(THEME_MODES)('Theme: %s', (theme) => {
    test('should render the divider node properly', async () => {
      await initFullPageEditorWithAdf(
        page,
        adfWithDivider,
        Device.LaptopMDPI,
        undefined,
        undefined,
        theme === 'dark' ? 'dark' : 'light',
      );

      await snapshot(page);
    });
  });
});
