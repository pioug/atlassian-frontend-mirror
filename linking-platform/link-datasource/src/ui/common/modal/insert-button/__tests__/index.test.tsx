import React from 'react';

import { render, screen } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import { IntlProvider } from 'react-intl-next';

import { AnalyticsListener } from '@atlaskit/analytics-next';
import { asMock } from '@atlaskit/link-test-helpers/jest';
import { ffTest } from '@atlassian/feature-flags-test-utils';

import { EVENT_CHANNEL } from '../../../../../analytics';
import { UserInteractionsProvider } from '../../../../../contexts/user-interactions';
import { useDatasourceContext } from '../../datasource-context';
import { useViewModeContext } from '../../mode-switcher/useViewModeContext';
import { InsertButton, type InsertButtonProps } from '../index';

jest.mock('../../datasource-context', () => ({
	useDatasourceContext: jest.fn(),
}));

jest.mock('../../mode-switcher/useViewModeContext', () => ({
	useViewModeContext: jest.fn(),
}));

const mockOnInsert = jest.fn();
const mockIsValidParameters = jest.fn().mockReturnValue(true);
const mockVisibleColumnCount = { current: 1 };

const getDefaultContextValue = () => ({
	datasourceId: 'test-datasource-id',
	parameters: { cloudId: 'test-cloud-id', jql: 'test-jql' },
	tableState: { status: 'resolved', totalCount: 10 },
	isValidParameters: mockIsValidParameters,
	visibleColumnCount: mockVisibleColumnCount,
	visibleColumnKeys: ['key1'],
	columnCustomSizes: undefined,
	wrappedColumnKeys: undefined,
	onInsert: mockOnInsert,
	setParameters: jest.fn(),
});

const getDefaultViewModeContextValue = () => ({
	currentViewMode: 'table' as const,
	setCurrentViewMode: jest.fn(),
	disableDisplayDropdown: false,
});

const setup = (
	propsOverride: Partial<InsertButtonProps<any>> = {},
	contextOverride: Partial<ReturnType<typeof getDefaultContextValue>> = {},
) => {
	const onAnalyticFireEvent = jest.fn();

	const contextValue = {
		...getDefaultContextValue(),
		...contextOverride,
	};

	asMock(useDatasourceContext).mockReturnValue(contextValue);
	asMock(useViewModeContext).mockReturnValue(getDefaultViewModeContextValue());

	const props: InsertButtonProps<any> = {
		getAnalyticsPayload: jest.fn().mockReturnValue({}),
		testId: 'test-insert-button',
		url: 'https://test.atlassian.net/issues',
		...propsOverride,
	};

	const component = render(
		<AnalyticsListener channel={EVENT_CHANNEL} onEvent={onAnalyticFireEvent}>
			<IntlProvider locale="en">
				<UserInteractionsProvider>
					<InsertButton {...props}>Insert</InsertButton>
				</UserInteractionsProvider>
			</IntlProvider>
		</AnalyticsListener>,
	);

	return {
		...component,
		onAnalyticFireEvent,
		props,
	};
};

describe('InsertButton', () => {
	const user = userEvent.setup({ delay: null });

	beforeEach(() => {
		jest.clearAllMocks();
		mockIsValidParameters.mockReturnValue(true);
	});

	it('should capture and report a11y violations', async () => {
		const { container } = setup();

		await expect(container).toBeAccessible();
	});

	it('should render the insert button', () => {
		setup();

		const button = screen.getByTestId('test-insert-button');
		expect(button).toBeInTheDocument();
		expect(button).toHaveTextContent('Insert');
	});

	it('should be disabled when isValidParameters returns false', () => {
		mockIsValidParameters.mockReturnValue(false);
		setup();

		const button = screen.getByTestId('test-insert-button');
		expect(button).toBeDisabled();
	});

	it('should be disabled when status is rejected', () => {
		setup({}, { tableState: { status: 'rejected', totalCount: 0 } });

		const button = screen.getByTestId('test-insert-button');
		expect(button).toBeDisabled();
	});

	it('should be disabled when status is unauthorized', () => {
		setup({}, { tableState: { status: 'unauthorized', totalCount: 0 } });

		const button = screen.getByTestId('test-insert-button');
		expect(button).toBeDisabled();
	});

	it('should be disabled when status is loading', () => {
		setup({}, { tableState: { status: 'loading', totalCount: 0 } });

		const button = screen.getByTestId('test-insert-button');
		expect(button).toBeDisabled();
	});

	it('should be enabled when all conditions are met', () => {
		setup();

		const button = screen.getByTestId('test-insert-button');
		expect(button).not.toBeDisabled();
	});

	it('should call onInsert when clicked', async () => {
		setup();

		const button = screen.getByTestId('test-insert-button');
		await user.click(button);

		expect(mockOnInsert).toHaveBeenCalled();
	});

	describe('navx-1345-issues-modal-jql-submit-fix feature flag', () => {
		ffTest.on(
			'navx-1345-issues-modal-jql-submit-fix',
			'hasErrors behavior when feature flag is ON',
			() => {
				it('should disable the button when hasErrors is true', () => {
					setup({ hasErrors: true });

					const button = screen.getByTestId('test-insert-button');
					expect(button).toBeDisabled();
				});

				it('should not disable the button when hasErrors is false', () => {
					setup({ hasErrors: false });

					const button = screen.getByTestId('test-insert-button');
					expect(button).not.toBeDisabled();
				});

				it('should not disable the button when hasErrors is undefined', () => {
					setup({ hasErrors: undefined });

					const button = screen.getByTestId('test-insert-button');
					expect(button).not.toBeDisabled();
				});

				it('should call onBeforeInsert when insert button is clicked', async () => {
					const mockOnBeforeInsert = jest.fn();
					setup({ onBeforeInsert: mockOnBeforeInsert });

					const button = screen.getByTestId('test-insert-button');
					await user.click(button);

					expect(mockOnBeforeInsert).toHaveBeenCalledWith({
						cloudId: 'test-cloud-id',
						jql: 'test-jql',
					});
				});
			},
		);

		ffTest.off(
			'navx-1345-issues-modal-jql-submit-fix',
			'hasErrors behavior when feature flag is OFF',
			() => {
				it('should not disable the button when hasErrors is true (flag off)', () => {
					setup({ hasErrors: true });

					const button = screen.getByTestId('test-insert-button');
					expect(button).not.toBeDisabled();
				});

				it('should not disable the button when hasErrors is false', () => {
					setup({ hasErrors: false });

					const button = screen.getByTestId('test-insert-button');
					expect(button).not.toBeDisabled();
				});

				it('should not disable the button when hasErrors is undefined', () => {
					setup({ hasErrors: undefined });

					const button = screen.getByTestId('test-insert-button');
					expect(button).not.toBeDisabled();
				});

				it('should not call onBeforeInsert when insert button is clicked', async () => {
					const mockOnBeforeInsert = jest.fn();
					setup({ onBeforeInsert: mockOnBeforeInsert });

					const button = screen.getByTestId('test-insert-button');
					await user.click(button);

					expect(mockOnBeforeInsert).not.toHaveBeenCalled();
				});
			},
		);
	});
});
