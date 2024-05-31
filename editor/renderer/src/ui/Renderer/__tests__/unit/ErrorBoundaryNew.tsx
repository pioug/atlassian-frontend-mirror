import React from 'react';
import { render } from '@testing-library/react';

import { ErrorBoundary } from '../../ErrorBoundary';
import { ffTest } from '@atlassian/feature-flags-test-utils';
import type {
	ComponentCaughtDomErrorAEP,
	ComponentCrashErrorAEP,
} from '../../../../analytics/events';
import { PLATFORM } from '../../../../analytics/events';
import { ACTION, EVENT_TYPE, ACTION_SUBJECT } from '@atlaskit/editor-common/analytics';
import { mockCreateAnalyticsEvent } from '@atlaskit/editor-test-helpers/mock-analytics-next';

describe('When error boundary for dom errors flag is enabled it should call fireAnalyticsEvent again with ComponentCaughtDomErrorAEP', () => {
	const CustomError = new Error(
		`Failed to execute 'removeChild' on 'Node': The node to be removed is not a child of this node`,
	);
	const BrokenComponent = () => {
		throw CustomError;
	};

	ffTest(
		'platform.editor.renderer-error-boundary-for-dom-errors',
		() => {
			try {
				render(
					<ErrorBoundary
						component={ACTION_SUBJECT.RENDERER}
						createAnalyticsEvent={mockCreateAnalyticsEvent}
					>
						<BrokenComponent />
					</ErrorBoundary>,
				);
				// In the real world scenario that this is testing, after the DOM error is caught,
				// the ErrorBoundary would either render a fallback component or the broken component
				// would be re-rendered without the error. In this test, we just want to check that
				// the correct analytics event is fired. To do this, we're suppressing this error.
			} catch (e) {}

			const expectedAnalyticsEvent: ComponentCaughtDomErrorAEP = {
				action: ACTION.CAUGHT_DOM_ERROR,
				actionSubject: ACTION_SUBJECT.RENDERER,
				actionSubjectId: undefined,
				eventType: EVENT_TYPE.OPERATIONAL,
				attributes: {
					platform: PLATFORM.WEB,
					errorMessage: CustomError.message,
				},
			};

			expect(mockCreateAnalyticsEvent).toHaveBeenCalledTimes(2);
			expect(mockCreateAnalyticsEvent).toHaveBeenNthCalledWith(2, expectedAnalyticsEvent);
		},
		() => {
			render(
				<ErrorBoundary
					component={ACTION_SUBJECT.RENDERER}
					createAnalyticsEvent={mockCreateAnalyticsEvent}
				>
					<BrokenComponent />
				</ErrorBoundary>,
			);

			const expectedAnalyticsEvent: ComponentCrashErrorAEP = {
				action: ACTION.CRASHED,
				actionSubject: ACTION_SUBJECT.RENDERER,
				eventType: EVENT_TYPE.OPERATIONAL,
				attributes: expect.objectContaining({
					platform: PLATFORM.WEB,
					errorMessage: CustomError.message,
					componentStack: expect.any(String),
					errorRethrown: false,
				}),
			};

			expect(mockCreateAnalyticsEvent).toHaveBeenCalledTimes(1);
			expect(mockCreateAnalyticsEvent).toHaveBeenCalledWith(expectedAnalyticsEvent);
		},
	);
});
