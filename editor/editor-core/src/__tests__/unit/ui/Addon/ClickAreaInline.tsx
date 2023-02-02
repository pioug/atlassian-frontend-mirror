import React from 'react';
import { mount } from 'enzyme';
import { createEditorFactory } from '@atlaskit/editor-test-helpers/create-editor';
import { doc, p, DocBuilder } from '@atlaskit/editor-test-helpers/doc-builder';
import { ClickAreaInline } from '../../../../ui/Addon';

const clickWrapperSelector = 'div[data-testid="click-wrapper"]';
describe('ClickAreaInline', () => {
  const createEditor = createEditorFactory();
  const editor = (doc: DocBuilder) =>
    createEditor({
      doc,
    });

  it('should create empty terminal empty paragraph when clicked', () => {
    const { editorView } = editor(doc(p('Hello world')));
    const clickArea = mount(<ClickAreaInline editorView={editorView} />);
    clickArea
      .find(clickWrapperSelector)
      .simulate('mousedown', { clientY: 200 });
    expect(editorView.state.doc).toEqualDocument(doc(p('Hello world'), p('')));
  });

  it('should not create empty terminal empty paragraph if it is already present at end', () => {
    const { editorView } = editor(doc(p('Hello world'), p('')));
    const clickArea = mount(<ClickAreaInline editorView={editorView} />);
    clickArea
      .find(clickWrapperSelector)
      .simulate('mousedown', { clientY: 200 });
    expect(editorView.state.doc).toEqualDocument(doc(p('Hello world'), p('')));
  });
});
