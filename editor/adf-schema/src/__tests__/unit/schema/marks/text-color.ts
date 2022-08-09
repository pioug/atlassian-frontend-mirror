import { createSchema } from '../../../../schema/create-schema';
import {
  fromHTML,
  toHTML,
  textWithMarks,
} from '@atlaskit/editor-test-helpers/adf-schema';

const testColorObj1 = { color: '#97a0af' };
const testColorObj2 = { color: '#97A0AF' };
const packageName = process.env._PACKAGE_NAME_ as string;

describe(`${packageName}/schema textColor mark`, () => {
  itMatches(
    `<span style="color: rgb(151, 160, 175);">text</span>`,
    'text',
    testColorObj1,
  );
  itMatches(`<span style="color: #97a0af;">text</span>`, 'text', testColorObj1);
  itMatches(`<span style="color: #97A0AF;">text</span>`, 'text', testColorObj1);

  it('serializes to <span style="color: ...">', () => {
    const schema = makeSchema();
    const node = schema.text('foo', [
      schema.marks.textColor.create(testColorObj1),
    ]);
    expect(toHTML(node, schema)).toEqual(
      `<span class=\"fabric-text-color-mark\" style=\"--custom-text-color: ${testColorObj1.color}\" data-text-custom-color=\"#97a0af\">foo</span>`,
    );
  });

  it('serializes to <span style="color: ..."> case preserving', () => {
    const schema = makeSchema();
    const node = schema.text('foo', [
      schema.marks.textColor.create(testColorObj2),
    ]);
    expect(toHTML(node, schema)).toEqual(
      `<span class=\"fabric-text-color-mark\" style=\"--custom-text-color: ${testColorObj2.color}\" data-text-custom-color=\"#97A0AF\">foo</span>`,
    );
  });
});

function makeSchema() {
  return createSchema({
    nodes: ['doc', 'paragraph', 'text'],
    marks: ['textColor'],
  });
}

function itMatches(
  html: string,
  expectedText: string,
  attrs: { color: string },
) {
  it(`matches ${html}`, () => {
    const schema = makeSchema();
    const doc = fromHTML(`${html}`, schema);
    const textColorNode = schema.marks.textColor.create(attrs);

    expect(textWithMarks(doc, expectedText, [textColorNode])).toBe(true);
  });
}
