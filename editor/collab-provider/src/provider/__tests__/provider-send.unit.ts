jest.mock('lodash/throttle', () => jest.fn((fn) => fn));
jest.mock('prosemirror-collab', () => {
  const originPC = jest.requireActual('prosemirror-collab');
  return {
    ...originPC,
    sendableSteps: jest.fn(),
    getVersion: jest.fn(),
  };
});
import { getVersion, sendableSteps } from 'prosemirror-collab';
import { createEditorState } from '@atlaskit/editor-test-helpers/create-editor-state';
import { doc, p } from '@atlaskit/editor-test-helpers/doc-builder';

import { Slice } from 'prosemirror-model';
import { Step, ReplaceStep } from 'prosemirror-transform';
import { EditorState } from 'prosemirror-state';
import { createSocketIOCollabProvider } from '../../socket-io-provider';
import type { Provider } from '../';
import { Metadata } from '../../channel';

describe('#sendData', () => {
  let fakeStep: Step;
  let anyEditorState: EditorState;
  let provider: Provider;
  let channelBroadCastSpy: jest.SpyInstance;
  let channelSendMetaSpy: jest.SpyInstance;

  beforeEach(() => {
    const fakeAnalyticsWebClient = {
      sendOperationalEvent: jest.fn(),
      sendScreenEvent: jest.fn(),
      sendTrackEvent: jest.fn(),
      sendUIEvent: jest.fn(),
    };
    const testProviderConfigWithAnalytics = {
      url: `http://provider-url:66661`,
      documentAri: 'ari:cloud:confluence:ABC:page/testpage',
      analyticsClient: fakeAnalyticsWebClient,
    };
    provider = createSocketIOCollabProvider(testProviderConfigWithAnalytics);

    channelBroadCastSpy = jest.spyOn((provider as any).channel, 'broadcast');
    channelSendMetaSpy = jest.spyOn((provider as any).channel, 'sendMetadata');

    fakeStep = new ReplaceStep(1, 1, Slice.empty);

    const { collab: collabPlugin } = jest.requireActual('prosemirror-collab');
    anyEditorState = createEditorState(doc(p('lol')), collabPlugin({}));

    const getStateMock = jest.fn(() => anyEditorState);
    provider.initialize(getStateMock);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('when sendSteps is called', () => {
    describe('when there are steps to send', () => {
      beforeEach(() => {
        (sendableSteps as jest.Mock).mockReturnValue({
          steps: [fakeStep],
        });
        (getVersion as jest.Mock).mockReturnValue(1);

        provider.send(null, null, anyEditorState);
      });

      it('should broadcast message to steps:commit', () => {
        expect(channelBroadCastSpy).toHaveBeenCalledWith(
          'steps:commit',
          expect.anything(),
        );
      });

      it('should serialize the steps with clientId and userId to steps:commit', () => {
        expect(channelBroadCastSpy).toHaveBeenCalledWith(
          'steps:commit',
          expect.objectContaining({
            steps: [
              expect.objectContaining({
                ...fakeStep.toJSON(),
              }),
            ],
          }),
        );
      });
    });

    describe('when there sendableSteps returns nothing', () => {
      it('should not send a broadcast message', () => {
        (sendableSteps as jest.Mock).mockReturnValue(null);

        provider.send(null, null, anyEditorState);

        expect(channelBroadCastSpy).not.toHaveBeenCalled();
      });
    });

    describe('when there is no sendable steps to send', () => {
      it('should not send a broadcast message', () => {
        (sendableSteps as jest.Mock).mockReturnValue({
          steps: [],
        });

        provider.send(null, null, anyEditorState);

        expect(channelBroadCastSpy).not.toHaveBeenCalled();
      });
    });
  });
  describe('when sendMetadata is called', () => {
    it('should broadcast metadata', () => {
      const metadata: Metadata = {
        title: 'abc',
      };
      provider.setMetadata(metadata);
      expect(channelSendMetaSpy).toHaveBeenCalledWith(metadata);
    });
  });
});
