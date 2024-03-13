// eslint-disable-next-line import/no-extraneous-dependencies -- Removed import for fixing circular dependencies
import { createEditorState } from '@atlaskit/editor-test-helpers/create-editor-state';
// eslint-disable-next-line import/no-extraneous-dependencies -- Removed import for fixing circular dependencies
import { doc, p } from '@atlaskit/editor-test-helpers/doc-builder';

import type { AnalyticsWebClient } from '@atlaskit/analytics-listeners';
import type { EditorState } from '@atlaskit/editor-prosemirror/state';
import type { Provider } from '..';
import { createSocketIOCollabProvider } from '../../socket-io-provider';

jest.mock('lodash/throttle', () => jest.fn((fn) => fn));
jest.mock('@atlaskit/prosemirror-collab', () => {
  const originPC = jest.requireActual('@atlaskit/prosemirror-collab');
  return {
    ...originPC,
    sendableSteps: jest.fn(),
    getVersion: jest.fn(),
  };
});

describe('#sendData - enableCatchupv2', () => {
  jest.useFakeTimers();
  let anyEditorState: EditorState;
  let provider: Provider;
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
      featureFlags: {
        catchupv2: true,
      },
    };
    provider = createSocketIOCollabProvider(testProviderConfigWithAnalytics);

    jest.runOnlyPendingTimers();
    jest.clearAllTimers();

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

  afterEach(() => {
    jest.clearAllMocks();
    jest.runOnlyPendingTimers();
  });

  it('triggers catchupv2 on processSteps failure', () => {
    const catchupv2Spy = jest.spyOn(
      // @ts-ignore
      provider.documentService as any,
      'catchupv2',
    );

    //@ts-expect-error private method call but it's okay we're testing
    provider.documentService.processSteps({
      version: 1625,
      // @ts-ignore breaking on purpose
      steps: 'hot garbarge', // even the spelling is garbage, nice
    });

    expect(fakeAnalyticsWebClient.sendTrackEvent).toHaveBeenCalledTimes(1);
    expect(fakeAnalyticsWebClient.sendTrackEvent).toBeCalledWith({
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
        errorName: 'TypeError',
        errorMessage: 'Error while processing steps',
        originalErrorMessage: 'steps.map is not a function',
      },
      nonPrivacySafeAttributes: {
        error: new TypeError('steps.map is not a function'),
      },
      source: 'unknown',
      tags: ['editor'],
    });
    expect(catchupv2Spy).toHaveBeenCalledTimes(1);
    expect(catchupv2Spy).toBeCalledWith();
  });
});
