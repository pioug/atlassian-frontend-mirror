import { InProductTestPageObject } from '@atlaskit/in-product-testing';

export class BasePopperPageObject extends InProductTestPageObject {
  public assertPopperStyle(
    elementSelector: keyof HTMLElementTagNameMap | string,
  ) {
    return this.cy.get(elementSelector).should('be.visible');
  }
}
