import { CypressType } from '@atlaskit/in-product-testing';

import { BaseCardPageObject } from './BaseCard';

export class EmbedCardPageObject extends BaseCardPageObject {
  public constructor(protected cy: CypressType) {
    super(cy, 'embed');
  }
}
