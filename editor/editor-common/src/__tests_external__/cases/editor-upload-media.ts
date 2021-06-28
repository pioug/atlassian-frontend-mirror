import { MediaCardPageObject } from '@atlaskit/media-card/in-product';

import { EditorPageObject } from '../page-objects/Editor';
import { RendererPageObject } from '../page-objects/Renderer';

import { EditorTestCase } from './base-test-case';
import { TestCaseOpts } from './types';
interface EditorUploadMediaTestCaseOpts extends TestCaseOpts {
  fixtures: string[];
}

export const editorUploadMediaTestCase = ({
  ui,
  fixtures,
  auth,
}: EditorUploadMediaTestCaseOpts) =>
  new EditorTestCase({
    title: 'media upload and publish works',
    id: 'media-file-upload',
    assertions: (cy) => {
      const editor = new EditorPageObject(cy);
      const renderer = new RendererPageObject(cy);
      const mediaCard = new MediaCardPageObject(cy);

      if (fixtures.length === 0) {
        throw new Error(
          'To run this test case, you need to supply a file fixture 😱',
        );
      }

      if (auth?.cookie) {
        cy.setCookie('cloud.session.token.stg', auth.cookie, {
          domain: '.atlassian.com',
          httpOnly: true,
          secure: true,
          sameSite: 'no_restriction',
        });
      }

      editor.getEditorArea().attachFile(fixtures, {
        subjectType: 'drag-n-drop',
      });

      // Wait until uploaded.
      mediaCard.expectCardReady(fixtures.length);

      if (ui?.publishButton) {
        cy.get(ui.publishButton).click();

        renderer.getRenderedContent().should('be.visible');
        renderer.expectMediaSingleRenders(fixtures.length);
      }
    },
  });
