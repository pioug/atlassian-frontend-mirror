import {
  getDynamicMobileTestCase,
  DynamicMobileTestSuite,
  MobileTestCase,
} from '@atlaskit/webdriver-runner/runner';
import Page from '@atlaskit/webdriver-runner/wd-app-wrapper';
import {
  loadEditor,
  focusOnWebView,
} from '../../_page-objects/hybrid-editor-page';

import { doc, p } from '@atlaskit/editor-test-helpers/doc-builder';
import placeholderAdf from '../../__fixtures__/placeholder.adf.json';
import { setADFContent, getADFContent } from '../../_utils/afe-app-helpers';
import { callNativeBridge } from '../../../integration/_utils';
import sampleSchema from '@atlaskit/editor-test-helpers/schema';
import { Node } from '@atlaskit/editor-prosemirror/model';

type TestName = 'Placeholder - editing';

const placeholderTestSuite: DynamicMobileTestSuite<TestName> = async ({
  skipTests,
}) => {
  const DynamicMobileTestCase = getDynamicMobileTestCase({
    TestCase: MobileTestCase,
    skipTests,
  });

  DynamicMobileTestCase(
    'Placeholder - editing',
    {},
    async (client: any, testName: string) => {
      const page = await Page.create(client);
      await loadEditor(page);
      await setADFContent(page, placeholderAdf);
      await focusOnWebView(page);

      const selection = {
        selection: { type: 'text', anchor: 1, head: 1 },
        rect: { top: 0, left: 0 },
      };

      await callNativeBridge(page, 'setSelection', JSON.stringify(selection));

      await page.tapKeys('lol');

      const adfContent = await getADFContent(page);
      const pmDocument = Node.fromJSON(sampleSchema, adfContent);
      expect(pmDocument).toEqualDocument(
        doc(p('lol'), p('normal text'), p('')),
      );
    },
  );
};

export default placeholderTestSuite;
