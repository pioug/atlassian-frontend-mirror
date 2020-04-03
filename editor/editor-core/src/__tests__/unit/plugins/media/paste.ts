import { Node, Fragment, Slice, Schema } from 'prosemirror-model';
import createEditorFactory from '@atlaskit/editor-test-helpers/create-editor';

import {
  doc,
  p,
  layoutSection,
  layoutColumn,
  mediaSingle,
  ol,
  ul,
  li,
  tr,
  table,
  td,
} from '@atlaskit/editor-test-helpers/schema-builder';

import { temporaryMedia } from './_utils';
import { transformSliceForMedia } from '../../../../plugins/media/utils/media-single';

const removeRef = (node: Node) =>
  Node.fromJSON(node.type.schema, node.toJSON());
const fragment = (...args: any) => (schema: Schema) =>
  Fragment.from(args.map((i: any) => removeRef(i(schema))));

describe('Media plugin', () => {
  const createEditor = createEditorFactory();
  const editor = (doc: any) =>
    createEditor({
      doc,
      editorProps: {
        allowLayouts: true,
        media: {
          allowMediaSingle: true,
        },
        allowTables: true,
      },
    });

  describe('#transformSliceForMedia', () => {
    const sliceWithAttributes = (schema: Schema) =>
      new Slice(
        fragment(
          p('some text'),
          mediaSingle({
            width: 60,
            layout: 'align-start',
          })(temporaryMedia),
          p('text after'),
        )(schema),
        0,
        0,
      );

    const sliceWithoutAttributes = (schema: Schema) =>
      new Slice(
        fragment(
          p('some text'),
          mediaSingle()(temporaryMedia),
          p('text after'),
        )(schema),
        0,
        0,
      );

    it('removes mediaSingle attributes when pasted into a layoutSection', () => {
      const { editorView } = editor(
        doc(
          layoutSection(
            layoutColumn({ width: 50 })(p('{<>}')),
            layoutColumn({ width: 50 })(p('')),
          ),
        ),
      );

      const { selection, schema } = editorView.state;
      expect(
        transformSliceForMedia(sliceWithAttributes(schema), schema)(selection),
      ).toEqual(sliceWithoutAttributes(schema));
    });

    it('removes mediaSingle attributes when pasted into a table', () => {
      const { editorView } = editor(
        doc(table()(tr(td()(p('hello {<>}')), td()(p())))),
      );

      const { selection, schema } = editorView.state;
      expect(
        transformSliceForMedia(sliceWithAttributes(schema), schema)(selection),
      ).toEqual(sliceWithoutAttributes(schema));
    });

    it('removes mediaSingle attributes when pasted into an ordered list', () => {
      const { editorView } = editor(
        doc(ol(li(p('hello {<>}')), li(p('world')))),
      );

      const { selection, schema } = editorView.state;
      expect(
        transformSliceForMedia(sliceWithAttributes(schema), schema)(selection),
      ).toEqual(sliceWithoutAttributes(schema));
    });

    it('removes mediaSingle attributes when pasted into a bullet list', () => {
      const { editorView } = editor(
        doc(ul(li(p('hello {<>}')), li(p('world')))),
      );

      const { selection, schema } = editorView.state;
      expect(
        transformSliceForMedia(sliceWithAttributes(schema), schema)(selection),
      ).toEqual(sliceWithoutAttributes(schema));
    });

    it('maintains mediaSingle attributes when pasted into a top level paragraph', () => {
      const { editorView } = editor(doc(p('hello {<>} world')));
      const { selection, schema } = editorView.state;
      expect(
        transformSliceForMedia(sliceWithAttributes(schema), schema)(selection),
      ).toEqual(sliceWithAttributes(schema));
    });
  });
});
