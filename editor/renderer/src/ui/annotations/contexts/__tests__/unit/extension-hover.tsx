import React from 'react';

import { act, fireEvent, render, renderHook, screen } from '@testing-library/react';

import { AnnotationTypes } from '@atlaskit/adf-schema/annotation';
import { getSchemaBasedOnStage } from '@atlaskit/adf-schema/schema-default';
import { AddNodeMarkStep } from '@atlaskit/editor-prosemirror/transform';
import { failGate, passGate } from '@atlassian/feature-flags-test-utils/mock-gates';

import RendererActions from '../../../../../actions';
import { ReactSerializer } from '../../../../../index';
import { getPosFromRange } from '../../../../../steps';
import { ProvidersContext } from '../../../context';
import { AnnotationHoverContext } from '../../AnnotationHoverContext';
import {
	AnnotationRangeProvider,
	useAnnotationRangeDispatch,
	useAnnotationRangeState,
} from '../../AnnotationRangeContext';

describe('Extension comment hover targeting', () => {
	const setup = (hasBlockNodeSupport = true, allowCommentsOnMedia = false) =>
		renderHook(() => ({ ...useAnnotationRangeState(), ...useAnnotationRangeDispatch() }), {
			wrapper: ({ children }: React.PropsWithChildren) => (
				<AnnotationRangeProvider
					hasBlockNodeSupport={hasBlockNodeSupport}
					allowCommentsOnMedia={allowCommentsOnMedia}
				>
					{children}
				</AnnotationRangeProvider>
			),
		});

	it('requires the annotations gate', () => {
		failGate('cc_maui_annotations_on_extensions');
		expect(setup().result.current.setHoverTarget).toBeUndefined();
	});

	it('requires provider opt-in', () => {
		expect(setup(false).result.current.setHoverTarget).toBeUndefined();
	});

	it.each([true, false])('targets the whole extension (target is wrapper: %s)', (direct) => {
		passGate('cc_maui_annotations_on_extensions');
		const { result } = setup();
		const parent = document.createElement('div');
		const extension = parent.appendChild(document.createElement('div'));
		extension.className = 'ak-renderer-extension';
		extension.dataset.inlineCommentsTarget = 'true';
		act(() => result.current.setHoverTarget?.(direct ? extension : parent));
		expect(result.current.range?.startContainer).toBe(parent);
		expect(result.current.range?.startOffset).toBe(0);
		expect(result.current.range?.endOffset).toBe(1);
	});

	it('does not target an extension the node predicate rejected', () => {
		passGate('cc_maui_annotations_on_extensions');
		const { result } = setup();
		const parent = document.createElement('div');
		parent.appendChild(document.createElement('div')).className = 'ak-renderer-extension';
		act(() => result.current.setHoverTarget?.(parent));
		expect(result.current.range).toBeNull();
	});

	it('does not opt media in when only extensions are enabled', () => {
		passGate('cc_maui_annotations_on_extensions');
		const { result } = setup();
		const parent = document.createElement('div');
		parent.appendChild(document.createElement('div')).className = 'media-file-card-view';
		act(() => result.current.setHoverTarget?.(parent));
		expect(result.current.range).toBeNull();
	});

	it('does not replace an extension draft with a media hover, but releases the target after closing', () => {
		passGate('cc_maui_annotations_on_extensions');
		const { result } = setup(true, true);
		const setHoverTarget = result.current.setHoverTarget;
		const parent = document.createElement('div');
		const extension = parent.appendChild(document.createElement('div'));
		extension.className = 'ak-renderer-extension';
		extension.dataset.inlineCommentsTarget = 'true';
		const mediaParent = document.createElement('div');
		mediaParent.appendChild(document.createElement('div')).className = 'media-file-card-view';
		act(() => result.current.setHoverTarget?.(extension));
		act(() => result.current.promoteHoverToDraft({ from: 903, to: 903 }));
		expect(result.current.setHoverTarget).toBe(setHoverTarget);
		act(() => result.current.setHoverTarget?.(mediaParent));
		expect(result.current.range).toBeNull();
		expect(result.current.hoverDraftDocumentPosition).toEqual({ from: 903, to: 903 });
		act(() => result.current.clearHoverDraft());
		expect(result.current.setHoverTarget).toBe(setHoverTarget);
		act(() => result.current.setHoverTarget?.(mediaParent));
		expect(result.current.range?.startContainer).toBe(mediaParent);
	});

	it('preserves existing hover behavior during a media draft', () => {
		passGate('cc_maui_annotations_on_extensions');
		const { result } = setup(true, true);
		const mediaParent = document.createElement('div');
		mediaParent.appendChild(document.createElement('div')).className = 'media-file-card-view';
		const nextParent = document.createElement('div');
		nextParent.appendChild(document.createElement('div')).className = 'media-file-card-view';
		act(() => result.current.setHoverTarget?.(mediaParent));
		act(() => result.current.promoteHoverToDraft({ from: 0, to: 0 }));
		act(() => result.current.setHoverTarget?.(nextParent));
		expect(result.current.range?.startContainer).toBe(nextParent);
	});

	const extension = {
		type: 'extension',
		attrs: { extensionType: 'test', extensionKey: 'chart' },
	};
	describe.each([
		{ name: 'first chart', content: [extension], position: 0, targetIndex: 0 },
		{
			name: 'chart after text at the reported position',
			content: [
				{ type: 'paragraph', content: [{ type: 'text', text: 'x'.repeat(84) }] },
				extension,
			],
			position: 86,
			targetIndex: 0,
		},
		{ name: 'second adjacent chart', content: [extension, extension], position: 1, targetIndex: 1 },
		{
			name: 'chart in a layout column',
			content: [
				{
					type: 'layoutSection',
					content: [
						{ type: 'layoutColumn', attrs: { width: 50 }, content: [extension] },
						{ type: 'layoutColumn', attrs: { width: 50 }, content: [{ type: 'paragraph' }] },
					],
				},
			],
			position: 2,
			targetIndex: 0,
		},
	])('$name', ({ content, position, targetIndex }) => {
		it.each(['mouse hover', 'keyboard focus'] as const)(
			'sets the whole eligible extension as the hover range on %s in a full-page renderer',
			async (interaction) => {
				passGate('cc_maui_annotations_on_extensions');
				getSchemaBasedOnStage.clear();
				const schema = getSchemaBasedOnStage('stage0');
				const doc = schema.nodeFromJSON({
					type: 'doc',
					content,
				});
				doc.check();
				let hoverRange: Range | null = null;
				const serializer = new ReactSerializer({
					appearance: 'full-page',
					objectContext: { adDoc: doc.toJSON() },
					extensionHandlers: {
						test: () => (
							<>
								<button>Chart interaction</button>
								<button>Another chart interaction</button>
							</>
						),
					},
				});
				const HoverState = () => {
					const { range } = useAnnotationRangeState();
					hoverRange = range;
					return <span>{range ? JSON.stringify(getPosFromRange(range)) : 'idle'}</span>;
				};

				const { container } = render(
					<ProvidersContext.Provider
						value={{
							inlineComment: { getState: async () => [], isBlockNodeSupported: () => true },
						}}
					>
						<AnnotationRangeProvider hasBlockNodeSupport>
							<AnnotationHoverContext>
								{serializer.serializeFragment(doc.content)}
								<HoverState />
							</AnnotationHoverContext>
						</AnnotationRangeProvider>
					</ProvidersContext.Provider>,
				);

				if (interaction === 'mouse hover') {
					fireEvent.mouseEnter(screen.getAllByTestId('extension--wrapper')[targetIndex], {
						buttons: 0,
					});
				} else {
					const firstControl = screen.getAllByRole('button', { name: 'Chart interaction' })[
						targetIndex
					];
					const secondControl = screen.getAllByRole('button', {
						name: 'Another chart interaction',
					})[targetIndex];
					fireEvent.focus(firstControl);
					const initialRange = hoverRange;
					fireEvent.blur(firstControl, { relatedTarget: secondControl });
					fireEvent.focus(secondControl, { relatedTarget: firstControl });
					expect(hoverRange).toBe(initialRange);
				}
				expect(
					screen.getByText(JSON.stringify({ from: position, to: position })),
				).toBeInTheDocument();
				if (!hoverRange) {
					throw new Error('Expected an extension hover range');
				}
				const actions = new RendererActions(true);
				actions._privateRegisterRenderer({ current: null }, doc, schema);
				// Follow the hover comment flow through RangeValidator and Mounter.
				const documentPosition = actions.getPositionFromRange(hoverRange);
				if (!documentPosition) {
					throw new Error('Expected an extension document position');
				}
				const result = actions.applyAnnotation(documentPosition, {
					annotationId: 'new-chart-comment',
					annotationType: AnnotationTypes.INLINE_COMMENT,
				});
				if (!result) {
					throw new Error('Expected an extension annotation');
				}
				expect(result.step).toBeInstanceOf(AddNodeMarkStep);
				expect(result.step.toJSON()).toMatchObject({ stepType: 'addNodeMark', pos: position });
				expect(result.targetNodeType).toBe('extension');
				expect(result.pos).toBe(position);
				const updatedDoc = schema.nodeFromJSON(result.doc);
				updatedDoc.check();
				expect(updatedDoc.nodeAt(position)?.marks).toEqual([
					expect.objectContaining({ attrs: expect.objectContaining({ id: 'new-chart-comment' }) }),
				]);
				const annotatedPositions: number[] = [];
				updatedDoc.descendants((node, pos) => {
					if (node.marks.some((mark) => mark.attrs.id === 'new-chart-comment')) {
						annotatedPositions.push(pos);
					}
				});
				expect(annotatedPositions).toEqual([position]);
				await expect(container).toBeAccessible();
			},
		);
	});
});
