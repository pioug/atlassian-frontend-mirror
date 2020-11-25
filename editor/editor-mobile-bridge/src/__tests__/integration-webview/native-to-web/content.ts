import { MobileTestCase } from '@atlaskit/webdriver-runner/runner';
import Page from '@atlaskit/webdriver-runner/wd-app-wrapper';

import {
  loadEditor,
  getADFContent,
  setADFContent,
} from '../_utils/afe-app-helpers';
import { invalidAdf } from './__fixtures__/invalid-adf';

MobileTestCase(
  `Can properly set content when given invalid nodes`,
  {},
  async (client: any, testName: string) => {
    const page = await Page.create(client);
    await loadEditor(page);

    await setADFContent(page, invalidAdf);
    const adfContent = await getADFContent(page);

    expect(adfContent).toMatchCustomDocSnapshot(testName);
  },
);
