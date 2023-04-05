import { createSchema } from '../../../../schema/create-schema';
import { fromHTML, toHTML } from '@atlaskit/editor-test-helpers/adf-schema';

const testAttr = { color: '#172B4D', size: 1 };
const testAttrFalse = { color: '#12345', size: 0 };
const packageName = process.env._PACKAGE_NAME_ as string;

describe(`${packageName}/schema border mark`, () => {
  it('serializes to the correct HTML', () => {
    const schema = makeSchema();
    const node = schema.nodes.media.create(
      {},
      [],
      [schema.marks.border.create(testAttr)],
    );
    const html = toHTML(node, schema);
    expect(html).toContain(
      `data-mark-type="border" data-color="#172B4D" data-size="1" style="--custom-palette-color: var(--ds-text, #172B4D)"`,
    );
  });
});

it('should parse border with color in lower case', () => {
  const schema = makeSchema();
  const doc = fromHTML(
    `<div data-mark-type="border" data-color="${testAttr.color}" data-size="${testAttr.size}"><div data-node-type="media" data-type="file" data-id="dummy-id"></div></div>`,
    schema,
  );
  const dataConsumerNode = doc.firstChild!.firstChild!;

  expect(dataConsumerNode.marks).toHaveLength(1);
  expect(dataConsumerNode.marks[0].type.name).toBe('border');
  expect(dataConsumerNode.marks[0].attrs).toEqual({
    size: testAttr.size,
    color: '#172b4d',
  });
});

it('should parse border with attributes as false if size and color are not expected values', () => {
  const schema = makeSchema();
  const doc = fromHTML(
    `<div data-mark-type="border" data-color="${testAttrFalse.color}" data-size="${testAttrFalse.size}"><div data-node-type="media" data-type="file" data-id="dummy-id"></div></div>`,
    schema,
  );
  const dataConsumerNode = doc.firstChild!.firstChild!;

  expect(dataConsumerNode.marks).toHaveLength(1);
  expect(dataConsumerNode.marks[0].type.name).toBe('border');
  expect(dataConsumerNode.marks[0].attrs).toEqual({
    size: false,
    color: false,
  });
});

it('should parse maximum size as 3', () => {
  const schema = makeSchema();
  const doc = fromHTML(
    `<div data-mark-type="border" data-color="${testAttr.color}" data-size=5><div data-node-type="media" data-type="file" data-id="dummy-id"></div></div>`,
    schema,
  );
  const dataConsumerNode = doc.firstChild!.firstChild!;

  expect(dataConsumerNode.marks).toHaveLength(1);
  expect(dataConsumerNode.marks[0].type.name).toBe('border');
  expect(dataConsumerNode.marks[0].attrs).toEqual({
    size: 3,
    color: '#172b4d',
  });
});

function makeSchema() {
  return createSchema({
    nodes: ['doc', 'paragraph', 'text', 'mediaSingle', 'media', 'caption'],
    marks: ['border'],
  });
}
