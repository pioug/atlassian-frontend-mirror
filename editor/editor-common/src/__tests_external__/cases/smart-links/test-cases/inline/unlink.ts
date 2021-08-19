import { InProductTestCase } from '@atlaskit/in-product-testing';
import {
  InlineCardPageObject,
  inlineSmartLinkRendersTestCase,
} from '@atlaskit/smart-card/in-product';

import { EditorPageObject } from '../../../../page-objects/Editor';
import { EditorSmartLinkPageObject } from '../../../../page-objects/EditorSmartLink';
import { SmartLinkTestCaseOpts } from '../types';

export const unlinkInlineSmartLinkTestCase = ({
  ui,
  url,
}: SmartLinkTestCaseOpts) =>
  new InProductTestCase({
    title: 'unlinking an Inline Smart Link works',
    id: 'inline-smart-link-unlink',
    assertions: (cy) => {
      const editor = new EditorPageObject(cy);
      const editorWithSmartLinks = new EditorSmartLinkPageObject(cy, editor);
      const inlineCard = new InlineCardPageObject(cy);

      editorWithSmartLinks.insertSmartLinkByTyping(url);
      inlineSmartLinkRendersTestCase({ url }).assertions(cy);

      editorWithSmartLinks.unlink();
      inlineCard.expectCardNotExists();
      inlineCard.assertHrefNotRendered(url);

      if (ui?.publishButton) {
        const renderer = editor.publish(ui);
        renderer.expectContentReady();
        inlineCard.expectCardNotExists();
        inlineCard.assertHrefNotRendered(url);
      }
    },
  });
