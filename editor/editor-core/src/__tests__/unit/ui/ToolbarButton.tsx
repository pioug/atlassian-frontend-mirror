import React from 'react';

import { fireEvent, render, screen } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';

import { FabricChannel } from '@atlaskit/analytics-listeners/types';
import AnalyticsListener from '@atlaskit/analytics-next/AnalyticsListener';
import { ACTION, ACTION_SUBJECT, EVENT_TYPE } from '@atlaskit/editor-common/analytics';
import { TOOLBAR_BUTTON, ToolbarButton } from '@atlaskit/editor-common/ui-menu';

const noop = () => {};

describe('@atlaskit/editor-core/ui/ToolbarButton', () => {
	it('should not render tooltip if title is not set', async () => {
		render(
			<ToolbarButton
				aria-label="Toolbar action"
				onClick={noop}
				selected={false}
				disabled={false}
			/>,
		);

		await userEvent.hover(screen.getByRole('button', { name: 'Toolbar action' }));

		expect(screen.queryByRole('tooltip')).not.toBeInTheDocument();
		await expect(document.body).toBeAccessible();
	});

	it('should render tooltip if title is set', async () => {
		render(
			<ToolbarButton
				aria-label="Toolbar action"
				onClick={noop}
				selected={false}
				disabled={false}
				title="tooltip text"
			/>,
		);

		await userEvent.hover(screen.getByRole('button', { name: 'Toolbar action' }));

		expect(await screen.findByRole('tooltip', { name: 'tooltip text' })).toBeVisible();
		await expect(document.body).toBeAccessible();
	});

	it('should not display tooltip if hideTooltip prop is passed in', async () => {
		render(
			<ToolbarButton
				aria-label="Toolbar action"
				onClick={noop}
				selected={false}
				disabled={false}
				hideTooltip={true}
				title="tooltip text"
			/>,
		);

		await userEvent.hover(screen.getByRole('button', { name: 'Toolbar action' }));

		expect(screen.queryByRole('tooltip')).not.toBeInTheDocument();
		await expect(document.body).toBeAccessible();
	});

	it('should pass titlePosition to tooltip position', async () => {
		render(
			<ToolbarButton
				aria-label="Toolbar action"
				onClick={noop}
				selected={false}
				disabled={false}
				title="tooltip text"
				titlePosition="left"
			/>,
		);

		await userEvent.hover(screen.getByRole('button', { name: 'Toolbar action' }));

		expect(await screen.findByRole('tooltip', { name: 'tooltip text' })).toHaveAttribute(
			'data-placement',
			'left',
		);
		await expect(document.body).toBeAccessible();
	});

	describe('when button id is not set', () => {
		it('should not fire the analytics event', async () => {
			const onEvent = jest.fn();
			render(
				<AnalyticsListener onEvent={onEvent} channel={FabricChannel.editor}>
					<ToolbarButton
						testId="some-test-id"
						onClick={noop}
						selected={false}
						disabled={false}
						title="tooltip text"
						titlePosition="left"
					/>
				</AnalyticsListener>,
			);

			fireEvent.click(screen.getByTestId('some-test-id'));
			expect(onEvent).not.toHaveBeenCalled();

			// eslint-disable-next-line @atlassian/a11y/no-violation-count
			await expect(document.body).toBeAccessible({ violationCount: 1 });
		});
	});

	describe('when button id is set', () => {
		it('should fire the analytics event with the button id', async () => {
			const onEvent = jest.fn();
			render(
				<AnalyticsListener onEvent={onEvent} channel={FabricChannel.editor}>
					<ToolbarButton
						buttonId={TOOLBAR_BUTTON.UNDO}
						testId="some-test-id"
						onClick={noop}
						selected={false}
						disabled={false}
						title="tooltip text"
						titlePosition="left"
					/>
				</AnalyticsListener>,
			);

			fireEvent.click(screen.getByTestId('some-test-id'));
			expect(onEvent).toHaveBeenCalledWith(
				expect.objectContaining({
					payload: {
						action: ACTION.CLICKED,
						actionSubject: ACTION_SUBJECT.TOOLBAR_BUTTON,
						actionSubjectId: TOOLBAR_BUTTON.UNDO,
						eventType: EVENT_TYPE.UI,
						attributes: expect.any(Object),
					},
				}),
				'editor',
			);

			// eslint-disable-next-line @atlassian/a11y/no-violation-count
			await expect(document.body).toBeAccessible({ violationCount: 1 });
		});
	});
});
