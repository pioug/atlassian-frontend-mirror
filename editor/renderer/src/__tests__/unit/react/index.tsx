/* eslint-disable @typescript-eslint/no-explicit-any -- TODO: remove this and fix types */
import { skipAutoA11yFile } from '@atlassian/a11y-jest-testing';
import { mockExpDisabled } from '@atlassian/experiment-test-utils/mock-exp-disabled';
import { mockExpEnabled } from '@atlassian/experiment-test-utils/mock-exp-enabled';
import React from 'react';
import { ReactSerializer } from '../../../index';
import { createSchema } from '@atlaskit/adf-schema/create-schema';
import {
	defaultSchemaConfig,
	getSchemaBasedOnStage,
	defaultSchema as schema,
} from '@atlaskit/adf-schema/schema-default';
import { UnsupportedBlock, UnsupportedInline } from '@atlaskit/editor-common/ui';
import { Expand, Emoji } from '../../../react/nodes';
import {
	ExpandBodyBlock,
	ExpandBodyProvider,
	ExpandBodyTable,
} from '../../../ui/utils/expand-body';
import { Link } from '../../../react/marks';
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
import * as layoutWithMedia from '../../__fixtures__/layout-with-media.adf.json';
import * as tableWithMedia from '../../__fixtures__/table-with-media.json';
import * as tableWithNestedTable from '../../__fixtures__/table-with-nested-table-adf.json';
import type { Node as PMNode } from '@atlaskit/editor-prosemirror/model';
import type { AnalyticsEventPayload } from '../../../analytics/events';
// eslint-disable-next-line import/no-extraneous-dependencies -- Removed import for fixing circular dependencies
import { renderWithIntl } from '@atlaskit/editor-test-helpers/rtl';
import { screen } from '@testing-library/react';

// This file exposes one or more accessibility violations. Testing is currently skipped but violations need to
// be fixed in a timely manner or result in escalation. Once all violations have been fixed, you can remove
// the next line and associated import. For more information, see go/afm-a11y-tooling:jest
skipAutoA11yFile();

const docFromSchema = schema.nodeFromJSON(doc);
const headingDocFromSchema = schema.nodeFromJSON(headingDoc);
const stage0schema = getSchemaBasedOnStage('stage0');
const dataConsumerDocFromSchema = stage0schema.nodeFromJSON(dataConsumerDoc);
const nestedHeadingsDocFromSchema = schema.nodeFromJSON(nestedHeadingsDoc);
const nestedHeadingsWithPanelLayoutTableDocFromSchema = schema.nodeFromJSON(
	nestedHeadingsWithPanelLayoutTableDoc,
);
const linksDocFromSchema = schema.nodeFromJSON(linkDoc);

/**
 * `serializeFragment` is a pure `Fragment -> ReactElement` function, and some of what it decides
 * never reaches the DOM: `isInsideOfBlockNode`, `shouldOpenMediaViewer`, `ssr`, `nestedHeaderIds`
 * and the `node`/`dispatchAnalyticsEvent` handed to unsupported-node components are props only.
 * Those are asserted on the returned element tree; everything with a DOM footprint is rendered.
 */
const serializedElements = (node: React.ReactNode): React.ReactElement[] =>
	React.Children.toArray(node).flatMap((child) =>
		React.isValidElement(child)
			? [child, ...serializedElements((child.props as { children?: React.ReactNode }).children)]
			: [],
	);

const elementsOfType = (node: React.ReactNode, type: React.ElementType) =>
	serializedElements(node).filter((element) => element.type === type);

const elementsOfNodeType = (node: React.ReactNode, nodeType: string) =>
	serializedElements(node).filter((element) => (element.props as any).nodeType === nodeType);

const onlyElement = (elements: React.ReactElement[], description: string) => {
	if (elements.length === 0) {
		throw new Error(`Expected the serializer to produce ${description}`);
	}

	return elements[0].props as any;
};

const propsOfType = (node: React.ReactNode, type: React.ElementType) => {
	const name = typeof type === 'string' ? type : ((type as any).displayName ?? (type as any).name);

	return onlyElement(elementsOfType(node, type), `a <${name} /> element`);
};

const propsOfNodeType = (node: React.ReactNode, nodeType: string) =>
	onlyElement(elementsOfNodeType(node, nodeType), `an element with nodeType "${nodeType}"`);

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
				const output = reactSerializer.serializeFragment(dataConsumerDocFromSchema.content);

				expect(elementsOfNodeType(output, 'extension')).toHaveLength(1);
				expect(elementsOfNodeType(output, 'bodiedExtension')).toHaveLength(1);
				expect(elementsOfNodeType(output, 'inlineExtension')).toHaveLength(1);
				expect(elementsOfNodeType(output, 'paragraph')).toHaveLength(2);

				const { container } = renderWithIntl(output as any);

				const dataConsumers = container.querySelectorAll('[data-mark-type="dataConsumer"]');

				expect(dataConsumers).toHaveLength(3);
				// block level extensions get a div wrapper, the inline extension gets a span
				expect(dataConsumers[0].tagName).toEqual('DIV');
				expect(dataConsumers[1].tagName).toEqual('DIV');
				expect(dataConsumers[2].tagName).toEqual('SPAN');
			});
		});

		it('should render document', () => {
			const reactSerializer = new ReactSerializer({});
			const { container } = renderWithIntl(
				reactSerializer.serializeFragment(docFromSchema.content) as any,
			);

			expect(container.querySelectorAll('div')).toHaveLength(1);
			expect(container.querySelectorAll('p')).toHaveLength(1);
			expect(container.querySelectorAll('p a')).toHaveLength(1);
			expect(container.querySelectorAll('p a strong')).toHaveLength(1);

			const link = container.querySelector('p a');

			expect(link).toHaveTextContent('Hello, World!');
			expect(link).toHaveAttribute('href', 'https://www.atlassian.com');
			expect(container.querySelector('p a strong')).toHaveTextContent('World!');
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
					const output = reactSerializer.serializeFragment(unsupportBlockNode.content);

					const unspportedBlockNodeProp = propsOfType(output, UnsupportedBlock).node as PMNode;

					expect(unspportedBlockNodeProp.toJSON()).toEqual(unsupportedNodeJson);
				});

				it(`should have dispatchAnalyticsEvent as prop for unsupported
              block when serializer is enabled with analytics `, () => {
					const mockFireAnalyticsEvent = jest.fn((_event: AnalyticsEventPayload) => {});
					const reactSerializer = new ReactSerializer({
						fireAnalyticsEvent: mockFireAnalyticsEvent,
					});
					const output = reactSerializer.serializeFragment(unsupportBlockNode.content);

					expect(propsOfType(output, UnsupportedBlock).dispatchAnalyticsEvent).toEqual(
						mockFireAnalyticsEvent,
					);
				});

				it(`should have not dispatchAnalyticsEvent as prop for unsupported
              block when serializer is not enabled with analytics `, () => {
					const reactSerializer = new ReactSerializer({});
					const output = reactSerializer.serializeFragment(unsupportBlockNode.content);

					expect(propsOfType(output, UnsupportedBlock).dispatchAnalyticsEvent).toBeUndefined();
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
					const output = reactSerializer.serializeFragment(unsupportInlineNode.content);

					const unspportedInlineNodeProp = propsOfType(output, UnsupportedInline).node as PMNode;

					expect(unspportedInlineNodeProp.toJSON()).toEqual(unsupportedNodeJson);
				});

				it(`should have dispatchAnalyticsEvent as prop for unsupported
                Inline when serializer is enabled with analytics `, () => {
					const mockFireAnalyticsEvent = jest.fn((_event: AnalyticsEventPayload) => {});
					const reactSerializer = new ReactSerializer({
						fireAnalyticsEvent: mockFireAnalyticsEvent,
					});
					const output = reactSerializer.serializeFragment(unsupportInlineNode.content);

					expect(propsOfType(output, UnsupportedInline).dispatchAnalyticsEvent).toEqual(
						mockFireAnalyticsEvent,
					);
				});

				it(`should have not dispatchAnalyticsEvent as prop for unsupported
                Inline when serializer is not enabled with analytics `, () => {
					const reactSerializer = new ReactSerializer({});
					const output = reactSerializer.serializeFragment(unsupportInlineNode.content);

					expect(propsOfType(output, UnsupportedInline).dispatchAnalyticsEvent).toBeUndefined();
				});
			});
		});
	});

	describe('buildMarkStructure', () => {
		const { em, strong, link, textColor, subsup } = schema.marks;

		it('should wrap text nodes with marks', () => {
			const textNodes = [schema.text('Hello '), schema.text('World!', [strong.create()])];

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
				schema.text('World ', [link.create({ href: 'https://www.atlassian.com' }), em.create()]),
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
				schema.text('Ice Blue!', [strong.create(), textColor.create({ color: '#aaeebb' })]),
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
				schema.text('the link. ', [em.create(), link.create({ href: 'gnu.org' })]),
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
		const node = schema.text('Hello World', [strike.create(), underline.create(), strong.create()]);

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
				it('media node has isInsideOfBlockNode as true', () => {
					const reactSerializer = new ReactSerializer({});

					const output = reactSerializer.serializeFragment(
						schema.nodeFromJSON(expandWithMedia).content,
					);

					expect(propsOfNodeType(output, 'mediaSingle').isInsideOfBlockNode).toEqual(true);
				});
			});

			describe('unsupported nodes', () => {
				it('should return isInsideOfBlockNode as false', async () => {
					const schemaWithUnsupportedNodes = createSchema({
						...defaultSchemaConfig,
						nodes: defaultSchemaConfig.nodes.filter(
							(node) =>
								['expand', 'nestedExpand', 'layoutColumn', 'layoutSection'].indexOf(node) === -1,
						),
					});
					const reactSerializer = new ReactSerializer({});

					const output = reactSerializer.serializeFragment(
						schemaWithUnsupportedNodes.nodeFromJSON(tableWithMedia).content,
					);

					expect(propsOfNodeType(output, 'mediaSingle').isInsideOfBlockNode).toBeFalsy();
				});
			});

			describe('tables -> nestedExpand', () => {
				it('media node has isInsideOfBlockNode as true', async () => {
					const reactSerializer = new ReactSerializer({});

					const output = reactSerializer.serializeFragment(
						schema.nodeFromJSON(nestedExpandWithMedia).content,
					);

					expect(propsOfNodeType(output, 'mediaSingle').isInsideOfBlockNode).toEqual(true);
				});
			});

			describe('tables -> tables', () => {
				it('nested table should not have a sticky header', async () => {
					const reactSerializer = new ReactSerializer({ stickyHeaders: { offsetTop: 100 } });

					const { container } = renderWithIntl(
						reactSerializer.serializeFragment(
							schema.nodeFromJSON(tableWithNestedTable).content,
						) as any,
					);

					// Not ideal but using a querySelector here because I can't find a better way to target only the root table and its sticky table
					// eslint-disable-next-line testing-library/no-container
					const nestedTable = container.querySelector(
						':scope > div > .pm-table-container  .pm-table-container',
					);
					expect(nestedTable).toBeDefined();
					expect(nestedTable?.querySelector(':scope > [class$=StickyTable]')).toBeNull();
				});

				it('non-nested table should have a sticky header', async () => {
					const reactSerializer = new ReactSerializer({ stickyHeaders: { offsetTop: 100 } });

					const { container } = renderWithIntl(
						reactSerializer.serializeFragment(
							schema.nodeFromJSON(tableWithNestedTable).content,
						) as any,
					);

					// Not ideal but using a querySelector here because I can't find a better way to target only the root table and its sticky table
					// eslint-disable-next-line testing-library/no-container
					const rootTable = container.querySelector(':scope > div > .pm-table-container');
					expect(rootTable?.querySelector(':scope > [class$=StickyTable]')).toBeDefined();
				});
			});

			describe('layoutSection -> layoutColumn', () => {
				it('media node has isInsideOfBlockNode as true', async () => {
					const reactSerializer = new ReactSerializer({});
					const output = reactSerializer.serializeFragment(
						schema.nodeFromJSON(layoutWithMedia).content,
					);

					expect(propsOfNodeType(output, 'mediaSingle').isInsideOfBlockNode).toEqual(true);
				});
			});
		});

		describe('when default shouldOpenMediaViewer is false', () => {
			it('media node has shouldOpenMediaViewer set to default value when parent is not mediaSingle', async () => {
				const reactSerializer = new ReactSerializer({
					shouldOpenMediaViewer: false,
				});

				const output = reactSerializer.serializeFragment(
					schema.nodeFromJSON(mediaGroupFragment).content,
				);

				expect(propsOfNodeType(output, 'media').shouldOpenMediaViewer).toEqual(false);
			});

			it('media node without parent has shouldOpenMediaViewer set to false', async () => {
				const reactSerializer = new ReactSerializer({
					shouldOpenMediaViewer: false,
				});

				const output = reactSerializer.serializeFragment(
					schema.nodeFromJSON(mediaFragment).content,
				);

				expect(propsOfNodeType(output, 'media').shouldOpenMediaViewer).toEqual(false);
			});
		});

		describe('when default shouldOpenMediaViewer is true', () => {
			it('media node has shouldOpenMediaViewer set to default value when parent is not mediaSingle', async () => {
				const reactSerializer = new ReactSerializer({
					shouldOpenMediaViewer: true,
				});

				const output = reactSerializer.serializeFragment(
					schema.nodeFromJSON(mediaGroupFragment).content,
				);

				expect(propsOfNodeType(output, 'media').shouldOpenMediaViewer).toEqual(true);
			});

			it('media without parent has shouldOpenMediaViewer set to true', () => {
				const reactSerializer = new ReactSerializer({
					shouldOpenMediaViewer: true,
				});

				const output = reactSerializer.serializeFragment(
					schema.nodeFromJSON(mediaFragment).content,
				);

				expect(propsOfNodeType(output, 'media').shouldOpenMediaViewer).toEqual(true);
			});
		});

		describe('when default shouldOpenMediaViewer is undefined', () => {
			it('media node has shouldOpenMediaViewer set to undefined when parent is not mediaSingle', async () => {
				const reactSerializer = new ReactSerializer({});

				const output = reactSerializer.serializeFragment(
					schema.nodeFromJSON(mediaGroupFragment).content,
				);

				expect(propsOfNodeType(output, 'media').shouldOpenMediaViewer).toEqual(undefined);
			});

			it('media mode without parent has shouldOpenMediaViewer set to undefined', () => {
				const reactSerializer = new ReactSerializer({});

				const output = reactSerializer.serializeFragment(
					schema.nodeFromJSON(mediaFragment).content,
				);

				expect(propsOfNodeType(output, 'media').shouldOpenMediaViewer).toEqual(undefined);
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

				const output = reactSerializer.serializeFragment(
					schema.nodeFromJSON(mediaFragment).content,
				);

				expect(propsOfNodeType(output, 'media').ssr).toEqual(ssr);
			});
		});
	});

	describe('link mark', () => {
		it('has correct isMediaLink value when link mark is applied on media', () => {
			const reactSerializer = new ReactSerializer({ allowMediaLinking: true });
			const output = reactSerializer.serializeFragment(linksDocFromSchema.content);

			expect(propsOfType(output, Link).isMediaLink).toEqual(true);
		});

		it('has correct isMediaLink value when link mark is not applied on media', () => {
			const reactSerializer = new ReactSerializer({ allowMediaLinking: true });
			const output = reactSerializer.serializeFragment(linksDocFromSchema.content)!;
			const links = elementsOfType(output, Link);

			expect((links[links.length - 1].props as any).isMediaLink).toBeFalsy();
		});

		it('does not render when allowMediaLinking is undefined', () => {
			const reactSerializer = new ReactSerializer({});
			const output = reactSerializer.serializeFragment(linksDocFromSchema.content)!;

			expect(elementsOfType(output, Link)).toHaveLength(1);
		});

		it('does not render when allowMediaLinking is false', () => {
			const reactSerializer = new ReactSerializer({ allowMediaLinking: false });
			const output = reactSerializer.serializeFragment(linksDocFromSchema.content)!;

			expect(elementsOfType(output, Link)).toHaveLength(1);
		});

		it('does render when allowMediaLinking is true', () => {
			const reactSerializer = new ReactSerializer({ allowMediaLinking: true });
			const output = reactSerializer.serializeFragment(linksDocFromSchema.content)!;

			expect(elementsOfType(output, Link)).toHaveLength(2);
		});
	});

	describe('Heading IDs', () => {
		const renderHeadingDoc = (props: ConstructorParameters<typeof ReactSerializer>[0]) => {
			const reactSerializer = new ReactSerializer(props);
			const { container } = renderWithIntl(
				reactSerializer.serializeFragment(headingDocFromSchema.content) as any,
			);

			return Array.from(container.querySelectorAll('h1')).map((heading) =>
				heading.getAttribute('id'),
			);
		};

		it('should render headings with unique ids based on node content', () => {
			expect(renderHeadingDoc({})).toEqual([
				'Heading-1',
				'Heading-2',
				'Heading-1.1',
				'Heading-2.1',
				'!with-special-@!@#$%^&*()-characters-1?',
				'CJK-characters-中文-日文-한국어',
				'white----spaces',
				'❤😏status[date]',
			]);
		});

		it('should not render heading ids if "disableHeadingIDs" is true', () => {
			expect(renderHeadingDoc({ disableHeadingIDs: true })).toEqual(new Array(8).fill(null));
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
				const output = reactSerializer.serializeFragment(nestedHeadingsDocFromSchema.content);
				const expands = elementsOfType(output, Expand).map((element) => element.props as any);
				expect(expands[0].nestedHeaderIds).toEqual([
					'test1',
					'test2',
					'test3',
					'test4',
					'test5',
					'test6',
				]);
				expect(expands[1].nestedHeaderIds).toEqual(['test7']);
				expect(expands[2].nestedHeaderIds).toEqual([]);
			});

			it('should not provide nested header ids prop to expand nodes when allowNestedHeadersLinks is false', () => {
				const reactSerializer = new ReactSerializer({
					allowHeadingAnchorLinks: {
						allowNestedHeaderLinks: false,
					},
				});
				const output = reactSerializer.serializeFragment(nestedHeadingsDocFromSchema.content);
				const expands = elementsOfType(output, Expand).map((element) => element.props as any);
				expect(expands[0].nestedHeaderIds).toBeUndefined();
				expect(expands[1].nestedHeaderIds).toBeUndefined();
				expect(expands[2].nestedHeaderIds).toBeUndefined();
			});

			it('should not provide nested header ids prop to expand nodes when allowHeadingAnchorLinks is true', () => {
				const reactSerializer = new ReactSerializer({
					allowHeadingAnchorLinks: true,
				});
				const output = reactSerializer.serializeFragment(nestedHeadingsDocFromSchema.content);
				const expands = elementsOfType(output, Expand).map((element) => element.props as any);
				expect(expands[0].nestedHeaderIds).toBeUndefined();
				expect(expands[1].nestedHeaderIds).toBeUndefined();
				expect(expands[2].nestedHeaderIds).toBeUndefined();
			});
		});

		describe('NHAL: Inside a table, layout, or panel', () => {
			const reactSerializer = new ReactSerializer({
				allowHeadingAnchorLinks: {
					allowNestedHeaderLinks: true,
				},
			});
			const renderDoc = () =>
				renderWithIntl(
					reactSerializer.serializeFragment(
						nestedHeadingsWithPanelLayoutTableDocFromSchema.content,
					) as any,
				);

			it('should have a heading anchor within a table', () => {
				const { container } = renderDoc();

				expect(container.querySelector('table [data-testid="anchor-button"]')).toBeInTheDocument();
			});

			it('should have heading anchor within a layout', () => {
				const { container } = renderDoc();

				expect(
					container.querySelector('[data-layout-column] [data-testid="anchor-button"]'),
				).toBeInTheDocument();
			});

			it('should have heading anchor within a panel', () => {
				const { container } = renderDoc();

				expect(
					container.querySelector('[data-panel-type] [data-testid="anchor-button"]'),
				).toBeInTheDocument();
			});
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
				expect(screen.queryByLabelText('Col 1')).not.toBeInTheDocument();
				expect(screen.queryByLabelText('Col 2')).not.toBeInTheDocument();
				expect(screen.queryByLabelText('Col 3')).not.toBeInTheDocument();
			});

			it('should have heading anchor within a layout', () => {
				expect(screen.getByLabelText('Header inside Layout')).toBeEnabled();
				expect(screen.getByLabelText('Header inside Layout 2')).toBeEnabled();
			});

			it('should not have heading anchor within a panel', () => {
				expect(screen.queryByLabelText('Header in a Panel')).not.toBeInTheDocument();
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
			const { container } = renderWithIntl(
				reactSerializer.serializeFragment(tableFromSchema.content) as any,
			);

			expect(container.querySelectorAll('table[data-number-column]')).toHaveLength(1);
			expect(container.querySelector('table')).toHaveAttribute('data-number-column', 'true');
		});
	});

	// getExpandProps hands Expand the node itself; Expand derives the collapsed text mirror from it
	// (see expand-search-text.ts and its tests) and owns both the feature gate and the
	// inline-comment decision.
	describe('getExpandProps - passes the expand node', () => {
		const expandWithInlineComment = {
			version: 1,
			type: 'doc',
			content: [
				{
					type: 'expand',
					attrs: {
						title: 'Expand with comment',
					},
					content: [
						{
							type: 'paragraph',
							content: [
								{
									type: 'text',
									text: 'Text with inline comment',
									marks: [
										{
											type: 'annotation',
											attrs: {
												id: 'annotation-1',
												annotationType: 'inlineComment',
											},
										},
									],
								},
							],
						},
					],
				},
			],
		};

		const expandWithoutAnnotation = {
			version: 1,
			type: 'doc',
			content: [
				{
					type: 'expand',
					attrs: {
						title: 'Expand without comment',
					},
					content: [
						{
							type: 'paragraph',
							content: [
								{
									type: 'text',
									text: 'Text without annotation',
								},
							],
						},
					],
				},
			],
		};

		const expandWithNonInlineCommentAnnotation = {
			version: 1,
			type: 'doc',
			content: [
				{
					type: 'expand',
					attrs: {
						title: 'Expand with other annotation',
					},
					content: [
						{
							type: 'paragraph',
							content: [
								{
									type: 'text',
									text: 'Text with other annotation type',
									marks: [
										{
											type: 'annotation',
											attrs: {
												id: 'annotation-1',
												annotationType: 'otherType',
											},
										},
									],
								},
							],
						},
					],
				},
			],
		};

		const serializeAndGetExpandPropsForAdf = (adf: object) => {
			const serializer = new ReactSerializer({});
			const docNode = schema.nodeFromJSON(adf);
			const getExpandPropsSpy = jest.spyOn(serializer as any, 'getExpandProps');

			serializer.serializeFragment(docNode.content);

			expect(getExpandPropsSpy).toHaveBeenCalled();
			const expandCall = getExpandPropsSpy.mock.results.find((result) => result.value);
			expect(expandCall).toBeDefined();

			getExpandPropsSpy.mockRestore();
			return expandCall?.value;
		};

		// Nothing forced here: for a plain `expand` this builder runs either way. Expand decides
		// whether to hold its body back, so that is covered by its own tests.
		it('passes the expand node through so Expand knows it can hold its body back', () => {
			const props = serializeAndGetExpandPropsForAdf(expandWithoutAnnotation);

			expect(props.node?.type.name).toBe('expand');
		});

		it('passes the node regardless of annotations', () => {
			expect(serializeAndGetExpandPropsForAdf(expandWithInlineComment).node?.type.name).toBe(
				'expand',
			);
			expect(
				serializeAndGetExpandPropsForAdf(expandWithNonInlineCommentAnnotation).node?.type.name,
			).toBe('expand');
		});
	});

	describe('nestedExpand - getExpandProps routing based on feature flag', () => {
		const tableWithNestedExpandAndInlineComment = {
			version: 1,
			type: 'doc',
			content: [
				{
					type: 'table',
					attrs: {
						isNumberColumnEnabled: false,
						layout: 'default',
					},
					content: [
						{
							type: 'tableRow',
							content: [
								{
									type: 'tableCell',
									attrs: {},
									content: [
										{
											type: 'nestedExpand',
											attrs: {
												title: 'Nested expand with comment',
											},
											content: [
												{
													type: 'paragraph',
													content: [
														{
															type: 'text',
															text: 'Text with inline comment',
															marks: [
																{
																	type: 'annotation',
																	attrs: {
																		id: 'annotation-1',
																		annotationType: 'inlineComment',
																	},
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
						},
					],
				},
			],
		};

		// getExpandProps is the only source of a `node` key, so its presence identifies which props
		// builder ran.
		const hasNodeKey = (value: unknown) =>
			typeof value === 'object' && value !== null && 'node' in value;

		// The text a collapsed expand shows in place of its blocks exists only for browser find, so the
		// serializer joins neighbouring blocks into one string with no element around it. Four
		// paragraphs become one text node, not four spans.
		it('when the experiment is on, joins the text of neighbouring blocks in an expand body', () => {
			mockExpEnabled('platform_editor_defer_collapsed_expand_body');
			const paragraph = (text: string) => ({
				type: 'paragraph',
				content: [{ type: 'text', text }],
			});
			const docNode = schema.nodeFromJSON({
				type: 'doc',
				version: 1,
				content: [
					{
						type: 'expand',
						attrs: { title: 'Outer' },
						content: [
							paragraph('first'),
							paragraph('second'),
							paragraph('third'),
							paragraph('fourth'),
						],
					},
				],
			});

			const output = new ReactSerializer({}).serializeFragment(docNode.content);

			// One block holding the text of all four paragraphs, rather than four blocks. Asserted on
			// the element tree because `Expand` is loadable, so the DOM holds a placeholder here.
			const blocks = elementsOfType(output, ExpandBodyBlock);
			expect(blocks).toHaveLength(1);
			expect((blocks[0].props as any).searchText).toBe('first second third fourth');
		});

		// A mark is folded around the serialized node after its children are attached, so the rows of a
		// marked table are a level further in than they look. Reading the children of what the
		// serializer hands over finds one element rather than the rows, and the stand-in then renders
		// the whole table — which looks exactly like this feature being switched off. So the shape is
		// checked here against the real serializer, with a mark the schema really allows on a table.
		it('when the experiment is on, finds the rows of a table carrying a mark', () => {
			mockExpEnabled('platform_editor_defer_collapsed_expand_body');
			const row = (content: unknown) => ({
				type: 'tableRow',
				content: [{ type: 'tableCell', attrs: {}, content: [content] }],
			});
			const text = (value: string) => ({
				type: 'paragraph',
				content: [{ type: 'text', text: value }],
			});
			const docNode = schema.nodeFromJSON({
				type: 'doc',
				version: 1,
				content: [
					{
						type: 'expand',
						attrs: { title: 'Outer' },
						content: [
							{
								type: 'table',
								attrs: { isNumberColumnEnabled: false, layout: 'default' },
								marks: [{ type: 'fragment', attrs: { localId: 'fragment-1' } }],
								content: [
									row(text('first row')),
									row({
										type: 'nestedExpand',
										attrs: { title: 'Nested' },
										content: [text('nested body')],
									}),
									row(text('third row')),
								],
							},
						],
					},
				],
			});
			// Without this the test stops covering the mark case, which is the case that broke.
			expect(docNode.child(0).child(0).marks).toHaveLength(1);

			const output = new ReactSerializer({}).serializeFragment(docNode.content);

			const standIns = elementsOfType(output, ExpandBodyTable);
			expect(standIns).toHaveLength(1);

			const { container } = renderWithIntl(
				<ExpandBodyProvider
					value={{
						openWithAncestors: jest.fn(),
						revealed: false,
						revealedByFind: new WeakSet<PMNode>(),
					}}
				>
					{standIns[0]}
				</ExpandBodyProvider>,
			);

			// Nothing of the real table is mounted, and the rows it stood in for are text.
			expect(container.querySelector('[data-testid="renderer-table"]')).toBeNull();
			expect(container.textContent).toContain('first row');
			expect(container.textContent).toContain('third row');
			// The row holding the nested expand still renders, inside the least table that is valid.
			expect(container.querySelectorAll('table > tbody > tr')).toHaveLength(1);
		});

		it('when the experiment is on, calls getExpandProps for nestedExpand', () => {
			mockExpEnabled('platform_editor_defer_collapsed_expand_body');
			const serializer = new ReactSerializer({});
			const docNode = schema.nodeFromJSON(tableWithNestedExpandAndInlineComment);
			const getExpandPropsSpy = jest.spyOn(serializer as any, 'getExpandProps');

			serializer.serializeFragment(docNode.content);

			const nestedExpandCall = getExpandPropsSpy.mock.results.find((result) =>
				hasNodeKey(result.value),
			);
			expect(nestedExpandCall).toBeDefined();
			expect(nestedExpandCall?.value.node?.type.name).toBe('nestedExpand');

			getExpandPropsSpy.mockRestore();
		});

		it('when the experiment is off, calls getProps (not getExpandProps) for nestedExpand', () => {
			mockExpDisabled('platform_editor_defer_collapsed_expand_body');
			const serializer = new ReactSerializer({});
			const docNode = schema.nodeFromJSON(tableWithNestedExpandAndInlineComment);
			const getExpandPropsSpy = jest.spyOn(serializer as any, 'getExpandProps');
			const getPropsSpy = jest.spyOn(serializer as any, 'getProps');

			serializer.serializeFragment(docNode.content);

			// getExpandProps should NOT be called for nestedExpand when the experiment is off
			// (it will still be called for regular expand nodes if any)
			const nestedExpandCall = getExpandPropsSpy.mock.results.find((result) =>
				hasNodeKey(result.value),
			);
			expect(nestedExpandCall).toBeUndefined();

			// getProps should have been called (for nestedExpand and other nodes)
			expect(getPropsSpy).toHaveBeenCalled();

			getExpandPropsSpy.mockRestore();
			getPropsSpy.mockRestore();
		});
	});
});
