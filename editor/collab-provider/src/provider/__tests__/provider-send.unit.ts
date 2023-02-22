import { getVersion, sendableSteps } from '@atlaskit/prosemirror-collab';
import { createEditorState } from '@atlaskit/editor-test-helpers/create-editor-state';
import { doc, p } from '@atlaskit/editor-test-helpers/doc-builder';

import { Slice } from 'prosemirror-model';
import { Step, ReplaceStep } from 'prosemirror-transform';
import { EditorState } from 'prosemirror-state';
import type { AnalyticsWebClient } from '@atlaskit/analytics-listeners';
import {
  ExperiencePerformanceTypes,
  ExperienceTypes,
  UFOExperience,
} from '@atlaskit/ufo';
import { createSocketIOCollabProvider } from '../../socket-io-provider';
import type { Provider } from '../';
import * as Analytics from '../../analytics';
import { AcknowledgementResponseTypes, Metadata } from '../../types';

jest.mock('lodash/throttle', () => jest.fn((fn) => fn));
jest.mock('@atlaskit/prosemirror-collab', () => {
  const originPC = jest.requireActual('@atlaskit/prosemirror-collab');
  return {
    ...originPC,
    sendableSteps: jest.fn(),
    getVersion: jest.fn(),
  };
});
jest.mock('@atlaskit/ufo');

describe('#sendData', () => {
  let fakeStep: Step;
  let anyEditorState: EditorState;
  let provider: Provider;
  let channelBroadCastSpy: jest.SpyInstance;
  let channelSendMetaSpy: jest.SpyInstance;
  let fakeAnalyticsWebClient: AnalyticsWebClient;
  const documentAri = 'ari:cloud:confluence:ABC:page/testpage';

  beforeEach(() => {
    fakeAnalyticsWebClient = {
      sendOperationalEvent: jest.fn(),
      sendScreenEvent: jest.fn(),
      sendTrackEvent: jest.fn(),
      sendUIEvent: jest.fn(),
    };
    const testProviderConfigWithAnalytics = {
      url: `http://provider-url:6661`,
      documentAri: documentAri,
      analyticsClient: fakeAnalyticsWebClient,
    };
    provider = createSocketIOCollabProvider(testProviderConfigWithAnalytics);

    channelBroadCastSpy = jest.spyOn((provider as any).channel, 'broadcast');
    channelSendMetaSpy = jest.spyOn((provider as any).channel, 'sendMetadata');

    fakeStep = new ReplaceStep(1, 1, Slice.empty);

    const { collab: collabPlugin } = jest.requireActual(
      '@atlaskit/prosemirror-collab',
    );
    anyEditorState = createEditorState(
      doc(p('lol')),
      collabPlugin({ clientID: 3771180701 }),
    );

    const getStateMock = () => anyEditorState;
    provider.initialize(getStateMock);
  });

  afterEach(jest.clearAllMocks);

  describe('when sendMessage is called', () => {
    let ackCallback: (resp: any) => void;
    const startMock = jest.spyOn(UFOExperience.prototype, 'start');
    const successMock = jest.spyOn(UFOExperience.prototype, 'success');
    const failureMock = jest.spyOn(UFOExperience.prototype, 'failure');
    const abortMock = jest.spyOn(UFOExperience.prototype, 'abort');
    const metadataMock = jest.spyOn(UFOExperience.prototype, 'addMetadata');

    beforeEach(() => {
      (UFOExperience as any).mockClear();
      startMock.mockClear();
      successMock.mockClear();
      failureMock.mockClear();
      const data = { type: 'telepointer' };
      provider.sendMessage(data);
      ackCallback = channelBroadCastSpy.mock.calls[0][2];
      jest
        .spyOn(window, 'requestAnimationFrame')
        // @ts-ignore
        .mockImplementation((cb) => cb());
      // @ts-ignore emit is a protected function
    });

    afterEach(() => {
      // @ts-ignore
      window.requestAnimationFrame.mockRestore();
    });

    it('should create a new ufo experience', () => {
      expect(UFOExperience).toHaveBeenCalledWith(
        'collab-provider.telepointer',
        {
          type: ExperienceTypes.Operation,
          performanceType: ExperiencePerformanceTypes.Custom,
          performanceConfig: {
            histogram: {
              [ExperiencePerformanceTypes.Custom]: {
                duration: '250_500_1000_1500_2000_3000_4000',
              },
            },
          },
        },
      );
    });

    it('should start experience with ufo', () => {
      expect(startMock).toHaveBeenCalledTimes(1);
    });

    it('should add the documentAri as metadata', () => {
      expect(metadataMock).toHaveBeenCalledWith({
        documentAri: documentAri,
      });
    });

    it('should finish experience with ufo on success', () => {
      ackCallback({
        type: AcknowledgementResponseTypes.SUCCESS,
      });
      expect(successMock).toHaveBeenCalledTimes(1);
      expect(failureMock).toHaveBeenCalledTimes(0);
      expect(abortMock).toHaveBeenCalledTimes(0);
    });

    it('should finish experience with ufo on error', () => {
      ackCallback({
        type: AcknowledgementResponseTypes.ERROR,
        error: 'Oh no we did a oopsie whoospie',
      });
      expect(metadataMock).toHaveBeenCalledWith({
        error: 'Oh no we did a oopsie whoospie',
      });
      expect(successMock).toHaveBeenCalledTimes(0);
      expect(failureMock).toHaveBeenCalledTimes(1);
      expect(abortMock).toHaveBeenCalledTimes(0);
    });

    it('should finish experience with ufo on abort', () => {
      ackCallback({
        type: 'herpaderp',
      });
      expect(successMock).toHaveBeenCalledTimes(0);
      expect(failureMock).toHaveBeenCalledTimes(0);
      expect(abortMock).toHaveBeenCalledTimes(1);
    });
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
          expect.any(Function),
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
          expect.any(Function),
        );
      });

      describe('when ack callback is called', () => {
        let ackCallback: (resp: any) => void;
        beforeEach(() => {
          ackCallback = channelBroadCastSpy.mock.calls[0][2];
          jest
            .spyOn(window, 'requestAnimationFrame')
            // @ts-ignore
            .mockImplementation((cb) => cb());
          // @ts-ignore emit is a protected function
          jest.spyOn(provider, 'emit').mockImplementation(() => {});
        });

        afterEach(() => {
          // @ts-ignore
          window.requestAnimationFrame.mockRestore();
        });

        it('should call onStepsAdded on a successful response', () => {
          ackCallback({
            type: AcknowledgementResponseTypes.SUCCESS,
            version: 2,
          });
          // @ts-ignore
          expect(provider.emit).toBeCalledWith('data', {
            json: [
              {
                clientId: 3771180701,
                from: 1,
                stepType: 'replace',
                to: 1,
                userId: undefined,
              },
            ],
            userIds: [3771180701],
            version: 2,
          });
          expect(fakeAnalyticsWebClient.sendOperationalEvent).toBeCalledWith({
            action: 'addSteps',
            actionSubject: 'collab',
            attributes: {
              collabService: 'ncs',
              documentAri: 'ari:cloud:confluence:ABC:page/testpage',
              eventStatus: 'SUCCESS',
              type: 'ACCEPTED',
              latency: 0,
              packageName: '@atlaskit/fabric',
              packageVersion: '0.0.0',
              stepType: {
                replace: 1,
              },
            },
            tags: ['editor'],
            source: 'unknown',
          });
        });

        describe('should call onErrorHandled on a functional error response', () => {
          it("HEAD_VERSION_UPDATE_FAILED: the collab service's latest stored step tail version didn't correspond to the head version of the first step submitted", () => {
            ackCallback({
              type: AcknowledgementResponseTypes.ERROR,
              error: { data: { code: 'HEAD_VERSION_UPDATE_FAILED' } },
            });
            // @ts-ignore
            expect(provider.emit).not.toHaveBeenCalled();
            expect(
              fakeAnalyticsWebClient.sendOperationalEvent,
            ).toHaveBeenCalledTimes(1);
            expect(
              fakeAnalyticsWebClient.sendOperationalEvent,
            ).toHaveBeenCalledWith({
              action: 'addSteps',
              actionSubject: 'collab',
              attributes: {
                collabService: 'ncs',
                documentAri: 'ari:cloud:confluence:ABC:page/testpage',
                eventStatus: 'FAILURE',
                type: 'REJECTED',
                error: {
                  data: {
                    code: 'HEAD_VERSION_UPDATE_FAILED',
                  },
                },
                latency: 0,
                packageName: '@atlaskit/fabric',
                packageVersion: '0.0.0',
              },
              tags: ['editor'],
              source: 'unknown',
            });
          });

          it('VERSION_NUMBER_ALREADY_EXISTS: while storing the steps there was a conflict meaning someone else wrote steps into the database more quickly', () => {
            ackCallback({
              type: AcknowledgementResponseTypes.ERROR,
              error: { data: { code: 'VERSION_NUMBER_ALREADY_EXISTS' } },
            });
            // @ts-ignore
            expect(provider.emit).not.toHaveBeenCalled();
            expect(
              fakeAnalyticsWebClient.sendOperationalEvent,
            ).toHaveBeenCalledTimes(1);
            expect(
              fakeAnalyticsWebClient.sendOperationalEvent,
            ).toHaveBeenCalledWith({
              action: 'addSteps',
              actionSubject: 'collab',
              attributes: {
                collabService: 'ncs',
                documentAri: 'ari:cloud:confluence:ABC:page/testpage',
                eventStatus: 'FAILURE',
                type: 'REJECTED',
                error: {
                  data: {
                    code: 'VERSION_NUMBER_ALREADY_EXISTS',
                  },
                },
                latency: 0,
                packageName: '@atlaskit/fabric',
                packageVersion: '0.0.0',
              },
              tags: ['editor'],
              source: 'unknown',
            });
          });
        });

        it('should call onErrorHandled on a technical error response', () => {
          ackCallback({
            type: AcknowledgementResponseTypes.ERROR,
            error: { data: { code: 'SOME_TECHNICAL_ERROR' } },
          });

          // @ts-ignore provider emit is protected
          expect(provider.emit).toHaveBeenCalledWith('error', {
            code: 'INTERNAL_SERVICE_ERROR',
            message: 'Collab service has experienced an internal server error',
            status: 500,
          });
          expect(
            fakeAnalyticsWebClient.sendOperationalEvent,
          ).toHaveBeenCalledTimes(1);
          expect(
            fakeAnalyticsWebClient.sendOperationalEvent,
          ).toHaveBeenCalledWith({
            action: 'addSteps',
            actionSubject: 'collab',
            attributes: {
              collabService: 'ncs',
              documentAri: 'ari:cloud:confluence:ABC:page/testpage',
              eventStatus: 'FAILURE',
              type: 'ERROR',
              error: {
                data: {
                  code: 'SOME_TECHNICAL_ERROR',
                },
              },
              latency: 0,
              packageName: '@atlaskit/fabric',
              packageVersion: '0.0.0',
            },
            tags: ['editor'],
            source: 'unknown',
          });
        });

        it('should call emit analytics event on invalid acknowledgement', () => {
          ackCallback({ wat: true });
          // @ts-ignore
          expect(provider.emit).not.toHaveBeenCalled();
          expect(fakeAnalyticsWebClient.sendOperationalEvent).toBeCalledWith({
            action: 'addSteps',
            actionSubject: 'collab',
            attributes: {
              collabService: 'ncs',
              documentAri: 'ari:cloud:confluence:ABC:page/testpage',
              eventStatus: 'FAILURE',
              type: 'ERROR',
              error: {
                message: 'Invalid Acknowledgement',
              },
              latency: 0,
              packageName: '@atlaskit/fabric',
              packageVersion: '0.0.0',
            },
            tags: ['editor'],
            source: 'unknown',
          });
        });
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

  describe('Analytics', () => {
    it('should send the add steps successful analytics event', () => {
      const triggerAnalyticsEventSpy = jest.spyOn(
        Analytics,
        'triggerAnalyticsEvent',
      );

      // TODO: Don't call private method, but it's a start
      //@ts-expect-error
      provider.processSteps({
        version: 1625,
        steps: [
          {
            stepType: 'replace',
            from: 643,
            to: 648,
            clientId: 3771180701,
            userId: '70121:8fce2c13-5f60-40be-a9f2-956c6f041fbe',
            createdAt: 1668993935216,
          },
          {
            stepType: 'replace',
            from: 641,
            to: 643,
            structure: true,
            clientId: 3771180701,
            userId: '70121:8fce2c13-5f60-40be-a9f2-956c6f041fbe',
            createdAt: 1668993935216,
          },
        ],
      });

      expect(triggerAnalyticsEventSpy).toHaveBeenCalledTimes(1);
      expect(triggerAnalyticsEventSpy).toHaveBeenCalledWith(
        {
          attributes: {
            documentAri: 'ari:cloud:confluence:ABC:page/testpage',
            eventStatus: 'SUCCESS',
            latency: undefined, // The ack change removed the Performance API latencies from these analytics
            type: 'ACCEPTED',
            stepType: {
              replace: 2,
            },
          },
          eventAction: 'addSteps',
        },
        fakeAnalyticsWebClient,
      );
    });

    it('should send the add steps failure analytics event', () => {
      const triggerAnalyticsEventSpy = jest.spyOn(
        Analytics,
        'triggerAnalyticsEvent',
      );

      // TODO: Don't call private method, but it's a start
      //@ts-expect-error
      provider.onErrorHandled({
        message: 'Version number does not match current head version.',
        data: {
          code: 'HEAD_VERSION_UPDATE_FAILED',
          meta: 'The version number does not match the current head version.',
          status: 409,
        },
      });

      expect(triggerAnalyticsEventSpy).toHaveBeenCalledTimes(1);
      expect(triggerAnalyticsEventSpy).toHaveBeenCalledWith(
        {
          attributes: {
            documentAri: 'ari:cloud:confluence:ABC:page/testpage',
            eventStatus: 'FAILURE',
            latency: undefined, // The ack change removed the Performance API latencies from these analytics
            type: 'REJECTED',
            error: {
              data: {
                code: 'HEAD_VERSION_UPDATE_FAILED',
                meta: 'The version number does not match the current head version.',
                status: 409,
              },
              message: 'Version number does not match current head version.',
            },
          },
          eventAction: 'addSteps',
        },
        fakeAnalyticsWebClient,
      );
    });
  });
});
