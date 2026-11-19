import '@atlaskit/link-test-helpers/jest';
import React from 'react';

import { IntlProvider } from 'react-intl';

import AnalyticsListener from '@atlaskit/analytics-next/AnalyticsListener';
import { SmartCardProvider } from '@atlaskit/link-provider/smart-card-provider';
import { expValEquals } from '@atlaskit/tmp-editor-statsig/exp-val-equals';
import { screen } from '@atlassian/testing-library/screen';
import { render } from '@atlassian/testing-library/testing-library/react';
import { userEvent } from '@atlassian/testing-library/user-event';

import mockContext from '../../../../../../__fixtures__/flexible-ui-data-context';
import { closeEmbedModal } from '../../../../../../__tests__/__utils__/unit-helpers';
import { FlexibleCardContext } from '../../../../../../state/flexible-ui-context';
import { useFlexibleUiContext } from '../../../../../../state/flexible-ui-context/useFlexibleUiContext';
import * as useInvokeClientAction from '../../../../../../state/hooks/use-invoke-client-action';
import { ANALYTICS_CHANNEL } from '../../../../../../utils/analytics/analytics';
import type { InternalFlexibleUiOptions } from '../../../../types';
import PreviewAction from '../index';
import { type PreviewActionProps } from '../types';

jest.mock('../../../../../../state/flexible-ui-context/useFlexibleUiContext', () => ({
	...jest.requireActual('../../../../../../state/flexible-ui-context/useFlexibleUiContext'),
	useFlexibleUiContext: jest.fn().mockReturnValue(mockContext),
}));

// Mock the expValEquals function
jest.mock('@atlaskit/tmp-editor-statsig/exp-val-equals', () => ({
	expValEquals: jest.fn(),
}));

describe('PreviewAction', () => {
	const testId = 'smart-action-preview-action';

	const setup = (props?: Partial<PreviewActionProps>, ui?: InternalFlexibleUiOptions) => {
		const onEvent = jest.fn();
		const isDropdownItem = props?.as === 'dropdown-item' || props?.asDropDownItem;

		return render(<PreviewAction {...props} />, {
			wrapper: ({ children }) => (
				<SmartCardProvider>
					<AnalyticsListener onEvent={onEvent} channel={ANALYTICS_CHANNEL}>
						<IntlProvider locale="en">
							<FlexibleCardContext.Provider value={{ ui }}>
								{isDropdownItem ? <div role="menu">{children}</div> : children}
							</FlexibleCardContext.Provider>
						</IntlProvider>
					</AnalyticsListener>
				</SmartCardProvider>
			),
		});
	};

	const setContextWithPreviewPanel = (hasPreviewPanel: boolean) => {
		(useFlexibleUiContext as jest.Mock).mockReturnValue({
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
		jest.mocked(expValEquals).mockReturnValue(false);
		jest.mocked(useFlexibleUiContext).mockReturnValue(mockContext);
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

	it('should not render when no preview action data present', () => {
		(useFlexibleUiContext as jest.Mock).mockReturnValue({
			...mockContext,
			actions: {
				...mockContext.actions,
				PreviewAction: undefined,
			},
		});
		setup();

		expect(screen.queryByTestId(testId)).toBeNull();
	});

	it('should pass a11y check when icon label is empty', async () => {
		setContextWithPreviewPanel(false);

		const { container } = setup();
		await expect(container).toBeAccessible();
	});

	describe('with descriptive accessible names', () => {
		const title = 'Confluence & Jira Software are Better Together';

		it.each([
			{ experimentEnabled: false, hasPreviewPanel: false, content: 'Open preview' },
			{ experimentEnabled: true, hasPreviewPanel: false, content: 'Open preview modal' },
			{ experimentEnabled: true, hasPreviewPanel: true, content: 'Open preview panel' },
		])(
			'names the $content action for its resource',
			({ experimentEnabled, hasPreviewPanel, content }) => {
				jest.mocked(expValEquals).mockReturnValue(experimentEnabled);
				setContextWithPreviewPanel(hasPreviewPanel);
				setup();

				const button = screen.getByRole('button', { name: `${content} for Link title` });
				expect(button).toHaveAccessibleName(`${content} for Link title`);
				expect(button).toHaveTextContent(content);
			},
		);

		it.each([title, 'Team project overview', 'https://www.link-url.com'])(
			'uses the available resource title %s',
			(text) => {
				jest.mocked(useFlexibleUiContext).mockReturnValue({
					...mockContext,
					linkTitle: { text },
				});
				setup();

				expect(
					screen.getByRole('button', { name: `Open preview for ${text}` }),
				).toHaveAccessibleName(`Open preview for ${text}`);
			},
		);

		it.each([undefined, { text: undefined }, { text: '' }, { text: ' \n\t ' }])(
			'keeps the generic name when no usable title is available: %p',
			(linkTitle) => {
				jest.mocked(useFlexibleUiContext).mockReturnValue({ ...mockContext, linkTitle });
				setup();

				expect(screen.getByRole('button', { name: 'Open preview' })).toHaveAccessibleName(
					'Open preview',
				);
			},
		);

		it('updates the name when the resource title changes', () => {
			const { rerender } = setup();
			expect(
				screen.getByRole('button', { name: 'Open preview for Link title' }),
			).toBeInTheDocument();

			jest.mocked(useFlexibleUiContext).mockReturnValue({
				...mockContext,
				linkTitle: { text: title },
			});
			rerender(<PreviewAction />);

			expect(
				screen.getByRole('button', { name: `Open preview for ${title}` }),
			).toHaveAccessibleName(`Open preview for ${title}`);
		});

		it.each<{
			presentation: string;
			props?: Partial<PreviewActionProps>;
			role: 'button' | 'menuitem';
			ui?: InternalFlexibleUiOptions;
		}>([
			{ presentation: 'legacy button', role: 'button' },
			{ presentation: 'refreshed text button', role: 'button', ui: { hideLegacyButton: true } },
			{
				presentation: 'refreshed icon button',
				props: { content: '' },
				role: 'button',
				ui: { hideLegacyButton: true },
			},
			{ presentation: 'dropdown item', props: { as: 'dropdown-item' }, role: 'menuitem' },
			{ presentation: 'stack item', props: { as: 'stack-item' }, role: 'button' },
		])('keeps the descriptive name for a $presentation', ({ props, role, ui }) => {
			setup(props, ui);

			expect(screen.getByRole(role, { name: 'Open preview for Link title' })).toHaveAccessibleName(
				'Open preview for Link title',
			);
		});

		it('preserves a caller-supplied accessible name', () => {
			setup({ ariaLabel: 'Preview the project guide' });

			expect(
				screen.getByRole('button', { name: 'Preview the project guide' }),
			).toHaveAccessibleName('Preview the project guide');
		});

		it('keeps the existing icon-button tooltip', async () => {
			const user = userEvent.setup();
			setup({ content: '' }, { hideLegacyButton: true });

			await user.hover(screen.getByRole('button', { name: 'Open preview for Link title' }));

			expect(await screen.findByRole('tooltip')).toHaveTextContent('Open preview');
			expect(screen.getByRole('tooltip')).not.toHaveTextContent('Link title');
		});
	});
});
