import { InProductTestCollection } from '@atlaskit/in-product-testing';

import { SmartLinkTestCaseOpts } from '../types';

import { deleteEmbedSmartLinkTestCase } from './delete';
import {
  editEmbedSmartLinkTitleTestCase,
  editEmbedSmartLinkUrlTestCase,
} from './edit';
import { switchToEmbedSmartLinkTestCase } from './insert';

export const embedSmartLinksTestCollection = (opts: SmartLinkTestCaseOpts) =>
  new InProductTestCollection({
    title: '@atlaskit/editor-core -> Embed Smart Links, happy paths',
    testCases: [
      switchToEmbedSmartLinkTestCase(opts),
      editEmbedSmartLinkTitleTestCase(opts),
      editEmbedSmartLinkUrlTestCase(opts),
      deleteEmbedSmartLinkTestCase(opts),
    ],
  });
