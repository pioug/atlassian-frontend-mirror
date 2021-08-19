import { InProductTestCase } from '@atlaskit/in-product-testing';
import { MediaCardPageObject } from '@atlaskit/media-card/in-product';

import { EditorPageObject } from '../../../page-objects/Editor';
import { EditorMediaPageObject } from '../../../page-objects/EditorMedia';

import { EditorMediaTestCaseOpts } from './types';

export const addAltTextMediaTestCase = ({
  ui,
  fixtures,
}: EditorMediaTestCaseOpts) =>
  new InProductTestCase({
    title: 'adding alt text to Media works',
    id: 'media-alt-text',
    precondition: () => fixtures.length > 0,
    assertions: (cy) => {
      const editor = new EditorPageObject(cy);
      const editorMedia = new EditorMediaPageObject(cy);
      const mediaCard = new MediaCardPageObject(cy);

      editor.upload(fixtures);
      mediaCard.expectCardReady(fixtures.length);

      const altText = 'Corne **loves** avocados';
      editorMedia.addAltTextToImage(altText);
      editorMedia.assertAltText(altText);

      if (ui?.publishButton) {
        const renderer = editor.publish(ui);

        renderer.expectContentReady();
        renderer.expectMediaSingleRenders(fixtures.length);
        mediaCard.assertAltText(altText);
      }
    },
  });
