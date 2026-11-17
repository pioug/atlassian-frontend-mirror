import React from 'react';

import { ErrorBoundary } from 'react-error-boundary';
import { IntlProvider } from 'react-intl';

import { SmartCardProvider } from '@atlaskit/link-provider/smart-card-provider';
import {
	ResolvedClient,
	ResolvedClientUrl,
} from '@atlaskit/link-test-helpers/smart-card/mocks/clients';
import { Box } from '@atlaskit/primitives/compiled/box';
import { failGate, passGate } from '@atlassian/feature-flags-test-utils/mock-gates';
import { screen } from '@atlassian/testing-library/screen';
import { render } from '@atlassian/testing-library/testing-library/react';

import { useAnalyticsEvents } from '../../../../common/analytics/generated/use-analytics-events';
import { failUfoExperience } from '../../../../state/analytics/failUfoExperience';
import { startUfoExperience } from '../../../../state/analytics/startUfoExperience';
import { getSmartLinkAnalyticsContext } from '../../../../utils/analytics/getSmartLinkAnalyticsContext';
import type { CardProps } from '../../../Card';
import { CardWithUrlContent } from '../../component';
import type { CardWithUrlContentProps } from '../../types';
import CardErrorBoundary from '../index';

jest.mock('../../../../common/analytics/generated/use-analytics-events', () => ({
	useAnalyticsEvents: jest.fn(() => ({ fireEvent: jest.fn() })),
}));
jest.mock('../../../../utils/analytics/getSmartLinkAnalyticsContext', () => ({
	getSmartLinkAnalyticsContext: jest.fn(),
}));
jest.mock('../../../../state/analytics/startUfoExperience', () => ({
	startUfoExperience: jest.fn(),
}));
jest.mock('../../../../state/analytics/failUfoExperience', () => ({
	failUfoExperience: jest.fn(),
}));

describe('CardErrorBoundary', () => {
	const setup = (props?: Partial<CardProps>) => {
		const onEvent = jest.fn();

		const cardProps: CardWithUrlContentProps = {
			appearance: 'inline',
			id: 'uid',
			onResolve: () => {
				throw new Error('unexpected error');
			},
			url: ResolvedClientUrl,
			...props,
		};

		const renderResult = render(
			<CardErrorBoundary {...cardProps}>
				<CardWithUrlContent {...cardProps} />
			</CardErrorBoundary>,
			{
				wrapper: ({ children }) => (
					<IntlProvider locale="en">
						<SmartCardProvider client={new ResolvedClient()}>{children}</SmartCardProvider>
					</IntlProvider>
				),
			},
		);

		return { ...renderResult, onEvent };
	};

	describe('diagnostic error containment', () => {
		const fireDiagnosticEvent = jest.fn();
		const contextMock = jest.mocked(getSmartLinkAnalyticsContext);
		const startMock = jest.mocked(startUfoExperience);
		const failMock = jest.mocked(failUfoExperience);

		beforeEach(() => {
			contextMock.mockReset();
			startMock.mockReset();
			failMock.mockReset();
			fireDiagnosticEvent.mockReset();
			jest.mocked(useAnalyticsEvents).mockReturnValue({ fireEvent: fireDiagnosticEvent });
			jest.spyOn(console, 'error').mockImplementation(() => {});
		});

		afterEach(() => {
			jest.restoreAllMocks();
		});

		const renderFailure = (error: unknown) => {
			const onParentError = jest.fn();
			const onError = jest.fn();
			const ThrowingChild = (): React.JSX.Element => {
				throw error;
			};
			render(
				<ErrorBoundary fallback={<span>Parent fallback</span>} onError={onParentError}>
					<span>Surrounding content</span>
					<CardErrorBoundary
						appearance="inline"
						id="uid"
						url={ResolvedClientUrl}
						onError={onError}
						fallbackComponent={() => <span>Card fallback</span>}
					>
						<ThrowingChild />
					</CardErrorBoundary>
				</ErrorBoundary>,
			);
			return { onParentError, onError };
		};

		const expectContained = async (error: unknown) => {
			const { onParentError, onError } = renderFailure(error);
			expect(await screen.findByText('Card fallback')).toBeVisible();
			expect(screen.getByText('Surrounding content')).toBeVisible();
			expect(screen.queryByText('Parent fallback')).not.toBeInTheDocument();
			expect(onParentError).not.toHaveBeenCalled();
			expect(onError).not.toHaveBeenCalled();
		};

		it.each([
			['context extraction', () => contextMock],
			['UFO start', () => startMock],
			['UFO failure', () => failMock],
			['event dispatch', () => fireDiagnosticEvent],
		] as const)('should contain failures from %s', async (_, getMock) => {
			passGate('platform_smartlink_cardssr_missing_events');
			const diagnosticMock = getMock();
			diagnosticMock.mockImplementation(() => {
				throw new Error('diagnostics failed');
			});

			await expectContained(new Error('original render failure'));
			expect(diagnosticMock).toHaveBeenCalled();
		});

		it('should contain chunk-load event dispatch failures', async () => {
			passGate('platform_smartlink_cardssr_missing_events');
			fireDiagnosticEvent.mockImplementation(() => {
				throw new Error('diagnostics failed');
			});

			await expectContained(Object.assign(new Error('chunk failure'), { name: 'ChunkLoadError' }));
			expect(fireDiagnosticEvent).toHaveBeenCalledWith(
				'operational.smartLink.chunkLoadFailed',
				expect.any(Object),
			);
		});

		it.each([undefined, null, 'render failure'])(
			'should contain non-Error value %p',
			async (error) => {
				passGate('platform_smartlink_cardssr_missing_events');
				await expectContained(error);
				expect(fireDiagnosticEvent).toHaveBeenCalledWith(
					'ui.smartLink.renderFailed',
					expect.objectContaining({ error }),
				);
			},
		);

		it('should skip all diagnostics for APIError', async () => {
			passGate('platform_smartlink_cardssr_missing_events');
			await expectContained(Object.assign(new Error('unsupported URL'), { name: 'APIError' }));
			expect(contextMock).not.toHaveBeenCalled();
			expect(startMock).not.toHaveBeenCalled();
			expect(failMock).not.toHaveBeenCalled();
			expect(fireDiagnosticEvent).not.toHaveBeenCalled();
		});

		it('should preserve local fallback without diagnostics when gate is off', async () => {
			failGate('platform_smartlink_cardssr_missing_events');
			await expectContained(new Error('original render failure'));
			expect(contextMock).not.toHaveBeenCalled();
			expect(fireDiagnosticEvent).not.toHaveBeenCalled();
		});
	});

	it('should capture and report a11y violations', async () => {
		const { container } = setup();
		await expect(container).toBeAccessible();
	});

	it('should render default fallback component', async () => {
		setup();
		const fallback = await screen.findByTestId('lazy-render-placeholder');
		expect(fallback).toBeInTheDocument();
	});

	it('should render custom fallback component', async () => {
		setup({
			fallbackComponent: () => <Box>Hello I am fallback component</Box>,
		});
		const fallback = await screen.findByText('Hello I am fallback component');
		expect(fallback).toBeInTheDocument();
	});
});
