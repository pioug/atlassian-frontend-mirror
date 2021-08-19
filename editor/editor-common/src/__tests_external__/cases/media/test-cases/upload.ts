import { InProductTestCase } from '@atlaskit/in-product-testing';
import { MediaCardPageObject } from '@atlaskit/media-card/in-product';

import { EditorPageObject } from '../../../page-objects/Editor';
import { EditorTestCaseOpts } from '../../types';

interface EditorMediaTestCaseOpts extends EditorTestCaseOpts {
  fixtures: string[];
}

export const uploadMediaTestCase = ({
  ui,
  fixtures,
}: EditorMediaTestCaseOpts) =>
  new InProductTestCase({
    title: 'media upload and publish works',
    id: 'media-file-upload',
    precondition: () => fixtures.length > 0,
    assertions: (cy) => {
      const editor = new EditorPageObject(cy);
      const mediaCard = new MediaCardPageObject(cy);

      editor.upload(fixtures);
      mediaCard.expectCardReady(fixtures.length);

      if (ui?.publishButton) {
        const renderer = editor.publish(ui);
        renderer.expectContentReady();
        renderer.expectMediaSingleRenders(fixtures.length);
      }
    },
  });
