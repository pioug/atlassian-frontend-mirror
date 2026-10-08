import React from 'react';

import { act, fireEvent, render, within } from '@testing-library/react';
import { hydrateRoot } from 'react-dom/client';
import { renderToString } from 'react-dom/server';
import { IntlProvider } from 'react-intl';

import { defaultSchema as schema } from '@atlaskit/adf-schema/schema-default';
import { ProviderFactory } from '@atlaskit/editor-common/provider-factory';
import { eeTest } from '@atlaskit/tmp-editor-statsig/editor-experiments-test-utils';
import { mockExpDisabled } from '@atlassian/experiment-test-utils/mock-exp-disabled';
import { mockExpEnabled } from '@atlassian/experiment-test-utils/mock-exp-enabled';
import { resetAllExperiments } from '@atlassian/experiment-test-utils/reset-all-experiments';

import ReactSerializer from '../../../react';
import type { ReactSerializerInit } from '../../../react';
import Paragraph from '../../../react/nodes/paragraph';
import type { NodeProps } from '../../../react/types';
import * as contentGetter from '../../../react/utils/content-getter';
import { AnnotationRangeStateContext } from '../../../ui/annotations/contexts/AnnotationRangeContext';
import type { Position } from '../../../ui/annotations/types';

const experiment = 'platform_renderer_paragraph_props_fast_path';
const textExperiment = 'platform_renderer_text_paragraph_fast_path';

const document = schema.nodeFromJSON({
	type: 'doc',
	content: [
		{ type: 'paragraph', attrs: { localId: 'empty' } },
		{
			type: 'paragraph',
			attrs: { localId: 'formatted' },
			content: [{ type: 'text', text: 'Hello', marks: [{ type: 'strong' }] }],
		},
		{
			type: 'bulletList',
			content: [
				{
					type: 'listItem',
					content: [{ type: 'paragraph', content: [{ type: 'text', text: 'Nested' }] }],
				},
			],
		},
	],
});

function elements(node: React.ReactNode): React.ReactElement<Record<string, unknown>>[] {
	return React.Children.toArray(node).flatMap((child) => {
		if (!React.isValidElement<{ children?: React.ReactNode }>(child)) {
			return [];
		}
		return [child, ...elements(child.props.children)];
	});
}

function serialize(
	enabled: boolean,
	init: ReactSerializerInit = {},
	textFastPath = true,
	source = document,
) {
	resetAllExperiments();
	(textFastPath ? mockExpEnabled : mockExpDisabled)(textExperiment);
	(enabled ? mockExpEnabled : mockExpDisabled)(experiment);
	return new ReactSerializer(init).serializeFragment(source.content);
}

const paragraphs = (output: React.ReactNode) =>
	elements(output).filter((element) => element.props.nodeType === 'paragraph');

describe('paragraph props fast path', () => {
	afterEach(() => jest.restoreAllMocks());

	it.each([false, true])('preserves markup with the text fast path %s', async (textFastPath) => {
		const control = serialize(false, {}, textFastPath);
		const treatment = serialize(true, {}, textFastPath);
		const baseline = render(control);
		const optimized = render(treatment);
		expect(optimized.container.innerHTML).toBe(baseline.container.innerHTML);
		await expect(optimized.container).toBeAccessible();
		expect(optimized.container.querySelector('p')?.innerHTML).toBe('&nbsp;');
		expect(optimized.container.querySelector('strong')).toHaveTextContent('Hello');
		expect(optimized.container.querySelector('li p')).toHaveTextContent('Nested');
		expect(
			paragraphs(treatment).map(({ props, key }) => ({
				key,
				startPos: props.startPos,
				dataAttributes: props.dataAttributes,
				path: props.path,
				marks: props.marks,
				localId: props.localId,
				plainTextFastPath: props.plainTextFastPath,
			})),
		).toEqual(
			paragraphs(control).map(({ props, key }) => ({
				key,
				startPos: props.startPos,
				dataAttributes: props.dataAttributes,
				path: props.path,
				marks: props.marks,
				localId: props.localId,
				plainTextFastPath: props.plainTextFastPath,
			})),
		);
	});

	it('avoids creating content getters for built-in paragraphs only', () => {
		const getter = jest.spyOn(contentGetter, 'createContentGetter');
		serialize(false);
		const baselineCalls = getter.mock.calls.length;
		getter.mockClear();
		const output = serialize(true);
		expect(getter).toHaveBeenCalledTimes(baselineCalls - 3);
		for (const { props } of paragraphs(output)) {
			expect(props).not.toHaveProperty('getContent');
			expect(props).not.toHaveProperty('serializer');
			expect(props).not.toHaveProperty('providers');
		}
	});

	it.each([false, true])('preserves highlighted text with annotation wrappers %s', (wrapped) => {
		const init: ReactSerializerInit = {
			surroundTextNodesWithTextWrapper: wrapped,
			textHighlighter: {
				pattern: /Hello/gu,
				component: ({ children }) => <mark>{children}</mark>,
			},
		};
		const control = render(serialize(false, init));
		const treatment = render(serialize(true, init));
		expect(treatment.container.innerHTML).toBe(control.container.innerHTML);
		expect(within(treatment.container).getByText('Hello').tagName).toBe('MARK');
	});

	eeTest
		.describe('platform_editor_render_bodied_extension_as_inline', 'inline paragraph metadata')
		.variant(true, () => {
			it.each([false, true])(
				'preserves inline paragraphs with the text fast path %s',
				(textFastPath) => {
					const source = schema.nodeFromJSON({
						type: 'doc',
						content: [
							{ type: 'paragraph', content: [{ type: 'text', text: 'Before' }] },
							{
								type: 'bodiedExtension',
								attrs: {
									extensionType: 'com.atlassian.confluence.macro.core',
									extensionKey: 'inline',
								},
								content: [{ type: 'paragraph', content: [{ type: 'text', text: 'Body' }] }],
							},
							{ type: 'paragraph', content: [{ type: 'text', text: 'After' }] },
						],
					});
					const init: ReactSerializerInit = {
						shouldDisplayExtensionAsInline: () => true,
						// Isolate extension loading; the serializer still computes inline paragraph positions.
						nodeComponents: { bodiedExtension: ({ children }) => <>{children}</> },
					};
					const control = render(serialize(false, init, textFastPath, source));
					const treatment = render(serialize(true, init, textFastPath, source));
					expect(treatment.container.innerHTML).toBe(control.container.innerHTML);
					for (const text of ['Before', 'After']) {
						expect(within(treatment.container).getByText(text)).toHaveAttribute(
							'data-as-inline',
							'on',
						);
					}
					expect(within(treatment.container).getByText('Body')).not.toHaveAttribute(
						'data-as-inline',
					);
				},
			);
		});

	it.each([false, true])(
		'preserves table and expand paragraphs with the text fast path %s',
		async (textFastPath) => {
			const source = schema.nodeFromJSON({
				type: 'doc',
				content: [
					{
						type: 'table',
						content: [
							{
								type: 'tableRow',
								content: [
									{
										type: 'tableCell',
										content: [
											{
												type: 'paragraph',
												attrs: { localId: 'table-text' },
												content: [{ type: 'text', text: 'Cell text' }],
											},
											{ type: 'paragraph', attrs: { localId: 'table-empty' } },
										],
									},
								],
							},
						],
					},
					{
						type: 'expand',
						attrs: { title: 'Details' },
						content: [
							{
								type: 'paragraph',
								attrs: { localId: 'expand-text' },
								content: [{ type: 'text', text: 'Expanded text' }],
							},
							{ type: 'paragraph', attrs: { localId: 'expand-empty' } },
						],
					},
				],
			});
			const expected: { localId: string; startPos: number }[] = [];
			source.descendants((node, pos) => {
				if (node.type.name === 'paragraph') {
					expected.push({ localId: node.attrs.localId, startPos: pos + 1 });
				}
			});
			const controlTree = serialize(false, {}, textFastPath, source);
			const treatmentTree = serialize(true, {}, textFastPath, source);
			for (const tree of [controlTree, treatmentTree]) {
				expect(
					paragraphs(tree).map(({ props }) => ({
						localId: props.localId,
						startPos: props.startPos,
					})),
				).toEqual(expected);
			}
			const control = render(<IntlProvider locale="en">{controlTree}</IntlProvider>);
			const treatment = render(<IntlProvider locale="en">{treatmentTree}</IntlProvider>);
			for (const result of [control, treatment]) {
				fireEvent.click(await within(result.container).findByRole('button', { name: 'Details' }));
				const renderedParagraphs = within(result.container).getAllByRole('paragraph');
				expect(renderedParagraphs).toHaveLength(4);
				renderedParagraphs.forEach((paragraph, index) => {
					expect(paragraph).toHaveAttribute('data-local-id', expected[index].localId);
					expect(paragraph).toHaveAttribute(
						'data-renderer-start-pos',
						String(expected[index].startPos),
					);
				});
				expect(renderedParagraphs.map((paragraph) => paragraph.textContent)).toEqual([
					'Cell text',
					'\u00a0',
					'Expanded text',
					'\u00a0',
				]);
			}
			expect(
				within(treatment.container)
					.getAllByRole('paragraph')
					.map((paragraph) => paragraph.outerHTML),
			).toEqual(
				within(control.container)
					.getAllByRole('paragraph')
					.map((paragraph) => paragraph.outerHTML),
			);
		},
	);

	it.each([false, true])(
		'preserves an active annotation draft with the text fast path %s',
		(textFastPath) => {
			const source = schema.nodeFromJSON({
				type: 'doc',
				content: [
					{
						type: 'paragraph',
						content: [
							{ type: 'text', text: 'Hello ' },
							{ type: 'text', text: 'world', marks: [{ type: 'strong' }] },
						],
					},
				],
			});
			const withDraft = (children: React.ReactNode, position: Position | null) => (
				<AnnotationRangeStateContext.Provider
					value={{
						range: null,
						type: null,
						selectionDraftRange: null,
						hoverDraftRange: null,
						hoverDraftDocumentPosition: null,
						selectionDraftDocumentPosition: position,
					}}
				>
					{children}
				</AnnotationRangeStateContext.Provider>
			);
			const init: ReactSerializerInit = {
				surroundTextNodesWithTextWrapper: true,
				allowAnnotations: true,
			};
			const controlTree = serialize(false, init, textFastPath, source);
			const treatmentTree = serialize(true, init, textFastPath, source);
			const control = render(withDraft(controlTree, null));
			const treatment = render(withDraft(treatmentTree, null));
			const originalHTML = treatment.container.innerHTML;
			const draft = { from: 4, to: 10 };
			control.rerender(withDraft(controlTree, draft));
			treatment.rerender(withDraft(treatmentTree, draft));
			expect(treatment.container.innerHTML).toBe(control.container.innerHTML);
			const marks = within(treatment.container).getAllByRole('mark');
			expect(marks.map((mark) => mark.textContent)).toEqual(['lo ', 'wor']);
			for (const mark of marks) {
				expect(mark).toHaveAttribute('data-annotation-draft-mark', 'true');
				expect(mark).toHaveAttribute('data-draft-start-at', '4');
				expect(mark).toHaveAttribute('data-draft-end-at', '10');
			}
			expect(marks[1].parentElement?.tagName).toBe('STRONG');
			expect(treatment.container).toHaveTextContent('Hello world');
			control.rerender(withDraft(controlTree, null));
			treatment.rerender(withDraft(treatmentTree, null));
			expect(within(treatment.container).queryByRole('mark')).not.toBeInTheDocument();
			expect(treatment.container.innerHTML).toBe(originalHTML);
			expect(treatment.container.innerHTML).toBe(control.container.innerHTML);
		},
	);

	it('preserves the full contract for an explicit paragraph override', () => {
		const providers = new ProviderFactory();
		const eventHandlers = {};
		const CustomParagraph = (props: NodeProps) => <Paragraph {...props} />;
		const output = serialize(true, {
			providers,
			eventHandlers,
			nodeComponents: { paragraph: CustomParagraph },
		});
		const custom = paragraphs(output);
		expect(custom).toHaveLength(3);
		for (const element of custom) {
			expect(element.type).toBe(CustomParagraph);
			expect(element.props.providers).toBe(providers);
			expect(element.props.eventHandlers).toBe(eventHandlers);
			expect(element.props.serializer).toBeInstanceOf(ReactSerializer);
			expect(element.props.getContent).toEqual(expect.any(Function));
		}
		const getContent = custom[1].props.getContent as () => unknown;
		expect(getContent()).toEqual(document.child(1).content.toJSON());
		expect(getContent()).toBe(getContent());
		providers.destroy();
	});

	it('keeps the generic contract even when the override is the default Paragraph', () => {
		const output = serialize(true, { nodeComponents: { paragraph: Paragraph } });
		expect(paragraphs(output)[0].props.getContent).toEqual(expect.any(Function));
	});

	it('allows unrelated node overrides without disabling the fast path', () => {
		const output = serialize(true, { nodeComponents: { heading: () => null } });
		expect(paragraphs(output)[0].props).not.toHaveProperty('getContent');
	});

	it('keeps the experiment assignment for the lifetime of a serializer', () => {
		mockExpEnabled(experiment);
		const serializer = new ReactSerializer({});
		resetAllExperiments();
		mockExpDisabled(experiment);
		expect(paragraphs(serializer.serializeFragment(document.content))[0].props).not.toHaveProperty(
			'getContent',
		);
	});

	it('preserves SSR markup and hydrates without recoverable errors', async () => {
		const control = renderToString(serialize(false));
		const treatment = renderToString(serialize(true));
		expect(treatment).toBe(control);
		const container = window.document.createElement('div');
		container.innerHTML = treatment;
		const initialHTML = container.innerHTML;
		const onRecoverableError = jest.fn();
		let root: ReturnType<typeof hydrateRoot>;
		await act(async () => {
			root = hydrateRoot(container, serialize(true), { onRecoverableError });
		});
		expect(onRecoverableError).not.toHaveBeenCalled();
		expect(container.innerHTML).toBe(initialHTML);
		await act(async () => root.unmount());
	});
});
