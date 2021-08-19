import { InProductTestCase } from '@atlaskit/in-product-testing';
import {
  BlockCardPageObject,
  blockSmartLinkRendersTestCase,
} from '@atlaskit/smart-card/in-product';

import { EditorPageObject } from '../../../../page-objects/Editor';
import { EditorSmartLinkPageObject } from '../../../../page-objects/EditorSmartLink';
import { SmartLinkTestCaseOpts } from '../types';

export const editBlockSmartLinkTitleTestCase = ({
  ui,
  url,
}: SmartLinkTestCaseOpts) =>
  new InProductTestCase({
    title: 'editing a Block Smart Link renders as Blue Link (title)',
    id: 'block-smart-link-edit-title',
    assertions: (cy) => {
      const editor = new EditorPageObject(cy);
      const editorWithSmartLinks = new EditorSmartLinkPageObject(cy, editor);
      const blockCard = new BlockCardPageObject(cy);

      editorWithSmartLinks.insertSmartLinkByTyping(url);
      editorWithSmartLinks.switchAfterInsert('block');
      blockSmartLinkRendersTestCase({ url }).assertions(cy);

      editorWithSmartLinks.changeLinkLabel(
        'Avocorne is watching you 🥑',
        'block',
      );
      blockCard.assertHrefRendered(url);
      blockCard.expectCardNotExists();

      if (ui?.publishButton) {
        const renderer = editor.publish(ui);
        renderer.expectContentReady();
        blockCard.assertHrefRendered(url);
        blockCard.expectCardNotExists();
      }
    },
  });

export const editBlockSmartLinkUrlTestCase = ({
  ui,
  url,
}: SmartLinkTestCaseOpts) =>
  new InProductTestCase({
    title: 'editing a Block Smart Link renders as Blue Link (URL)',
    id: 'block-smart-link-edit',
    assertions: (cy) => {
      const editor = new EditorPageObject(cy);
      const editorWithSmartLinks = new EditorSmartLinkPageObject(cy, editor);
      const blockCard = new BlockCardPageObject(cy);

      editorWithSmartLinks.insertSmartLinkByTyping(url);
      editorWithSmartLinks.switchAfterInsert('block');
      blockSmartLinkRendersTestCase({ url }).assertions(cy);

      const newUrl = 'https://avo.corne.com';
      editorWithSmartLinks.changeLinkUrl(newUrl, 'block');
      blockCard.expectCardNotExists();
      blockCard.assertHrefRendered(newUrl);

      if (ui?.publishButton) {
        const renderer = editor.publish(ui);
        renderer.expectContentReady();
        blockCard.assertHrefRendered(newUrl);
        blockCard.expectCardNotExists();
      }
    },
  });
