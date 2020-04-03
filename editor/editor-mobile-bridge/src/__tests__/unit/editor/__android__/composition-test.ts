import { doc, createEditorFactory, p } from '@atlaskit/editor-test-helpers';

import {
  androidComposeStart,
  androidComposeContinue,
  androidComposeEnd,
} from '../../_utils';

import { EditorViewWithComposition } from '../../../../types';

describe('composition events on mobile', () => {
  const createEditor = createEditorFactory();

  const editor = (doc: any): EditorViewWithComposition => {
    const { editorView } = createEditor({
      doc,
      editorProps: {
        analyticsHandler: () => {},
      },
    });

    return editorView as EditorViewWithComposition;
  };

  beforeEach(() => jest.useFakeTimers());

  it('updates PM state on compositionstart', () => {
    const editorView = editor(doc(p()));
    expect(editorView.composing).toBeFalsy();

    // mutate DOM to final state
    editorView.dom.children[0].innerHTML = 'hello';

    // start composition
    androidComposeStart(editorView, 'hello');
    expect(editorView.composing).toBeTruthy();

    jest.runOnlyPendingTimers();

    expect(editorView.composing).toBeFalsy();
    expect(editorView.state.doc).toEqualDocument(doc(p('hello')));
  });

  it('updates PM state on single compositionupdate', () => {
    const editorView = editor(doc(p('hello ')));
    expect(editorView.composing).toBeFalsy();

    // mutate DOM to final state
    editorView.dom.children[0].innerHTML = "hello I'm";

    // continue composition
    androidComposeContinue(editorView, "I'm");
    expect(editorView.composing).toBeTruthy();

    jest.runOnlyPendingTimers();

    expect(editorView.composing).toBeFalsy();
    expect(editorView.state.doc).toEqualDocument(doc(p('hello I’m')));
  });

  it('updates PM state on multiple compositionupdate', () => {
    const editorView = editor(doc(p('hello ')));
    expect(editorView.composing).toBeFalsy();

    // mutate DOM to final state
    editorView.dom.children[0].innerHTML = 'hello it';

    // continue multiple compositions
    androidComposeContinue(editorView, "I'm");
    expect(editorView.composing).toBeTruthy();

    jest.runOnlyPendingTimers();

    androidComposeContinue(editorView, 'it');
    expect(editorView.composing).toBeTruthy();

    jest.runOnlyPendingTimers();

    expect(editorView.composing).toBeFalsy();
    expect(editorView.state.doc).toEqualDocument(doc(p('hello it')));
  });

  it('updates PM state on compositionend', () => {
    const editorView = editor(doc(p('hello it')));
    expect(editorView.composing).toBeFalsy();

    // mutate DOM to final state
    editorView.dom.children[0].innerHTML = 'hello it works!';

    // continue composition till end
    androidComposeContinue(editorView, 'workz');
    expect(editorView.composing).toBeTruthy();

    jest.runOnlyPendingTimers();

    androidComposeContinue(editorView, 'workgrrrbbrrr');
    expect(editorView.composing).toBeTruthy();

    jest.runOnlyPendingTimers();

    androidComposeEnd(editorView, 'works!');

    expect(editorView.composing).toBeFalsy();
    expect(editorView.state.doc).toEqualDocument(doc(p('hello it works!')));
  });
});
