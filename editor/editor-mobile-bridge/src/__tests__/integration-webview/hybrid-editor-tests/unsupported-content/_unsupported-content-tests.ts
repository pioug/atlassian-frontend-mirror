import { MobileTestCase } from '@atlaskit/webdriver-runner/runner';
import Page from '@atlaskit/webdriver-runner/wd-app-wrapper';

import { setADFContent } from '../../_utils/afe-app-helpers';
import {
  isLozengeTooltipVisible,
  isBlockLozengeVisible,
  isInlineLozengeVisible,
  loadEditor,
} from '../../_page-objects/hybrid-editor-page';
import { invalidBlockAdf } from '../../__fixtures__/invalid-block-node-adf';
import { invalidInlineAdf } from '../../__fixtures__/invalid-inline-node-adf';
import {
  BLOCK_UNSUPPORTED_CONTENT,
  INLINE_UNSUPPORTED_CONTENT,
} from '../../_utils/test-data';

export default async () => {
  MobileTestCase(
    `Unsupported Content - Block node: Users can see a Lozenge with error message and a '?' with tooltip when the page contains unsupported content`,
    {},
    async (client: any, testName: string) => {
      const page = await Page.create(client);
      await loadEditor(page);
      await setADFContent(page, invalidBlockAdf);

      expect(
        (await isBlockLozengeVisible(page)) &&
          (await isLozengeTooltipVisible(page, BLOCK_UNSUPPORTED_CONTENT)),
      ).toBeTruthy();
    },
  );

  MobileTestCase(
    `Unsupported Content - Inline node: Users can see a Lozenge with text and a '?' with tooltip when the page contains unsupported content`,
    {},
    async (client: any, testName: string) => {
      const page = await Page.create(client);
      await loadEditor(page);
      await setADFContent(page, invalidInlineAdf);

      expect(
        (await isInlineLozengeVisible(page)) &&
          (await isLozengeTooltipVisible(page, INLINE_UNSUPPORTED_CONTENT)),
      ).toBeTruthy();
    },
  );
};
