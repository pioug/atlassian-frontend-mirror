import {
  doc,
  ol,
  ul,
  li,
  p,
  DocBuilder,
} from '@atlaskit/editor-test-helpers/doc-builder';
import {
  createProsemirrorEditorFactory,
  LightEditorPlugin,
  Preset,
} from '@atlaskit/editor-test-helpers/create-prosemirror-editor';
import listPlugin from '../..';
import { toggleOrderedList, toggleBulletList } from '../../commands';

describe('lists plugin -> joining lists', () => {
  const createEditor = createProsemirrorEditorFactory();

  const editor = (doc: DocBuilder) => {
    const preset = new Preset<LightEditorPlugin>().add(listPlugin);

    return createEditor({
      doc,
      preset,
    });
  };

  const expectedOutputForPreviousList = doc(
    ol(
      li(p('One')),
      li(p('Two')),
      li(p('Three')),
      li(p('Four')),
      li(p('Five')),
    ),
    p('Six'),
  );
  const expectedOutputForNextList = doc(
    p('One'),
    ol(
      li(p('Two')),
      li(p('Three')),
      li(p('Four')),
      li(p('Five')),
      li(p('Six')),
    ),
  );
  const expectedOutputForPreviousAndNextList = doc(
    ol(
      li(p('One')),
      li(p('Two')),
      li(p('Three')),
      li(p('Four')),
      li(p('Five')),
      li(p('Six')),
    ),
  );

  it("should join with previous list if it's of the same type", () => {
    const { editorView } = editor(
      doc(
        ol(li(p('One')), li(p('Two')), li(p('Three'))),
        p('{<}Four'),
        p('Five{>}'),
        p('Six'),
      ),
    );

    toggleOrderedList(editorView);
    expect(editorView.state.doc).toEqualDocument(expectedOutputForPreviousList);
  });

  it("should join with previous list if it's of the same type and selection starts at the end of previous line", () => {
    const { editorView } = editor(
      doc(
        ol(li(p('One')), li(p('Two')), li(p('Three{<}'))),
        p('Four'),
        p('Five{>}'),
        p('Six'),
      ),
    ); // When selection starts on previous (empty) node

    toggleOrderedList(editorView);
    expect(editorView.state.doc).toEqualDocument(expectedOutputForPreviousList);
  });

  it("should not join with previous list if it's not of the same type", () => {
    const { editorView } = editor(
      doc(
        ol(li(p('One')), li(p('Two')), li(p('Three'))),
        p('{<}Four'),
        p('Five{>}'),
        p('Six'),
      ),
    );

    toggleBulletList(editorView);
    expect(editorView.state.doc).toEqualDocument(
      doc(
        ol(li(p('One')), li(p('Two')), li(p('Three'))),
        ul(li(p('Four')), li(p('Five'))),
        p('Six'),
      ),
    );
  });

  it("should join with previous list if it's not of the same type and selection starts at the end of previous line", () => {
    const { editorView } = editor(
      doc(
        ol(li(p('One')), li(p('Two')), li(p('Three{<}'))),
        p('Four'),
        p('Five{>}'),
        p('Six'),
      ),
    ); // When selection starts on previous (empty) node

    toggleBulletList(editorView);
    expect(editorView.state.doc).toEqualDocument(
      doc(
        ul(
          li(p('One')),
          li(p('Two')),
          li(p('Three')),
          li(p('Four')),
          li(p('Five')),
        ),
        p('Six'),
      ),
    );
  });

  it("should join with next list if it's of the same type", () => {
    const { editorView } = editor(
      doc(
        p('One'),
        p('{<}Two'),
        p('Three{>}'),
        ol(li(p('Four')), li(p('Five')), li(p('Six'))),
      ),
    );

    toggleOrderedList(editorView);
    expect(editorView.state.doc).toEqualDocument(expectedOutputForNextList);
  });

  it("should join with next list if it's of the same type and selection starts at the end of previous line", () => {
    const { editorView } = editor(
      doc(
        p('One{<}'),
        p('Two'),
        p('Three{>}'),
        ol(li(p('Four')), li(p('Five')), li(p('Six'))),
      ),
    );

    toggleOrderedList(editorView);
    expect(editorView.state.doc).toEqualDocument(
      doc(
        ol(
          li(p('One')),
          li(p('Two')),
          li(p('Three')),
          li(p('Four')),
          li(p('Five')),
          li(p('Six')),
        ),
      ),
    );
  });

  it("should not join with next list if it isn't of the same type", () => {
    const { editorView } = editor(
      doc(
        p('One'),
        p('{<}Two'),
        p('Three{>}'),
        ol(li(p('Four')), li(p('Five')), li(p('Six'))),
      ),
    );

    toggleBulletList(editorView);
    expect(editorView.state.doc).toEqualDocument(
      doc(
        p('One'),
        ul(li(p('Two')), li(p('Three'))),
        ol(li(p('Four')), li(p('Five')), li(p('Six'))),
      ),
    );
  });

  it("should not join with next list if it isn't of the same type and selection starts at the end of previous line", () => {
    const { editorView } = editor(
      doc(
        p('One{<}'),
        p('Two'),
        p('Three{>}'),
        ol(li(p('Four')), li(p('Five')), li(p('Six'))),
      ),
    );

    toggleBulletList(editorView);
    expect(editorView.state.doc).toEqualDocument(
      doc(
        ul(li(p('One')), li(p('Two')), li(p('Three'))),
        ol(li(p('Four')), li(p('Five')), li(p('Six'))),
      ),
    );
  });

  it("should join with previous and next list if they're of the same type", () => {
    const { editorView } = editor(
      doc(
        ol(li(p('One')), li(p('Two'))),
        p('{<}Three'),
        p('Four{>}'),
        ol(li(p('Five')), li(p('Six'))),
      ),
    );

    toggleOrderedList(editorView);
    expect(editorView.state.doc).toEqualDocument(
      expectedOutputForPreviousAndNextList,
    );
  });

  it("should join with previous but not the next list if they're of the same type and selection starts at the end of previous line", () => {
    const { editorView } = editor(
      doc(
        ol(li(p('One')), li(p('Two{<}'))),
        p('Three'),
        p('Four{>}'),
        ol(li(p('Five')), li(p('Six'))),
      ),
    );

    toggleOrderedList(editorView);
    expect(editorView.state.doc).toEqualDocument(
      doc(
        ol(li(p('One')), li(p('Two')), li(p('Three')), li(p('Four{>}'))),
        ol(li(p('Five')), li(p('Six'))),
      ),
    );
  });

  it("should not join with previous and next list if they're not of the same type", () => {
    const { editorView } = editor(
      doc(
        ol(li(p('One')), li(p('Two'))),
        p('{<}Three'),
        p('Four{>}'),
        ol(li(p('Five')), li(p('Six'))),
      ),
    );

    toggleBulletList(editorView);
    expect(editorView.state.doc).toEqualDocument(
      doc(
        ol(li(p('One')), li(p('Two'))),
        ul(li(p('Three')), li(p('Four'))),
        ol(li(p('Five')), li(p('Six'))),
      ),
    );
  });

  it("should join with previous but not the next list if they're not of the same type and selectoin starts at the end of previous line", () => {
    const { editorView } = editor(
      doc(
        ol(li(p('One')), li(p('Two{<}'))),
        p('Three'),
        p('Four{>}'),
        ol(li(p('Five')), li(p('Six'))),
      ),
    );

    toggleBulletList(editorView);
    expect(editorView.state.doc).toEqualDocument(
      doc(
        ul(li(p('One')), li(p('Two')), li(p('Three')), li(p('Four'))),
        ol(li(p('Five')), li(p('Six'))),
      ),
    );
  });
});
