import { createSchema } from '../../../../schema/create-schema';
import { toHTML, fromHTML } from '@atlaskit/editor-test-helpers/adf-schema';
import { Schema } from '@atlaskit/editor-prosemirror/model';

const packageName = process.env._PACKAGE_NAME_ as string;

describe(`${packageName}/schema confluence-inline-comment mark`, () => {
  let schema: Schema;
  beforeEach(() => {
    schema = makeSchema();
  });

  it('serializes to the correct HTML', () => {
    const node = schema.text('foo', [
      schema.marks.annotation.create({
        id: 'hash-ref-goes-here',
      }),
    ]);

    const html = toHTML(node, schema);
    expect(html).toContain('data-id="hash-ref-goes-here"');
    expect(html).toContain('data-mark-type="annotation"');
    expect(html).toContain('data-mark-annotation-type="inlineComment"');
  });

  it('parses annotation correctly from html', () => {
    const doc = fromHTML(
      `<p><span data-mark-type="annotation" data-mark-annotation-type="inlineComment" data-id="comment-id" >annotated text</span></p>`,
      schema,
    );
    const annotationNode = doc.firstChild!.firstChild!;
    expect(annotationNode.marks).toHaveLength(1);
    expect(annotationNode.marks[0].type.name).toBe('annotation');
    expect(annotationNode.marks[0].attrs).toEqual({
      id: 'comment-id',
      annotationType: 'inlineComment',
    });
  });
});

function makeSchema() {
  return createSchema({
    nodes: ['doc', 'paragraph', 'text'],
    marks: ['annotation'],
  });
}
