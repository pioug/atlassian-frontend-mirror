import { AnnotationTypes } from '@atlaskit/adf-schema';
import RendererBridgeImplementation from '../../implementation';
import { eventDispatcher, EmitterEvents } from '../../../dispatcher';
import { AnnotationPayload } from '../../../types';
import { Serialized } from '../../../../types';
import * as BridgeUtils from '../../../../utils/bridge';
import { nativeBridgeAPI } from '../../../web-to-native/implementation';
import { JSONDocNode } from '@atlaskit/editor-json-transformer';
import RendererConfiguration from '../../../renderer-configuration';

jest.mock('../../../renderer-configuration');

describe('RendererBridgeImplementation', () => {
  let emitSpy: jest.SpyInstance;
  beforeEach(() => {
    emitSpy = jest.spyOn(eventDispatcher, 'emit');
  });

  afterEach(() => {
    jest.clearAllMocks();
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

  describe('setContent', () => {
    const content: JSONDocNode = {
      version: 1,
      type: 'doc',
      content: [
        {
          type: 'paragraph',
          content: [
            {
              type: 'date',
              attrs: {
                timestamp: '1804966400002',
              },
            },
            {
              type: 'text',
              text: ' ',
            },
          ],
        },
        {
          type: 'paragraph',
          content: [],
        },
      ],
    };

    beforeEach(() => {
      jest
        .spyOn(BridgeUtils, 'measureContentRenderedPerformance')
        .mockImplementation((_, callback) => {
          callback(4, '{"paragraph":2,"date":1,"text":1}', 1000);
        });

      jest.spyOn(BridgeUtils, 'PerformanceMatrices').mockImplementation(
        () =>
          ({
            duration: 1100,
          } as BridgeUtils.PerformanceMatrices),
      );

      jest.spyOn(nativeBridgeAPI, 'onContentRendered');
    });

    afterEach(() => {
      jest.clearAllMocks();
    });

    it('should call measureContentRenderedPerformance', () => {
      const bridge = new RendererBridgeImplementation();

      bridge.setContent(content);

      expect(
        BridgeUtils.measureContentRenderedPerformance,
      ).toHaveBeenCalledWith(content, expect.anything());
    });

    it('should call onContentRendered event of content bridge', () => {
      const bridge = new RendererBridgeImplementation();

      bridge.setContent(content);

      expect(nativeBridgeAPI.onContentRendered).toHaveBeenCalledWith(
        4,
        '{"paragraph":2,"date":1,"text":1}',
        1000,
        1100,
      );
    });
  });

  describe('Renderer Configuration', () => {
    const defaultConfig = new RendererConfiguration();

    it(`Should create renderer configuration object`, () => {
      const cloneAndUpdateSpy = jest.spyOn(
        RendererConfiguration.prototype,
        'cloneAndUpdate',
      );
      const bridge = new RendererBridgeImplementation();
      bridge.setCallbackToNotifyConfigChange(jest.fn());
      bridge.configure('{}');
      expect(RendererConfiguration).toBeCalledTimes(1);
      expect(cloneAndUpdateSpy).toBeCalledTimes(1);
      expect(RendererConfiguration).toHaveBeenCalledWith();
      expect(cloneAndUpdateSpy).toHaveBeenCalledWith('{}');
    });

    it(`should configure and set the updated renderer configuration `, () => {
      jest
        .spyOn(RendererConfiguration.prototype, 'cloneAndUpdate')
        .mockReturnValue(defaultConfig);
      const bridge = new RendererBridgeImplementation();
      bridge.setCallbackToNotifyConfigChange(jest.fn());
      bridge.configure('{disableActions: true}');
      const configuration = bridge.getConfiguration();
      expect(configuration).toBe(defaultConfig);
    });

    it(`should not cloneAndUpdate config if callbackToNotifyConfigChange is not set`, () => {
      const mockedCLoneAndUpdate = jest.spyOn(
        RendererConfiguration.prototype,
        'cloneAndUpdate',
      );
      const bridge = new RendererBridgeImplementation();
      bridge.configure('{disableActions: true}');
      expect(mockedCLoneAndUpdate).not.toHaveBeenCalled();
    });

    it(`should return default configuration if the bridge not configured expilicity`, () => {
      const bridge = new RendererBridgeImplementation();
      const configuration = bridge.getConfiguration();
      expect(configuration).not.toBeUndefined();
    });

    it(`should configure the bridge with the given renderer configuration`, () => {
      const config = new RendererConfiguration('{disableActions: true}');
      const bridge = new RendererBridgeImplementation(config);

      expect(bridge.getConfiguration()).toBe(config);
    });

    it(`should call the callback to notify config
        change when bridge is reconfigured`, () => {
      const mockCallback = jest.fn();
      const bridge = new RendererBridgeImplementation();
      bridge.setCallbackToNotifyConfigChange(mockCallback);
      bridge.configure('{disableActions: true}');
      expect(mockCallback).toBeCalledWith(bridge.getConfiguration());
    });
  });
});
