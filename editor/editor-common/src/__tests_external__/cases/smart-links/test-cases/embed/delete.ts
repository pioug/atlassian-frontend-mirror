import { InProductTestCase } from '@atlaskit/in-product-testing';
import {
  EmbedCardPageObject,
  embedSmartLinkRendersTestCase,
} from '@atlaskit/smart-card/in-product';

import { EditorPageObject } from '../../../../page-objects/Editor';
import { EditorSmartLinkPageObject } from '../../../../page-objects/EditorSmartLink';
import { SmartLinkTestCaseOpts } from '../types';

export const deleteEmbedSmartLinkTestCase = ({
  ui,
  url,
}: SmartLinkTestCaseOpts) =>
  new InProductTestCase({
    title: 'able to delete an Embed Smart Link using floating toolbar',
    id: 'delete-embed-smart-link',
    assertions: (cy) => {
      const editor = new EditorPageObject(cy);
      const editorWithSmartLinks = new EditorSmartLinkPageObject(cy, editor);
      const embedCard = new EmbedCardPageObject(cy);

      editorWithSmartLinks.insertSmartLinkByTyping(url);
      editorWithSmartLinks.switchAfterInsert('embed');
      embedSmartLinkRendersTestCase({ url }).assertions(cy);

      editorWithSmartLinks.deleteSmartLink('embed');
      embedCard.expectCardNotExists();

      if (ui?.publishButton) {
        const renderer = editor.publish(ui);
        renderer.expectContentReady();
        embedCard.expectCardNotExists();
      }
    },
  });
