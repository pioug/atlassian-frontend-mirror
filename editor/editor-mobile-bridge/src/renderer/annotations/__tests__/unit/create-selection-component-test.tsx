import React from 'react';
import { AnnotationTypes } from '@atlaskit/adf-schema';
import { render, unmountComponentAtNode } from 'react-dom';
import { act } from 'react-dom/test-utils';
import RendererBridgeImplementation from '../../../native-to-web/implementation';
import {
  eventDispatcher as mobileBridgeEventDispatcher,
  EmitterEvents,
} from '../../../dispatcher';
import { nativeBridgeAPI as webToNativeBridgeAPI } from '../../../web-to-native/implementation';
import { createSelectionComponent } from '../../create-selection-component';

const nativeToWebAPI = new RendererBridgeImplementation();
const SelectionComponent = createSelectionComponent(nativeToWebAPI);

let container: HTMLElement | null;
beforeEach(() => {
  container = document.createElement('div');
  document.body.appendChild(container);
});

afterEach(() => {
  document.body.removeChild(container!);
  unmountComponentAtNode(container!);
  container = null;
});

describe('Mobile Renderer: Annotations/create-selection-component', () => {
  describe('#SelectionComponent', () => {
    let onCreateMock: jest.Mock;
    let onCloseMock: jest.Mock;
    beforeEach(() => {
      jest.restoreAllMocks();

      jest.spyOn(webToNativeBridgeAPI, 'canApplyAnnotationOnCurrentSelection');
      jest.spyOn(mobileBridgeEventDispatcher, 'on');
      jest.spyOn(webToNativeBridgeAPI, 'setContent');
      jest.spyOn(mobileBridgeEventDispatcher, 'off');
      jest.spyOn(document, 'addEventListener');
      jest.spyOn(document, 'removeEventListener');

      onCreateMock = jest.fn(() => ({ doc: true }));
      onCloseMock = jest.fn();
    });

    afterEach(() => {
      jest.restoreAllMocks();
    });

    const renderSelectionComponent = () => {
      act(() => {
        render(
          <SelectionComponent
            range={new Range()}
            wrapperDOM={container!}
            isAnnotationAllowed={true}
            onCreate={onCreateMock as any}
            onClose={onCloseMock}
            applyDraftMode={jest.fn()}
            removeDraftMode={jest.fn()}
          />,
          container,
        );
      });
    };

    describe('when this component is mounted', () => {
      it('should call native bridge canApplyAnnotationOnCurrentSelection', () => {
        expect(
          webToNativeBridgeAPI.canApplyAnnotationOnCurrentSelection,
        ).toHaveBeenCalledTimes(0);

        renderSelectionComponent();

        expect(
          webToNativeBridgeAPI.canApplyAnnotationOnCurrentSelection,
        ).toHaveBeenCalledTimes(1);
      });

      it('should start to listen for the mobile bridge events', () => {
        expect(mobileBridgeEventDispatcher.on).toHaveBeenCalledTimes(0);

        renderSelectionComponent();

        expect(mobileBridgeEventDispatcher.on).toHaveBeenCalledTimes(3);
        expect(mobileBridgeEventDispatcher.on).toHaveBeenCalledWith(
          EmitterEvents.CREATE_ANNOTATION_ON_SELECTION,
          expect.any(Function),
        );
        expect(mobileBridgeEventDispatcher.on).toHaveBeenCalledWith(
          EmitterEvents.APPLY_DRAFT_ANNOTATION,
          expect.any(Function),
        );
        expect(mobileBridgeEventDispatcher.on).toHaveBeenCalledWith(
          EmitterEvents.REMOVE_DRAFT_ANNOTATION,
          expect.any(Function),
        );
      });
    });

    describe('when the create annotation event happens', () => {
      it('should call the setContent mobile API', () => {
        expect(webToNativeBridgeAPI.setContent).toHaveBeenCalledTimes(0);

        renderSelectionComponent();

        act(() => {
          mobileBridgeEventDispatcher.emit(
            EmitterEvents.CREATE_ANNOTATION_ON_SELECTION,
            {
              annotationId: 'random-id',
              annotationType: AnnotationTypes.INLINE_COMMENT,
            },
          );
        });

        expect(webToNativeBridgeAPI.setContent).toHaveBeenCalledTimes(1);
      });
    });

    describe('when this component is unmounted', () => {
      it('should remove the listeners from the mobile bridge events', () => {
        expect(mobileBridgeEventDispatcher.off).toHaveBeenCalledTimes(0);

        renderSelectionComponent();

        act(() => {
          unmountComponentAtNode(container!);
        });

        expect(mobileBridgeEventDispatcher.off).toHaveBeenCalledTimes(3);
        expect(mobileBridgeEventDispatcher.off).toHaveBeenCalledWith(
          EmitterEvents.CREATE_ANNOTATION_ON_SELECTION,
          expect.any(Function),
        );
        expect(mobileBridgeEventDispatcher.off).toHaveBeenCalledWith(
          EmitterEvents.APPLY_DRAFT_ANNOTATION,
          expect.any(Function),
        );
        expect(mobileBridgeEventDispatcher.off).toHaveBeenCalledWith(
          EmitterEvents.REMOVE_DRAFT_ANNOTATION,
          expect.any(Function),
        );
      });
    });
  });
});
