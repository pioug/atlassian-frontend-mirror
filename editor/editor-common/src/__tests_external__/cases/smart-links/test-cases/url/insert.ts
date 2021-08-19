import { InProductTestCase } from '@atlaskit/in-product-testing';
import { InlineCardPageObject } from '@atlaskit/smart-card/in-product';

import { EditorPageObject } from '../../../../page-objects/Editor';
import { EditorSmartLinkPageObject } from '../../../../page-objects/EditorSmartLink';
import { SmartLinkTestCaseOpts } from '../types';

export const switchToUrlTestCase = ({ ui, url }: SmartLinkTestCaseOpts) =>
  new InProductTestCase({
    title: 'switching to a Blue Link works',
    id: 'switch-to-url',
    assertions: (cy) => {
      const editor = new EditorPageObject(cy);
      const editorWithSmartLinks = new EditorSmartLinkPageObject(cy, editor);
      const inlineCard = new InlineCardPageObject(cy);

      editorWithSmartLinks.insertSmartLinkByTyping(url);
      editorWithSmartLinks.switchAfterInsert('url');
      inlineCard.assertHrefRendered(url);

      if (ui?.publishButton) {
        const renderer = editor.publish(ui);
        renderer.expectContentReady();
        inlineCard.assertHrefRendered(url);
      }
    },
  });
