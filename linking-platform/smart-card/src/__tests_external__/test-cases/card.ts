import { InProductTestCase } from '@atlaskit/in-product-testing';

import { BlockCardPageObject } from '../page-objects/BlockCard';

import { SmartLinkTestCaseOpts } from './types';

export const blockSmartLinkRendersTestCase = ({
  url,
  status = 'resolved',
}: SmartLinkTestCaseOpts) =>
  new InProductTestCase({
    title: 'Block Smart Link is visible in the resolved state',
    id: 'block-smart-link-resolved',
    assertions: (cy) => {
      const blockCard = new BlockCardPageObject(cy);
      blockCard.assertHrefRendered(url);
      blockCard.expectCardReady(1, status);
    },
  });
