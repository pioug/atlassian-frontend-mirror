import { InProductTestPageObject } from '@atlaskit/in-product-testing';

export class RendererPageObject extends InProductTestPageObject {
  public getContent() {
    return this.cy.get('.ak-renderer-document');
  }

  public expectContentReady() {
    return this.cy.get('.ak-renderer-document').should('be.visible');
  }
}
