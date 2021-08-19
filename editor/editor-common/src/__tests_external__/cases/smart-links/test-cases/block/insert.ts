import { InProductTestCase } from '@atlaskit/in-product-testing';
import { blockSmartLinkRendersTestCase } from '@atlaskit/smart-card/in-product';

import { EditorPageObject } from '../../../../page-objects/Editor';
import { EditorSmartLinkPageObject } from '../../../../page-objects/EditorSmartLink';
import { SmartLinkTestCaseOpts } from '../types';

export const switchToBlockSmartLinkTestCase = ({
  ui,
  url,
}: SmartLinkTestCaseOpts) =>
  new InProductTestCase({
    title: 'switching to a Block Smart Link works',
    id: 'switch-to-block',
    assertions: (cy) => {
      const editor = new EditorPageObject(cy);
      const editorWithSmartLinks = new EditorSmartLinkPageObject(cy, editor);

      editorWithSmartLinks.insertSmartLinkByTyping(url);
      editorWithSmartLinks.switchAfterInsert('block');
      blockSmartLinkRendersTestCase({ url }).assertions(cy);

      if (ui?.publishButton) {
        const renderer = editor.publish(ui);
        renderer.expectContentReady();
        blockSmartLinkRendersTestCase({ url }).assertions(cy);
      }
    },
  });
