import { AnnotationTypes } from '@atlaskit/adf-schema';
import type { InlineCommentViewComponentProps } from '@atlaskit/editor-common/types';
import type { JSONDocNode } from '@atlaskit/editor-json-transformer';
import React from 'react';
import { render, unmountComponentAtNode } from 'react-dom';
import { act } from 'react-dom/test-utils';
import { EmitterEvents, eventDispatcher as mobileBridgeEventDispatcher } from '../../../dispatcher';
import RendererBridgeImplementation from '../../../native-to-web/implementation';
import { nativeBridgeAPI as webToNativeBridgeAPI } from '../../../web-to-native/implementation';
import { createViewComponent } from '../../create-view-component';

const nativeToWebAPI = new RendererBridgeImplementation();

let container: HTMLElement | null;

describe('Mobile Renderer: Annotations/create-view-component', () => {
	describe('#ViewComponent', () => {
		let deleteAnnotationMock: jest.Mock;
		let ViewComponent: React.ComponentType<
			React.PropsWithChildren<InlineCommentViewComponentProps>
		>;
		let root: any; // Change to Root once we go full React 18

		beforeEach(async () => {
			container = document.createElement('div');
			document.body.appendChild(container);
			if (process.env.IS_REACT_18 === 'true') {
				// @ts-ignore react-dom/client only available in react 18
				// eslint-disable-next-line import/no-unresolved, import/dynamic-import-chunkname -- react-dom/client only available in react 18
				const { createRoot } = await import('react-dom/client');
				root = createRoot(container!);
			}

			ViewComponent = createViewComponent(nativeToWebAPI);
			deleteAnnotationMock = jest.fn();
			jest.spyOn(webToNativeBridgeAPI, 'onAnnotationClick');
			jest.spyOn(webToNativeBridgeAPI, 'onAnnotationClickWithRect');
		});

		afterEach(() => {
			jest.restoreAllMocks();

			document.body.removeChild(container!);
			act(() => {
				if (process.env.IS_REACT_18 === 'true') {
					root.unmount();
				} else {
					unmountComponentAtNode(container!);
				}
			});
			container = null;
		});

		describe('when annotations is empty', () => {
			it('onAnnotationClick should call without parameters', () => {
				expect(webToNativeBridgeAPI.onAnnotationClick).toHaveBeenCalledTimes(0);

				if (process.env.IS_REACT_18 === 'true') {
					act(() => {
						root.render(<ViewComponent annotations={[]} deleteAnnotation={deleteAnnotationMock} />);
					});
				} else {
					render(
						<ViewComponent annotations={[]} deleteAnnotation={deleteAnnotationMock} />,
						container,
					);
				}

				expect(webToNativeBridgeAPI.onAnnotationClick).toHaveBeenCalledWith();
			});
		});

		describe('when annotations is not empty', () => {
			it('onAnnotationClick should call with bridge annotation format', () => {
				expect(webToNativeBridgeAPI.onAnnotationClick).toHaveBeenCalledTimes(0);
				const annotations = [
					{ id: 'lol1', type: AnnotationTypes.INLINE_COMMENT },
					{ id: 'lol2', type: AnnotationTypes.INLINE_COMMENT },
				];
				if (process.env.IS_REACT_18 === 'true') {
					act(() => {
						root.render(
							<ViewComponent
								annotations={annotations}
								clickElementTarget={container!}
								deleteAnnotation={deleteAnnotationMock}
							/>,
						);
					});
				} else {
					render(
						<ViewComponent
							annotations={annotations}
							clickElementTarget={container!}
							deleteAnnotation={deleteAnnotationMock}
						/>,
						container,
					);
				}

				const payload = [
					{
						annotationType: AnnotationTypes.INLINE_COMMENT,
						annotationIds: ['lol1', 'lol2'],
					},
				];
				expect(webToNativeBridgeAPI.onAnnotationClick).toHaveBeenCalledWith(payload);
			});

			it('onAnnotationClickWithRect should call with bridge annotation format', () => {
				expect(webToNativeBridgeAPI.onAnnotationClickWithRect).toHaveBeenCalledTimes(0);
				const annotations = [
					{ id: 'lol1', type: AnnotationTypes.INLINE_COMMENT },
					{ id: 'lol2', type: AnnotationTypes.INLINE_COMMENT },
				];

				if (process.env.IS_REACT_18 === 'true') {
					act(() => {
						root.render(
							<ViewComponent
								annotations={annotations}
								clickElementTarget={container!}
								deleteAnnotation={() => false}
							/>,
						);
					});
				} else {
					render(
						<ViewComponent
							annotations={annotations}
							clickElementTarget={container!}
							deleteAnnotation={() => false}
						/>,
						container,
					);
				}

				const expectedPayload = [
					{
						annotationType: AnnotationTypes.INLINE_COMMENT,
						annotations: [
							expect.objectContaining({
								id: annotations[0].id,
							}),
							expect.objectContaining({
								id: annotations[1].id,
							}),
						],
					},
				];

				expect(webToNativeBridgeAPI.onAnnotationClickWithRect).toHaveBeenCalledWith(
					expectedPayload,
				);
			});
		});

		describe('delete annotations', () => {
			let deleteAnnotationMock: jest.Mock;
			beforeEach(() => {
				deleteAnnotationMock = jest.fn();
				jest.spyOn(mobileBridgeEventDispatcher, 'on');
				jest.spyOn(mobileBridgeEventDispatcher, 'off');
				jest.spyOn(webToNativeBridgeAPI, 'setContent');
				jest.spyOn(nativeToWebAPI, 'setContent');
			});

			const renderViewComponent = () => {
				if (process.env.IS_REACT_18 === 'true') {
					act(() => {
						root.render(
							<ViewComponent
								annotations={[{ id: 'fake-id-1', type: AnnotationTypes.INLINE_COMMENT }]}
								deleteAnnotation={deleteAnnotationMock}
							/>,
						);
					});
				} else {
					act(() => {
						render(
							<ViewComponent
								annotations={[{ id: 'fake-id-1', type: AnnotationTypes.INLINE_COMMENT }]}
								deleteAnnotation={deleteAnnotationMock}
							/>,
							container,
						);
					});
				}
			};

			it('should listen to the delete annotation event', () => {
				expect(mobileBridgeEventDispatcher.on).toHaveBeenCalledTimes(0);
				renderViewComponent();
				expect(mobileBridgeEventDispatcher.on).toHaveBeenCalledWith(
					EmitterEvents.DELETE_ANNOTATION,
					expect.any(Function),
				);
			});

			it('should call deleteAnnotation prop method when delete annotation event triggered', () => {
				renderViewComponent();

				act(() => {
					mobileBridgeEventDispatcher.emit(EmitterEvents.DELETE_ANNOTATION, {
						annotationId: 'random-id',
						annotationType: AnnotationTypes.INLINE_COMMENT,
					});
				});

				expect(deleteAnnotationMock).toHaveBeenCalledWith(
					expect.objectContaining({
						id: 'random-id',
						type: AnnotationTypes.INLINE_COMMENT,
					}),
				);
			});

			it(`should not call deleteAnnotation prop method when delete annotation
        event triggered and payload is provided as empty`, () => {
				renderViewComponent();

				act(() => {
					mobileBridgeEventDispatcher.emit(EmitterEvents.DELETE_ANNOTATION, undefined);
				});

				expect(deleteAnnotationMock).not.toHaveBeenCalled();
				expect(webToNativeBridgeAPI.setContent).not.toHaveBeenCalled();
			});

			it(`should invoke method setContent of web to native bridge
        after delete annotation method called`, () => {
				const adfDoc: JSONDocNode = {
					version: 1,
					type: 'doc',
					content: [
						{
							type: 'some',
							content: [],
						},
					],
				};
				deleteAnnotationMock.mockReturnValue({ doc: adfDoc });
				renderViewComponent();

				act(() => {
					mobileBridgeEventDispatcher.emit(EmitterEvents.DELETE_ANNOTATION, {
						annotationId: 'annotation-id',
						annotationType: AnnotationTypes.INLINE_COMMENT,
					});
				});

				expect(webToNativeBridgeAPI.setContent).toHaveBeenCalledWith(adfDoc);
			});

			it(`should not invoke method setContent of web to native bridge
      if delete annotation method returns false`, () => {
				deleteAnnotationMock.mockReturnValue(false);
				renderViewComponent();

				act(() => {
					mobileBridgeEventDispatcher.emit(EmitterEvents.DELETE_ANNOTATION, {
						annotationId: 'annotation-id',
						annotationType: AnnotationTypes.INLINE_COMMENT,
					});
				});

				expect(webToNativeBridgeAPI.setContent).not.toHaveBeenCalled();
			});

			it('should remove the listeners from the mobile bridge events', () => {
				const adfDoc: JSONDocNode = {
					version: 1,
					type: 'doc',
					content: [
						{
							type: 'some',
							content: [],
						},
					],
				};
				deleteAnnotationMock.mockReturnValue({ doc: adfDoc });
				renderViewComponent();

				act(() => {
					mobileBridgeEventDispatcher.emit(EmitterEvents.DELETE_ANNOTATION, {
						annotationId: 'annotation-id',
						annotationType: AnnotationTypes.INLINE_COMMENT,
					});
				});

				act(() => {
					if (process.env.IS_REACT_18 === 'true') {
						root.unmount();
					} else {
						unmountComponentAtNode(container!);
					}
				});

				expect(mobileBridgeEventDispatcher.off).toHaveBeenCalledTimes(1);
				expect(mobileBridgeEventDispatcher.off).toHaveBeenCalledWith(
					EmitterEvents.DELETE_ANNOTATION,
					expect.any(Function),
				);
			});

			it(`should invoke method setcontent of native to web bridge
      after delete annotation method called`, () => {
				const adfDoc: JSONDocNode = {
					version: 1,
					type: 'doc',
					content: [
						{
							type: 'some',
							content: [],
						},
					],
				};
				deleteAnnotationMock.mockReturnValue({ doc: adfDoc });
				renderViewComponent();

				act(() => {
					mobileBridgeEventDispatcher.emit(EmitterEvents.DELETE_ANNOTATION, {
						annotationId: 'annotation-id',
						annotationType: AnnotationTypes.INLINE_COMMENT,
					});
				});

				expect(nativeToWebAPI.setContent).toHaveBeenCalledWith(adfDoc);
			});

			it(`should not invoke method setcontent of native to web bridge
    if delete annotation method returns false`, () => {
				deleteAnnotationMock.mockReturnValue(false);
				renderViewComponent();

				act(() => {
					mobileBridgeEventDispatcher.emit(EmitterEvents.DELETE_ANNOTATION, {
						annotationId: 'annotation-id',
						annotationType: AnnotationTypes.INLINE_COMMENT,
					});
				});

				expect(nativeToWebAPI.setContent).not.toHaveBeenCalled();
			});
		});
	});
});
