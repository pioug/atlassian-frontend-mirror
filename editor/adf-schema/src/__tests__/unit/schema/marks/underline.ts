import { name } from '../../../../version.json';
import { createSchema } from '../../../../schema/create-schema';
import { fromHTML, toHTML, textWithMarks } from '../../../../../test-helpers';

describe(`${name}/schema underline mark`, () => {
  itMatches('<u>text</u>', 'text');
  itMatches('<span style="text-decoration: underline">text</span>', 'text');

  it('serializes to <u>', () => {
    const schema = makeSchema();
    const node = schema.text('foo', [schema.marks.underline.create()]);
    expect(toHTML(node, schema)).toEqual('<u>foo</u>');
  });
});

function makeSchema() {
  return createSchema({
    nodes: ['doc', 'paragraph', 'text'],
    marks: ['underline'],
  });
}

function itMatches(html: string, expectedText: string) {
  it(`matches ${html}`, () => {
    const schema = makeSchema();
    const doc = fromHTML(`${html}`, schema);
    const underlineNode = schema.marks.underline.create();

    expect(textWithMarks(doc, expectedText, [underlineNode])).toBe(true);
  });
}
