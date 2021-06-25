import { Node, Fragment, Slice, Schema } from 'prosemirror-model';
import { createEditorState } from '@atlaskit/editor-test-helpers/create-editor-state';
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
} from '@atlaskit/editor-test-helpers/doc-builder';

import { temporaryMedia } from './_utils';
import { transformSliceForMedia } from '../../../../plugins/media/utils/media-single';

const removeRef = (node: Node) =>
  Node.fromJSON(node.type.schema, node.toJSON());
const fragment = (...args: any) => (schema: Schema) =>
  Fragment.from(args.map((i: any) => removeRef(i(schema))));

describe('Media plugin', () => {
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

    const sliceWithLimitedAttributes = (schema: Schema) =>
      new Slice(
        fragment(
          p('some text'),
          mediaSingle({ layout: 'align-start' })(temporaryMedia),
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
      const editorState = createEditorState(
        doc(
          layoutSection(
            layoutColumn({ width: 50 })(p('{<>}')),
            layoutColumn({ width: 50 })(p('')),
          ),
        ),
      );

      const { selection, schema } = editorState;
      expect(
        transformSliceForMedia(sliceWithAttributes(schema), schema)(selection),
      ).toEqual(sliceWithLimitedAttributes(schema));
    });

    it('removes mediaSingle attributes when pasted into a table', () => {
      const editorState = createEditorState(
        doc(table()(tr(td()(p('hello {<>}')), td()(p())))),
      );

      const { selection, schema } = editorState;
      expect(
        transformSliceForMedia(sliceWithAttributes(schema), schema)(selection),
      ).toEqual(sliceWithLimitedAttributes(schema));
    });

    it('removes mediaSingle attributes when pasted into an ordered list', () => {
      const editorState = createEditorState(
        doc(ol(li(p('hello {<>}')), li(p('world')))),
      );

      const { selection, schema } = editorState;
      expect(
        transformSliceForMedia(sliceWithAttributes(schema), schema)(selection),
      ).toEqual(sliceWithoutAttributes(schema));
    });

    it('removes mediaSingle attributes when pasted into a bullet list', () => {
      const editorState = createEditorState(
        doc(ul(li(p('hello {<>}')), li(p('world')))),
      );

      const { selection, schema } = editorState;
      expect(
        transformSliceForMedia(sliceWithAttributes(schema), schema)(selection),
      ).toEqual(sliceWithoutAttributes(schema));
    });

    it('maintains mediaSingle attributes when pasted into a top level paragraph', () => {
      const editorState = createEditorState(doc(p('hello {<>} world')));
      const { selection, schema } = editorState;
      expect(
        transformSliceForMedia(sliceWithAttributes(schema), schema)(selection),
      ).toEqual(sliceWithAttributes(schema));
    });
  });
});
