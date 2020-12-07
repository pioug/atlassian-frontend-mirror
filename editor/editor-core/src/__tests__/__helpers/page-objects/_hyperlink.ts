import { WebDriverPage } from './_types';
import { copyToClipboard } from '../../integration/_helpers';

export const hyperlinkSelectors = {
  linkInput: '[data-testid="link-url"]',
  textInput: '[data-testid="link-label"]',
  floatingToolbar: '[aria-label="Hyperlink floating controls"]',
  editLinkBtn: '[aria-label="Edit link"]',
  clearLinkBtn: '[aria-label="Clear link"]',
  unlinkBtn: '[aria-label="Unlink"]',
  hyperlink: '.ProseMirror a',
};

export const copyHyperlink = async (
  page: WebDriverPage,
  link: string,
  text?: string,
) => {
  await copyToClipboard(
    page,
    `<a href="${link}">${text !== undefined ? text : link}</a>`,
    'html',
  );
};
