import { CypressType } from '@atlaskit/in-product-testing';

import { BaseCardPageObject } from './BaseCard';

export class BlockCardPageObject extends BaseCardPageObject {
  public constructor(protected cy: CypressType) {
    super(cy, 'block');
  }
}
