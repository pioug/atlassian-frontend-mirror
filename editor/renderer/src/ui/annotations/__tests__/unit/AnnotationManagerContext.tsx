import React from 'react';

import { renderHook } from '@testing-library/react';
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
import { createAnnotationStep } from '../../../../steps';

describe('Annotations: AnnotationManagerProvider', () => {
	const wrapper = ({ children }: React.PropsWithChildren) => (
		<AnnotationManagerProvider annotationManager={createAnnotationManager()}>
			{children}
		</AnnotationManagerProvider>
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
});
