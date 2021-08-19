import { InProductTestCase } from '@atlaskit/in-product-testing';
import {
  InlineCardPageObject,
  inlineSmartLinkRendersTestCase,
} from '@atlaskit/smart-card/in-product';

import { EditorPageObject } from '../../../../page-objects/Editor';
import { EditorSmartLinkPageObject } from '../../../../page-objects/EditorSmartLink';
import { SmartLinkTestCaseOpts } from '../types';

export const deleteInlineSmartLinkTestCase = ({
  ui,
  url,
}: SmartLinkTestCaseOpts) =>
  new InProductTestCase({
    title: 'able to delete an Inline Smart Link using floating toolbar',
    id: 'delete-inline-smart-link',
    assertions: (cy) => {
      const editor = new EditorPageObject(cy);
      const editorWithSmartLinks = new EditorSmartLinkPageObject(cy, editor);
      const inlineCard = new InlineCardPageObject(cy);

      editorWithSmartLinks.insertSmartLinkByTyping(url);
      inlineSmartLinkRendersTestCase({ url }).assertions(cy);

      editorWithSmartLinks.deleteSmartLink();
      inlineCard.expectCardNotExists();

      if (ui?.publishButton) {
        const renderer = editor.publish(ui);
        renderer.expectContentReady();
        inlineCard.expectCardNotExists();
      }
    },
  });
