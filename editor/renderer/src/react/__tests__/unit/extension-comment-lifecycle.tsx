import React, { useEffect } from 'react';

import { act, fireEvent, render, screen } from '@testing-library/react';
import { IntlProvider } from 'react-intl';

import { AnnotationMarkStates, AnnotationTypes } from '@atlaskit/adf-schema/annotation';
import { getSchemaBasedOnStage } from '@atlaskit/adf-schema/schema-default';
import type { InlineCommentHoverComponentProps } from '@atlaskit/editor-common/types';
import { AnnotationUpdateEmitter, AnnotationUpdateEvent } from '@atlaskit/editor-common/types';
import type { Node as PMNode } from '@atlaskit/editor-prosemirror/model';
import { setupEditorExperiments } from '@atlaskit/tmp-editor-statsig/setup';
import { passGate } from '@atlassian/feature-flags-test-utils/mock-gates';

import RendererActions from '../../../actions';
import { ReactSerializer } from '../../../index';
import { InlineCommentsStateContext, ProvidersContext } from '../../../ui/annotations/context';
import { AnnotationHoverContext } from '../../../ui/annotations/contexts/AnnotationHoverContext';
import { AnnotationRangeProvider } from '../../../ui/annotations/contexts/AnnotationRangeContext';
import { RangeValidator } from '../../../ui/annotations/hover/range-validator';
import { RendererContext } from '../../../ui/RendererActionsContext';

describe('Extension comment lifecycle', () => {
	afterEach(() => setupEditorExperiments('test'));
	const setup = () => {
		passGate('cc_maui_annotations_on_extensions');
		getSchemaBasedOnStage.clear();
		const schema = getSchemaBasedOnStage('stage0');
		const extension = {
			type: 'extension',
			attrs: { extensionType: 'test', extensionKey: 'chart' },
		};
		const doc = schema.nodeFromJSON({
			type: 'doc',
			content: [
				{ type: 'paragraph', content: [{ type: 'text', text: 'x'.repeat(84) }] },
				extension,
				{ type: 'paragraph', content: [{ type: 'text', text: 'x'.repeat(814) }] },
				extension,
			],
		});
		doc.check();
		const onMount = jest.fn();
		const onUnmount = jest.fn();
		const Chart = () => {
			useEffect(() => {
				onMount();
				return onUnmount;
			}, []);
			return <iframe title="Chart" src="about:blank" />;
		};
		const extensionHandlers = { test: () => <Chart /> };
		const subscriber = new AnnotationUpdateEmitter();
		const providers = {
			inlineComment: {
				getState: async () => [],
				isBlockNodeSupported: () => true,
				updateSubscriber: subscriber,
			},
		};
		const actions = new RendererActions(true);
		const rendererInstanceRef = { current: null };
		const rendererRef = React.createRef<HTMLDivElement>();
		// Like Confluence's HoverManager, retain the last callbacks after the hover mounter closes.
		let hoverProps: InlineCommentHoverComponentProps;
		const CaptureHover = (props: InlineCommentHoverComponentProps) => {
			useEffect(() => {
				hoverProps = props;
			}, [props]);
			return null;
		};
		const ui = (document: PMNode, state = AnnotationMarkStates.ACTIVE) => {
			actions._privateRegisterRenderer(rendererInstanceRef, document, schema);
			const serializer = new ReactSerializer({
				appearance: 'full-page',
				allowAnnotations: true,
				surroundTextNodesWithTextWrapper: true,
				objectContext: { adDoc: document.toJSON() },
				extensionHandlers,
			});
			return (
				<IntlProvider locale="en">
					<RendererContext.Provider value={actions}>
						<ProvidersContext.Provider value={providers}>
							<InlineCommentsStateContext.Provider value={{ saved: state, another: state }}>
								<AnnotationRangeProvider hasBlockNodeSupport>
									<AnnotationHoverContext>
										<div ref={rendererRef}>{serializer.serializeFragment(document.content)}</div>
										<RangeValidator rendererRef={rendererRef} component={CaptureHover} />
									</AnnotationHoverContext>
								</AnnotationRangeProvider>
							</InlineCommentsStateContext.Provider>
						</ProvidersContext.Provider>
					</RendererContext.Provider>
				</IntlProvider>
			);
		};
		const result = render(ui(doc));
		const hover = (index: number) =>
			fireEvent.mouseEnter(screen.getAllByTestId('extension--wrapper')[index], { buttons: 0 });
		const applyDraft = () => hoverProps.applyDraftMode({ annotationId: 'draft' });
		const save = () => hoverProps.onCreate('saved');
		const cancel = () => hoverProps.onClose();
		return {
			...result,
			doc,
			schema,
			ui,
			actions,
			hover,
			applyDraft,
			save,
			cancel,
			onMount,
			onUnmount,
			subscriber,
		};
	};

	it('anchors the draft to the selected chart and clears it on cancellation', () => {
		const { container, hover, applyDraft, cancel, onMount, onUnmount } = setup();
		const frames = screen.getAllByTitle('Chart');
		hover(1);
		act(() => {
			applyDraft();
		});
		expect(
			container
				.querySelector('[data-annotation-draft-mark="true"]')
				?.closest('[data-testid="extension--wrapper"]'),
		).toBe(screen.getAllByTestId('extension--wrapper')[1]);
		act(cancel);
		expect(container.querySelector('[data-annotation-draft-mark="true"]')).toBeNull();
		hover(0);
		act(() => {
			applyDraft();
		});
		expect(
			container
				.querySelector('[data-annotation-draft-mark="true"]')
				?.closest('[data-testid="extension--wrapper"]'),
		).toBe(screen.getAllByTestId('extension--wrapper')[0]);
		expect(screen.getAllByTitle('Chart')[0]).toBe(frames[0]);
		expect(screen.getAllByTitle('Chart')[1]).toBe(frames[1]);
		expect(onMount).toHaveBeenCalledTimes(2);
		expect(onUnmount).not.toHaveBeenCalled();
	});

	it.each([true, false])(
		'keeps the local save on chart two after hovering chart one (stale-selection experiment: %s)',
		(experimentEnabled) => {
			setupEditorExperiments('test', {
				confluence_inline_comments_fix_stale_selection: experimentEnabled,
			});
			const { hover, applyDraft, save, schema, ui, rerender } = setup();
			hover(1);
			act(() => {
				const draft = applyDraft();
				expect(draft && draft.step.toJSON()).toMatchObject({ stepType: 'addNodeMark', pos: 903 });
			});
			hover(0);
			act(() => {
				const result = save();
				expect(result && result.step.toJSON()).toMatchObject({ stepType: 'addNodeMark', pos: 903 });
				if (result) {
					rerender(ui(schema.nodeFromJSON(result.doc)));
				}
			});
			expect(
				screen
					.getByRole('button', { name: 'View comments' })
					.closest('[data-testid="extension--wrapper"]'),
			).toBe(screen.getAllByTestId('extension--wrapper')[1]);
		},
	);

	it('preserves both iframe instances through adding, focusing, resolving, reopening and removing marks', async () => {
		const { doc, ui, rerender, schema, actions, onMount, onUnmount, subscriber, container } =
			setup();
		const frames = screen.getAllByTitle('Chart');
		const result = actions.applyAnnotation(
			{ from: 903, to: 903 },
			{
				annotationId: 'saved',
				annotationType: AnnotationTypes.INLINE_COMMENT,
			},
		);
		if (!result) {
			throw new Error('Expected a chart annotation');
		}
		const annotatedDoc = schema.nodeFromJSON(result.doc);
		rerender(ui(annotatedDoc));
		expect(screen.getAllByTitle('Chart')[1]).toBe(frames[1]);
		const another = actions.applyAnnotation(
			{ from: 903, to: 903 },
			{
				annotationId: 'another',
				annotationType: AnnotationTypes.INLINE_COMMENT,
			},
		);
		if (!another) {
			throw new Error('Expected another chart annotation');
		}
		rerender(ui(schema.nodeFromJSON(another.doc)));
		expect(container.querySelector('#saved')).toBeInTheDocument();
		expect(container.querySelector('#another')).toBeInTheDocument();
		act(() =>
			subscriber.emit(AnnotationUpdateEvent.SET_ANNOTATION_FOCUS, { annotationId: 'saved' }),
		);
		expect(container.querySelector('#saved')).toHaveAttribute('data-has-focus', 'true');
		await expect(container).toBeAccessible();
		rerender(ui(annotatedDoc, AnnotationMarkStates.RESOLVED));
		expect(screen.queryByRole('button', { name: 'View comments' })).not.toBeInTheDocument();
		rerender(ui(annotatedDoc));
		expect(screen.getByRole('button', { name: 'View comments' })).toBeInTheDocument();
		rerender(ui(doc));
		expect(container.querySelector('#saved')).not.toBeInTheDocument();
		expect(screen.getAllByTitle('Chart')[0]).toBe(frames[0]);
		expect(screen.getAllByTitle('Chart')[1]).toBe(frames[1]);
		expect(onMount).toHaveBeenCalledTimes(2);
		expect(onUnmount).not.toHaveBeenCalled();
		await expect(container).toBeAccessible();
	});
});
