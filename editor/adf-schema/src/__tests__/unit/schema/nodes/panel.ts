import { NodeSpec } from 'prosemirror-model';
import { createSchema, SchemaConfig } from '../../../../schema/create-schema';
import { toHTML, fromHTML } from '@atlaskit/editor-test-helpers/adf-schema';
import { panel } from '../../../../schema/nodes/panel';

const schema = makeSchema();
const schemaWithAllowCustomPanel = makeSchema({
  panel: panel(true),
});

const schemaWithoutCustomPanel = makeSchema({
  panel: panel(false),
});
const packageName = process.env._PACKAGE_NAME_ as string;

function expectHtmlWithData(html: string, expectedData: Object) {
  const parser = new DOMParser();
  const dom = parser.parseFromString(html, 'text/html');
  const htmlNode = dom.body?.firstChild as HTMLElement;
  expect(htmlNode).toBeTruthy();
  expect(htmlNode.dataset).toEqual(expect.objectContaining(expectedData));
}

describe(`${packageName}/schema panel node `, () => {
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
    it('should have data-panel-icon, data-panel-color, data-panel-icon-id and data-panel-icon-text when serializing to DOM', () => {
      const html = toHTML(
        schemaWithAllowCustomPanel.nodes.panel.create({
          panelType: 'custom',
          panelIcon: ':smiley:',
          panelColor: '#33FF33',
          panelIconId: '1f603',
          panelIconText: '😃',
        }),
        schemaWithAllowCustomPanel,
      );

      expectHtmlWithData(html, {
        panelType: 'custom',
        panelIcon: ':smiley:',
        panelColor: '#33FF33',
        panelIconId: '1f603',
        panelIconText: '😃',
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
          panelIconId: null,
          panelIconText: null,
        },
      },
      {
        subject: 'icon and color',
        html:
          '<div data-panel-type="custom" data-panel-icon=":smiley:" data-panel-color="#33FF33" data-panel-icon-id="1f603" data-panel-icon-text="😃"><p>testing</p></div>',
        expected: {
          panelType: 'custom',
          panelColor: '#33FF33',
          panelIcon: ':smiley:',
          panelIconId: '1f603',
          panelIconText: '😃',
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
        "<div data-panel-type='tip' data-panel-icon=':smiley:' data-panel-color='#33FF33' data-panel-icon-id='1f603' data-panel-icon-text='😃'><p>testing</p></div>",
        schemaWithAllowCustomPanel,
      );
      const panel = doc.firstChild;
      expect(panel?.type?.name).toContain('panel');
      expect(panel?.attrs).toEqual(
        expect.objectContaining({
          panelIcon: ':smiley:',
          panelColor: '#33FF33',
          panelIconId: '1f603',
          panelIconText: '😃',
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
          panelIconId: null,
          panelIconText: null,
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
          panelIconId: null,
          panelIconText: null,
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
