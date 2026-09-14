import React from 'react';

import { fireEvent, screen } from '@testing-library/react';

import FabricAnalyticsListener from '@atlaskit/analytics-listeners/FabricAnalyticsListeners';
import type { AnalyticsWebClient } from '@atlaskit/analytics-listeners/types';

import { TaskItem } from '../../../';
import { renderWithIntl } from '../_testing-library';

describe('<TaskItem/>', () => {
	let analyticsWebClientMock: AnalyticsWebClient;

	beforeEach(() => {
		analyticsWebClientMock = {
			sendUIEvent: jest.fn(),
			sendOperationalEvent: jest.fn(),
			sendTrackEvent: jest.fn(),
			sendScreenEvent: jest.fn(),
		};
	});

	it('should render children', () => {
		const { container } = renderWithIntl(
			<TaskItem taskId="task-1">
				Hello <b>world</b>
			</TaskItem>,
		);

		expect(container.querySelector('[data-component="content"]')).toHaveTextContent('Hello world');
	});

	it('should render callback with ref', () => {
		let contentRef: HTMLElement | null = null;
		const handleContentRef = (ref: HTMLElement | null) => (contentRef = ref);

		const { container } = renderWithIntl(
			<TaskItem taskId="task-id" contentRef={handleContentRef}>
				Hello <b>world</b>
			</TaskItem>,
		);

		expect(container.querySelector('[data-component="content"]')).toHaveTextContent('Hello world');
		expect(contentRef).not.toBeNull();
		expect(contentRef).toHaveTextContent('Hello world');
	});

	it('should disable input if disabled', () => {
		renderWithIntl(
			<TaskItem taskId="task-1" disabled={true}>
				Hello <b>world</b>
			</TaskItem>,
		);

		expect(screen.getByRole('checkbox')).toBeDisabled();
	});

	it('should call onChange when checkbox is clicked', () => {
		const onChange = jest.fn();
		renderWithIntl(
			<TaskItem taskId="task-1" onChange={onChange}>
				Hello <b>world</b>
			</TaskItem>,
		);

		fireEvent.click(screen.getByRole('checkbox'));
		expect(onChange).toHaveBeenCalledWith('task-1', true);
	});

	describe('showPlaceholder', () => {
		it('should render placeholder if task is empty', () => {
			renderWithIntl(<TaskItem taskId="task-1" showPlaceholder={true} placeholder="cheese" />);

			expect(screen.getByTestId('task-decision-item-placeholder')).toHaveTextContent('cheese');
		});

		it('should not render placeholder if task is not empty', () => {
			renderWithIntl(
				<TaskItem taskId="task-1" showPlaceholder={true} placeholder="cheese">
					Hello <b>world</b>
				</TaskItem>,
			);

			expect(screen.queryByTestId('task-decision-item-placeholder')).not.toBeInTheDocument();
		});
	});

	describe('analytics', () => {
		it('check action fires an event', () => {
			renderWithIntl(
				<FabricAnalyticsListener client={analyticsWebClientMock}>
					<TaskItem taskId="task-1" appearance="inline" isDone={false} />
				</FabricAnalyticsListener>,
			);

			fireEvent.click(screen.getByRole('checkbox'));
			expect(analyticsWebClientMock.sendUIEvent).toHaveBeenCalledTimes(1);
			expect(analyticsWebClientMock.sendUIEvent).toHaveBeenCalledWith(
				expect.objectContaining({
					action: 'checked',
					actionSubject: 'action',
					attributes: { localId: 'task-1' },
				}),
			);
		});

		it('uncheck action fires an event', () => {
			renderWithIntl(
				<FabricAnalyticsListener client={analyticsWebClientMock}>
					<TaskItem taskId="task-1" appearance="inline" isDone={true} />
				</FabricAnalyticsListener>,
			);

			fireEvent.click(screen.getByRole('checkbox'));
			expect(analyticsWebClientMock.sendUIEvent).toHaveBeenCalledTimes(1);
			expect(analyticsWebClientMock.sendUIEvent).toHaveBeenCalledWith(
				expect.objectContaining({
					action: 'unchecked',
					actionSubject: 'action',
					attributes: { localId: 'task-1' },
				}),
			);
		});
	});
});
