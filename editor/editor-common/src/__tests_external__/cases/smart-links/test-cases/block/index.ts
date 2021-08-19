import { InProductTestCollection } from '@atlaskit/in-product-testing';

import { SmartLinkTestCaseOpts } from '../types';

import { deleteBlockSmartLinkTestCase } from './delete';
import {
  editBlockSmartLinkTitleTestCase,
  editBlockSmartLinkUrlTestCase,
} from './edit';
import { switchToBlockSmartLinkTestCase } from './insert';

export const blockSmartLinksTestCollection = (opts: SmartLinkTestCaseOpts) =>
  new InProductTestCollection({
    title: '@atlaskit/editor-core -> Block Smart Links, happy paths',
    testCases: [
      switchToBlockSmartLinkTestCase(opts),
      editBlockSmartLinkTitleTestCase(opts),
      editBlockSmartLinkUrlTestCase(opts),
      deleteBlockSmartLinkTestCase(opts),
    ],
  });
