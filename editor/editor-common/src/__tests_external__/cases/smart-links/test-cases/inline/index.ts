import { InProductTestCollection } from '@atlaskit/in-product-testing';

import { SmartLinkTestCaseOpts } from '../types';

import { deleteInlineSmartLinkTestCase } from './delete';
import {
  editInlineSmartLinkTitleTestCase,
  editInlineSmartLinkUrlTestCase,
} from './edit';
import { insertInlineSmartLinkTestCase } from './insert';
import { unlinkInlineSmartLinkTestCase } from './unlink';

export const inlineSmartLinksTestCollection = (opts: SmartLinkTestCaseOpts) =>
  new InProductTestCollection({
    title: '@atlaskit/editor-core -> Inline Smart Links, happy paths',
    testCases: [
      insertInlineSmartLinkTestCase(opts),
      editInlineSmartLinkTitleTestCase(opts),
      editInlineSmartLinkUrlTestCase(opts),
      unlinkInlineSmartLinkTestCase(opts),
      deleteInlineSmartLinkTestCase(opts),
    ],
  });
