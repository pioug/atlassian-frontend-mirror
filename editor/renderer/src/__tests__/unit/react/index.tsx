// eslint-disable-next-line import/no-extraneous-dependencies -- Removed import for fixing circular dependencies
import { mountWithIntl } from '@atlaskit/editor-test-helpers/enzyme';
// eslint-disable-next-line @typescript-eslint/consistent-type-imports
import { shallow, ReactWrapper } from 'enzyme';
import { ReactSerializer } from '../../../index';
import { createSchema } from '@atlaskit/adf-schema';
import {
  defaultSchemaConfig,
  getSchemaBasedOnStage,
  defaultSchema as schema,
} from '@atlaskit/adf-schema/schema-default';
import {
  Heading,
  Expand,
  Emoji,
  LayoutColumn,
  Panel,
  Table,
  Extension,
  BodiedExtension,
  InlineExtension,
} from '../../../react/nodes';
import { DataConsumer } from '../../../react/marks';
import type { MediaSSR } from '../../../types/mediaOptions';

import * as doc from '../../__fixtures__/hello-world.adf.json';
import * as dataConsumerDoc from '../../__fixtures__/data-consumer.adf.json';
import * as headingDoc from '../../__fixtures__/heading-doc.adf.json';
import * as nestedHeadingsDoc from '../../__fixtures__/nested-headings-adf.json';
import * as nestedHeadingsWithPanelLayoutTableDoc from '../../__fixtures__/nested-headings-adf-panel-layout-table.json';
import * as mediaFragment from '../../__fixtures__/media-fragment.json';
import * as mediaGroupFragment from '../../__fixtures__/media-group-fragment.json';
import * as linkDoc from '../../__fixtures__/links.adf.json';
import * as expandWithMedia from '../../__fixtures__/expand-with-media.adf.json';
import * as nestedExpandWithMedia from '../../__fixtures__/nested-expand-with-media.json';
import * as layoutWithMedia from '../../__fixtures__/layout-with-media.json';
import * as tableWithMedia from '../../__fixtures__/table-with-media.json';
import type { Node as PMNode } from '@atlaskit/editor-prosemirror/model';
import type { AnalyticsEventPayload } from '../../../analytics/events';
// eslint-disable-next-line import/no-extraneous-dependencies -- Removed import for fixing circular dependencies
import { renderWithIntl } from '@atlaskit/editor-test-helpers/rtl';
import { screen, waitFor, within } from '@testing-library/react';
import { act } from 'react-dom/test-utils';

const docFromSchema = schema.nodeFromJSON(doc);
const headingDocFromSchema = schema.nodeFromJSON(headingDoc);
const stage0schema = getSchemaBasedOnStage('stage0');
const dataConsumerDocFromSchema = stage0schema.nodeFromJSON(dataConsumerDoc);
const nestedHeadingsDocFromSchema = schema.nodeFromJSON(nestedHeadingsDoc);
const nestedHeadingsWithPanelLayoutTableDocFromSchema = schema.nodeFromJSON(
  nestedHeadingsWithPanelLayoutTableDoc,
);
const linksDocFromSchema = schema.nodeFromJSON(linkDoc);

const getMedia = (wrapper: ReactWrapper<any, any, any>) => {
  return wrapper.findWhere(
    (item: ReactWrapper) =>
      item.is('LoadableComponent') && item.prop('nodeType') === 'media',
  );
};

const getMediaSingle = (wrapper: ReactWrapper<any, any, any>) => {
  return wrapper.findWhere(
    (item: ReactWrapper) =>
      item.prop('nodeType') === 'mediaSingle' && !!item.prop('intl'),
  );
};

describe('Renderer - ReactSerializer', () => {
  beforeAll(async () => {
    /*
      Async nodes used need to be preloaded before testing, otherwise the first mount
      will have the loading component and not the actual node.
    */
    await Promise.all([Emoji.preload()]);
  });

  describe('serializeFragment', () => {
    describe('with varied data consumer marks on extension nodes', () => {
      /**
       * This should loosely cover the contract for nodes rendering different
       * mark elements based on whether it's inline or not
       */
      it('should render document', () => {
        const reactSerializer = new ReactSerializer({});
        const wrapper = mountWithIntl(
          reactSerializer.serializeFragment(
            dataConsumerDocFromSchema.content,
          ) as any,
        );

        const root = wrapper.find('div');
        const extension = root.find(Extension);
        const bodiedExtension = root.find(BodiedExtension);
        const inlineExtension = root.find(InlineExtension);

        const dataConsumer = root.find(DataConsumer);

        const paragraph = root.find('p');

        expect(root.length).not.toEqual(0);
        expect(extension.length).toEqual(1);
        expect(bodiedExtension.length).toEqual(1);
        expect(inlineExtension.length).toEqual(1);
        expect(dataConsumer.length).toEqual(3);
        expect(paragraph.length).toEqual(2);

        // block level extensions (extension+bodied extension) should be wrapped with span
        expect(extension.parent().get(0).type).toEqual('div');
        expect(bodiedExtension.parent().get(0).type).toEqual('div');
        // inline Extension should be wrapped with span
        expect(inlineExtension.parent().get(0).type).toEqual('span');

        wrapper.unmount();
      });
    });

    it('should render document', () => {
      const reactSerializer = new ReactSerializer({});
      const wrapper = mountWithIntl(
        reactSerializer.serializeFragment(docFromSchema.content) as any,
      );

      const root = wrapper.find('div');
      const paragraph = root.find('p');
      const link = paragraph.find('a');
      const strong = link.find('strong');

      expect(root.length).toEqual(1);
      expect(paragraph.length).toEqual(1);
      expect(link.length).toEqual(1);
      expect(strong.length).toEqual(1);

      expect(link.text()).toEqual('Hello, World!');
      expect(link.props()).toHaveProperty('href', 'https://www.atlassian.com');
      expect(strong.text()).toEqual('World!');
      wrapper.unmount();
    });
    describe('unsupported nodes', () => {
      describe('block nodes', () => {
        const unsupportedNodeJson = {
          type: 'unsupportedBlock',
          attrs: {
            originalValue: {
              attrs: {
                panelType: 'info',
              },
              content: [
                {
                  type: 'paragraph',
                  content: [
                    {
                      type: 'text',
                      text: 'text in panel',
                    },
                  ],
                },
              ],
            },
          },
        };
        const unsupportedBlockJSON = {
          version: 1,
          type: 'doc',
          content: [unsupportedNodeJson],
        };
        const unsupportBlockNode = schema.nodeFromJSON(unsupportedBlockJSON);

        it('should pass node value for unsupported block', () => {
          const reactSerializer = new ReactSerializer({});
          const wrapper = mountWithIntl(
            reactSerializer.serializeFragment(
              unsupportBlockNode.content,
            ) as any,
          );
          const unsupportedBlock = wrapper.find('UnsupportedBlockNode');
          const unspportedBlockNodeProp = unsupportedBlock.prop(
            'node',
          ) as PMNode;
          expect(unspportedBlockNodeProp.toJSON()).toEqual(unsupportedNodeJson);
        });

        it(`should have dispatchAnalyticsEvent as prop for unsupported
              block when serializer is enabled with analytics `, () => {
          const mockFireAnalyticsEvent = jest.fn(
            (event: AnalyticsEventPayload) => {},
          );
          const reactSerializer = new ReactSerializer({
            fireAnalyticsEvent: mockFireAnalyticsEvent,
          });
          const wrapper = mountWithIntl(
            reactSerializer.serializeFragment(
              unsupportBlockNode.content,
            ) as any,
          );
          const unsupportedBlock = wrapper.find('UnsupportedBlockNode');
          const dispatchAnalyticsEventProp = unsupportedBlock.prop(
            'dispatchAnalyticsEvent',
          );
          expect(dispatchAnalyticsEventProp).toEqual(mockFireAnalyticsEvent);
          wrapper.unmount();
        });

        it(`should have not dispatchAnalyticsEvent as prop for unsupported
              block when serializer is not enabled with analytics `, () => {
          const reactSerializer = new ReactSerializer({});
          const wrapper = mountWithIntl(
            reactSerializer.serializeFragment(
              unsupportBlockNode.content,
            ) as any,
          );
          const unsupportedBlock = wrapper.find('UnsupportedBlockNode');
          const dispatchAnalyticsEventProp = unsupportedBlock.prop(
            'dispatchAnalyticsEvent',
          );
          expect(dispatchAnalyticsEventProp).toBeUndefined();
          wrapper.unmount();
        });
      });

      describe('inline nodes', () => {
        const unsupportedNodeJson = {
          type: 'unsupportedInline',
          attrs: {
            originalValue: {
              attrs: {
                some: 'value',
              },
            },
          },
        };
        const unsupportedInlineJSON = {
          version: 1,
          type: 'doc',
          content: [unsupportedNodeJson],
        };
        const unsupportInlineNode = schema.nodeFromJSON(unsupportedInlineJSON);

        it('should pass node value for unsupported inline', () => {
          const reactSerializer = new ReactSerializer({});
          const wrapper = mountWithIntl(
            reactSerializer.serializeFragment(
              unsupportInlineNode.content,
            ) as any,
          );
          const unsupportedInline = wrapper.find('UnsupportedInlineNode');
          const unspportedInlineNodeProp = unsupportedInline.prop(
            'node',
          ) as PMNode;
          expect(unspportedInlineNodeProp.toJSON()).toEqual(
            unsupportedNodeJson,
          );
          wrapper.unmount();
        });

        it(`should have dispatchAnalyticsEvent as prop for unsupported
                Inline when serializer is enabled with analytics `, () => {
          const mockFireAnalyticsEvent = jest.fn(
            (event: AnalyticsEventPayload) => {},
          );
          const reactSerializer = new ReactSerializer({
            fireAnalyticsEvent: mockFireAnalyticsEvent,
          });
          const wrapper = mountWithIntl(
            reactSerializer.serializeFragment(
              unsupportInlineNode.content,
            ) as any,
          );
          const unsupportedInline = wrapper.find('UnsupportedInlineNode');
          const dispatchAnalyticsEventProp = unsupportedInline.prop(
            'dispatchAnalyticsEvent',
          );
          expect(dispatchAnalyticsEventProp).toEqual(mockFireAnalyticsEvent);
          wrapper.unmount();
        });

        it(`should have not dispatchAnalyticsEvent as prop for unsupported
                Inline when serializer is not enabled with analytics `, () => {
          const reactSerializer = new ReactSerializer({});
          const wrapper = mountWithIntl(
            reactSerializer.serializeFragment(
              unsupportInlineNode.content,
            ) as any,
          );
          const unsupportedInline = wrapper.find('UnsupportedInlineNode');
          const dispatchAnalyticsEventProp = unsupportedInline.prop(
            'dispatchAnalyticsEvent',
          );
          expect(dispatchAnalyticsEventProp).toBeUndefined();
          wrapper.unmount();
        });
      });
    });
  });

  describe('buildMarkStructure', () => {
    const { em, strong, link, textColor, subsup } = schema.marks;

    it('should wrap text nodes with marks', () => {
      const textNodes = [
        schema.text('Hello '),
        schema.text('World!', [strong.create()]),
      ];

      const output = ReactSerializer.buildMarkStructure(textNodes);
      expect(output[0].type.name).toEqual('text');
      expect((output[0] as any).text).toEqual('Hello ');
      expect(output[1].type.name).toEqual('strong');
      expect((output[1] as any).content[0].type.name).toEqual('text');
      expect((output[1] as any).content[0].text).toEqual('World!');
    });

    it('should not merge marks when parent mark is different', () => {
      const textNodes = [
        schema.text('Hello ', [em.create(), subsup.create({ type: 'sup' })]),
        schema.text('World!', [subsup.create({ type: 'sup ' })]),
      ];

      const output = ReactSerializer.buildMarkStructure(textNodes);
      expect(output[0].type.name).toEqual('em');
      expect(output[1].type.name).toEqual('subsup');
    });

    it('should merge same marks when possible', () => {
      const textNodes = [
        schema.text('Hello ', [
          link.create({ href: 'https://www.atlassian.com' }),
          em.create(),
          strong.create(),
        ]),
        schema.text('World ', [
          link.create({ href: 'https://www.atlassian.com' }),
          em.create(),
        ]),
      ];

      const output = ReactSerializer.buildMarkStructure(textNodes);
      expect(output.length).toEqual(1);
      expect(output[0].type.name).toEqual('link');

      const { content } = output[0] as any;
      expect(content.length).toEqual(1);
      expect(content[0].type.name).toEqual('em');
      expect(content[0].content.length).toEqual(2);
      expect(content[0].content[0].type.name).toEqual('strong');
      expect(content[0].content[1].type.name).toEqual('text');
    });

    it('should merge mark nodes with text color', () => {
      const textNodes = [
        schema.text('2Pac '),
        schema.text('Ice Blue!', [
          strong.create(),
          textColor.create({ color: '#aaeebb' }),
        ]),
        schema.text('KL Jay', [strong.create()]),
        schema.text('Rihana', [strong.create()]),
      ];

      const output = ReactSerializer.buildMarkStructure(textNodes);
      expect(output.length).toEqual(2);
      expect(output[0].type.name).toEqual('text');
      expect(output[1].type.name).toEqual('strong');
      expect((output[1] as any).content[0].attrs).toEqual({
        color: '#aaeebb',
      });
    });

    it('should merge mark nodes with link', () => {
      const textNodes = [
        schema.text('2Pac '),
        schema.text('This is', [link.create({ href: 'gnu.org' })]),
        schema.text('the link. ', [
          em.create(),
          link.create({ href: 'gnu.org' }),
        ]),
        schema.text('not here', [strong.create()]),
      ];

      const output = ReactSerializer.buildMarkStructure(textNodes);
      expect(output.length).toEqual(3);
      expect(output[0].type.name).toEqual('text');
      expect(output[1].type.name).toEqual('link');
      expect(output[2].type.name).toEqual('strong');

      expect((output[1] as any).content.length).toEqual(2);
    });
  });

  describe('getMarks', () => {
    const { strong, strike, underline } = schema.marks;
    const node = schema.text('Hello World', [
      strike.create(),
      underline.create(),
      strong.create(),
    ]);

    it('should sort marks', () => {
      const sortedMarks = ReactSerializer.getMarks(node);
      expect(sortedMarks[0].type.name).toEqual('strong');
      expect(sortedMarks[1].type.name).toEqual('strike');
      expect(sortedMarks[2].type.name).toEqual('underline');
    });
  });

  describe('media', () => {
    describe('when inside of', () => {
      describe('expand', () => {
        it('media node has isInsideOfBlockNode as true', async () => {
          const reactSerializer = new ReactSerializer({});

          const { container } = renderWithIntl(
            reactSerializer.serializeFragment(
              schema.nodeFromJSON(expandWithMedia).content,
            ) as any,
          );
          // Pretty shitty test, as the original Enzyme test was checking isInsideOfBlockNode which has zero impact on actually rendered stuff in this test
          await waitFor(() =>
            expect(
              container.querySelector('[data-node-type="mediaSingle"]'),
            ).toHaveAttribute('data-width-type', 'percentage'),
          );
          expect(
            container.querySelector('[data-node-type="mediaSingle"]'),
          ).not.toHaveAttribute('data-width');
        });
      });

      describe('unsupported nodes', () => {
        it('should return isInsideOfBlockNode as false', async () => {
          const schemaWithUnsupportedNodes = createSchema({
            ...defaultSchemaConfig,
            nodes: defaultSchemaConfig.nodes.filter(
              (node) =>
                [
                  'expand',
                  'nestedExpand',
                  'layoutColumn',
                  'layoutSection',
                ].indexOf(node) === -1,
            ),
          });
          const reactSerializer = new ReactSerializer({});

          const wrapper = mountWithIntl(
            reactSerializer.serializeFragment(
              schemaWithUnsupportedNodes.nodeFromJSON(tableWithMedia).content,
            ) as any,
          );

          await waitFor(() =>
            expect(
              getMediaSingle(wrapper).first().prop('isInsideOfBlockNode'),
            ).toBeFalsy(),
          );
          wrapper.unmount();
        });
      });

      describe('tables -> nestedExpand', () => {
        it('media node has isInsideOfBlockNode as true', async () => {
          const reactSerializer = new ReactSerializer({});

          const wrapper = mountWithIntl(
            reactSerializer.serializeFragment(
              schema.nodeFromJSON(nestedExpandWithMedia).content,
            ) as any,
          );

          await waitFor(() =>
            expect(getMediaSingle(wrapper).prop('isInsideOfBlockNode')).toEqual(
              true,
            ),
          );

          wrapper.unmount();
        });
      });

      describe('layoutSection -> layoutColumn', () => {
        it('media node has isInsideOfBlockNode as true', async () => {
          const reactSerializer = new ReactSerializer({});

          const wrapper = mountWithIntl(
            reactSerializer.serializeFragment(
              schema.nodeFromJSON(layoutWithMedia).content,
            ) as any,
          );

          await waitFor(() =>
            expect(getMediaSingle(wrapper).prop('isInsideOfBlockNode')).toEqual(
              true,
            ),
          );
          wrapper.unmount();
        });
      });
    });

    describe('when default shouldOpenMediaViewer is false', () => {
      it('media node has shouldOpenMediaViewer set to default value when parent is not mediaSingle', async () => {
        const reactSerializer = new ReactSerializer({
          shouldOpenMediaViewer: false,
        });

        const wrapper = mountWithIntl(
          reactSerializer.serializeFragment(
            schema.nodeFromJSON(mediaGroupFragment).content,
          ) as any,
        );

        // Media under media group takes 2 ticks to render.
        await act(async () => {
          await new Promise(process.nextTick);
          await new Promise(process.nextTick);
        });
        wrapper.update();

        expect(getMedia(wrapper).prop('shouldOpenMediaViewer')).toEqual(false);
        wrapper.unmount();
      });

      it('media node without parent has shouldOpenMediaViewer set to false', async () => {
        const reactSerializer = new ReactSerializer({
          shouldOpenMediaViewer: false,
        });

        const wrapper = mountWithIntl(
          reactSerializer.serializeFragment(
            schema.nodeFromJSON(mediaFragment).content,
          ) as any,
        );

        // Media under media group takes 2 ticks to render.
        await act(async () => {
          await new Promise(process.nextTick);
          await new Promise(process.nextTick);
        });
        wrapper.update();

        expect(getMedia(wrapper).prop('shouldOpenMediaViewer')).toEqual(false);
        wrapper.unmount();
      });
    });

    describe('when default shouldOpenMediaViewer is true', () => {
      it('media node has shouldOpenMediaViewer set to default value when parent is not mediaSingle', async () => {
        const reactSerializer = new ReactSerializer({
          shouldOpenMediaViewer: true,
        });

        const wrapper = mountWithIntl(
          reactSerializer.serializeFragment(
            schema.nodeFromJSON(mediaGroupFragment).content,
          ) as any,
        );

        // Media under media group takes 2 ticks to render.
        await act(async () => {
          await new Promise(process.nextTick);
          await new Promise(process.nextTick);
        });
        wrapper.update();

        expect(getMedia(wrapper).prop('shouldOpenMediaViewer')).toEqual(true);
        wrapper.unmount();
      });

      it('media without parent has shouldOpenMediaViewer set to true', () => {
        const reactSerializer = new ReactSerializer({
          shouldOpenMediaViewer: true,
        });

        const wrapper = mountWithIntl(
          reactSerializer.serializeFragment(
            schema.nodeFromJSON(mediaFragment).content,
          ) as any,
        );

        expect(getMedia(wrapper).prop('shouldOpenMediaViewer')).toEqual(true);
        wrapper.unmount();
      });
    });

    describe('when default shouldOpenMediaViewer is undefined', () => {
      it('media node has shouldOpenMediaViewer set to undefined when parent is not mediaSingle', async () => {
        const reactSerializer = new ReactSerializer({});

        const wrapper = mountWithIntl(
          reactSerializer.serializeFragment(
            schema.nodeFromJSON(mediaGroupFragment).content,
          ) as any,
        );

        await waitFor(() =>
          expect(getMedia(wrapper).prop('shouldOpenMediaViewer')).toEqual(
            undefined,
          ),
        );
        wrapper.unmount();
      });

      it('media mode without parent has shouldOpenMediaViewer set to undefined', () => {
        const reactSerializer = new ReactSerializer({});

        const wrapper = mountWithIntl(
          reactSerializer.serializeFragment(
            schema.nodeFromJSON(mediaFragment).content,
          ) as any,
        );

        expect(getMedia(wrapper).prop('shouldOpenMediaViewer')).toEqual(
          undefined,
        );
        wrapper.unmount();
      });
    });

    describe('Media SSR', () => {
      it('should pass ssr prop to media card', () => {
        const ssr: MediaSSR = {
          mode: 'server',
          config: {
            authProvider: () => Promise.reject(new Error('do not use')),
            initialAuth: {
              clientId: 'clientId',
              token: 'token',
              baseUrl: 'baseUrl',
            },
          },
        };

        const reactSerializer = new ReactSerializer({
          media: { ssr },
        });

        const wrapper = mountWithIntl(
          reactSerializer.serializeFragment(
            schema.nodeFromJSON(mediaFragment).content,
          ) as any,
        );

        expect(getMedia(wrapper).prop('ssr')).toEqual(ssr);
        wrapper.unmount();
      });
    });
  });

  describe('link mark', () => {
    it('has correct isMediaLink value when link mark is applied on media', () => {
      const reactSerializer = new ReactSerializer({ allowMediaLinking: true });
      const wrapper = shallow(
        reactSerializer.serializeFragment(linksDocFromSchema.content) as any,
      );
      expect(wrapper.find('Link').first().prop('isMediaLink')).toEqual(true);
    });

    it('has correct isMediaLink value when link mark is not applied on media', () => {
      const reactSerializer = new ReactSerializer({ allowMediaLinking: true });
      const wrapper = shallow(
        reactSerializer.serializeFragment(linksDocFromSchema.content)!,
      );
      expect(wrapper.find('Link').last().prop('isMediaLink')).toBeFalsy();
    });

    it('does not render when allowMediaLinking is undefined', () => {
      const reactSerializer = new ReactSerializer({});
      const wrapper = shallow(
        reactSerializer.serializeFragment(linksDocFromSchema.content)!,
      );
      expect(wrapper.find('Link')).toHaveLength(1);
    });

    it('does not render when allowMediaLinking is false', () => {
      const reactSerializer = new ReactSerializer({ allowMediaLinking: false });
      const wrapper = shallow(
        reactSerializer.serializeFragment(linksDocFromSchema.content)!,
      );
      expect(wrapper.find('Link')).toHaveLength(1);
    });

    it('does render when allowMediaLinking is true', () => {
      const reactSerializer = new ReactSerializer({ allowMediaLinking: true });
      const wrapper = shallow(
        reactSerializer.serializeFragment(linksDocFromSchema.content)!,
      );
      expect(wrapper.find('Link')).toHaveLength(2);
    });
  });

  describe('Heading IDs', () => {
    it('should render headings with unique ids based on node content', () => {
      const reactSerializer = new ReactSerializer({});
      const wrapper = shallow(
        reactSerializer.serializeFragment(headingDocFromSchema.content) as any,
      );

      const headings = wrapper.find(Heading);
      expect(headings.at(0).prop('headingId')).toEqual('Heading-1');
      expect(headings.at(1).prop('headingId')).toEqual('Heading-2');
      expect(headings.at(2).prop('headingId')).toEqual('Heading-1.1');
      expect(headings.at(3).prop('headingId')).toEqual('Heading-2.1');
      expect(headings.at(4).prop('headingId')).toEqual(
        '!with-special-@!@#$%^&*()-characters-1?',
      );
      expect(headings.at(5).prop('headingId')).toEqual(
        'CJK-characters-中文-日文-한국어',
      );
      expect(headings.at(6).prop('headingId')).toEqual('white----spaces');
      expect(headings.at(7).prop('headingId')).toEqual('❤😏status[date]');
    });

    it('should not render heading ids if "disableHeadingIDs" is true', () => {
      const reactSerializer = new ReactSerializer({
        disableHeadingIDs: true,
      });
      const wrapper = shallow(
        reactSerializer.serializeFragment(headingDocFromSchema.content) as any,
      );

      const headings = wrapper.find(Heading);
      expect(headings.at(0).prop('headingId')).toEqual(undefined);
      expect(headings.at(1).prop('headingId')).toEqual(undefined);
      expect(headings.at(2).prop('headingId')).toEqual(undefined);
      expect(headings.at(3).prop('headingId')).toEqual(undefined);
    });
  });

  describe('Nested Headings', () => {
    describe('inside expands', () => {
      it('should provide nested header ids to expand nodes through props', () => {
        const reactSerializer = new ReactSerializer({
          allowHeadingAnchorLinks: {
            allowNestedHeaderLinks: true,
          },
        });
        const wrapper = shallow(
          reactSerializer.serializeFragment(
            nestedHeadingsDocFromSchema.content,
          ) as any,
        );
        const expands = wrapper.find(Expand);
        expect(expands.at(0).prop('nestedHeaderIds')).toEqual([
          'test1',
          'test2',
          'test3',
          'test4',
          'test5',
          'test6',
        ]);
        expect(expands.at(1).prop('nestedHeaderIds')).toEqual(['test7']);
        expect(expands.at(2).prop('nestedHeaderIds')).toEqual([]);
      });

      it('should not provide nested header ids prop to expand nodes when allowNestedHeadersLinks is false', () => {
        const reactSerializer = new ReactSerializer({
          allowHeadingAnchorLinks: {
            allowNestedHeaderLinks: false,
          },
        });
        const wrapper = shallow(
          reactSerializer.serializeFragment(
            nestedHeadingsDocFromSchema.content,
          ) as any,
        );
        const expands = wrapper.find(Expand);
        expect(expands.at(0).prop('nestedHeaderIds')).toBeUndefined();
        expect(expands.at(1).prop('nestedHeaderIds')).toBeUndefined();
        expect(expands.at(2).prop('nestedHeaderIds')).toBeUndefined();
      });

      it('should not provide nested header ids prop to expand nodes when allowHeadingAnchorLinks is true', () => {
        const reactSerializer = new ReactSerializer({
          allowHeadingAnchorLinks: true,
        });
        const wrapper = shallow(
          reactSerializer.serializeFragment(
            nestedHeadingsDocFromSchema.content,
          ) as any,
        );
        const expands = wrapper.find(Expand);
        expect(expands.at(0).prop('nestedHeaderIds')).toBeUndefined();
        expect(expands.at(1).prop('nestedHeaderIds')).toBeUndefined();
        expect(expands.at(2).prop('nestedHeaderIds')).toBeUndefined();
      });
    });

    describe('NHAL: Inside a table, layout, or panel', () => {
      const reactSerializer = new ReactSerializer({
        allowHeadingAnchorLinks: {
          allowNestedHeaderLinks: true,
        },
      });
      const wrapper = mountWithIntl(
        reactSerializer.serializeFragment(
          nestedHeadingsWithPanelLayoutTableDocFromSchema.content,
        ) as any,
      );

      it('should have a heading anchor within a table', () => {
        const tableWithHeadingAnchor = wrapper
          .find(Table)
          .find('HeadingAnchor');
        expect(tableWithHeadingAnchor).toBeDefined();
      });

      it('should have heading anchor within a layout', () => {
        const layoutWithHeadingAnchor = wrapper
          .find(LayoutColumn)
          .find('HeadingAnchor');
        expect(layoutWithHeadingAnchor).toBeDefined();
      });

      it('should have heading anchor within a panel', () => {
        const panelWithHeadingAnchor = wrapper
          .find(Panel)
          .find('HeadingAnchor');
        expect(panelWithHeadingAnchor).toBeDefined();
      });

      wrapper.unmount();
    });

    describe('Legacy: Inside a table, layout, or panel', () => {
      beforeEach(() => {
        const reactSerializer = new ReactSerializer({
          allowHeadingAnchorLinks: {
            allowNestedHeaderLinks: false,
          },
        });
        renderWithIntl(
          reactSerializer.serializeFragment(
            nestedHeadingsWithPanelLayoutTableDocFromSchema.content,
          ) as any,
        );
      });

      it('should not have a heading anchor within a table', () => {
        const heading1 = screen.getByRole('heading', {
          name: 'Col1',
        });
        expect(within(heading1).queryByRole('button')).not.toBeInTheDocument();
        const heading2 = screen.getByRole('heading', {
          name: 'Col 2',
        });
        expect(within(heading2).queryByRole('button')).not.toBeInTheDocument();
        const heading3 = screen.getByRole('heading', {
          name: 'Col3',
        });
        expect(within(heading3).queryByRole('button')).not.toBeInTheDocument();
      });

      it('should have heading anchor within a layout', () => {
        const heading1 = screen.getByRole('heading', {
          name: 'Header inside Layout Copy',
        });
        expect(
          within(heading1).getByRole('button', {
            name: 'Copy link to heading',
          }),
        ).toBeEnabled(); // we've got the legacy support this already
        const heading2 = screen.getByRole('heading', {
          name: 'Header inside Layout 2 Copy',
        });
        expect(
          within(heading2).getByRole('button', {
            name: 'Copy link to heading',
          }),
        ).toBeEnabled(); // we've got the legacy support this already
      });

      it('should not have heading anchor within a panel', () => {
        const heading = screen.getByRole('heading', {
          name: 'Header in a Panel',
        });
        expect(within(heading).queryByRole('button')).not.toBeInTheDocument();
      });
    });
  });

  describe('Table: Numbered Columns', () => {
    const tableDoc = {
      type: 'doc',
      version: 1,
      content: [
        {
          type: 'table',
          attrs: {
            isNumberColumnEnabled: true,
          },
          content: [
            {
              type: 'tableRow',
              content: [
                {
                  type: 'tableHeader',
                  content: [
                    {
                      type: 'paragraph',
                      content: [
                        {
                          type: 'text',
                          text: 'Header content 1',
                        },
                      ],
                    },
                  ],
                },
                {
                  type: 'tableHeader',
                  content: [
                    {
                      type: 'paragraph',
                      content: [
                        {
                          type: 'text',
                          text: 'Header content 2',
                        },
                      ],
                    },
                  ],
                },
              ],
            },
            {
              type: 'tableRow',
              content: [
                {
                  type: 'tableCell',
                  content: [
                    {
                      type: 'paragraph',
                      content: [
                        {
                          type: 'text',
                          text: 'Body content 1',
                        },
                      ],
                    },
                  ],
                },
                {
                  type: 'tableCell',
                  content: [
                    {
                      type: 'paragraph',
                      content: [
                        {
                          type: 'text',
                          text: 'Body content 2',
                        },
                      ],
                    },
                  ],
                },
              ],
            },
          ],
        },
      ],
    };

    it('should add an extra column for numbered rows', () => {
      const reactSerializer = new ReactSerializer({});
      const tableFromSchema = schema.nodeFromJSON(tableDoc);
      const wrapper = mountWithIntl(
        reactSerializer.serializeFragment(tableFromSchema.content) as any,
      );

      expect(wrapper.find('table').prop('data-number-column')).toEqual(true);
      expect(wrapper.find('table[data-number-column]').length).toEqual(1);
      wrapper.unmount();
    });
  });
});
