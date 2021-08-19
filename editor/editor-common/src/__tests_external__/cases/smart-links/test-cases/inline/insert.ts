import { InProductTestCase } from '@atlaskit/in-product-testing';
import { inlineSmartLinkRendersTestCase } from '@atlaskit/smart-card/in-product';

import { EditorPageObject } from '../../../../page-objects/Editor';
import { EditorSmartLinkPageObject } from '../../../../page-objects/EditorSmartLink';
import { SmartLinkTestCaseOpts } from '../types';

export const insertInlineSmartLinkTestCase = ({
  ui,
  url,
}: SmartLinkTestCaseOpts) =>
  new InProductTestCase({
    title: 'inserting an Inline Smart Link works',
    id: 'inline-smart-link-insert',
    assertions: (cy) => {
      const editor = new EditorPageObject(cy);
      const editorWithSmartLinks = new EditorSmartLinkPageObject(cy, editor);

      editorWithSmartLinks.insertSmartLinkByTyping(url);
      inlineSmartLinkRendersTestCase({ url }).assertions(cy);

      if (ui?.publishButton) {
        const renderer = editor.publish(ui);
        renderer.expectContentReady();
        inlineSmartLinkRendersTestCase({ url }).assertions(cy);
      }
    },
  });
