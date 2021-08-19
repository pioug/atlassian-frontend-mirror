import {
  CypressType,
  InProductTestPageObject,
} from '@atlaskit/in-product-testing';
import { CardAppearance } from '@atlaskit/smart-card';
import {
  BlockCardPageObject,
  EmbedCardPageObject,
  InlineCardPageObject,
} from '@atlaskit/smart-card/in-product';

import { EditorPageObject } from './Editor';

export class EditorSmartLinkPageObject extends InProductTestPageObject {
  constructor(protected cy: CypressType, private editor: EditorPageObject) {
    super(cy);
  }

  testIds = {
    viewSwitcher: 'link-toolbar-appearance-button',
    displayUrlOption: 'url-appearance',
    displayInlineOption: 'inline-appearance',
    displayCardOption: 'block-appearance',
    displayEmbedOption: 'embed-appearance',
    linkUrl: 'link-url',
    linkLabel: 'link-label',
  };
  ariaLabels = {
    editLink: 'Edit link',
    deleteLink: 'Remove',
    unlinkLink: 'Unlink',
  };

  private getViewSwitcher() {
    return this.cy.get(this.toTestId(this.testIds.viewSwitcher));
  }

  public openViewSwitcher() {
    return this.getViewSwitcher().click();
  }

  private getViewSwitcherOption(type: CardAppearance | 'url' = 'inline') {
    switch (type) {
      case 'url': {
        return this.cy.get(this.toTestId(this.testIds.displayUrlOption));
      }
      case 'inline': {
        return this.cy.get(this.toTestId(this.testIds.displayInlineOption));
      }
      case 'block': {
        return this.cy.get(this.toTestId(this.testIds.displayCardOption));
      }
      case 'embed': {
        return this.cy.get(this.toTestId(this.testIds.displayEmbedOption));
      }
      default: {
        throw Error(
          `Attempted to switch to \`${type}\`: unknown Smart Link view switcher option!`,
        );
      }
    }
  }

  public selectViewSwitcherOption(type: CardAppearance | 'url' = 'inline') {
    const viewSwitcherOption = this.getViewSwitcherOption(type);
    return viewSwitcherOption.click();
  }

  public insertSmartLinkByTyping(url: string) {
    return this.editor
      .getEditorArea()
      .focus()
      .type(`${url} {enter}`, { delay: 0 });
  }

  public switchAfterInsert(type: CardAppearance | 'url' = 'inline') {
    // NOTE: inline inserted by default for all Smart Links.
    const inlineCard = new InlineCardPageObject(this.cy);
    inlineCard.click();
    this.openViewSwitcher();
    this.selectViewSwitcherOption(type);
  }

  private getSmartLink(type: CardAppearance | 'url' = 'inline') {
    switch (type) {
      case 'inline': {
        return new InlineCardPageObject(this.cy);
      }
      case 'block': {
        return new BlockCardPageObject(this.cy);
      }
      case 'embed': {
        return new EmbedCardPageObject(this.cy);
      }
      case 'url': {
        return new InlineCardPageObject(this.cy);
      }
    }
  }

  public getEditLinkButton() {
    return this.cy.get(this.toAriaLabel(this.ariaLabels.editLink));
  }

  public openEditLinkMenu() {
    const button = this.getEditLinkButton();
    return button.click();
  }

  public changeLinkLabel(
    title: string,
    type: CardAppearance | 'url' = 'inline',
  ) {
    const smartLink = this.getSmartLink(type);
    smartLink.click();
    this.openEditLinkMenu();
    this.typeIntoLabelField(title);
  }

  public changeLinkUrl(url: string, type: CardAppearance | 'url' = 'inline') {
    this.getSmartLink(type).click();
    this.openEditLinkMenu();
    this.typeIntoUrlField(url);
  }

  private typeIntoLabelField(title: string) {
    const titleField = this.cy
      .get(this.toTestId(this.testIds.linkLabel))
      .focus();
    titleField.clear();
    titleField.type(`${title}{enter}`, { delay: 0 });
  }
  private typeIntoUrlField(url: string) {
    const urlField = this.cy.get(this.toTestId(this.testIds.linkUrl)).focus();
    urlField.clear();
    urlField.type(`${url}{enter}`, { delay: 0 });
  }

  public deleteSmartLink(type: CardAppearance | 'url' = 'inline') {
    this.getSmartLink(type).click();
    this.clickDeleteIcon();
  }
  private clickDeleteIcon() {
    const ariaLabelSelector = this.toAriaLabel(this.ariaLabels.deleteLink);
    const deleteButtonSelector = `button${ariaLabelSelector}`;
    return this.cy.get(deleteButtonSelector).click();
  }

  public unlink(type: CardAppearance | 'url' = 'inline') {
    this.getSmartLink(type).click();
    this.clickUnlinkIcon();
  }
  private clickUnlinkIcon() {
    const ariaLabelSelector = this.toAriaLabel(this.ariaLabels.unlinkLink);
    const unlinkButtonSelector = `button${ariaLabelSelector}`;
    return this.cy.get(unlinkButtonSelector).click();
  }
}
