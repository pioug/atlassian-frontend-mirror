import { name } from '../../../../version.json';
import { createSchema } from '../../../../schema/create-schema';
import { fromHTML, toHTML, textWithMarks } from '../../../../../test-helpers';

describe(`${name}/schema em mark`, () => {
  itMatches('<em>text</em>', 'text');
  itMatches('<i>text</i>', 'text');
  itMatches('<span style="font-style: italic">text</span>', 'text');

  it('serializes to <em>', () => {
    const schema = makeSchema();
    const node = schema.text('foo', [schema.marks.em.create()]);
    expect(toHTML(node, schema)).toEqual('<em>foo</em>');
  });
});

function makeSchema() {
  return createSchema({
    nodes: ['doc', 'paragraph', 'text'],
    marks: ['em'],
  });
}

function itMatches(html: string, expectedText: string) {
  it(`matches ${html}`, () => {
    const schema = makeSchema();
    const doc = fromHTML(`${html}`, schema);
    const emNode = schema.marks.em.create();

    expect(textWithMarks(doc, expectedText, [emNode])).toBe(true);
  });
}
