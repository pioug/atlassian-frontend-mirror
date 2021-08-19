import {
  InProductTestPageObject,
  CypressType,
} from '@atlaskit/in-product-testing';

import { CardType } from '../../state/store/types';
import { CardAppearance } from '../../view/Card';

export class BaseCardPageObject extends InProductTestPageObject {
  protected constructor(
    protected cy: CypressType,
    protected appearance: CardAppearance,
  ) {
    super(cy);
  }
  private static CARD_TIMEOUT = 15000;

  private _toSelector(appearance: CardAppearance, status: CardType) {
    const viewSelector = status.replace(/_/g, '-');
    return this.toTestId(`${appearance}-card-${viewSelector}-view`);
  }

  public expectCardReady(
    numOfCards: number = 1,
    status: CardType = 'resolved',
  ) {
    const selector = this._toSelector(this.appearance, status);
    return (
      this.cy
        // NOTE: `timeout` used since Smart Links rely on a network response.
        .get(selector, { timeout: BaseCardPageObject.CARD_TIMEOUT })
        .should('have.length', numOfCards)
        .each((element) => {
          this.cy
            .wrap(element)
            // NOTE: `be.visible` is used to ensure the file is still visible
            // whilst it is being uploaded.
            .should('be.visible');
        })
    );
  }

  public expectCardNotExists(status: CardType = 'resolved') {
    const selector = this._toSelector(this.appearance, status);
    return this.cy.get(selector).should('not.exist');
  }

  public findCardNth(nth: number = 1, status: CardType = 'resolved') {
    const selector = this._toSelector(this.appearance, status);
    return (
      this.cy
        // NOTE: `timeout` used since Smart Links rely on a network response.
        .get(selector, { timeout: BaseCardPageObject.CARD_TIMEOUT })
        .should('have.length.at.least', nth)
        .should('be.visible')
        .eq(nth - 1)
    );
  }

  public assertHrefRendered(url: string) {
    return this.cy
      .get(`a[href="${url}"]`, { timeout: BaseCardPageObject.CARD_TIMEOUT })
      .should('be.visible');
  }
  public assertHrefNotRendered(url: string) {
    return this.cy
      .get(`a[href="${url}"]`, { timeout: BaseCardPageObject.CARD_TIMEOUT })
      .should('not.exist');
  }

  public click(status: CardType = 'resolved') {
    return this.findCardNth(1, status).click();
  }
}
