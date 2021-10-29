import { NodeSpec } from 'prosemirror-model';
import { name } from '../../../../version.json';
import { createSchema, SchemaConfig } from '../../../../schema/create-schema';
import { toHTML, fromHTML } from '../../../../../test-helpers';
import { customPanel } from '../../../../schema/nodes/panel';

const schema = makeSchema();
const schemaWithAllowCustomPanel = makeSchema({
  panel: customPanel(true),
});

const schemaWithoutCustomPanel = makeSchema({
  panel: customPanel(false),
});

function expectHtmlWithData(html: string, expectedData: Object) {
  const parser = new DOMParser();
  const dom = parser.parseFromString(html, 'text/html');
  const htmlNode = dom.body?.firstChild as HTMLElement;
  expect(htmlNode).toBeTruthy();
  expect(htmlNode.dataset).toEqual(expect.objectContaining(expectedData));
}

describe(`${name}/schema panel node `, () => {
  describe('With default panel NodeSpec ', () => {
    it('should have data-panel-type when serializing to DOM', () => {
      const html = toHTML(
        schema.nodes.panel.create({ panelType: 'info' }),
        schema,
      );
      expectHtmlWithData(html, {
        panelType: 'info',
      });
    });

    it('should have info panel type by default', () => {
      const html = toHTML(schema.nodes.panel.create(), schema);
      expectHtmlWithData(html, {
        panelType: 'info',
      });
    });
  });

  describe('With CustomPanel NodeSpec FF On ', () => {
    it('should have data-panel-icon and data-panel-color when serializing to DOM', () => {
      const html = toHTML(
        schemaWithAllowCustomPanel.nodes.panel.create({
          panelType: 'custom',
          panelIcon: ':smiley:',
          panelColor: '#33FF33',
        }),
        schemaWithAllowCustomPanel,
      );

      expectHtmlWithData(html, {
        panelType: 'custom',
        panelIcon: ':smiley:',
        panelColor: '#33FF33',
      });
    });

    describe.each([
      {
        subject: 'panelType',
        html: '<div data-panel-type="tip"><p>testing</p></div>',
        expected: {
          panelType: 'tip',
          panelColor: null,
          panelIcon: null,
        },
      },
      {
        subject: 'icon and color',
        html:
          '<div data-panel-type="custom" data-panel-icon=":smiley:" data-panel-color="#33FF33"><p>testing</p></div>',
        expected: {
          panelType: 'custom',
          panelColor: '#33FF33',
          panelIcon: ':smiley:',
        },
      },
    ])('extract correct values', ({ html, subject, expected }) => {
      it(`for ${subject}`, () => {
        const doc = fromHTML(html, schemaWithAllowCustomPanel);
        const panel = doc.firstChild!;
        expect(panel.type.name).toContain('panel');
        expect(panel.attrs).toEqual(expected);
      });
    });

    it('should extract the correct attributes of panelType', () => {
      const doc = fromHTML(
        "<div data-panel-type='tip' data-panel-icon=':smiley:' data-panel-color='#33FF33'><p>testing</p></div>",
        schemaWithAllowCustomPanel,
      );
      const panel = doc.firstChild;
      expect(panel?.type?.name).toContain('panel');
      expect(panel?.attrs).toEqual(
        expect.objectContaining({
          panelIcon: ':smiley:',
          panelColor: '#33FF33',
        }),
      );
    });
  });

  describe('With CustomPanel NodeSpec FF Off ', () => {
    describe.each([
      {
        subject: 'panelType',
        html: '<div data-panel-type="info"><p>testing</p></div>',
        expected: {
          panelType: 'info',
          panelColor: null,
          panelIcon: null,
        },
      },
      {
        subject: 'icon and color',
        html:
          '<div data-panel-type="custom" data-panel-icon=":smiley:" data-panel-color="#33FF33"><p>testing</p></div>',
        expected: {
          panelType: 'info',
          panelColor: null,
          panelIcon: null,
        },
      },
    ])('extract correct values', ({ html, subject, expected }) => {
      it(`for ${subject}`, () => {
        const doc = fromHTML(html, schemaWithoutCustomPanel);
        const panel = doc.firstChild!;
        expect(panel.type.name).toContain('panel');
        expect(panel.attrs).toEqual(expected);
      });
    });

    it('should have data-panel-type when serializing to DOM', () => {
      const html = toHTML(
        schemaWithoutCustomPanel.nodes.panel.create({
          panelType: 'info',
        }),
        schemaWithoutCustomPanel,
      );

      expectHtmlWithData(html, {
        panelType: 'info',
      });
    });
  });
});

function makeSchema(customNodeSpecs?: { [key: string]: NodeSpec }) {
  const config: SchemaConfig = {
    nodes: [
      'doc',
      'paragraph',
      'heading',
      'text',
      'panel',
      'orderedList',
      'bulletList',
      'listItem',
    ],
  };
  return customNodeSpecs
    ? createSchema({ ...config, customNodeSpecs })
    : createSchema(config);
}
