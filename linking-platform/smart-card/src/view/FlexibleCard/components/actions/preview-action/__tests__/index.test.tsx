import '@atlaskit/link-test-helpers/jest';

import React from 'react';

import { IntlProvider } from 'react-intl';

import { AnalyticsListener } from '@atlaskit/analytics-next';
import { SmartCardProvider } from '@atlaskit/link-provider';
import { render, screen, userEvent } from '@atlassian/testing-library';

import mockContext from '../../../../../../__fixtures__/flexible-ui-data-context';
import { closeEmbedModal } from '../../../../../../__tests__/__utils__/unit-helpers';
import * as flexibleUiContextModule from '../../../../../../state/flexible-ui-context';
import * as useInvokeClientAction from '../../../../../../state/hooks/use-invoke-client-action';
import { ANALYTICS_CHANNEL } from '../../../../../../utils/analytics';
import PreviewAction from '../index';
import { type PreviewActionProps } from '../types';

jest.mock('../../../../../../state/flexible-ui-context', () => ({
	...jest.requireActual('../../../../../../state/flexible-ui-context'),
	useFlexibleUiContext: jest.fn().mockReturnValue(mockContext),
}));

// Mock the expValEquals function
jest.mock('@atlaskit/tmp-editor-statsig/exp-val-equals', () => ({
	expValEquals: jest.fn(),
}));

describe('PreviewAction', () => {
	const testId = 'smart-action-preview-action';

	const setup = (props?: Partial<PreviewActionProps>) => {
		const onEvent = jest.fn();

		return render(
			<SmartCardProvider>
				<AnalyticsListener onEvent={onEvent} channel={ANALYTICS_CHANNEL}>
					<IntlProvider locale="en">
						<PreviewAction {...props} />
					</IntlProvider>
				</AnalyticsListener>
			</SmartCardProvider>,
		);
	};

	const setContextWithPreviewPanel = (hasPreviewPanel: boolean) => {
		(flexibleUiContextModule.useFlexibleUiContext as jest.Mock).mockReturnValue({
			...mockContext,
			actions: {
				...(mockContext as any).actions,
				PreviewAction: {
					...(mockContext as any).actions.PreviewAction,
					hasPreviewPanel,
				},
			},
		});
	};

	beforeEach(() => {
		// Reset the mock to default behavior (experiment disabled)
		const { expValEquals } = require('@atlaskit/tmp-editor-statsig/exp-val-equals');
		expValEquals.mockReturnValue(false);
	});

	it('renders action', async () => {
		setup();
		const element = await screen.findByTestId(testId);
		expect(element).toBeInTheDocument();
		expect(element).toHaveTextContent('Open preview');
	});

	it('invokes action', async () => {
		const invoke = jest.fn();
		const spy = jest.spyOn(useInvokeClientAction, 'default').mockReturnValue(invoke);
		const event = userEvent.setup();

		setup();

		const element = await screen.findByTestId(testId);
		await event.click(element);

		expect(invoke).toHaveBeenCalledTimes(1);

		spy.mockRestore();

		await closeEmbedModal(event);
	});

	describe('with tooltip', () => {
		it('renders tooltip', async () => {
			const user = userEvent.setup();
			setup();

			const element = await screen.findByTestId(testId);
			await user.hover(element);

			const tooltip = await screen.findByRole('tooltip');
			expect(tooltip).toHaveTextContent('Open preview');
		});

		it('renders stack item tooltip', async () => {
			const user = userEvent.setup();
			setup({ as: 'stack-item' });

			const element = await screen.findByTestId(testId);
			await user.hover(element);

			const tooltip = await screen.findByRole('tooltip');
			expect(tooltip).toHaveTextContent('Open a full screen preview of this link');
		});
	});

	it('should render modal variant when hasPreviewPanel is false', async () => {
		setContextWithPreviewPanel(false);
		setup();

		const element = await screen.findByTestId(testId);
		expect(element).toHaveTextContent('Open preview');
		// button has aria-label for a11y; icon is decorative (empty label)
		expect(element).toHaveAttribute('aria-label', 'Open preview');
	});

	it('should render panel variant when hasPreviewPanel is true', async () => {
		// Enable the experiment for this test
		const { expValEquals } = require('@atlaskit/tmp-editor-statsig/exp-val-equals');
		expValEquals.mockReturnValue(true);
		setContextWithPreviewPanel(true);
		setup();

		const element = await screen.findByTestId(testId);
		expect(element).toHaveTextContent('Open preview panel');
		// button has aria-label for a11y; icon is decorative (empty label)
		expect(element).toHaveAttribute('aria-label', 'Open preview panel');
	});

	it('should not render when no preview action data present', () => {
		(flexibleUiContextModule.useFlexibleUiContext as jest.Mock).mockReturnValue({
			...mockContext,
			actions: {
				...mockContext.actions,
				PreviewAction: undefined,
			},
		});
		setup();

		expect(screen.queryByTestId(testId)).toBeNull();
	});

	it('should render modal icon without aria-label when flag is enabled', async () => {
		setContextWithPreviewPanel(false);
		setup();
		const element = await screen.findByTestId(testId);
		expect(element).toBeInTheDocument();
		expect(element).toHaveTextContent('Open preview');
		// button has aria-label for a11y; icon is decorative (empty label)
		expect(element).toHaveAttribute('aria-label', 'Open preview');
	});

	it('should pass a11y check when icon label is empty', async () => {
		setContextWithPreviewPanel(false);

		const { container } = setup();
		await expect(container).toBeAccessible();
	});
});
