import { InProductTestPageObject } from '@atlaskit/in-product-testing';

import { EditorTestCaseOpts } from '../cases/types';

import { RendererPageObject } from './Renderer';

export class EditorPageObject extends InProductTestPageObject {
  public getEditorArea() {
    return this.cy.get('div.ProseMirror', { timeout: 30000 });
  }

  public getTitleArea() {
    return this.cy.get('[data-test-id="editor-title"]');
  }

  public publish(opts: EditorTestCaseOpts['ui']) {
    if (opts?.publishButton) {
      this.cy.get(opts.publishButton).click();
      return new RendererPageObject(this.cy);
    }
    throw Error('No publish button selector supplied!');
  }

  public upload(fixtures: string[]) {
    return this.getEditorArea().attachFile(fixtures, {
      subjectType: 'drag-n-drop',
    });
  }
}
