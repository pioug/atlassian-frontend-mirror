import { InProductTestCollection } from '@atlaskit/in-product-testing';

import { SmartLinkTestCaseOpts } from '../types';

import { switchToUrlTestCase } from './insert';

export const blueLinksTestCollection = (opts: SmartLinkTestCaseOpts) =>
  new InProductTestCollection({
    title: '@atlaskit/editor-core -> Blue Links, happy paths',
    testCases: [switchToUrlTestCase(opts)],
  });
