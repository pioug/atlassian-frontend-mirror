export class EditorPageObject {
  constructor(private cy: Cypress.cy) {}

  public getEditorArea() {
    return this.cy.get('div.ProseMirror');
  }

  public getTitleArea() {
    return this.cy.get('[data-test-id="editor-title"]');
  }
}
