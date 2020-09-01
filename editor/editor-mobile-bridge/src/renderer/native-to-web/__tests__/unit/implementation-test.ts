import { AnnotationTypes } from '@atlaskit/adf-schema';
import RendererBridgeImplementation from '../../implementation';
import { eventDispatcher, EmitterEvents } from '../../../dispatcher';
import { AnnotationPayload } from '../../../types';

describe('RendererBridgeImplementation', () => {
  let emitSpy: jest.SpyInstance;
  beforeEach(() => {
    emitSpy = jest.spyOn(eventDispatcher, 'emit');
  });

  afterEach(() => {
    emitSpy.mockRestore();
  });

  describe('#setAnnotationFocus', () => {
    it('should emit remove focus event when there is no payload', () => {
      const bridge = new RendererBridgeImplementation();

      bridge.setAnnotationFocus();

      expect(emitSpy).toHaveBeenCalledWith(
        EmitterEvents.REMOVE_ANNOTATION_FOCUS,
      );
    });

    describe('when payload is empty', () => {
      beforeEach(() => {
        const bridge = new RendererBridgeImplementation();

        bridge.setAnnotationFocus('');
      });

      it('should emit remove focus event', () => {
        expect(emitSpy).toHaveBeenCalledWith(
          EmitterEvents.REMOVE_ANNOTATION_FOCUS,
        );
      });

      it('should not emit set state event', () => {
        expect(emitSpy).not.toHaveBeenCalledWith(
          EmitterEvents.SET_ANNOTATION_FOCUS,
          expect.any(Object),
        );
      });
    });

    describe('when payload is valid', () => {
      const payload: AnnotationPayload = {
        annotationId: 'fakeid',
        annotationType: AnnotationTypes.INLINE_COMMENT,
      };
      beforeEach(() => {
        const bridge = new RendererBridgeImplementation();

        bridge.setAnnotationFocus(JSON.stringify(payload));
      });

      it('should not emit set remove focus event', () => {
        expect(emitSpy).not.toHaveBeenCalledWith(
          EmitterEvents.SET_ANNOTATION_FOCUS,
        );
      });

      it('should emit set focus event', () => {
        expect(emitSpy).toHaveBeenCalledWith(
          EmitterEvents.SET_ANNOTATION_FOCUS,
          payload,
        );
      });
    });
  });
});
