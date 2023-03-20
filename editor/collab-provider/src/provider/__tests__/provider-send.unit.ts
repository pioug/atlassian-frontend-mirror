import { getVersion, sendableSteps } from '@atlaskit/prosemirror-collab';
import { createEditorState } from '@atlaskit/editor-test-helpers/create-editor-state';
import { doc, p } from '@atlaskit/editor-test-helpers/doc-builder';

import { Slice } from 'prosemirror-model';
import { Step, ReplaceStep } from 'prosemirror-transform';
import { EditorState } from 'prosemirror-state';
import type { AnalyticsWebClient } from '@atlaskit/analytics-listeners';
import { createSocketIOCollabProvider } from '../../socket-io-provider';
import type { Provider } from '../';
import { AcknowledgementResponseTypes, Metadata } from '../../types';

jest.useFakeTimers();

jest.mock('lodash/throttle', () => jest.fn((fn) => fn));
jest.mock('@atlaskit/prosemirror-collab', () => {
  const originPC = jest.requireActual('@atlaskit/prosemirror-collab');
  return {
    ...originPC,
    sendableSteps: jest.fn(),
    getVersion: jest.fn(),
  };
});

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

    // So we can check sendOperationalEvent is called
    jest
      .spyOn(window, 'requestAnimationFrame')
      // @ts-ignore
      .mockImplementation((cb) => cb());
  });

  afterEach(jest.clearAllMocks);

  it('should trigger a catchup on processSteps failure', () => {
    const catchupSpy = jest.spyOn(provider as any, 'catchup');

    //@ts-expect-error private method call but it's okay we're testing
    provider.processSteps({
      version: 1625,
      //@ts-expect-error breaking on purpose
      steps: 'hot garbarge', // even the spelling is garbage, nice
    });

    expect(fakeAnalyticsWebClient.sendOperationalEvent).toHaveBeenCalledTimes(
      1,
    );
    expect(fakeAnalyticsWebClient.sendOperationalEvent).toBeCalledWith({
      action: 'error',
      actionSubject: 'collab',
      attributes: {
        collabService: 'ncs',
        documentAri: 'ari:cloud:confluence:ABC:page/testpage',
        network: {
          status: 'ONLINE',
        },
        packageName: '@atlaskit/fabric',
        packageVersion: '0.0.0',
        errorMessage: 'Error while processing steps',
      },
      nonPrivacySafeAttributes: {
        error: new TypeError('steps.map is not a function'),
      },
      source: 'unknown',
      tags: ['editor'],
    });
    expect(catchupSpy).toHaveBeenCalledTimes(1);
    expect(catchupSpy).toBeCalledWith();
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
          expect(
            fakeAnalyticsWebClient.sendOperationalEvent,
          ).toHaveBeenCalledTimes(1);
          expect(fakeAnalyticsWebClient.sendOperationalEvent).toBeCalledWith({
            action: 'addSteps',
            actionSubject: 'collab',
            attributes: {
              packageName: '@atlaskit/fabric',
              packageVersion: '0.0.0',
              collabService: 'ncs',
              network: {
                status: 'ONLINE',
              },
              documentAri: 'ari:cloud:confluence:ABC:page/testpage',
              eventStatus: 'SUCCESS',
              type: 'ACCEPTED',
              latency: 0,
              stepType: {
                replace: 1,
              },
            },
            tags: ['editor'],
            source: 'unknown',
          });
        });

        describe('should call onErrorHandled when step conflicts happen', () => {
          it("when the collab service's latest stored step tail version didn't correspond to the head version of the first step submitted", () => {
            ackCallback({
              type: AcknowledgementResponseTypes.ERROR,
              error: { data: { code: 'HEAD_VERSION_UPDATE_FAILED' } },
            });
            // @ts-ignore
            expect(provider.emit).not.toHaveBeenCalled();
            expect(
              fakeAnalyticsWebClient.sendOperationalEvent,
            ).toHaveBeenCalledTimes(2);
            expect(
              fakeAnalyticsWebClient.sendOperationalEvent,
            ).toHaveBeenNthCalledWith(1, {
              action: 'addSteps',
              actionSubject: 'collab',
              attributes: {
                packageName: '@atlaskit/fabric',
                packageVersion: '0.0.0',
                collabService: 'ncs',
                network: {
                  status: 'ONLINE',
                },
                documentAri: 'ari:cloud:confluence:ABC:page/testpage',
                eventStatus: 'FAILURE',
                type: 'REJECTED',
                latency: 0,
              },
              tags: ['editor'],
              source: 'unknown',
            });
            expect(
              fakeAnalyticsWebClient.sendOperationalEvent,
            ).toHaveBeenNthCalledWith(2, {
              action: 'error',
              actionSubject: 'collab',
              attributes: {
                packageName: '@atlaskit/fabric',
                packageVersion: '0.0.0',
                collabService: 'ncs',
                network: {
                  status: 'ONLINE',
                },
                documentAri: 'ari:cloud:confluence:ABC:page/testpage',
                errorMessage:
                  'Error while adding steps - Acknowledgement Error',
              },
              nonPrivacySafeAttributes: {
                error: {
                  data: {
                    code: 'HEAD_VERSION_UPDATE_FAILED',
                  },
                },
              },
              tags: ['editor'],
              source: 'unknown',
            });
          });

          it('when there was a conflict while storing the steps meaning someone else wrote steps into the database more quickly', () => {
            ackCallback({
              type: AcknowledgementResponseTypes.ERROR,
              error: { data: { code: 'VERSION_NUMBER_ALREADY_EXISTS' } },
            });
            // @ts-ignore
            expect(provider.emit).not.toHaveBeenCalled();
            expect(
              fakeAnalyticsWebClient.sendOperationalEvent,
            ).toHaveBeenCalledTimes(2);
            expect(
              fakeAnalyticsWebClient.sendOperationalEvent,
            ).toHaveBeenNthCalledWith(1, {
              action: 'addSteps',
              actionSubject: 'collab',
              attributes: {
                packageName: '@atlaskit/fabric',
                packageVersion: '0.0.0',
                collabService: 'ncs',
                network: {
                  status: 'ONLINE',
                },
                documentAri: 'ari:cloud:confluence:ABC:page/testpage',
                eventStatus: 'FAILURE',
                type: 'REJECTED',
                latency: 0,
              },
              tags: ['editor'],
              source: 'unknown',
            });
            expect(
              fakeAnalyticsWebClient.sendOperationalEvent,
            ).toHaveBeenNthCalledWith(2, {
              action: 'error',
              actionSubject: 'collab',
              attributes: {
                packageName: '@atlaskit/fabric',
                packageVersion: '0.0.0',
                collabService: 'ncs',
                network: {
                  status: 'ONLINE',
                },
                documentAri: 'ari:cloud:confluence:ABC:page/testpage',
                errorMessage:
                  'Error while adding steps - Acknowledgement Error',
              },
              nonPrivacySafeAttributes: {
                error: {
                  data: {
                    code: 'VERSION_NUMBER_ALREADY_EXISTS',
                  },
                },
              },
              tags: ['editor'],
              source: 'unknown',
            });
          });

          it('should automatically trigger a step commit again after a while', async () => {
            jest.spyOn(provider as any, 'sendStepsFromCurrentState');
            ackCallback({
              type: AcknowledgementResponseTypes.ERROR,
              error: { data: { code: 'VERSION_NUMBER_ALREADY_EXISTS' } },
            });
            // @ts-ignore just spying on a private method, nothing to see here
            expect(provider.sendStepsFromCurrentState).not.toHaveBeenCalled();

            // Fast forward and exhaust only currently pending timers
            // (but not any new timers that get created during that process)
            jest.runOnlyPendingTimers();

            // @ts-ignore just spying on a private method, nothing to see here
            expect(provider.sendStepsFromCurrentState).toHaveBeenCalledTimes(1);
            // @ts-ignore just spying on a private method, nothing to see here
            expect(provider.sendStepsFromCurrentState).toHaveBeenCalledWith();
          });
        });

        it('should call onErrorHandled on a technical error response', () => {
          ackCallback({
            type: AcknowledgementResponseTypes.ERROR,
            error: { data: { code: 'SOME_TECHNICAL_ERROR' } },
          });

          // @ts-ignore provider emit is protected
          expect(provider.emit).not.toHaveBeenCalled();
          // expect(provider.emit).toHaveBeenCalledWith('error', {
          //   code: 'INTERNAL_SERVICE_ERROR',
          //   message: 'Collab service has experienced an internal server error',
          //   status: 500,
          // });
          expect(
            fakeAnalyticsWebClient.sendOperationalEvent,
          ).toHaveBeenCalledTimes(2);
          expect(
            fakeAnalyticsWebClient.sendOperationalEvent,
          ).toHaveBeenNthCalledWith(1, {
            action: 'addSteps',
            actionSubject: 'collab',
            attributes: {
              packageName: '@atlaskit/fabric',
              packageVersion: '0.0.0',
              collabService: 'ncs',
              network: {
                status: 'ONLINE',
              },
              documentAri: 'ari:cloud:confluence:ABC:page/testpage',
              eventStatus: 'FAILURE',
              type: 'ERROR',
              latency: 0,
            },
            tags: ['editor'],
            source: 'unknown',
          });
          expect(
            fakeAnalyticsWebClient.sendOperationalEvent,
          ).toHaveBeenNthCalledWith(2, {
            action: 'error',
            actionSubject: 'collab',
            attributes: {
              packageName: '@atlaskit/fabric',
              packageVersion: '0.0.0',
              collabService: 'ncs',
              network: {
                status: 'ONLINE',
              },
              documentAri: 'ari:cloud:confluence:ABC:page/testpage',
              errorMessage: 'Error while adding steps - Acknowledgement Error',
            },
            nonPrivacySafeAttributes: {
              error: {
                data: {
                  code: 'SOME_TECHNICAL_ERROR',
                },
              },
            },
            tags: ['editor'],
            source: 'unknown',
          });
        });

        it('should call emit analytics event on invalid acknowledgement', () => {
          ackCallback({ wat: true });
          // @ts-ignore
          expect(provider.emit).not.toHaveBeenCalled();
          expect(
            fakeAnalyticsWebClient.sendOperationalEvent,
          ).toHaveBeenCalledTimes(1);
          expect(
            fakeAnalyticsWebClient.sendOperationalEvent,
          ).toHaveBeenCalledWith({
            action: 'error',
            actionSubject: 'collab',
            attributes: {
              packageName: '@atlaskit/fabric',
              packageVersion: '0.0.0',
              collabService: 'ncs',
              network: {
                status: 'ONLINE',
              },
              documentAri: 'ari:cloud:confluence:ABC:page/testpage',
              errorMessage:
                'Error while adding steps - Invalid Acknowledgement',
            },
            nonPrivacySafeAttributes: {
              error: new Error('Response type: No response type'),
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
});
