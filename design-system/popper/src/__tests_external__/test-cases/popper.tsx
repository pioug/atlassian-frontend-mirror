import { CypressType, InProductTestCase } from '@atlaskit/in-product-testing';

import { BasePopperPageObject } from '../page-objects/base-popper';

export const popperRendersTestCase = (
  elementSelector: keyof HTMLElementTagNameMap | string,
) =>
  new InProductTestCase({
    title: 'Popped container renders with position fixed',
    id: 'popped-container-fixed-position',
    assertions: (cy: CypressType) => {
      const popperElement = new BasePopperPageObject(cy);

      popperElement.assertPopperStyle(elementSelector);
    },
  });
