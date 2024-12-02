import { APIError } from '@atlaskit/linking-common';

import {
	ANALYTICS_CHANNEL,
	fireSmartLinkEvent,
	instrumentEvent,
	resolvedEvent,
	uiActionClickedEvent,
	unresolvedEvent,
} from '../analytics';
import { type AnalyticsPayload } from '../types';

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

		expect(mockedFireFn).toHaveBeenCalledWith(ANALYTICS_CHANNEL);
		expect(fakeCreateAnalyticsEvent).toHaveBeenCalled();
		expect(fakeCreateAnalyticsEvent).toHaveBeenCalledWith(payload);
	});
});

describe('resolvedEvent', () => {
	test('returns resolved events with definition id and resource type', () => {
		const event = resolvedEvent({
			id: 'id',
			definitionId: 'definition-id',
			extensionKey: 'extension-key',
			resourceType: 'file-type',
		});

		expect(event).toMatchInlineSnapshot(`
      {
        "action": "resolved",
        "actionSubject": "smartLink",
        "attributes": {
          "componentName": "smart-cards",
          "definitionId": "definition-id",
          "extensionKey": "extension-key",
          "id": "id",
          "packageName": "@product/platform",
          "packageVersion": "0.0.0",
          "resourceType": "file-type",
        },
        "eventType": "operational",
      }
    `);
	});
});

describe('unresolvedEvent', () => {
	test('returns unresolved events with definition id and resource type', () => {
		const error = new APIError('error', 'localhost', 'something wrong', 'ResolveFailedError');
		const event = unresolvedEvent({
			id: 'id',
			status: 'fail',
			definitionId: 'definition-id',
			extensionKey: 'extension-key',
			resourceType: 'file-type',
			error,
		});

		expect(event).toMatchInlineSnapshot(`
      {
        "action": "unresolved",
        "actionSubject": "smartLink",
        "attributes": {
          "componentName": "smart-cards",
          "definitionId": "definition-id",
          "error": {
            "kind": "error",
            "message": "something wrong",
            "type": "ResolveFailedError",
          },
          "extensionKey": "extension-key",
          "id": "id",
          "packageName": "@product/platform",
          "packageVersion": "0.0.0",
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
		const error = new APIError('error', 'localhost', 'something wrong', 'ResolveUnsupportedError');
		const event = instrumentEvent({
			id: 'id',
			status: 'errored',
			definitionId: 'definition-id',
			extensionKey: 'extension-key',
			resourceType: 'file-type',
			error,
		});
		expect(event).toBeUndefined();
	});

	test('returns unresolved events for events apart from ResolveUnsupportedError unresolved events', () => {
		const error = new APIError('error', 'localhost', 'something wrong', 'ResolveFailedError');
		const event = instrumentEvent({
			id: 'id',
			status: 'errored',
			definitionId: 'definition-id',
			extensionKey: 'extension-key',
			resourceType: 'file-type',
			error,
		});
		expect(event).toMatchInlineSnapshot(`
      {
        "action": "unresolved",
        "actionSubject": "smartLink",
        "attributes": {
          "componentName": "smart-cards",
          "definitionId": "definition-id",
          "duration": undefined,
          "error": {
            "kind": "error",
            "message": "something wrong",
            "type": "ResolveFailedError",
          },
          "extensionKey": "extension-key",
          "id": "id",
          "packageName": "@product/platform",
          "packageVersion": "0.0.0",
          "reason": "errored",
          "resourceType": "file-type",
        },
        "eventType": "operational",
      }
    `);
	});
});

describe('uiActionClickedEvent', () => {
	it.each([
		['DownloadAction', 'downloadDocument'],
		['PreviewAction', 'invokePreviewScreen'],
		['ViewAction', 'shortcutGoToLink'],
		['ServerAction', undefined],
	])(
		'returns action button click event for action type %s',
		(actionType: string, actionSubjectId: string | undefined) => {
			const event = uiActionClickedEvent({
				id: 'id',
				actionType,
				extensionKey: 'extension-key',
				display: 'block',
			});

			expect(event).toEqual({
				action: 'clicked',
				actionSubject: 'button',
				actionSubjectId: actionSubjectId,
				attributes: {
					actionType: actionType,
					componentName: 'smart-cards',
					display: 'block',
					id: 'id',
					extensionKey: 'extension-key',
					packageName: expect.any(String),
					packageVersion: expect.any(String),
				},
				eventType: 'ui',
			});
		},
	);
});
