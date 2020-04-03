import { name } from '../../../../version.json';
import { createSchema } from '../../../../schema/create-schema';
import { fromHTML, toHTML, textWithMarks } from '../../../../../test-helpers';

describe(`${name}/schema subsup mark`, () => {
  itMatches('<sub>text</sub>', 'text', { type: 'sub' });
  itMatches('<sup>text</sup>', 'text', { type: 'sup' });

  it('serializes to <sub>', () => {
    const schema = makeSchema();
    const node = schema.text('foo', [
      schema.marks.subsup.create({ type: 'sub' }),
    ]);
    expect(toHTML(node, schema)).toEqual('<sub>foo</sub>');
  });

  it('serializes to <sup>', () => {
    const schema = makeSchema();
    const node = schema.text('foo', [
      schema.marks.subsup.create({ type: 'sup' }),
    ]);
    expect(toHTML(node, schema)).toEqual('<sup>foo</sup>');
  });
});

function makeSchema() {
  return createSchema({
    nodes: ['doc', 'paragraph', 'text'],
    marks: ['subsup'],
  });
}

function itMatches(
  html: string,
  expectedText: string,
  attrs: { type: 'sub' | 'sup' },
) {
  it(`matches ${html}`, () => {
    const schema = makeSchema();
    const doc = fromHTML(`${html}`, schema);
    const subsupNode = schema.marks.subsup.create(attrs);

    expect(textWithMarks(doc, expectedText, [subsupNode])).toBe(true);
  });
}
