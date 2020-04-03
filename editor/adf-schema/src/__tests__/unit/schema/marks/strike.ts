import { name } from '../../../../version.json';
import { createSchema } from '../../../../schema/create-schema';
import { fromHTML, toHTML, textWithMarks } from '../../../../../test-helpers';

describe(`${name}/schema strike mark`, () => {
  itMatches('<s>text</s>', 'text');
  itMatches('<del>text</del>', 'text');
  itMatches('<strike>text</strike>', 'text');
  itMatches('<span style="text-decoration: line-through">text</span>', 'text');

  it('serializes to <s>', () => {
    const schema = makeSchema();
    const node = schema.text('foo', [schema.marks.strike.create()]);
    expect(toHTML(node, schema)).toEqual('<s>foo</s>');
  });
});

function makeSchema() {
  return createSchema({
    nodes: ['doc', 'paragraph', 'text'],
    marks: ['strike'],
  });
}

function itMatches(html: string, expectedText: string) {
  it(`matches ${html}`, () => {
    const schema = makeSchema();
    const doc = fromHTML(html, schema);
    const strike = schema.marks.strike.create();
    expect(textWithMarks(doc, expectedText, [strike])).toBe(true);
  });
}
