import {
  fireSmartLinkEvent,
  ANALYTICS_CHANNEL,
  resolvedEvent,
  unresolvedEvent,
  instrumentEvent,
} from '../analytics';
import { AnalyticsPayload } from '../types';
import { APIError } from '../../client/errors';

// Mock our fire analytics function
describe('fireSmartLinkEvent', () => {
  test('Fires an analytics event when given a valid gas payload and a valid create analytics event function', () => {
    const payload: AnalyticsPayload = {
      action: 'clicked',
      actionSubject: 'smartLink',
      eventType: 'ui',
      attributes: {},
    };

    const mockedFireFn = jest.fn();
    const fakeCreateAnalyticsEvent = jest
      .fn()
      .mockImplementation(() => ({ fire: mockedFireFn, payload }));

    fireSmartLinkEvent(payload, fakeCreateAnalyticsEvent);

    expect(mockedFireFn).toBeCalledWith(ANALYTICS_CHANNEL);
    expect(fakeCreateAnalyticsEvent).toBeCalled();
    expect(fakeCreateAnalyticsEvent).toBeCalledWith(payload);
  });
});

describe('resolvedEvent', () => {
  test('returns resolved events with definition id and resource type', () => {
    const event = resolvedEvent(
      'id',
      'definition-id',
      'extension-key',
      'file-type',
    );

    expect(event).toMatchInlineSnapshot(`
      Object {
        "action": "resolved",
        "actionSubject": "smartLink",
        "attributes": Object {
          "componentName": "smart-cards",
          "definitionId": "definition-id",
          "extensionKey": "extension-key",
          "id": "id",
          "packageName": "@atlaskit/smart-card",
          "packageVersion": "999.9.9",
          "resourceType": "file-type",
        },
        "eventType": "operational",
      }
    `);
  });
});

describe('unresolvedEvent', () => {
  test('returns unresolved events with definition id and resource type', () => {
    const error = new APIError(
      'error',
      'localhost',
      'something wrong',
      'ResolveFailedError',
    );
    const event = unresolvedEvent(
      'id',
      'fail',
      'definition-id',
      'extension-key',
      'file-type',
      error,
    );

    expect(event).toMatchInlineSnapshot(`
      Object {
        "action": "unresolved",
        "actionSubject": "smartLink",
        "attributes": Object {
          "componentName": "smart-cards",
          "definitionId": "definition-id",
          "error": Object {
            "kind": "error",
            "message": "something wrong",
            "type": "ResolveFailedError",
          },
          "extensionKey": "extension-key",
          "id": "id",
          "packageName": "@atlaskit/smart-card",
          "packageVersion": "999.9.9",
          "reason": "fail",
          "resourceType": "file-type",
        },
        "eventType": "operational",
      }
    `);
  });
});

describe('instrumentEvent', () => {
  test('does not return ResolveUnsupportedError unresolved events', () => {
    const error = new APIError(
      'error',
      'localhost',
      'something wrong',
      'ResolveUnsupportedError',
    );
    const event = instrumentEvent(
      'id',
      'errored',
      'definition-id',
      'extension-key',
      'file-type',
      error,
    );
    expect(event).toBeUndefined();
  });

  test('returns unresolved events for events apart from ResolveUnsupportedError unresolved events', () => {
    const error = new APIError(
      'error',
      'localhost',
      'something wrong',
      'ResolveFailedError',
    );
    const event = instrumentEvent(
      'id',
      'errored',
      'definition-id',
      'extension-key',
      'file-type',
      error,
    );
    expect(event).toMatchInlineSnapshot(`
      Object {
        "action": "unresolved",
        "actionSubject": "smartLink",
        "attributes": Object {
          "componentName": "smart-cards",
          "definitionId": "definition-id",
          "duration": undefined,
          "error": Object {
            "kind": "error",
            "message": "something wrong",
            "type": "ResolveFailedError",
          },
          "extensionKey": "extension-key",
          "id": "id",
          "packageName": "@atlaskit/smart-card",
          "packageVersion": "999.9.9",
          "reason": "errored",
          "resourceType": "file-type",
        },
        "eventType": "operational",
      }
    `);
  });
});
