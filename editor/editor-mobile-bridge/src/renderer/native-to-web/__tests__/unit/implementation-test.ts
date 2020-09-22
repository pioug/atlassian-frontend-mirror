import { AnnotationTypes } from '@atlaskit/adf-schema';
import RendererBridgeImplementation from '../../implementation';
import { eventDispatcher, EmitterEvents } from '../../../dispatcher';
import { AnnotationPayload } from '../../../types';
import { Serialized } from '../../../../types';

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

  describe('deleteAnnotation', () => {
    it(`should dispatch event to delete annotation when JSON string playload
        containing annotationID and annotationType is passed`, () => {
      const bridge = new RendererBridgeImplementation();
      const annotationId = 'some-id';
      const annotationType = 'someType';
      const annotationPayload = {
        annotationId,
        annotationType,
      };
      bridge.deleteAnnotation(JSON.stringify(annotationPayload));
      expect(emitSpy).toHaveBeenCalledWith(EmitterEvents.DELETE_ANNOTATION, {
        annotationId,
        annotationType,
      });
    });

    it(`should dispatch event to delete annotation when non serialized annotation playload
        containing annotationID and annotationType is passed`, () => {
      const bridge = new RendererBridgeImplementation();
      const annotationId = 'some-id';
      const annotationType = AnnotationTypes.INLINE_COMMENT;
      const annotationPayload: Serialized<AnnotationPayload> = {
        annotationId,
        annotationType,
      };
      bridge.deleteAnnotation(annotationPayload);
      expect(emitSpy).toHaveBeenCalledWith(EmitterEvents.DELETE_ANNOTATION, {
        annotationId,
        annotationType,
      });
    });

    it(`should not dispatch event to delete annotation when JSON string payload
        containing only annotationType is passed`, () => {
      const bridge = new RendererBridgeImplementation();
      const annotationType = AnnotationTypes.INLINE_COMMENT;
      const annotationPayload = {
        annotationType,
      };
      bridge.deleteAnnotation(JSON.stringify(annotationPayload));
      expect(emitSpy).not.toHaveBeenCalled();
    });

    it(`should not dispatch event to delete annotation when JSON string payload
        containing only annotationId is passed`, () => {
      const bridge = new RendererBridgeImplementation();
      const annotationId = 'some-id';
      const annotationPayload = {
        annotationId,
      };
      bridge.deleteAnnotation(JSON.stringify(annotationPayload));
      expect(emitSpy).not.toHaveBeenCalled();
    });

    it(`should not dispatch event to delete annotation when a random string in passed`, () => {
      const bridge = new RendererBridgeImplementation();

      bridge.deleteAnnotation('some string');
      expect(emitSpy).not.toHaveBeenCalled();
    });
  });
});
