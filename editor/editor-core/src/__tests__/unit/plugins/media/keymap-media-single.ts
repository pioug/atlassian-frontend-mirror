import {
  doc,
  p,
  blockquote,
  mediaSingle,
  code_block,
} from '@atlaskit/editor-test-helpers/doc-builder';
import sendKeyToPm from '@atlaskit/editor-test-helpers/send-key-to-pm';

import { temporaryMedia, mediaEditor } from './_utils';

describe('mediaSingle - keymap', () => {
  it('should remove the empty paragraph on backspace', () => {
    const { editorView } = mediaEditor(
      doc(
        p(''),
        mediaSingle({ layout: 'wrap-right' })(temporaryMedia),
        p('{<>}Hello World!'),
      ),
    );

    sendKeyToPm(editorView, 'Backspace');

    expect(editorView.state.doc).toEqualDocument(
      doc(
        mediaSingle({ layout: 'wrap-right' })(temporaryMedia),
        p('Hello World!'),
      ),
    );
  });

  it('should remove the empty blockquote on backspace', () => {
    const { editorView } = mediaEditor(
      doc(
        blockquote(p('')),
        mediaSingle({ layout: 'wrap-right' })(temporaryMedia),
        p('{<>}Hello World!'),
      ),
    );

    sendKeyToPm(editorView, 'Backspace');

    expect(editorView.state.doc).toEqualDocument(
      doc(
        mediaSingle({ layout: 'wrap-right' })(temporaryMedia),
        p('Hello World!'),
      ),
    );
  });

  it('should remove the empty codeBlock on backspace', () => {
    const { editorView } = mediaEditor(
      doc(
        code_block({})(''),
        mediaSingle({ layout: 'wrap-right' })(temporaryMedia),
        p('{<>}Hello World!'),
      ),
    );

    sendKeyToPm(editorView, 'Backspace');

    expect(editorView.state.doc).toEqualDocument(
      doc(
        mediaSingle({ layout: 'wrap-right' })(temporaryMedia),
        p('Hello World!'),
      ),
    );
  });

  it('should move the text to the paragraph before media single like a normal paragraph delete works', () => {
    const { editorView } = mediaEditor(
      doc(
        p('Hey!'),
        mediaSingle({ layout: 'wrap-right' })(temporaryMedia),
        p('{<>}Hello World!'),
      ),
    );

    sendKeyToPm(editorView, 'Backspace');

    expect(editorView.state.doc).toEqualDocument(
      doc(
        p('Hey!Hello World!'),
        mediaSingle({ layout: 'wrap-right' })(temporaryMedia),
        p(''),
      ),
    );
  });

  it('should delete the last empty paragraph', () => {
    const { editorView } = mediaEditor(
      doc(
        p(''),
        p(''),
        p(''),
        p(''),
        p(''),
        mediaSingle({ layout: 'wrap-right' })(temporaryMedia),
        p('{<>}Hello World!'),
      ),
    );

    sendKeyToPm(editorView, 'Backspace');

    expect(editorView.state.doc).toEqualDocument(
      doc(
        p(''),
        p(''),
        p(''),
        p(''),
        mediaSingle({ layout: 'wrap-right' })(temporaryMedia),
        p('Hello World!'),
      ),
    );
  });

  it('should not remove the first empty paragraph on backspace if the selection is not empty', () => {
    const { editorView } = mediaEditor(
      doc(
        p(''),
        mediaSingle({ layout: 'wrap-right' })(temporaryMedia),
        p('{<}Hello World!{>}'),
      ),
    );

    sendKeyToPm(editorView, 'Backspace');

    expect(editorView.state.doc).toEqualDocument(
      doc(p(''), mediaSingle({ layout: 'wrap-right' })(temporaryMedia), p('')),
    );
  });

  it('should not remove the first empty paragraph on backspace if mediaSingle is not wrap-right', () => {
    const { editorView } = mediaEditor(
      doc(
        p(''),
        mediaSingle({ layout: 'center' })(temporaryMedia),
        p('{<>}Hello World!'),
      ),
    );

    sendKeyToPm(editorView, 'Backspace');

    expect(editorView.state.doc).toEqualDocument(
      doc(
        p(''),
        mediaSingle({ layout: 'center' })(temporaryMedia),
        p('Hello World!'),
      ),
    );
  });
});
