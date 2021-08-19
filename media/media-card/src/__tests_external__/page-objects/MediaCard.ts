import { InProductTestPageObject } from '@atlaskit/in-product-testing';

export class MediaCardPageObject extends InProductTestPageObject {
  public expectCardReady(numOfCards: number) {
    return this.cy
      .get('[data-test-media-name]')
      .should('have.length', numOfCards)
      .each((element) => {
        this.cy
          .wrap(element)
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

  public findImage(nth: number) {
    return this.cy
      .get(this.toTestId('media-image'))
      .should('have.length.at.least', nth)
      .should('be.visible')
      .eq(nth - 1);
  }

  public assertAltText(altText: string, nth = 1) {
    return this.findImage(nth).should('have.attr', 'alt', altText);
  }
}
