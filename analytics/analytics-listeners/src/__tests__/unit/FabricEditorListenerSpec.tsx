import { AnalyticsListener } from '@atlaskit/analytics-next';
import { render, screen, fireEvent } from '@testing-library/react';
import React from 'react';
import {
	createComponentWithAnalytics,
	createTaggedComponentWithAnalytics,
	type OwnProps,
} from '../../../examples/helpers';
import FabricEditorListener, {
	EDITOR_TAG,
	LEGACY_EDITOR_TAG,
} from '../../fabric/FabricEditorListener';
import type Logger from '../../helpers/logger';
import { type AnalyticsWebClient, FabricChannel } from '../../types';
import { createLoggerMock } from '../_testUtils';

const DummyEditorComponent = createComponentWithAnalytics(FabricChannel.editor);
const DummyTaggedEditorComponent = createTaggedComponentWithAnalytics(
	FabricChannel.editor,
	EDITOR_TAG,
);

describe('<FabricEditorsListener />', () => {
	let analyticsWebClientMock: AnalyticsWebClient;
	let loggerMock: Logger;

	beforeEach(() => {
		analyticsWebClientMock = {
			sendUIEvent: jest.fn(),
			sendOperationalEvent: jest.fn(),
			sendTrackEvent: jest.fn(),
			sendScreenEvent: jest.fn(),
		};
		loggerMock = createLoggerMock();
	});

	const fireAndVerifySentEvent = (Component: React.ComponentType<OwnProps>, expectedEvent: any) => {
		const compOnClick = jest.fn();
		render(
			<FabricEditorListener client={analyticsWebClientMock} logger={loggerMock}>
				<AnalyticsListener channel={FabricChannel.editor} onEvent={() => {}}>
					<Component onClick={compOnClick} />
				</AnalyticsListener>
			</FabricEditorListener>,
		);

		const dummyElement = screen.getByRole('button', { name: 'editor' });
		fireEvent.click(dummyElement);

		expect(analyticsWebClientMock.sendUIEvent).toBeCalledWith(expectedEvent);
	};

	describe('Listen and fire an UI event with analyticsWebClient', () => {
		it('should fire event with editor tag', async () => {
			fireAndVerifySentEvent(DummyEditorComponent, {
				action: 'someAction',
				actionSubject: 'someComponent',
				source: 'unknown',
				tags: [EDITOR_TAG, LEGACY_EDITOR_TAG],
			});

			await expect(document.body).toBeAccessible();
		});

		it('should fire event without duplicating the tag', async () => {
			fireAndVerifySentEvent(DummyTaggedEditorComponent, {
				action: 'someAction',
				actionSubject: 'someComponent',
				source: 'unknown',
				tags: [EDITOR_TAG, 'foo', LEGACY_EDITOR_TAG],
			});

			await expect(document.body).toBeAccessible();
		});
	});
});
