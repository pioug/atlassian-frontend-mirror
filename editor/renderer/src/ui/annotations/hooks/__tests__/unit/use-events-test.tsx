import { AnnotationMarkStates, AnnotationTypes } from '@atlaskit/adf-schema';
import type { AnnotationState } from '@atlaskit/editor-common/types';
import { AnnotationUpdateEmitter, AnnotationUpdateEvent } from '@atlaskit/editor-common/types';
import React from 'react';
import { render, unmountComponentAtNode } from 'react-dom';
import { act } from 'react-dom/test-utils';
import {
	useAnnotationClickEvent,
	useAnnotationStateByTypeEvent,
	useHasFocusEvent,
} from '../../use-events';
import type { CreateUIAnalyticsEvent } from '@atlaskit/analytics-next';

function createFakeAnnotationState(id: string): AnnotationState<AnnotationTypes.INLINE_COMMENT> {
	return {
		id,
		annotationType: AnnotationTypes.INLINE_COMMENT,
		state: AnnotationMarkStates.ACTIVE,
	};
}

function createFakeAnnotationStateWithEmptyState(
	id: string,
): AnnotationState<AnnotationTypes.INLINE_COMMENT> {
	return {
		id,
		annotationType: AnnotationTypes.INLINE_COMMENT,
		state: null,
	};
}

function createFakeAnnotationStateWithOtherType(id: string): AnnotationState<number> {
	return {
		id,
		annotationType: -1,
		state: AnnotationMarkStates.ACTIVE,
	};
}

describe('Annotations: Hooks/useEvents', () => {
	const fakeId = 'fakeId';
	let updateSubscriberFake: AnnotationUpdateEmitter;
	let createAnalyticsEventFake: CreateUIAnalyticsEvent;
	let container: HTMLElement | null;
	let root: any; // Change to Root once we go full React 18

	beforeEach(async () => {
		container = document.createElement('div');
		document.body.appendChild(container);
		if (process.env.IS_REACT_18 === 'true') {
			// @ts-ignore react-dom/client only available in react 18
			// eslint-disable-next-line @repo/internal/import/no-unresolved, import/dynamic-import-chunkname -- react-dom/client only available in react 18
			const { createRoot } = await import('react-dom/client');
			root = createRoot(container!);
		}

		jest.spyOn(AnnotationUpdateEmitter.prototype, 'off');
		jest.spyOn(AnnotationUpdateEmitter.prototype, 'on');
		updateSubscriberFake = new AnnotationUpdateEmitter();
		createAnalyticsEventFake = jest.fn().mockImplementation(() => ({
			fire: () => {},
		}));
	});

	afterEach(() => {
		jest.clearAllMocks();

		document.body.removeChild(container!);
		container = null;
	});

	describe('#useHasFocusEvent', () => {
		let CustomComp: (props: React.PropsWithChildren<unknown>) => React.ReactElement | null;
		let fakeFunction: jest.Mock;

		beforeEach(() => {
			fakeFunction = jest.fn();
			CustomComp = () => {
				const hasFocus = useHasFocusEvent({
					id: fakeId,
					updateSubscriber: updateSubscriberFake,
				});

				fakeFunction(hasFocus);

				return null;
			};
		});

		it('should listen for the focus events', () => {
			expect(updateSubscriberFake.on).toHaveBeenCalledTimes(0);

			if (process.env.IS_REACT_18 === 'true') {
				act(() => {
					root.render(<CustomComp />);
				});
			} else {
				render(<CustomComp />, container);
			}

			expect(updateSubscriberFake.on).toHaveBeenCalledWith(
				AnnotationUpdateEvent.SET_ANNOTATION_FOCUS,
				expect.any(Function),
			);
			expect(updateSubscriberFake.on).toHaveBeenCalledWith(
				AnnotationUpdateEvent.REMOVE_ANNOTATION_FOCUS,
				expect.any(Function),
			);
		});

		describe('when the component is unmounted', () => {
			it('should stop listen for the focus events', () => {
				expect(updateSubscriberFake.off).toHaveBeenCalledTimes(0);

				if (process.env.IS_REACT_18 === 'true') {
					act(() => {
						root.render(<CustomComp />);
					});
				} else {
					render(<CustomComp />, container);
				}

				act(() => {
					if (process.env.IS_REACT_18 === 'true') {
						root.unmount();
					} else {
						unmountComponentAtNode(container!);
					}
				});

				expect(updateSubscriberFake.off).toHaveBeenCalledWith(
					AnnotationUpdateEvent.SET_ANNOTATION_FOCUS,
					expect.any(Function),
				);
				expect(updateSubscriberFake.off).toHaveBeenCalledWith(
					AnnotationUpdateEvent.REMOVE_ANNOTATION_FOCUS,
					expect.any(Function),
				);
			});
		});

		describe('when REMOVE_ANNOTATION_FOCUS is emitted', () => {
			it('should set hasFocus to false', () => {
				expect(fakeFunction).toHaveBeenCalledTimes(0);

				if (process.env.IS_REACT_18 === 'true') {
					act(() => {
						root.render(<CustomComp />);
					});
				} else {
					render(<CustomComp />, container);
				}

				expect(fakeFunction).toHaveBeenCalledTimes(1);
				expect(fakeFunction).toHaveBeenCalledWith({ hasFocus: false, isHovered: false });

				act(() => {
					updateSubscriberFake.emit(AnnotationUpdateEvent.SET_ANNOTATION_FOCUS, {
						annotationId: fakeId,
					});
				});

				expect(fakeFunction).toHaveBeenCalledTimes(2);
				expect(fakeFunction).toHaveBeenCalledWith({ hasFocus: true, isHovered: false });

				act(() => {
					updateSubscriberFake.emit(AnnotationUpdateEvent.REMOVE_ANNOTATION_FOCUS);
				});

				expect(fakeFunction).toHaveBeenCalledTimes(3);
				expect(fakeFunction).toHaveBeenCalledWith({ hasFocus: false, isHovered: false });
			});
		});

		describe('when SET_ANNOTATION_FOCUS is emitted', () => {
			it('should not set hasFocus when the id is different', () => {
				expect(fakeFunction).toHaveBeenCalledTimes(0);

				if (process.env.IS_REACT_18 === 'true') {
					act(() => {
						root.render(<CustomComp />);
					});
				} else {
					render(<CustomComp />, container);
				}

				expect(fakeFunction).toHaveBeenCalledWith({ hasFocus: false, isHovered: false });

				const otherId = 'otherId';
				act(() => {
					updateSubscriberFake.emit(AnnotationUpdateEvent.SET_ANNOTATION_FOCUS, {
						annotationId: otherId,
					});
				});

				expect(fakeFunction).toHaveBeenCalledWith({ hasFocus: false, isHovered: false });
			});

			it('should set hasFocus for the id emitted', () => {
				expect(fakeFunction).toHaveBeenCalledTimes(0);

				if (process.env.IS_REACT_18 === 'true') {
					act(() => {
						root.render(<CustomComp />);
					});
				} else {
					render(<CustomComp />, container);
				}

				expect(fakeFunction).toHaveBeenCalledWith({ hasFocus: false, isHovered: false });

				act(() => {
					updateSubscriberFake.emit(AnnotationUpdateEvent.SET_ANNOTATION_FOCUS, {
						annotationId: fakeId,
					});
				});

				expect(fakeFunction).toHaveBeenCalledWith({ hasFocus: true, isHovered: false });
			});
		});
	});

	describe('#useAnnotationStateByTypeEvent', () => {
		let CustomComp: (props: React.PropsWithChildren<unknown>) => React.ReactElement | null;
		let fakeFunction: jest.Mock;

		beforeEach(() => {
			fakeFunction = jest.fn();
			CustomComp = () => {
				const states = useAnnotationStateByTypeEvent({
					type: AnnotationTypes.INLINE_COMMENT,
					updateSubscriber: updateSubscriberFake,
				});
				fakeFunction(states);
				return null;
			};
		});

		it('should listen for SET_ANNOTATION_STATE', () => {
			expect(updateSubscriberFake.on).toHaveBeenCalledTimes(0);

			if (process.env.IS_REACT_18 === 'true') {
				act(() => {
					root.render(<CustomComp />);
				});
			} else {
				render(<CustomComp />, container);
			}

			expect(updateSubscriberFake.on).toHaveBeenCalledWith(
				AnnotationUpdateEvent.SET_ANNOTATION_STATE,
				expect.any(Function),
			);
		});

		describe('when the component is unmounted', () => {
			it('should stop listen for SET_ANNOTATION_STATE', () => {
				expect(updateSubscriberFake.off).toHaveBeenCalledTimes(0);

				if (process.env.IS_REACT_18 === 'true') {
					act(() => {
						root.render(<CustomComp />);
					});
				} else {
					render(<CustomComp />, container);
				}

				act(() => {
					if (process.env.IS_REACT_18 === 'true') {
						root.unmount();
					} else {
						unmountComponentAtNode(container!);
					}
				});

				expect(updateSubscriberFake.off).toHaveBeenCalledWith(
					AnnotationUpdateEvent.SET_ANNOTATION_STATE,
					expect.any(Function),
				);
			});
		});

		describe('when SET_ANNOTATION_STATE is emitted', () => {
			it('should not set the state when the type is different', () => {
				expect(fakeFunction).toHaveBeenCalledTimes(0);

				if (process.env.IS_REACT_18 === 'true') {
					act(() => {
						root.render(<CustomComp />);
					});
				} else {
					render(<CustomComp />, container);
				}

				expect(fakeFunction).toHaveBeenCalledWith({});

				const otherId = 'otherId';
				const payload = {
					[otherId]: createFakeAnnotationStateWithOtherType(otherId),
				};
				act(() => {
					updateSubscriberFake.emit(
						AnnotationUpdateEvent.SET_ANNOTATION_STATE,
						// @ts-ignore
						payload,
					);
				});

				expect(fakeFunction).toHaveBeenCalledWith({});
			});

			it('should not set the state if the current state is empty', () => {
				expect(fakeFunction).toHaveBeenCalledTimes(0);

				if (process.env.IS_REACT_18 === 'true') {
					act(() => {
						root.render(<CustomComp />);
					});
				} else {
					render(<CustomComp />, container);
				}

				expect(fakeFunction).toHaveBeenCalledWith({});

				const otherId = 'otherId';
				const payload = {
					[otherId]: createFakeAnnotationStateWithEmptyState(otherId),
				};
				act(() => {
					updateSubscriberFake.emit(
						AnnotationUpdateEvent.SET_ANNOTATION_STATE,
						// @ts-ignore
						payload,
					);
				});

				expect(fakeFunction).toHaveBeenCalledWith({});
			});

			it('should set the state for the id emitted', () => {
				expect(fakeFunction).toHaveBeenCalledTimes(0);

				if (process.env.IS_REACT_18 === 'true') {
					act(() => {
						root.render(<CustomComp />);
					});
				} else {
					render(<CustomComp />, container);
				}

				expect(fakeFunction).toHaveBeenCalledWith({});

				const payload = {
					[fakeId]: createFakeAnnotationState(fakeId),
				};
				act(() => {
					updateSubscriberFake.emit(AnnotationUpdateEvent.SET_ANNOTATION_STATE, payload);
				});

				expect(fakeFunction).toHaveBeenCalledWith({
					[fakeId]: AnnotationMarkStates.ACTIVE,
				});
			});

			it('should handle null annotation id', () => {
				const nullid = null;
				expect(fakeFunction).toHaveBeenCalledTimes(0);

				if (process.env.IS_REACT_18 === 'true') {
					act(() => {
						root.render(<CustomComp />);
					});
				} else {
					render(<CustomComp />, container);
				}

				expect(fakeFunction).toHaveBeenCalledWith({});

				const payload = {
					[nullid as any]: createFakeAnnotationState(nullid as any),
					[fakeId]: createFakeAnnotationState(fakeId),
				};
				act(() => {
					updateSubscriberFake.emit(AnnotationUpdateEvent.SET_ANNOTATION_STATE, payload);
				});

				expect(fakeFunction).toHaveBeenLastCalledWith({
					[fakeId]: AnnotationMarkStates.ACTIVE,
				});
			});
		});
	});

	describe('#useAnnotationClickEvent', () => {
		let CustomComp: (props: React.PropsWithChildren<unknown>) => React.ReactElement | null;
		let fakeFunction: jest.Mock;
		beforeEach(() => {
			fakeFunction = jest.fn();

			CustomComp = () => {
				const annotations = useAnnotationClickEvent({
					updateSubscriber: updateSubscriberFake,
					createAnalyticsEvent: createAnalyticsEventFake,
					isNestedRender: false,
				});

				fakeFunction(annotations);
				return null;
			};
		});

		it('should listen for ON_ANNOTATION_CLICK', () => {
			expect(updateSubscriberFake.on).toHaveBeenCalledTimes(0);

			if (process.env.IS_REACT_18 === 'true') {
				act(() => {
					root.render(<CustomComp />);
				});
			} else {
				render(<CustomComp />, container);
			}

			expect(updateSubscriberFake.on).toHaveBeenCalledWith(
				AnnotationUpdateEvent.ON_ANNOTATION_CLICK,
				expect.any(Function),
			);
		});

		it('should listen for ON_ANNOTATION_CLICK for nested render but do not bind multiple(duplicate) callback', () => {
			expect(updateSubscriberFake.on).toHaveBeenCalledTimes(0);

			CustomComp = () => {
				const annotations = useAnnotationClickEvent({
					updateSubscriber: updateSubscriberFake,
					createAnalyticsEvent: createAnalyticsEventFake,
					isNestedRender: true,
				});

				fakeFunction(annotations);
				return null;
			};

			expect(updateSubscriberFake.on).toHaveBeenCalledTimes(0);
		});

		it('should listen for DESELECT_ANNOTATIONS', () => {
			expect(updateSubscriberFake.on).toHaveBeenCalledTimes(0);

			if (process.env.IS_REACT_18 === 'true') {
				act(() => {
					root.render(<CustomComp />);
				});
			} else {
				render(<CustomComp />, container);
			}

			expect(updateSubscriberFake.on).toHaveBeenCalledWith(
				AnnotationUpdateEvent.DESELECT_ANNOTATIONS,
				expect.any(Function),
			);
		});

		describe('when the component is unmounted', () => {
			it('should stop listen for ON_ANNOTATION_CLICK', () => {
				expect(updateSubscriberFake.off).toHaveBeenCalledTimes(0);

				if (process.env.IS_REACT_18 === 'true') {
					act(() => {
						root.render(<CustomComp />);
					});
				} else {
					render(<CustomComp />, container);
				}

				act(() => {
					if (process.env.IS_REACT_18 === 'true') {
						root.unmount();
					} else {
						unmountComponentAtNode(container!);
					}
				});

				expect(updateSubscriberFake.off).toHaveBeenCalledWith(
					AnnotationUpdateEvent.ON_ANNOTATION_CLICK,
					expect.any(Function),
				);
			});

			it('should stop listen for DESELECT_ANNOTATIONS', () => {
				expect(updateSubscriberFake.off).toHaveBeenCalledTimes(0);

				if (process.env.IS_REACT_18 === 'true') {
					act(() => {
						root.render(<CustomComp />);
					});
				} else {
					render(<CustomComp />, container);
				}

				act(() => {
					if (process.env.IS_REACT_18 === 'true') {
						root.unmount();
					} else {
						unmountComponentAtNode(container!);
					}
				});

				expect(updateSubscriberFake.off).toHaveBeenCalledWith(
					AnnotationUpdateEvent.DESELECT_ANNOTATIONS,
					expect.any(Function),
				);
			});
		});

		describe('when ON_ANNOTATION_CLICK is emitted', () => {
			it('should set annotations', () => {
				const annotationIds = ['lol1', 'lol2'];
				expect(fakeFunction).toHaveBeenCalledTimes(0);

				if (process.env.IS_REACT_18 === 'true') {
					act(() => {
						root.render(<CustomComp />);
					});
				} else {
					render(<CustomComp />, container);
				}

				expect(fakeFunction).toHaveBeenCalledWith(null);

				act(() => {
					updateSubscriberFake.emit(AnnotationUpdateEvent.ON_ANNOTATION_CLICK, {
						annotationIds,
						eventTarget: container!, // The container is created before each test and destroyed after
						eventTargetType: 'media',
						viewMethod: 'badge',
					});
				});

				const expected = {
					annotations: annotationIds.map((id) => ({
						id,
						type: AnnotationTypes.INLINE_COMMENT,
					})),
					clickElementTarget: container!,
				};

				expect(fakeFunction).toHaveBeenCalledWith(expected);
				expect(createAnalyticsEventFake).toHaveBeenCalledWith(
					expect.objectContaining({
						attributes: {
							targetNodeType: 'media',
							method: 'badge',
							overlap: 2,
						},
					}),
				);
			});
		});

		describe('when DESELECT_ANNOTATIONS is emitted', () => {
			it('should remove all annotations', () => {
				expect(fakeFunction).toHaveBeenCalledTimes(0);

				if (process.env.IS_REACT_18 === 'true') {
					act(() => {
						root.render(<CustomComp />);
					});
				} else {
					render(<CustomComp />, container);
				}

				expect(fakeFunction).toHaveBeenCalledWith(null);

				act(() => {
					updateSubscriberFake.emit(AnnotationUpdateEvent.DESELECT_ANNOTATIONS);
				});

				const expected = {
					annotations: [],
					clickElementTarget: undefined,
				};

				expect(fakeFunction).toHaveBeenCalledWith(expected);
			});
		});
	});
});
