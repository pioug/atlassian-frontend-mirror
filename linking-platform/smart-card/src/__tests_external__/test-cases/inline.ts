import { InProductTestCase } from '@atlaskit/in-product-testing';

import { InlineCardPageObject } from '../page-objects/InlineCard';

import { SmartLinkTestCaseOpts } from './types';

export const inlineSmartLinkRendersTestCase = ({
  url,
  status = 'resolved',
}: SmartLinkTestCaseOpts) =>
  new InProductTestCase({
    title: 'Inline Smart Link is visible in the resolved state',
    id: 'inline-smart-link-resolved',
    assertions: (cy) => {
      const inlineCard = new InlineCardPageObject(cy);
      inlineCard.assertHrefRendered(url);
      inlineCard.expectCardReady(1, status);
    },
  });
