import { InProductTestCase } from '@atlaskit/in-product-testing';
import {
  InlineCardPageObject,
  inlineSmartLinkRendersTestCase,
} from '@atlaskit/smart-card/in-product';

import { EditorPageObject } from '../../../../page-objects/Editor';
import { EditorSmartLinkPageObject } from '../../../../page-objects/EditorSmartLink';
import { SmartLinkTestCaseOpts } from '../types';

export const editInlineSmartLinkTitleTestCase = ({
  ui,
  url,
}: SmartLinkTestCaseOpts) =>
  new InProductTestCase({
    title: 'editing an Inline Smart Link renders as Blue Link (title)',
    id: 'inline-smart-link-edit-title',
    assertions: (cy) => {
      const editor = new EditorPageObject(cy);
      const editorWithSmartLinks = new EditorSmartLinkPageObject(cy, editor);
      const inlineCard = new InlineCardPageObject(cy);

      editorWithSmartLinks.insertSmartLinkByTyping(url);
      inlineSmartLinkRendersTestCase({ url }).assertions(cy);

      editorWithSmartLinks.changeLinkLabel('Avocorne is watching you 🥑');
      inlineCard.assertHrefRendered(url);
      inlineCard.expectCardNotExists();

      if (ui?.publishButton) {
        const renderer = editor.publish(ui);
        renderer.expectContentReady();
        inlineCard.assertHrefRendered(url);
        inlineCard.expectCardNotExists();
      }
    },
  });

export const editInlineSmartLinkUrlTestCase = ({
  ui,
  url,
}: SmartLinkTestCaseOpts) =>
  new InProductTestCase({
    title: 'editing an Inline Smart Link renders as Blue Link (URL)',
    id: 'inline-smart-link-edit',
    assertions: (cy) => {
      const editor = new EditorPageObject(cy);
      const editorWithSmartLinks = new EditorSmartLinkPageObject(cy, editor);
      const inlineCard = new InlineCardPageObject(cy);

      editorWithSmartLinks.insertSmartLinkByTyping(url);
      inlineSmartLinkRendersTestCase({ url }).assertions(cy);

      const newUrl = 'https://avo.corne.com';
      editorWithSmartLinks.changeLinkUrl(newUrl);
      inlineCard.expectCardNotExists();
      inlineCard.assertHrefRendered(newUrl);

      if (ui?.publishButton) {
        const renderer = editor.publish(ui);
        renderer.expectContentReady();
        inlineCard.assertHrefRendered(newUrl);
        inlineCard.expectCardNotExists();
      }
    },
  });
