import React from 'react';

import { screen, renderHook } from '@testing-library/react';
import { act } from 'react-dom/test-utils';

import { AnnotationMarkStates } from '@atlaskit/adf-schema';
import { defaultSchema as schema } from '@atlaskit/adf-schema/schema-default';
import { createAnnotationManager } from '@atlaskit/editor-common/annotation';
import type { JSONDocNode } from '@atlaskit/editor-json-transformer';

import {
	AnnotationManagerProvider,
	useAnnotationManagerDispatch,
	useAnnotationManagerState,
} from '../../contexts/AnnotationManagerContext';
import { RendererActionsContext } from '../../../RendererActionsContext';
import { createAnnotationStep } from '../../../../steps';

describe('Annotations: AnnotationManagerProvider', () => {
	const wrapper = ({ children }: React.PropsWithChildren) => (
		<div>
			<mark id="test-id-1" data-testid="test-id-1">
				comment-1
			</mark>
			<mark id="test-id-2" data-testid="test-id-2">
				comment-2
			</mark>
			<AnnotationManagerProvider annotationManager={createAnnotationManager()}>
				{children}
			</AnnotationManagerProvider>
		</div>
	);

	describe('when updateAnnotation is called', () => {
		it('should add missing annotations to annotation map', () => {
			const { result } = renderHook(
				() => ({ ...useAnnotationManagerState(), ...useAnnotationManagerDispatch() }),
				{ wrapper },
			);

			expect(result.current.annotations).toEqual({});
			expect(result.current.currentSelectedAnnotationId).toBeUndefined();
			expect(result.current.currentHoveredAnnotationId).toBeUndefined();

			act(() => {
				result.current.dispatch({
					type: 'updateAnnotation',
					data: {
						id: 'test-id-1',
						selected: true,
					},
				});
			});

			expect(result.current.annotations).toEqual({
				'test-id-1': {
					id: 'test-id-1',
					markState: AnnotationMarkStates.ACTIVE,
				},
			});

			expect(result.current.currentSelectedAnnotationId).toEqual('test-id-1');
			expect(result.current.currentHoveredAnnotationId).toBeUndefined();
		});

		it('should toggle off previous selected annotation when new annotation is selected', () => {
			const { result } = renderHook(
				() => ({ ...useAnnotationManagerState(), ...useAnnotationManagerDispatch() }),
				{ wrapper },
			);

			act(() => {
				result.current.dispatch({
					type: 'updateAnnotation',
					data: {
						id: 'test-id-1',
						selected: true,
					},
				});
			});

			expect(result.current.annotations).toEqual({
				'test-id-1': {
					id: 'test-id-1',
					markState: AnnotationMarkStates.ACTIVE,
				},
			});
			expect(result.current.currentSelectedAnnotationId).toEqual('test-id-1');
			expect(result.current.currentHoveredAnnotationId).toBeUndefined();

			act(() => {
				result.current.dispatch({
					type: 'updateAnnotation',
					data: {
						id: 'test-id-2',
						selected: true,
					},
				});
			});

			expect(result.current.annotations).toEqual({
				'test-id-1': {
					id: 'test-id-1',
					markState: AnnotationMarkStates.ACTIVE,
				},
				'test-id-2': {
					id: 'test-id-2',
					markState: AnnotationMarkStates.ACTIVE,
				},
			});

			expect(result.current.currentSelectedAnnotationId).toEqual('test-id-2');
			expect(result.current.currentHoveredAnnotationId).toBeUndefined();

			act(() => {
				result.current.dispatch({
					type: 'updateAnnotation',
					data: {
						id: 'test-id-1',
						selected: true,
					},
				});
			});

			expect(result.current.annotations).toEqual({
				'test-id-1': {
					id: 'test-id-1',
					markState: AnnotationMarkStates.ACTIVE,
				},
				'test-id-2': {
					id: 'test-id-2',
					markState: AnnotationMarkStates.ACTIVE,
				},
			});
			expect(result.current.currentSelectedAnnotationId).toEqual('test-id-1');
			expect(result.current.currentHoveredAnnotationId).toBeUndefined();
		});

		it('should not reset selected or hovered if the other has been toggled', () => {
			// Basically, if you select an annotation, it should not reset the hovered state of the other annotations
			// and vice versa.
			// This is to ensure that the user can select an annotation and hover over another one without losing the selection
			// or hover state of the other annotation.

			const { result } = renderHook(
				() => ({ ...useAnnotationManagerState(), ...useAnnotationManagerDispatch() }),
				{ wrapper },
			);

			act(() => {
				result.current.dispatch({
					type: 'updateAnnotation',
					data: {
						id: 'test-id-1',
						selected: true,
						hovered: true,
					},
				});
			});

			expect(result.current.annotations).toEqual({
				'test-id-1': {
					id: 'test-id-1',
					markState: AnnotationMarkStates.ACTIVE,
				},
			});
			expect(result.current.currentSelectedAnnotationId).toEqual('test-id-1');
			expect(result.current.currentHoveredAnnotationId).toEqual('test-id-1');

			act(() => {
				result.current.dispatch({
					type: 'updateAnnotation',
					data: {
						id: 'test-id-2',
						hovered: true,
					},
				});
			});

			expect(result.current.annotations).toEqual({
				'test-id-1': {
					id: 'test-id-1',
					markState: AnnotationMarkStates.ACTIVE,
				},
				'test-id-2': {
					id: 'test-id-2',
					markState: AnnotationMarkStates.ACTIVE,
				},
			});
			expect(result.current.currentSelectedAnnotationId).toEqual('test-id-1');
			expect(result.current.currentHoveredAnnotationId).toEqual('test-id-2');

			act(() => {
				result.current.dispatch({
					type: 'updateAnnotation',
					data: {
						id: 'test-id-2',
						selected: true,
					},
				});
			});

			expect(result.current.annotations).toEqual({
				'test-id-1': {
					id: 'test-id-1',
					markState: AnnotationMarkStates.ACTIVE,
				},
				'test-id-2': {
					id: 'test-id-2',
					markState: AnnotationMarkStates.ACTIVE,
				},
			});
			expect(result.current.currentSelectedAnnotationId).toEqual('test-id-2');
			expect(result.current.currentHoveredAnnotationId).toEqual('test-id-2');

			act(() => {
				result.current.dispatch({
					type: 'updateAnnotation',
					data: {
						id: 'test-id-2',
						selected: false,
						hovered: false,
					},
				});
			});

			expect(result.current.annotations).toEqual({
				'test-id-1': {
					id: 'test-id-1',
					markState: AnnotationMarkStates.ACTIVE,
				},
				'test-id-2': {
					id: 'test-id-2',
					markState: AnnotationMarkStates.ACTIVE,
				},
			});
			expect(result.current.currentSelectedAnnotationId).toBeUndefined();
			expect(result.current.currentHoveredAnnotationId).toBeUndefined();
		});

		it('should not reset selected or hovered if the current selected/hovered is not the same id as the toggled item', () => {
			const { result } = renderHook(
				() => ({ ...useAnnotationManagerState(), ...useAnnotationManagerDispatch() }),
				{ wrapper },
			);

			act(() => {
				result.current.dispatch({
					type: 'updateAnnotation',
					data: {
						id: 'test-id-1',
						selected: true,
						hovered: true,
					},
				});
				result.current.dispatch({
					type: 'updateAnnotation',
					data: {
						id: 'test-id-2',
						selected: false,
						hovered: false,
					},
				});
			});

			expect(result.current.annotations).toEqual({
				'test-id-1': {
					id: 'test-id-1',
					markState: AnnotationMarkStates.ACTIVE,
				},
				'test-id-2': {
					id: 'test-id-2',
					markState: AnnotationMarkStates.ACTIVE,
				},
			});
			expect(result.current.currentSelectedAnnotationId).toEqual('test-id-1');
			expect(result.current.currentHoveredAnnotationId).toEqual('test-id-1');

			act(() => {
				result.current.dispatch({
					type: 'updateAnnotation',
					data: {
						id: 'test-id-2',
						selected: true,
						hovered: true,
					},
				});
			});
			expect(result.current.currentSelectedAnnotationId).toEqual('test-id-2');
			expect(result.current.currentHoveredAnnotationId).toEqual('test-id-2');

			act(() => {
				result.current.dispatch({
					type: 'updateAnnotation',
					data: {
						id: 'test-id-1',
						selected: false,
						hovered: false,
					},
				});
			});

			expect(result.current.currentSelectedAnnotationId).toEqual('test-id-2');
			expect(result.current.currentHoveredAnnotationId).toEqual('test-id-2');

			act(() => {
				result.current.dispatch({
					type: 'updateAnnotation',
					data: {
						id: 'test-id-2',
						selected: false,
						hovered: false,
					},
				});
			});

			expect(result.current.currentSelectedAnnotationId).toBeUndefined();
			expect(result.current.currentHoveredAnnotationId).toBeUndefined();
		});

		it('should not reset current selected annotation when the annotation is resolved', () => {
			const { result } = renderHook(
				() => ({ ...useAnnotationManagerState(), ...useAnnotationManagerDispatch() }),
				{ wrapper },
			);

			act(() => {
				result.current.dispatch({
					type: 'updateAnnotation',
					data: {
						id: 'test-id-1',
						selected: true,
					},
				});
			});

			expect(result.current.annotations).toEqual({
				'test-id-1': {
					id: 'test-id-1',
					markState: AnnotationMarkStates.ACTIVE,
				},
			});
			expect(result.current.currentSelectedAnnotationId).toEqual('test-id-1');

			act(() => {
				result.current.dispatch({
					type: 'updateAnnotation',
					data: {
						id: 'test-id-1',
						markState: AnnotationMarkStates.RESOLVED,
					},
				});
			});

			expect(result.current.annotations).toEqual({
				'test-id-1': {
					id: 'test-id-1',
					markState: AnnotationMarkStates.RESOLVED,
				},
			});
			expect(result.current.currentSelectedAnnotationId).toBeUndefined();
		});
	});

	describe('when annotation manager is used', () => {
		it('should get draft not started if isDrafting is false', () => {
			const { result } = renderHook(
				() => ({ ...useAnnotationManagerState(), ...useAnnotationManagerDispatch() }),
				{ wrapper },
			);

			expect(result.current.annotations).toEqual({});
			expect(result.current.isDrafting).toEqual(false);

			const draft = result.current.annotationManager?.getDraft();

			expect(draft).toEqual({
				success: false,
				reason: 'draft-not-started',
			});
		});

		it('should get draft started only when the draft has been completely started', () => {
			const { result } = renderHook(
				() => ({ ...useAnnotationManagerState(), ...useAnnotationManagerDispatch() }),
				{ wrapper },
			);

			expect(result.current.annotations).toEqual({});
			expect(result.current.isDrafting).toEqual(false);

			act(() => {
				result.current.dispatch({
					type: 'setDrafting',
					data: {
						draftId: 'test-id-1',
						isDrafting: true,
						draftActionResult: undefined,
					},
				});
			});

			expect(result.current.isDrafting).toEqual(true);

			const draftResult1 = result.current.annotationManager?.getDraft();

			expect(draftResult1).toEqual({
				success: false,
				reason: 'draft-not-started',
			});

			act(() => {
				result.current.dispatch({
					type: 'setDrafting',
					data: {
						draftId: 'test-id-1',
						isDrafting: true,
						draftActionResult: {
							step: createAnnotationStep(1, 2, {
								schema,
								annotationId: 'test-id-1',
								annotationType: 'inlineComment',
							}),
							doc: {} as JSONDocNode,
							inlineNodeTypes: undefined,
							targetNodeType: undefined,
							originalSelection: '',
							numMatches: 0,
							matchIndex: 0,
							pos: 0,
						},
					},
				});
				result.current.dispatch({
					type: 'setDraftMarkRef',
					data: {
						draftMarkRef: document.createElement('div'),
					},
				});
			});

			const draftResult2 = result.current.annotationManager?.getDraft();

			expect(draftResult2).toEqual({
				success: true,
				targetElement: expect.any(HTMLElement),
				inlineNodeTypes: [],
				actionResult: expect.any(Object),
			});
		});

		it('should not trigger draft started callback until after the html element reference is available', () => {
			const { result } = renderHook(
				() => ({ ...useAnnotationManagerState(), ...useAnnotationManagerDispatch() }),
				{ wrapper },
			);

			const onDraftAnnotationStartedCallback = jest.fn();
			const element = document.createElement('div');
			result.current.annotationManager?.onDraftAnnotationStarted(onDraftAnnotationStartedCallback);

			act(() => {
				result.current.dispatch({
					type: 'setDrafting',
					data: {
						draftId: 'test-id-1',
						isDrafting: true,
						draftActionResult: {
							step: createAnnotationStep(1, 2, {
								schema,
								annotationId: 'test-id-1',
								annotationType: 'inlineComment',
							}),
							doc: {} as JSONDocNode,
							inlineNodeTypes: ['test'],
							targetNodeType: undefined,
							originalSelection: '',
							numMatches: 0,
							matchIndex: 0,
							pos: 0,
						},
					},
				});
			});

			expect(onDraftAnnotationStartedCallback).not.toHaveBeenCalled();

			act(() => {
				result.current.dispatch({
					type: 'setDraftMarkRef',
					data: {
						draftMarkRef: element,
					},
				});
			});

			expect(onDraftAnnotationStartedCallback).toHaveBeenCalledWith({
				targetElement: element,
				inlineNodeTypes: ['test'],
				actionResult: {
					step: expect.any(Object),
					doc: expect.any(Object),
					inlineNodeTypes: ['test'],
					targetNodeType: undefined,
					originalSelection: '',
					numMatches: 0,
					matchIndex: 0,
					pos: 0,
				},
			});
		});
	});

	describe('setIsAnnotationSelected', () => {
		it('should return false if drafting', () => {
			const { result } = renderHook(
				() => ({ ...useAnnotationManagerState(), ...useAnnotationManagerDispatch() }),
				{ wrapper },
			);

			act(() => {
				result.current.dispatch({
					type: 'setDrafting',
					data: { isDrafting: true, draftId: 'test-id-1', draftActionResult: undefined },
				});
			});

			act(() => {
				const rtn = result.current.annotationManager?.setIsAnnotationSelected('test-id-1', true);
				expect(rtn).toEqual({ success: false, reason: 'draft-in-progress' });
			});
		});

		it('should return false if id is not valid', () => {
			const { result } = renderHook(
				() => ({ ...useAnnotationManagerState(), ...useAnnotationManagerDispatch() }),
				{ wrapper },
			);

			act(() => {
				const rtn = result.current.annotationManager?.setIsAnnotationSelected('test-id-1', true);
				expect(rtn).toEqual({ success: false, reason: 'id-not-valid' });
			});
		});

		it('should set the annotation as selected programmatically', () => {
			const { result } = renderHook(
				() => ({ ...useAnnotationManagerState(), ...useAnnotationManagerDispatch() }),
				{ wrapper },
			);

			act(() => {
				result.current.dispatch({
					type: 'loadAnnotation',
					data: [{ id: 'test-id-1', markState: AnnotationMarkStates.ACTIVE }],
				});
			});

			expect(result.current.currentSelectedAnnotationId).toBeUndefined();
			expect(result.current.currentSelectedMarkRef).toBeUndefined();

			act(() => {
				const rtn = result.current.annotationManager?.setIsAnnotationSelected('test-id-1', true);
				expect(rtn).toEqual({ success: true, isSelected: true });
			});

			expect(result.current.currentSelectedAnnotationId).toEqual('test-id-1');
			expect(result.current.currentSelectedMarkRef?.id).toEqual('test-id-1');
		});

		it('should override the current selected annotation programmatically if a different annotation is selected', () => {
			const { result } = renderHook(
				() => ({ ...useAnnotationManagerState(), ...useAnnotationManagerDispatch() }),
				{ wrapper },
			);

			act(() => {
				result.current.dispatch({
					type: 'loadAnnotation',
					data: [
						{ id: 'test-id-1', markState: AnnotationMarkStates.ACTIVE },
						{ id: 'test-id-2', markState: AnnotationMarkStates.ACTIVE },
					],
				});
			});

			expect(result.current.currentSelectedAnnotationId).toBeUndefined();

			act(() => {
				const rtn = result.current.annotationManager?.setIsAnnotationSelected('test-id-1', true);
				expect(rtn).toEqual({ success: true, isSelected: true });
			});

			act(() => {
				const rtn = result.current.annotationManager?.setIsAnnotationSelected('test-id-2', true);
				expect(rtn).toEqual({ success: true, isSelected: true });
			});

			expect(result.current.currentSelectedAnnotationId).toEqual('test-id-2');
			expect(result.current.currentSelectedMarkRef?.id).toEqual('test-id-2');
		});

		it('should deselect a selected annotation', () => {
			const { result } = renderHook(
				() => ({ ...useAnnotationManagerState(), ...useAnnotationManagerDispatch() }),
				{ wrapper },
			);

			act(() => {
				result.current.dispatch({
					type: 'loadAnnotation',
					data: [{ id: 'test-id-1', markState: AnnotationMarkStates.ACTIVE }],
				});
			});

			act(() => {
				const rtn = result.current.annotationManager?.setIsAnnotationSelected('test-id-1', true);
				expect(rtn).toEqual({ success: true, isSelected: true });
			});

			act(() => {
				const rtn = result.current.annotationManager?.setIsAnnotationSelected('test-id-1', false);
				expect(rtn).toEqual({ success: true, isSelected: false });
			});

			expect(result.current.currentSelectedAnnotationId).toBeUndefined();
			expect(result.current.currentSelectedMarkRef).toBeUndefined();
		});
	});

	describe('onAnnotationSelectionChange', () => {
		it('single annotation toggle', () => {
			const { result } = renderHook(
				() => ({ ...useAnnotationManagerState(), ...useAnnotationManagerDispatch() }),
				{ wrapper },
			);

			const callback = jest.fn();
			result.current.annotationManager?.onAnnotationSelectionChange(callback);

			act(() => {
				result.current.dispatch({
					type: 'loadAnnotation',
					data: [{ id: 'test-id-1', markState: AnnotationMarkStates.ACTIVE }],
				});
			});

			act(() => {
				result.current.annotationManager?.setIsAnnotationSelected('test-id-1', true);
			});

			expect(callback).toHaveBeenCalledWith({
				annotationId: 'test-id-1',
				isSelected: true,
				inlineNodeTypes: [],
			});

			act(() => {
				result.current.annotationManager?.setIsAnnotationSelected('test-id-1', false);
			});

			expect(callback).toHaveBeenCalledWith({
				annotationId: 'test-id-1',
				isSelected: false,
				inlineNodeTypes: [],
			});

			expect(callback).toHaveBeenCalledTimes(2);
		});

		it('switch to another annotation', () => {
			const { result } = renderHook(
				() => ({ ...useAnnotationManagerState(), ...useAnnotationManagerDispatch() }),
				{ wrapper },
			);

			const callback = jest.fn();
			result.current.annotationManager?.onAnnotationSelectionChange(callback);

			act(() => {
				result.current.dispatch({
					type: 'loadAnnotation',
					data: [
						{ id: 'test-id-1', markState: AnnotationMarkStates.ACTIVE },
						{ id: 'test-id-2', markState: AnnotationMarkStates.ACTIVE },
					],
				});
			});

			act(() => {
				result.current.annotationManager?.setIsAnnotationSelected('test-id-1', true);
			});

			expect(callback).toHaveBeenCalledWith({
				annotationId: 'test-id-1',
				isSelected: true,
				inlineNodeTypes: [],
			});

			act(() => {
				result.current.annotationManager?.setIsAnnotationSelected('test-id-2', true);
			});

			expect(callback).toHaveBeenCalledWith({
				annotationId: 'test-id-1',
				isSelected: false,
				inlineNodeTypes: [],
			});

			expect(callback).toHaveBeenCalledWith({
				annotationId: 'test-id-2',
				isSelected: true,
				inlineNodeTypes: [],
			});

			expect(callback).toHaveBeenCalledTimes(3);
		});

		it('should only trigger onAnnotationSelectionChange when the annotation is selected and ref is set', () => {
			const { result } = renderHook(
				() => ({ ...useAnnotationManagerState(), ...useAnnotationManagerDispatch() }),
				{ wrapper },
			);

			const callback = jest.fn();
			result.current.annotationManager?.onAnnotationSelectionChange(callback);

			act(() => {
				result.current.dispatch({
					type: 'updateAnnotation',
					data: {
						id: 'test-id-1',
						selected: true,
					},
				});
			});

			expect(callback).not.toHaveBeenCalled();

			act(() => {
				result.current.dispatch({
					type: 'setSelectedMarkRef',
					data: {
						markRef: screen.getByTestId('test-id-1'),
					},
				});
			});

			expect(callback).toHaveBeenCalledWith({
				annotationId: 'test-id-1',
				isSelected: true,
				inlineNodeTypes: [],
			});

			expect(callback).toHaveBeenCalledTimes(1);
		});
	});

	describe('setIsAnnotationHovered', () => {
		it('should return false if id is not valid', () => {
			const { result } = renderHook(
				() => ({ ...useAnnotationManagerState(), ...useAnnotationManagerDispatch() }),
				{ wrapper },
			);

			act(() => {
				const rtn = result.current.annotationManager?.setIsAnnotationHovered('test-id-1', true);
				expect(rtn).toEqual({ success: false, reason: 'id-not-valid' });
			});
		});

		it('should set the annotation as hovered programmatically', () => {
			const { result } = renderHook(
				() => ({ ...useAnnotationManagerState(), ...useAnnotationManagerDispatch() }),
				{ wrapper },
			);

			act(() => {
				result.current.dispatch({
					type: 'loadAnnotation',
					data: [{ id: 'test-id-1', markState: AnnotationMarkStates.ACTIVE }],
				});
			});

			expect(result.current.currentHoveredAnnotationId).toBeUndefined();

			act(() => {
				const rtn = result.current.annotationManager?.setIsAnnotationHovered('test-id-1', true);
				expect(rtn).toEqual({ success: true, isHovered: true });
			});

			expect(result.current.currentHoveredAnnotationId).toEqual('test-id-1');
		});

		it('should override the current hovered annotation programmatically if a different annotation is hovered', () => {
			const { result } = renderHook(
				() => ({ ...useAnnotationManagerState(), ...useAnnotationManagerDispatch() }),
				{ wrapper },
			);

			act(() => {
				result.current.dispatch({
					type: 'loadAnnotation',
					data: [
						{ id: 'test-id-1', markState: AnnotationMarkStates.ACTIVE },
						{ id: 'test-id-2', markState: AnnotationMarkStates.ACTIVE },
					],
				});
			});

			act(() => {
				const rtn = result.current.annotationManager?.setIsAnnotationHovered('test-id-1', true);
				expect(rtn).toEqual({ success: true, isHovered: true });
			});

			act(() => {
				const rtn = result.current.annotationManager?.setIsAnnotationHovered('test-id-2', true);
				expect(rtn).toEqual({ success: true, isHovered: true });
			});

			expect(result.current.currentHoveredAnnotationId).toEqual('test-id-2');
		});
	});

	describe('clearAnnotation', () => {
		it('should return false if id is not valid', () => {
			const { result } = renderHook(
				() => ({ ...useAnnotationManagerState(), ...useAnnotationManagerDispatch() }),
				{ wrapper },
			);

			act(() => {
				const rtn = result.current.annotationManager?.clearAnnotation('test-id-1');
				expect(rtn).toEqual({ success: false, reason: 'id-not-valid' });
			});
		});

		it('should return false if deleteAnnotation failed', () => {
			const { result } = renderHook(
				() => ({ ...useAnnotationManagerState(), ...useAnnotationManagerDispatch() }),
				{
					wrapper: ({ children }: React.PropsWithChildren) => {
						const Wrapper = wrapper;
						return (
							<RendererActionsContext context={{ deleteAnnotation: jest.fn(() => false) } as any}>
								<Wrapper>{children}</Wrapper>
							</RendererActionsContext>
						);
					},
				},
			);

			act(() => {
				result.current.dispatch({
					type: 'loadAnnotation',
					data: [{ id: 'test-id-1', markState: AnnotationMarkStates.ACTIVE }],
				});
			});

			act(() => {
				const rtn = result.current.annotationManager?.clearAnnotation('test-id-1');
				expect(rtn).toEqual({ success: false, reason: 'clear-failed' });
			});
		});

		it('should return what deleteAnnotation returns', () => {
			const { result } = renderHook(
				() => ({ ...useAnnotationManagerState(), ...useAnnotationManagerDispatch() }),
				{
					wrapper: ({ children }: React.PropsWithChildren) => {
						const Wrapper = wrapper;
						return (
							<RendererActionsContext
								context={
									{
										deleteAnnotation: jest.fn(() => ({ step: 'mock-step', doc: 'mock-doc' })),
									} as any
								}
							>
								<Wrapper>{children}</Wrapper>
							</RendererActionsContext>
						);
					},
				},
			);

			act(() => {
				result.current.dispatch({
					type: 'loadAnnotation',
					data: [{ id: 'test-id-1', markState: AnnotationMarkStates.ACTIVE }],
				});
			});

			act(() => {
				const rtn = result.current.annotationManager?.clearAnnotation('test-id-1');
				expect(rtn).toEqual({
					success: true,
					actionResult: { step: 'mock-step', doc: 'mock-doc' },
				});
			});
		});
	});
});
