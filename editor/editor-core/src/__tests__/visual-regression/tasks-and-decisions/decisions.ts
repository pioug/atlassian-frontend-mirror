// eslint-disable-next-line import/no-extraneous-dependencies -- Removed import for fixing circular dependencies
import {
  initFullPageEditorWithAdf,
  snapshot,
} from '@atlaskit/editor-test-helpers/vr-utils/base-utils';
// eslint-disable-next-line import/no-extraneous-dependencies -- Removed import for fixing circular dependencies
import { Device } from '@atlaskit/editor-test-helpers/vr-utils/device-viewport';

import * as adjacentDecisionsAdf from './__fixtures__/adjacent-decisions-adf.json';

// FIXME: This is failing in master-publish pipeline: https://bitbucket.org/atlassian/atlassian-frontend/pipelines/results/2440494/steps/%7B7c2a0f37-ea6f-4ffc-8a60-a5a7868dac4c%7D
describe.skip('decisions', () => {
  it('adjacent', async () => {
    const { page } = global;
    await initFullPageEditorWithAdf(
      page,
      adjacentDecisionsAdf,
      Device.LaptopMDPI,
    );
    await snapshot(page);
  });
});
