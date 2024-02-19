// eslint-disable-next-line import/no-extraneous-dependencies -- Removed import for fixing circular dependencies
import { waitForMediaToBeLoaded } from '@atlaskit/editor-test-helpers/page-objects/media';
// eslint-disable-next-line import/no-extraneous-dependencies -- Removed import for fixing circular dependencies
import {
  initFullPageEditorWithAdf,
  snapshot,
} from '@atlaskit/editor-test-helpers/vr-utils/base-utils';
// eslint-disable-next-line import/no-extraneous-dependencies -- Removed import for fixing circular dependencies
import { Device } from '@atlaskit/editor-test-helpers/vr-utils/device-viewport';

import * as layoutsAndWidths from './__fixtures__/layouts-and-widths-adf.json';
import * as nestedMedia from './__fixtures__/nested-media.adf.json';

// FIXME: This is failing in master-publish pipeline: https://bitbucket.org/atlassian/atlassian-frontend/pipelines/results/2440494/steps/%7B7c2a0f37-ea6f-4ffc-8a60-a5a7868dac4c%7D
describe.skip('Snapshot Test: Media', () => {
  describe('full page editor', () => {
    it('display media with correct layouts and widths', async () => {
      const { page } = global;

      await initFullPageEditorWithAdf(
        page,
        layoutsAndWidths,
        Device.LaptopHiDPI,

        // viewport size to cover whole document
        //
        // can't use .ak-editor-content-area selector
        // in snapshot, because that cuts off wide and full-width images
        { width: 1440, height: 9200 },
      );

      await waitForMediaToBeLoaded(page);
      await snapshot(page);
    });

    it('set max width to media when inside nested in nodes like layouts', async () => {
      const { page } = global;

      await initFullPageEditorWithAdf(page, nestedMedia, Device.LaptopHiDPI, {
        width: 1440,
        height: 900,
      });

      await waitForMediaToBeLoaded(page);
      await snapshot(page);
    });
  });
});
