export class RendererPageObject {
  constructor(private cy: Cypress.cy) {}

  public getRenderedContent() {
    return this.cy.get('.ak-renderer-document');
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
