import React from 'react';

import { IntlProvider } from 'react-intl';

import { render, screen, userEvent } from '@atlassian/testing-library';

import { ActionName, CardDisplay } from '../../../../../constants';
import * as useInvokeClientAction from '../../../../../state/hooks/use-invoke-client-action';
import * as useRovoChat from '../../../../../state/hooks/use-rovo-chat';
import { RovoChatPromptKey } from '../../../../common/rovo-chat-utils';
import EmbedRovoActionsFooter from '../index';

let mockObservedWidth: number | undefined;

jest.mock('@atlaskit/width-detector', () => {
	const React = require('react');

	return {
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
