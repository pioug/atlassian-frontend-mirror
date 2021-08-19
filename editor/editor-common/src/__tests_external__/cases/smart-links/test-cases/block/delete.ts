import { InProductTestCase } from '@atlaskit/in-product-testing';
import {
  BlockCardPageObject,
  blockSmartLinkRendersTestCase,
} from '@atlaskit/smart-card/in-product';

import { EditorPageObject } from '../../../../page-objects/Editor';
import { EditorSmartLinkPageObject } from '../../../../page-objects/EditorSmartLink';
import { SmartLinkTestCaseOpts } from '../types';

export const deleteBlockSmartLinkTestCase = ({
  ui,
  url,
}: SmartLinkTestCaseOpts) =>
  new InProductTestCase({
    title: 'able to delete a Block Smart Link using floating toolbar',
    id: 'delete-block-smart-link',
    assertions: (cy) => {
      const editor = new EditorPageObject(cy);
      const editorWithSmartLinks = new EditorSmartLinkPageObject(cy, editor);
      const blockCard = new BlockCardPageObject(cy);

      editorWithSmartLinks.insertSmartLinkByTyping(url);
      editorWithSmartLinks.switchAfterInsert('block');
      blockSmartLinkRendersTestCase({ url }).assertions(cy);

      editorWithSmartLinks.deleteSmartLink('block');
      blockCard.expectCardNotExists();

      if (ui?.publishButton) {
        const renderer = editor.publish(ui);
        renderer.expectContentReady();
        blockCard.expectCardNotExists();
      }
    },
  });
