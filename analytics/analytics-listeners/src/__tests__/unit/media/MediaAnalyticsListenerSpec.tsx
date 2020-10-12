import {
  DEFAULT_SOURCE,
  GasPayload,
  UI_EVENT_TYPE,
} from '@atlaskit/analytics-gas-types';
import {
  AnalyticsListener,
  AnalyticsEventPayload,
  UIAnalyticsEvent,
} from '@atlaskit/analytics-next';
import { mount } from 'enzyme';
import React from 'react';
import { createButtonWithAnalytics } from '../../../../examples/helpers';
import Logger from '../../../helpers/logger';
import MediaAnalyticsListener from '../../../media/MediaAnalyticsListener';
import { AnalyticsWebClient, FabricChannel } from '../../../types';
import { createLoggerMock } from '../../_testUtils';

describe('MediaAnalyticsListener', () => {
  let analyticsWebClientMock: AnalyticsWebClient;
  let loggerMock: Logger;

  const EVENT_TYPE = UI_EVENT_TYPE;
  const SOURCE = 'the-jiras';
  const ACTION = 'render';
  const ACTION_SUBJECT = 'action-subject';
  const MEDIA_TAG = 'media';
  const LISTENER_VERSION = '999.9.9';
  const MOCK_PACKAGE = {
    JIRA_ISSUE: {
      version: '1.1.1',
      name: '@jira/issue',
    },
    MEDIA_CARD: {
      version: '2.5.1',
      name: '@atlaskit/media-card',
    },
    EDITOR: {
      version: '1337.0.0',
      name: '@atlaskit/editor',
    },
  };

  beforeEach(() => {
    analyticsWebClientMock = {
      sendUIEvent: jest.fn(),
      sendOperationalEvent: jest.fn(),
      sendTrackEvent: jest.fn(),
      sendScreenEvent: jest.fn(),
    };
    loggerMock = createLoggerMock();
  });

  const fireAndVerify = (
    eventPayload: GasPayload,
    expectedEvent: any,
    context?: AnalyticsEventPayload[],
  ) => {
    const spy = jest.fn();
    const ButtonWithAnalytics = createButtonWithAnalytics(
      eventPayload,
      FabricChannel.media,
      context,
    );

    const component = mount(
      <MediaAnalyticsListener
        client={analyticsWebClientMock}
        logger={loggerMock}
      >
        <ButtonWithAnalytics onClick={spy} />
      </MediaAnalyticsListener>,
    );
    const button = component.find(ButtonWithAnalytics);
    button.simulate('click');

    expect(analyticsWebClientMock.sendUIEvent).toBeCalledWith(expectedEvent);
  };

  it('should register an Analytics listener on the media channel', () => {
    const component = mount(
      <MediaAnalyticsListener
        client={analyticsWebClientMock}
        logger={loggerMock}
      >
        <div />
      </MediaAnalyticsListener>,
    );

    const analyticsListener = component.find(AnalyticsListener);
    expect(analyticsListener.props()).toHaveProperty(
      'channel',
      FabricChannel.media,
    );
  });

  it('should send event with default source', () => {
    fireAndVerify(
      {
        eventType: EVENT_TYPE,
        action: ACTION,
        actionSubject: ACTION_SUBJECT,
      },
      {
        action: ACTION,
        actionSubject: ACTION_SUBJECT,
        source: DEFAULT_SOURCE,
        tags: expect.arrayContaining([MEDIA_TAG]),
        attributes: {
          listenerVersion: LISTENER_VERSION,
        },
      },
    );
  });

  it('should send event with listener version', () => {
    fireAndVerify(
      {
        eventType: EVENT_TYPE,
        action: ACTION,
        actionSubject: ACTION_SUBJECT,
      },
      {
        action: ACTION,
        actionSubject: ACTION_SUBJECT,
        source: DEFAULT_SOURCE,
        tags: expect.arrayContaining([MEDIA_TAG]),
        attributes: {
          listenerVersion: LISTENER_VERSION,
        },
      },
    );
  });

  it('should use nearest source', () => {
    fireAndVerify(
      {
        eventType: EVENT_TYPE,
        action: ACTION,
        actionSubject: ACTION_SUBJECT,
      },
      {
        action: ACTION,
        actionSubject: ACTION_SUBJECT,
        source: 'comment',
        tags: expect.arrayContaining([MEDIA_TAG]),
        attributes: {
          listenerVersion: LISTENER_VERSION,
          sourceHierarchy: `${SOURCE}.issue.comment`,
        },
      },
      [
        {
          source: SOURCE, // This is the farthest
        },
        {
          source: 'issue',
        },
        {
          source: 'comment', // This is the nearest
        },
      ],
    );
  });

  it('should include source hierarchy from context', () => {
    const context: UIAnalyticsEvent['context'] = [
      { source: 'source1' },
      { source: 'source2' },
      {
        noSourceOnThisContext: '0',
      },
      { source: 'source3' },
    ];
    fireAndVerify(
      {
        eventType: EVENT_TYPE,
        action: ACTION,
        actionSubject: ACTION_SUBJECT,
      },
      {
        action: ACTION,
        actionSubject: ACTION_SUBJECT,
        source: 'source3',
        attributes: {
          listenerVersion: LISTENER_VERSION,
          sourceHierarchy: 'source1.source2.source3',
        },
        tags: expect.arrayContaining([MEDIA_TAG]),
      },
      context,
    );
  });

  it('should append media tag if tags are not empty', () => {
    fireAndVerify(
      {
        eventType: EVENT_TYPE,
        action: ACTION,
        actionSubject: ACTION_SUBJECT,
        tags: ['atlaskit'],
      },
      {
        action: ACTION,
        actionSubject: ACTION_SUBJECT,
        source: DEFAULT_SOURCE,
        tags: expect.arrayContaining([MEDIA_TAG]),
        attributes: {
          listenerVersion: LISTENER_VERSION,
        },
      },
    );
  });

  it('should add media tag to existing event tags', () => {
    fireAndVerify(
      {
        eventType: EVENT_TYPE,
        action: ACTION,
        actionSubject: ACTION_SUBJECT,
        tags: ['atlaskit'],
      },
      {
        action: ACTION,
        actionSubject: ACTION_SUBJECT,
        source: DEFAULT_SOURCE,
        tags: expect.arrayContaining([MEDIA_TAG, 'atlaskit']),
        attributes: {
          listenerVersion: LISTENER_VERSION,
        },
      },
    );
  });

  it('should de-dupe tags', () => {
    fireAndVerify(
      {
        eventType: EVENT_TYPE,
        action: ACTION,
        actionSubject: ACTION_SUBJECT,
        tags: ['atlaskit', 'atlaskit', MEDIA_TAG],
      },
      {
        action: ACTION,
        actionSubject: ACTION_SUBJECT,
        source: DEFAULT_SOURCE,
        tags: expect.arrayContaining([MEDIA_TAG, 'atlaskit']),
        attributes: {
          listenerVersion: LISTENER_VERSION,
        },
      },
    );
  });

  it('should include package hierarchy based on context data', () => {
    const context = [
      {
        // Top Package
        packageName: MOCK_PACKAGE.JIRA_ISSUE.name,
        packageVersion: MOCK_PACKAGE.JIRA_ISSUE.version,
      },
      {
        // Middle Packages
        packageName: MOCK_PACKAGE.EDITOR.name,
        packageVersion: MOCK_PACKAGE.EDITOR.version,
      },
      {
        // Bottom Package
        packageName: MOCK_PACKAGE.MEDIA_CARD.name,
        packageVersion: MOCK_PACKAGE.MEDIA_CARD.version,
      },
    ];
    fireAndVerify(
      {
        eventType: EVENT_TYPE,
        action: ACTION,
        actionSubject: ACTION_SUBJECT,
        tags: ['atlaskit'],
      },
      {
        source: DEFAULT_SOURCE,
        action: ACTION,
        actionSubject: ACTION_SUBJECT,
        tags: expect.arrayContaining([MEDIA_TAG, 'atlaskit']),
        attributes: {
          listenerVersion: LISTENER_VERSION,
          packageName: MOCK_PACKAGE.MEDIA_CARD.name,
          packageVersion: MOCK_PACKAGE.MEDIA_CARD.version,
          packageHierarchy: [
            `${MOCK_PACKAGE.JIRA_ISSUE.name}@${MOCK_PACKAGE.JIRA_ISSUE.version}`,
            `${MOCK_PACKAGE.EDITOR.name}@${MOCK_PACKAGE.EDITOR.version}`,
            `${MOCK_PACKAGE.MEDIA_CARD.name}@${MOCK_PACKAGE.MEDIA_CARD.version}`,
          ].join(','),
        },
      },
      context,
    );
  });

  it('should collect namespaced media context and add to attributes, using nearest values for duplicates', () => {
    const context: UIAnalyticsEvent['context'] = [
      {
        source: SOURCE,
      },
      {
        mediaCtx: {
          fileName: 'test.png',
        },
      },
      {
        mediaCtx: {
          fileSize: 1337,
          fileMimeType: 'image/png',
        },
      },
      {
        mediaCtx: {
          processingStatus: 'success',
        },
      },
    ];
    fireAndVerify(
      {
        actionSubject: ACTION_SUBJECT,
        eventType: EVENT_TYPE,
      },
      {
        actionSubject: ACTION_SUBJECT,
        tags: [MEDIA_TAG],
        source: SOURCE,
        attributes: {
          listenerVersion: LISTENER_VERSION,
          sourceHierarchy: SOURCE,
          fileName: 'test.png',
          fileSize: 1337,
          fileMimeType: 'image/png',
          processingStatus: 'success',
        },
      },
      context,
    );
  });

  it('should not be able to override listenerVersion', () => {
    const context: UIAnalyticsEvent['context'] = [
      {
        attributes: {
          listenerVersion: '1.0.0',
        },
      },
    ];
    fireAndVerify(
      {
        actionSubject: ACTION_SUBJECT,
        eventType: EVENT_TYPE,
      },
      {
        actionSubject: ACTION_SUBJECT,
        tags: [MEDIA_TAG],
        source: DEFAULT_SOURCE,
        attributes: {
          listenerVersion: LISTENER_VERSION,
        },
      },
      context,
    );
  });

  it('should not be able to override sourceHierarchy', () => {
    const context: UIAnalyticsEvent['context'] = [
      {
        source: SOURCE,
      },
      {
        source: 'board',
      },
      {
        attributes: {
          sourceHierarchy: 'confluence.page.comments',
        },
      },
    ];
    fireAndVerify(
      {
        actionSubject: ACTION_SUBJECT,
        eventType: EVENT_TYPE,
      },
      {
        actionSubject: ACTION_SUBJECT,
        tags: [MEDIA_TAG],
        source: 'board',
        attributes: {
          listenerVersion: LISTENER_VERSION,
          sourceHierarchy: `${SOURCE}.board`,
        },
      },
      context,
    );
  });

  it('should not be able to override packageHierarchy', () => {
    const context: UIAnalyticsEvent['context'] = [
      {
        packageName: '@atlaskit/jira',
        packageVersion: '2.0.1',
      },
      {
        packageName: '@atlaskit/issue',
        packageVersion: '1.0.1',
      },
      {
        attributes: {
          packageHierarchy: '@atlaskit/editor@40.0.0',
        },
      },
    ];
    fireAndVerify(
      {
        actionSubject: ACTION_SUBJECT,
        eventType: EVENT_TYPE,
      },
      {
        actionSubject: ACTION_SUBJECT,
        tags: [MEDIA_TAG],
        source: DEFAULT_SOURCE,
        attributes: {
          listenerVersion: LISTENER_VERSION,
          packageName: '@atlaskit/issue',
          packageVersion: '1.0.1',
          packageHierarchy: '@atlaskit/jira@2.0.1,@atlaskit/issue@1.0.1',
        },
      },
      context,
    );
  });

  it('should be able to override packageName and packageVersion', () => {
    const context: UIAnalyticsEvent['context'] = [
      {
        packageName: '@atlaskit/jira',
        packageVersion: '2.0.1',
      },
      {
        packageName: '@atlaskit/issue',
        packageVersion: '1.0.2',
      },
      {
        attributes: {
          packageName: '@atlaskit/confluence-button',
          packageVersion: '1.0.1',
        },
      },
    ];
    fireAndVerify(
      {
        actionSubject: ACTION_SUBJECT,
        eventType: EVENT_TYPE,
      },
      {
        actionSubject: ACTION_SUBJECT,
        tags: [MEDIA_TAG],
        source: DEFAULT_SOURCE,
        attributes: {
          listenerVersion: LISTENER_VERSION,
          packageName: '@atlaskit/confluence-button',
          packageVersion: '1.0.1',
          packageHierarchy: '@atlaskit/jira@2.0.1,@atlaskit/issue@1.0.2',
        },
      },
      context,
    );
  });

  it('should not be able to override componentHierarchy', () => {
    const context: UIAnalyticsEvent['context'] = [
      {
        component: 'issue',
      },
      {
        component: 'mediaCard',
      },
      {
        attributes: {
          componentHierarchy: 'editor.comment',
        },
      },
    ];
    fireAndVerify(
      {
        actionSubject: ACTION_SUBJECT,
        eventType: EVENT_TYPE,
      },
      {
        actionSubject: ACTION_SUBJECT,
        tags: [MEDIA_TAG],
        source: DEFAULT_SOURCE,
        attributes: {
          listenerVersion: LISTENER_VERSION,
          componentHierarchy: 'issue.mediaCard',
        },
      },
      context,
    );
  });

  it('should include media region when available', () => {
    window.sessionStorage.setItem('media-api-region', 'someMediaRegion');
    fireAndVerify(
      {
        eventType: EVENT_TYPE,
        action: ACTION,
        actionSubject: ACTION_SUBJECT,
        tags: ['atlaskit'],
      },
      {
        action: ACTION,
        actionSubject: ACTION_SUBJECT,
        source: DEFAULT_SOURCE,
        tags: expect.arrayContaining([MEDIA_TAG]),
        attributes: {
          listenerVersion: LISTENER_VERSION,
          mediaRegion: 'someMediaRegion',
        },
      },
    );
  });
});
