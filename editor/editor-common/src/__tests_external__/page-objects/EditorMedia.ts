import {
  CypressType,
  InProductTestPageObject,
} from '@atlaskit/in-product-testing';
import { MediaCardPageObject } from '@atlaskit/media-card/in-product';

export class EditorMediaPageObject extends InProductTestPageObject {
  constructor(protected cy: CypressType) {
    super(cy);
  }

  testIds = {
    altTextButton: 'alt-text-edit-button',
    altTextInput: 'alt-text-input',
    captionPlaceholder: 'caption-placeholder',
    caption: 'media-caption',
  };

  public addAltTextToImage(altText: string, cardNumber = 1) {
    const mediaCard = new MediaCardPageObject(this.cy);

    mediaCard.findCardNth(cardNumber).click();
    this.getAltTextButton().click();
    this.getAltTextInput().type(`${altText}{enter}`);
  }

  public addCaptionToImage(captionText: string, cardNumber = 1) {
    const mediaCard = new MediaCardPageObject(this.cy);

    mediaCard.findCardNth(cardNumber).click();
    this.getCaptionInput().type(`${captionText}{enter}`);
  }

  public assertCaptionText(captionText: string) {
    return this.cy
      .get(this.toTestId(this.testIds.caption))
      .should('have.text', captionText);
  }

  public assertAltText(altText: string) {
    return this.cy
      .get('.mediaView-content-wrap')
      .should('have.attr', 'alt', altText);
  }

  private getAltTextButton() {
    return this.cy
      .get(this.toTestId(this.testIds.altTextButton))
      .should('be.visible');
  }
  private getAltTextInput() {
    return this.cy
      .get(this.toTestId(this.testIds.altTextInput))
      .should('be.visible');
  }

  private getCaptionInput() {
    return this.cy
      .get(this.toTestId(this.testIds.captionPlaceholder))
      .should('be.visible');
  }
}
