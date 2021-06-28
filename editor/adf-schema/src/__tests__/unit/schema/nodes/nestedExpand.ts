import { name } from '../../../../version.json';
import { schema, toDOM, fromHTML } from '../../../../../test-helpers';
import { nestedExpand } from '../../../../../src';
import { Schema, Node } from 'prosemirror-model';

const findNestedExpand = (doc: Node, schema: Schema) => {
  let expand: Node | null = null;
  doc.nodesBetween(0, doc.nodeSize - 2, (node) => {
    if (!expand && node.type === schema.nodes.nestedExpand) {
      expand = node;
    }
  });

  return expand as Node | null;
};

describe(`${name}/schema nestedExpand node`, () => {
  describe('parse html', () => {
    it('converts to PM node', () => {
      const doc = fromHTML('<div data-node-type="nestedExpand" />', schema);
      const node = findNestedExpand(doc, schema)!;
      expect(node.type.spec).toEqual(nestedExpand);
    });

    it('gets attributes from html', () => {
      const title = 'Homer Simpson';
      const doc = fromHTML(
        `
        <div
          data-node-type="nestedExpand"
          data-title="${title}"
        ><p>hello</p></div>
      `,
        schema,
      );

      const node = findNestedExpand(doc, schema)!;
      expect(node.attrs.title).toEqual(title);
    });
  });

  describe('encode html', () => {
    it('converts html data attributes to node attributes', () => {
      const title = 'Homer Simpson';
      const content = schema.nodes.paragraph.create(schema.text('hello'));
      const node = schema.nodes.nestedExpand.create({ title }, content);
      const dom = toDOM(node, schema).firstChild as HTMLElement;

      expect(dom.getAttribute('data-node-type')).toEqual('nestedExpand');
      expect(dom.getAttribute('data-title')).toEqual(title);
    });

    it('encodes and decodes to the same node', () => {
      const {
        paragraph,
        nestedExpand,
        table,
        tableRow,
        tableCell,
      } = schema.nodes;

      const title = 'Homer Simpson';
      const content = paragraph.create(schema.text('hello'));
      const node = nestedExpand.create({ title }, content);

      // We must create a table wrapper since nestedExpands are only allow inside tables.
      const cell = tableCell.createChecked(undefined, node);
      const row = tableRow.createChecked(undefined, cell);
      const tableWrapper = table.createChecked(undefined, row);

      const dom = toDOM(node, schema).firstChild as HTMLElement;
      const parsedNode = fromHTML(dom.outerHTML, schema).firstChild!;
      expect(parsedNode).toEqual(tableWrapper);
    });
  });
});
