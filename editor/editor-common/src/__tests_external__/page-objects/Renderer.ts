import { InProductTestPageObject } from '@atlaskit/in-product-testing';

export class RendererPageObject extends InProductTestPageObject {
  public getContent() {
    return this.cy.get('.ak-renderer-document');
  }

  public expectContentReady() {
    return this.cy.get('.ak-renderer-document').should('be.visible');
  }

  public expectMediaSingleRenders(numOfMedia: number) {
    return this.cy
      .get('.rich-media-item')
      .should('have.length', numOfMedia)
      .each((element) => {
        this.cy
          .wrap(element)
          .should('have.attr', 'data-layout', 'center')
          .should('have.attr', 'data-node-type', 'mediaSingle')
          .should('be.visible');
      });
  }
}
