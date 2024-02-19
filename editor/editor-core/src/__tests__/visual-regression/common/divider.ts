// eslint-disable-next-line import/no-extraneous-dependencies -- Removed import for fixing circular dependencies
import {
  initFullPageEditorWithAdf,
  snapshot,
} from '@atlaskit/editor-test-helpers/vr-utils/base-utils';
// eslint-disable-next-line import/no-extraneous-dependencies -- Removed import for fixing circular dependencies
import { Device } from '@atlaskit/editor-test-helpers/vr-utils/device-viewport';
import type { PuppeteerPage } from '@atlaskit/visual-regression/helper';

import * as adfWithDivider from './__fixtures__/divider.adf.json';

// FIXME: This is failing in master-publish pipeline: https://bitbucket.org/atlassian/atlassian-frontend/pipelines/results/2440494/steps/%7B7c2a0f37-ea6f-4ffc-8a60-a5a7868dac4c%7D
describe.skip('Snapshot Test: Divider', () => {
  let page: PuppeteerPage;
  beforeAll(() => {
    page = global.page;
  });

  test('should render the divider node properly', async () => {
    await initFullPageEditorWithAdf(page, adfWithDivider, Device.LaptopMDPI);

    await snapshot(page);
  });
});
