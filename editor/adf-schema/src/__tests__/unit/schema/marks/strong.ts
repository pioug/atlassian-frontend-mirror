import { name } from '../../../../version.json';
import { createSchema } from '../../../../schema/create-schema';
import { fromHTML, toHTML, textWithMarks } from '../../../../../test-helpers';

describe(`${name}/schema strong mark`, () => {
  itMatches('<strong>text</strong>', 'text');
  itMatches('<b>text</b>', 'text');
  itMatches('<b style="font-weight: bold">text</b>', 'text');
  itMatches('<span style="font-weight: bold">text</span>', 'text');

  it('serializes to <strong>', () => {
    const schema = makeSchema();
    const node = schema.text('foo', [schema.marks.strong.create()]);
    expect(toHTML(node, schema)).toEqual('<strong>foo</strong>');
  });

  it('should not match <b style=font-weight: normal> as strong', () => {
    const schema = makeSchema();
    const doc = fromHTML('<b style="font-weight: normal">text</b>', schema);
    expect(textWithMarks(doc, 'text', [])).toBe(true);
  });
});

function makeSchema() {
  return createSchema({
    nodes: ['doc', 'paragraph', 'text'],
    marks: ['strong'],
  });
}

function itMatches(html: string, expectedText: string) {
  it(`matches ${html}`, () => {
    const schema = makeSchema();
    const doc = fromHTML(html, schema);
    const strong = schema.marks.strong.create();
    expect(textWithMarks(doc, expectedText, [strong])).toBe(true);
  });
}
