import { name } from '../../../../version.json';
import { createSchema } from '../../../../schema/create-schema';
import { fromHTML, toHTML, textWithMarks } from '../../../../../test-helpers';

describe(`${name}/schema code mark`, () => {
  itMatches('<span class="code">text</span>', 'text');
  itMatches('<code>text</code>', 'text');
  itMatches('<tt>text</tt>', 'text');
  itMatches(
    `<span style="font-family: Menlo, Monaco, 'Courier New', monospace;">text</span>`,
    'text',
  );
  itMatches(`<span style="white-space: pre;">text</span>`, 'text');

  it('serializes to <span class="code">', () => {
    const schema = makeSchema();
    const node = schema.text('foo', [schema.marks.code.create()]);
    expect(toHTML(node, schema)).toEqual(
      '<span style="white-space: pre-wrap;" class="code">foo</span>',
    );
  });
});

function makeSchema() {
  return createSchema({
    nodes: ['doc', 'paragraph', 'text'],
    marks: ['code'],
  });
}

function itMatches(html: string, expectedText: string) {
  it(`matches ${html}`, () => {
    const schema = makeSchema();
    const doc = fromHTML(`${html}`, schema);
    const codeNode = schema.marks.code.create();

    expect(textWithMarks(doc, expectedText, [codeNode])).toBe(true);
  });
}
