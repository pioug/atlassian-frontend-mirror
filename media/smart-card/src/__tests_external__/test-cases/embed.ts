import { InProductTestCase } from '@atlaskit/in-product-testing';

import { EmbedCardPageObject } from '../page-objects/EmbedCard';

import { SmartLinkTestCaseOpts } from './types';

export const embedSmartLinkRendersTestCase = ({
  url,
  status = 'resolved',
}: SmartLinkTestCaseOpts) =>
  new InProductTestCase({
    title: 'Embed Smart Link is visible in the resolved state',
    id: 'embed-smart-link-resolved',
    assertions: (cy) => {
      const embedCard = new EmbedCardPageObject(cy);
      embedCard.assertHrefRendered(url);
      embedCard.expectCardReady(1, status);
    },
  });
