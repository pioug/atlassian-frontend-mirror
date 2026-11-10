import React from 'react';

import { IntlProvider } from 'react-intl';

import { failGate, passGate } from '@atlassian/feature-flags-test-utils/mock-gates';
import { screen } from '@atlassian/testing-library/screen';
import { render } from '@atlassian/testing-library/testing-library/react';
import { userEvent } from '@atlassian/testing-library/user-event';
import { within } from '@atlassian/testing-library/within';

import { ActionName, CardDisplay } from '../../../../../constants';
import * as useInvokeClientAction from '../../../../../state/hooks/use-invoke-client-action';
import * as useRovoChat from '../../../../../state/hooks/use-rovo-chat';
import { RovoChatPromptKey } from '../../../../common/rovo-chat-utils';
import EmbedRovoActionsFooter from '../index';

let mockObservedWidth: number | undefined;

jest.mock('@atlaskit/width-detector/width-observer', () => {
	const React = require('react');
	return {
		...jest.requireActual('@atlaskit/width-detector/width-observer'),
		WidthObserver: ({ setWidth }: { setWidth: (width: number) => void }) => {
			React.useEffect(() => {
				if (mockObservedWidth !== undefined) {
					setWidth(mockObservedWidth);
				}
			}, [setWidth]);
			return null;
		},
	};
});

jest.mock('../../../../FlexibleCard/assets/ai-edit-icon', () => ({
	__esModule: true,
	default: () => <span data-testid="ai-edit-icon" />,
}));

jest.mock('@atlaskit/icon/core/ai-generative-text-summary', () => ({
	__esModule: true,
	default: () => <span data-testid="summary-icon" />,
}));

jest.mock('@atlaskit/icon/core/chart-bar', () => ({
	__esModule: true,
	default: () => <span data-testid="chart-bar-icon" />,
}));

describe('EmbedRovoActionsFooter', () => {
	const sendPromptMessageMock = jest.fn();
	const invokeMock = jest.fn();

	const actionData = {
		invokeAction: {
			actionSubjectId: 'rovoChatPrompt' as const,
			actionType: ActionName.RovoChatAction,
			definitionId: 'd1',
			display: CardDisplay.Embed,
			extensionKey: 'google-object-provider',
			id: 'uid',
			resourceType: 'r1',
		},
		product: 'CONFLUENCE' as const,
		url: 'https://example.com/doc',
	};

	const setup = (prompts = [RovoChatPromptKey.SUMMARIZE_LINK]) => {
		return render(
			<IntlProvider locale="en">
				<EmbedRovoActionsFooter actionData={actionData} prompts={prompts} testId="embed-footer" />
			</IntlProvider>,
		);
	};

	beforeEach(() => {
		mockObservedWidth = undefined;
		jest.spyOn(useRovoChat, 'default').mockReturnValue({
			isRovoChatEnabled: true,
			sendPromptMessage: sendPromptMessageMock,
		});
		jest.spyOn(useInvokeClientAction, 'default').mockReturnValue(invokeMock);
	});

	afterEach(() => {
		jest.clearAllMocks();
	});

	it('should capture and report a11y violations', async () => {
		const { container } = setup();

		await expect(container).toBeAccessible();
	});

	it('renders prompt actions', () => {
		setup([RovoChatPromptKey.SUMMARIZE_LINK, RovoChatPromptKey.KEY_HIGHLIGHTS]);

		expect(screen.getByRole('button', { name: 'Summarize' })).toBeInTheDocument();
		expect(screen.getByRole('button', { name: 'Key highlights' })).toBeInTheDocument();
	});

	it('hides secondary actions when the footer is narrow', async () => {
		mockObservedWidth = 300;

		setup([RovoChatPromptKey.SUMMARIZE_LINK, RovoChatPromptKey.KEY_HIGHLIGHTS]);

		expect(await screen.findByRole('button', { name: 'Summarize' })).toBeInTheDocument();
		expect(screen.queryByRole('button', { name: 'Key highlights' })).not.toBeInTheDocument();
	});

	it('renders the primary action as icon-only when the footer is very narrow', async () => {
		mockObservedWidth = 200;

		setup([RovoChatPromptKey.SUMMARIZE_LINK, RovoChatPromptKey.KEY_HIGHLIGHTS]);

		const summarizeButton = await screen.findByRole('button', { name: 'Summarize' });

		expect(summarizeButton).toBeInTheDocument();
		expect(summarizeButton).not.toHaveTextContent('Summarize');
		expect(screen.queryByRole('button', { name: 'Key highlights' })).not.toBeInTheDocument();
	});

	it('uses the branded AI icon for the primary action', () => {
		setup([RovoChatPromptKey.SUMMARIZE_LINK, RovoChatPromptKey.KEY_HIGHLIGHTS]);

		const summarizeButton = screen.getByRole('button', { name: 'Summarize' });

		expect(within(summarizeButton).getByTestId('ai-edit-icon')).toBeInTheDocument();
		expect(screen.getAllByTestId('ai-edit-icon')).toHaveLength(1);
	});

	it('keeps the Visualize chart icon when Visualize is the primary action', () => {
		setup([RovoChatPromptKey.VISUALIZE, RovoChatPromptKey.SUMMARIZE_DOCUMENT]);

		const visualizeButton = screen.getByRole('button', { name: 'Visualize' });

		expect(within(visualizeButton).getByTestId('chart-bar-icon')).toBeInTheDocument();
		expect(screen.queryByTestId('ai-edit-icon')).not.toBeInTheDocument();
	});

	describe('with platform_sl_rovo_summarize_icon_consistency', () => {
		it('keeps the primary action prompt icon when the gate is on', () => {
			passGate('platform_sl_rovo_summarize_icon_consistency');
			setup([RovoChatPromptKey.SUMMARIZE_DOCUMENT, RovoChatPromptKey.KEY_HIGHLIGHTS]);

			const summarizeButton = screen.getByRole('button', { name: 'Summarize' });

			expect(within(summarizeButton).getByTestId('summary-icon')).toBeInTheDocument();
			expect(screen.queryByTestId('ai-edit-icon')).not.toBeInTheDocument();
		});

		it('uses the branded AI icon for the primary action when the gate is off', () => {
			failGate('platform_sl_rovo_summarize_icon_consistency');
			setup([RovoChatPromptKey.SUMMARIZE_DOCUMENT, RovoChatPromptKey.KEY_HIGHLIGHTS]);

			const summarizeButton = screen.getByRole('button', { name: 'Summarize' });

			expect(within(summarizeButton).getByTestId('ai-edit-icon')).toBeInTheDocument();
			expect(within(summarizeButton).queryByTestId('summary-icon')).not.toBeInTheDocument();
		});
	});

	it('keeps the Visualize chart icon in the icon-only view', async () => {
		mockObservedWidth = 200;

		setup([RovoChatPromptKey.VISUALIZE, RovoChatPromptKey.SUMMARIZE_DOCUMENT]);

		const visualizeButton = await screen.findByRole('button', { name: 'Visualize' });

		expect(visualizeButton).not.toHaveTextContent('Visualize');
		expect(within(visualizeButton).getByTestId('chart-bar-icon')).toBeInTheDocument();
	});

	it('invokes the selected Rovo prompt without bubbling to the embed frame', async () => {
		const user = userEvent.setup();
		const onParentClick = jest.fn();

		render(
			<IntlProvider locale="en">
				<div onClick={onParentClick}>
					<EmbedRovoActionsFooter
						actionData={actionData}
						prompts={[RovoChatPromptKey.SUMMARIZE_LINK]}
						testId="embed-footer"
					/>
				</div>
			</IntlProvider>,
		);

		await user.click(screen.getByRole('button', { name: 'Summarize' }));

		expect(onParentClick).not.toHaveBeenCalled();
		expect(invokeMock).toHaveBeenCalledWith({
			...actionData.invokeAction,
			actionFn: expect.any(Function),
			prompt: RovoChatPromptKey.SUMMARIZE_LINK,
		});
	});

	it('does not render when Rovo chat is unavailable', () => {
		jest.spyOn(useRovoChat, 'default').mockReturnValueOnce({
			isRovoChatEnabled: false,
			sendPromptMessage: sendPromptMessageMock,
		});

		setup();

		expect(screen.queryByTestId('embed-footer')).not.toBeInTheDocument();
	});
});
