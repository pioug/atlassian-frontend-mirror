import { InProductTestCase } from '@atlaskit/in-product-testing';
import {
  EmbedCardPageObject,
  embedSmartLinkRendersTestCase,
} from '@atlaskit/smart-card/in-product';

import { EditorPageObject } from '../../../../page-objects/Editor';
import { EditorSmartLinkPageObject } from '../../../../page-objects/EditorSmartLink';
import { SmartLinkTestCaseOpts } from '../types';

export const editEmbedSmartLinkTitleTestCase = ({
  ui,
  url,
}: SmartLinkTestCaseOpts) =>
  new InProductTestCase({
    title: 'editing an Embed Smart Link renders as Blue Link (title)',
    id: 'embed-smart-link-edit-title',
    assertions: (cy) => {
      const editor = new EditorPageObject(cy);
      const editorWithSmartLinks = new EditorSmartLinkPageObject(cy, editor);
      const embedCard = new EmbedCardPageObject(cy);

      editorWithSmartLinks.insertSmartLinkByTyping(url);
      editorWithSmartLinks.switchAfterInsert('embed');
      embedSmartLinkRendersTestCase({ url }).assertions(cy);

      editorWithSmartLinks.changeLinkLabel(
        'Avocorne is watching you 🥑',
        'embed',
      );
      embedCard.assertHrefRendered(url);
      embedCard.expectCardNotExists();

      if (ui?.publishButton) {
        const renderer = editor.publish(ui);
        renderer.expectContentReady();
        embedCard.assertHrefRendered(url);
        embedCard.expectCardNotExists();
      }
    },
  });

export const editEmbedSmartLinkUrlTestCase = ({
  ui,
  url,
}: SmartLinkTestCaseOpts) =>
  new InProductTestCase({
    title: 'editing an Embed Smart Link renders as Blue Link (URL)',
    id: 'embed-smart-link-edit',
    assertions: (cy) => {
      const editor = new EditorPageObject(cy);
      const editorWithSmartLinks = new EditorSmartLinkPageObject(cy, editor);
      const embedCard = new EmbedCardPageObject(cy);

      editorWithSmartLinks.insertSmartLinkByTyping(url);
      editorWithSmartLinks.switchAfterInsert('embed');
      embedSmartLinkRendersTestCase({ url }).assertions(cy);

      const newUrl = 'https://avo.corne.com';
      editorWithSmartLinks.changeLinkUrl(newUrl, 'embed');
      embedCard.expectCardNotExists();
      embedCard.assertHrefRendered(newUrl);

      if (ui?.publishButton) {
        const renderer = editor.publish(ui);
        renderer.expectContentReady();
        embedCard.assertHrefRendered(newUrl);
        embedCard.expectCardNotExists();
      }
    },
  });
