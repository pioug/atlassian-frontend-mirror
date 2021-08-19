import { InProductTestCase } from '@atlaskit/in-product-testing';
import { embedSmartLinkRendersTestCase } from '@atlaskit/smart-card/in-product';

import { EditorPageObject } from '../../../../page-objects/Editor';
import { EditorSmartLinkPageObject } from '../../../../page-objects/EditorSmartLink';
import { SmartLinkTestCaseOpts } from '../types';

export const switchToEmbedSmartLinkTestCase = ({
  ui,
  url,
}: SmartLinkTestCaseOpts) =>
  new InProductTestCase({
    title: 'switching to an Embed Smart Link works',
    id: 'switch-to-embed',
    assertions: (cy) => {
      const editor = new EditorPageObject(cy);
      const editorWithSmartLinks = new EditorSmartLinkPageObject(cy, editor);

      editorWithSmartLinks.insertSmartLinkByTyping(url);
      editorWithSmartLinks.switchAfterInsert('embed');
      embedSmartLinkRendersTestCase({ url }).assertions(cy);

      if (ui?.publishButton) {
        const renderer = editor.publish(ui);
        renderer.expectContentReady();
        embedSmartLinkRendersTestCase({ url }).assertions(cy);
      }
    },
  });
