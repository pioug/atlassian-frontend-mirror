import {
  CypressType,
  InProductTestPageObject,
} from '@atlaskit/in-product-testing';

export class BasePopperPageObject extends InProductTestPageObject {
  constructor(cy: CypressType) {
    super(cy);
  }

  public assertPopperStyle = (
    elementSelector: keyof HTMLElementTagNameMap | string,
  ) => {
    return this.cy.get(elementSelector).should('be.visbile');
  };
}
