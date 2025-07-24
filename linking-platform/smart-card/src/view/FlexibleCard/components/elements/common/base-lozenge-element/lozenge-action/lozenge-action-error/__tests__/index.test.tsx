import React from 'react';

import { render, screen } from '@testing-library/react';
import { IntlProvider } from 'react-intl-next';

import FabricAnalyticsListeners, { type AnalyticsWebClient } from '@atlaskit/analytics-listeners';
import DropdownMenu from '@atlaskit/dropdown-menu';

import { ActionName } from '../../../../../../../../../index';
import * as useInvokeClientAction from '../../../../../../../../../state/hooks/use-invoke-client-action';
import * as useResolve from '../../../../../../../../../state/hooks/use-resolve';
import LozengeActionError from '../index';
import { LozengeActionErrorMessages, type LozengeActionErrorProps } from '../types';

describe('LozengeActionError', () => {
	const testId = 'test-smart-element-lozenge-dropdown';
	const TEXT_ERROR_MESSAGE = 'Field "root cause" must be filled out before status change';
	const MESSAGE_PROP_ERROR_MESSAGE = LozengeActionErrorMessages.noData;
	const MAX_LINE_NUMBER = 20;
	const url = 'https://linchen.jira-dev.com/browse/AT-1';
	const mockAnalyticsClient = {
		sendUIEvent: jest.fn().mockResolvedValue(undefined),
		sendOperationalEvent: jest.fn().mockResolvedValue(undefined),
		sendTrackEvent: jest.fn().mockResolvedValue(undefined),
		sendScreenEvent: jest.fn().mockResolvedValue(undefined),
	} satisfies AnalyticsWebClient;

	const renderComponent = (props: LozengeActionErrorProps, mockResolve = jest.fn()) => {
		jest.spyOn(useResolve, 'default').mockReturnValue(mockResolve);

		return render(
			<FabricAnalyticsListeners client={mockAnalyticsClient}>
				<IntlProvider locale="en">
					<DropdownMenu trigger="open menu">
						<LozengeActionError testId={testId} {...props} />
					</DropdownMenu>
				</IntlProvider>
			</FabricAnalyticsListeners>,
		);
	};

	afterEach(() => {
		jest.clearAllMocks();
	});

	it('renders component correctly when provided a text errorMessage & a preview action is available', async () => {
		renderComponent({
			errorMessage: TEXT_ERROR_MESSAGE,
			url,
			invokePreviewAction: { actionFn: jest.fn(), actionType: ActionName.PreviewAction },
		});

		const dropdownMenu = await screen.findByText('open menu');
		dropdownMenu.click();

		// make sure icon is loaded
		const icon = await screen.findByTestId(`${testId}-icon`);
		expect(icon).toBeDefined();

		// make sure error text is correct
		const errorMessage = await screen.findByTestId(`${testId}-error-message`);
		expect(errorMessage).toBeDefined();
		expect(errorMessage).toHaveTextContent(TEXT_ERROR_MESSAGE);
		expect(errorMessage).toHaveCompiledCss('-webkit-line-clamp', '8');

		// make sure an error link is present
		const link = await screen.findByTestId(`${testId}-open-embed`);
		expect(link).toBeDefined();
		expect(link).toHaveTextContent('Open issue in Jira');
	});

	it('does not render preview modal link if a preview action is not available', async () => {
		renderComponent({
			errorMessage: TEXT_ERROR_MESSAGE,
		});

		const dropdownMenu = await screen.findByText('open menu');
		dropdownMenu.click();

		// make sure icon is loaded
		const icon = await screen.findByTestId(`${testId}-icon`);
		expect(icon).toBeDefined();

		// make sure error text is correct
		const errorMessage = await screen.findByTestId(`${testId}-error-message`);
		expect(errorMessage).toBeDefined();
		expect(errorMessage).toHaveTextContent(TEXT_ERROR_MESSAGE);
		expect(errorMessage).toHaveCompiledCss('-webkit-line-clamp', '8');

		// make sure an error link is not present
		const link = screen.queryByTestId(`${testId}-open-embed`);
		expect(link).toBeNull();
	});

	it('renders component correctly when provided a MessageProps errorMessage', async () => {
		renderComponent({
			errorMessage: MESSAGE_PROP_ERROR_MESSAGE,
		});

		const dropdownMenu = await screen.findByText('open menu');
		dropdownMenu.click();

		// make sure icon is loaded
		const icon = await screen.findByTestId(`${testId}-icon`);
		expect(icon).toBeDefined();

		// make sure error text is correct
		const errorMessage = await screen.findByTestId(`${testId}-error-message`);
		expect(errorMessage).toBeDefined();
		expect(errorMessage.textContent).toEqual(MESSAGE_PROP_ERROR_MESSAGE.descriptor.defaultMessage);
		expect(errorMessage).toHaveCompiledCss('-webkit-line-clamp', '8');
	});

	it('renders with a specific maxLineNumber', async () => {
		renderComponent({
			errorMessage: TEXT_ERROR_MESSAGE,
			maxLineNumber: MAX_LINE_NUMBER,
		});

		const dropdownMenu = await screen.findByText('open menu');
		dropdownMenu.click();

		// make sure icon is loaded
		const icon = await screen.findByTestId(`${testId}-icon`);
		expect(icon).toBeDefined();

		// make sure error text is correct
		const errorMessage = await screen.findByTestId(`${testId}-error-message`);
		expect(errorMessage).toBeDefined();
		expect(errorMessage).toHaveTextContent(TEXT_ERROR_MESSAGE);
		expect(errorMessage).toHaveCompiledCss('-webkit-line-clamp', MAX_LINE_NUMBER.toString());
	});

	it('invokes preview action', async () => {
		const invoke = jest.fn();
		const spy = jest.spyOn(useInvokeClientAction, 'default').mockReturnValue(invoke);

		renderComponent({
			errorMessage: TEXT_ERROR_MESSAGE,
			invokePreviewAction: { actionFn: jest.fn(), actionType: ActionName.PreviewAction },
			url,
		});

		const dropdownMenu = await screen.findByText('open menu');
		dropdownMenu.click();

		// make sure an error link is present
		const link = await screen.findByTestId(`${testId}-open-embed`);
		expect(link).toBeDefined();
		expect(link).toHaveTextContent('Open issue in Jira');

		link.click();

		expect(invoke).toHaveBeenCalledTimes(1);

		spy.mockRestore();
	});
	it('should capture and report a11y violations', async () => {
		const { container } = renderComponent({
			errorMessage: TEXT_ERROR_MESSAGE,
			invokePreviewAction: { actionFn: jest.fn(), actionType: ActionName.PreviewAction },
			url,
		});
		await expect(container).toBeAccessible();
	});
});
