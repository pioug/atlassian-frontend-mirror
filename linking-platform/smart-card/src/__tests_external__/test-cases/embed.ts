import { InProductTestCase } from '@atlaskit/in-product-testing';

import { EmbedCardPageObject } from '../page-objects/EmbedCard';

import { SmartLinkTestCaseOpts } from './types';

export const embedSmartLinkRendersTestCase = ({
  status = 'resolved',
}: SmartLinkTestCaseOpts) =>
  new InProductTestCase({
    title: 'Embed Smart Link is visible in the resolved state',
    id: 'embed-smart-link-resolved',
    assertions: (cy) => {
      const embedCard = new EmbedCardPageObject(cy);
      embedCard.expectCardReady(1, status);
    },
  });
