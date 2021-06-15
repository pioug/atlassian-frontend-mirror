// complains about devDependencies instead of dependencies
// eslint-disable-next-line import/no-extraneous-dependencies
import { cy } from 'local-cypress';

export class MediaCardPageObject {
  constructor(private cy: Cypress.cy) {}

  public expectCardReady(numOfCards: number) {
    return this.cy
      .get('[data-test-media-name]')
      .should('have.length', numOfCards)
      .each((element) => {
        cy.wrap(element)
          // NOTE: `be.visible` is used to ensure the file is still visible
          // whilst it is being uploaded.
          .should('be.visible')
          .should('have.attr', 'data-test-status', 'complete');
      });
  }

  public findCardNth(nth: number) {
    return this.cy
      .get('[data-test-media-name][data-test-status="complete"]')
      .should('have.length.at.least', nth)
      .should('be.visible')
      .eq(nth - 1);
  }
}
