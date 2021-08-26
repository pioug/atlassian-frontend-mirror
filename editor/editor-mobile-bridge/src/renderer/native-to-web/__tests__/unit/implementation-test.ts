import { AnnotationTypes } from '@atlaskit/adf-schema';
import RendererBridgeImplementation from '../../implementation';
import { eventDispatcher, EmitterEvents } from '../../../dispatcher';
import { AnnotationPayload } from '../../../types';
import { Serialized } from '../../../../types';
import { getEmptyADF } from '@atlaskit/adf-utils/empty-adf';
import * as crossPlatformPromise from '../../../../cross-platform-promise';
import * as BridgeUtils from '../../../../utils/bridge';
import { nativeBridgeAPI } from '../../../web-to-native/implementation';
import { JSONDocNode } from '@atlaskit/editor-json-transformer';
import RendererConfiguration from '../../../renderer-configuration';
// eslint-disable-next-line import/no-extraneous-dependencies
import { waitFor } from '@testing-library/dom';

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

    it('should get the set content', () => {
      const bridge = new RendererBridgeImplementation();

      bridge.setContent(content);

      const result = bridge.getContent();

      expect(result).toEqual(content);
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

  describe('setContentPayload', () => {
    let bridge: RendererBridgeImplementation;
    let fetchSpy: jest.SpyInstance;
    let setContentSpy: jest.SpyInstance;

    beforeEach(() => {
      bridge = new RendererBridgeImplementation();
      fetchSpy = jest.spyOn(bridge, 'fetchPayload');
      setContentSpy = jest.spyOn(bridge, 'setContent');
    });

    afterEach(() => {
      jest.resetAllMocks();
    });

    it('should invoke fetchPayload with correct category and uuid', async () => {
      const uuid = '1234567890';
      let adfContent = getEmptyADF();
      fetchSpy.mockImplementation(() => Promise.resolve(adfContent));
      await bridge.setContentPayload(uuid);
      expect(fetchSpy).toHaveBeenCalledTimes(1);
      expect(fetchSpy).toHaveBeenCalledWith('content', uuid);
    });

    it('should invoke setContent with ADF', async () => {
      let adfContent = getEmptyADF();
      fetchSpy.mockImplementation(() => Promise.resolve(adfContent));
      await bridge.setContentPayload('11111111');
      expect(setContentSpy).toHaveBeenCalledWith(adfContent);
    });

    it('should not invoke setContent if fetchPayload fails', async () => {
      fetchSpy.mockImplementation(() => Promise.reject('error'));
      expect.assertions(2);
      await expect(bridge.setContentPayload('1')).rejects.toMatch('error');
      expect(setContentSpy).not.toHaveBeenCalled();
    });
  });

  describe('onPromiseResolvedPayload', () => {
    let bridge: RendererBridgeImplementation;
    let fetchSpy: jest.SpyInstance;
    let resolvePromiseSpy: jest.SpyInstance;
    let rejectPromiseSpy: jest.SpyInstance;

    beforeEach(() => {
      bridge = new RendererBridgeImplementation();
      fetchSpy = jest.spyOn(bridge, 'fetchPayload');
      resolvePromiseSpy = jest.spyOn(crossPlatformPromise, 'resolvePromise');
      rejectPromiseSpy = jest.spyOn(crossPlatformPromise, 'rejectPromise');
    });

    afterEach(() => {
      jest.resetAllMocks();
    });

    it('should invoke fetchPayload with correct category and uuid', async () => {
      const uuid = '09876';
      let adfContent = getEmptyADF();
      fetchSpy.mockImplementation(() => Promise.resolve(adfContent));
      await bridge.onPromiseResolvedPayload(uuid);
      expect(fetchSpy).toHaveBeenCalledTimes(1);
      expect(fetchSpy).toHaveBeenCalledWith('promise', uuid);
    });

    it('should resolvePromise if fetchPayload succeeds', async () => {
      const uuid = '665';
      let someContent = { some: 'content' };
      fetchSpy.mockImplementation(() => Promise.resolve(someContent));
      await bridge.onPromiseResolvedPayload(uuid);
      expect(resolvePromiseSpy).toHaveBeenCalledWith(uuid, someContent);
      expect(rejectPromiseSpy).not.toHaveBeenCalled();
    });

    it('should rejectPromise if fetchPayload fails', async () => {
      const uuid = '665';
      let someError = 'some error';
      fetchSpy.mockImplementation(() => Promise.reject(someError));
      await bridge.onPromiseResolvedPayload(uuid);
      expect(rejectPromiseSpy).toHaveBeenCalledWith(uuid, someError);
      expect(resolvePromiseSpy).not.toHaveBeenCalled();
    });
  });

  describe('fetchPayload', () => {
    let bridge: RendererBridgeImplementation;
    let fetchSpy: jest.SpyInstance;

    beforeEach(() => {
      bridge = new RendererBridgeImplementation();
      fetchSpy = jest.spyOn(window, 'fetch');
    });

    afterEach(() => {
      jest.resetAllMocks();
    });

    it('should formulate valid request', async () => {
      let someObject = { test: 'test' };
      let stubResponse = new Response(JSON.stringify(someObject));
      fetchSpy.mockImplementation(() => Promise.resolve(stubResponse));

      let returnValue = await bridge.fetchPayload('category', '112233');
      var originURL = new URL(window.location.href);
      originURL.protocol = `fabric-hybrid`;
      let expectedURL = originURL.origin + '/payload/category/112233';
      expect(fetchSpy).toHaveBeenCalledWith(expectedURL);
      expect(returnValue).toEqual(someObject);
    });
  });

  describe('Async function', () => {
    var bridge: RendererBridgeImplementation;
    var createPromiseSpy: jest.SpyInstance;
    var submitPromise: jest.Mock;

    beforeEach(() => {
      bridge = new RendererBridgeImplementation();
      createPromiseSpy = jest.spyOn(crossPlatformPromise, 'createPromise');
      submitPromise = jest.fn();
      createPromiseSpy.mockReturnValue({
        submit: submitPromise,
        uuid: 'some',
      });
    });

    afterEach(() => {
      jest.resetAllMocks();
    });

    it('should submit promise if function was successful', async () => {
      let asyncFunction = jest.fn().mockResolvedValue('A');
      const id = bridge.asyncCall(asyncFunction);
      await waitFor(() => expect(asyncFunction).toBeCalled());
      await waitFor(() =>
        expect(createPromiseSpy).toBeCalledWith(
          'asyncCallCompleted',
          {
            value: 'A',
          },
          id,
        ),
      );
      await waitFor(() => expect(submitPromise).toBeCalled());
    });

    it('should submit promise if function failed', async () => {
      let asyncFunction = jest
        .fn()
        .mockRejectedValue(new Error('something went wrong'));
      const id = bridge.asyncCall(asyncFunction);
      await waitFor(() => expect(asyncFunction).toBeCalled());
      await waitFor(() =>
        expect(createPromiseSpy).toBeCalledWith(
          'asyncCallCompleted',
          {
            error: 'something went wrong',
          },
          id,
        ),
      );
      await waitFor(() => expect(submitPromise).toBeCalled());
    });
  });
});
