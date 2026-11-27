import React from 'react';

import { SmartCardProvider } from '@atlaskit/link-provider/smart-card-provider';
import type { CardProviderStoreOpts } from '@atlaskit/link-provider/types';
import { renderWithIntl } from '@atlaskit/link-test-helpers/react-testing-library';
import { mockExpEnabled } from '@atlassian/experiment-test-utils/mock-exp-enabled';
import { passGate } from '@atlassian/feature-flags-test-utils/mock-gates';
import { screen } from '@atlassian/testing-library/screen';

import extractRovoChatAction from '../../../extractors/flexible/actions/extract-rovo-chat-action';
import { isRemixActionEnabled } from '../../../utils/is-remix-action-enabled';
import EmbedRovoActionsFooter from '../components/rovo-actions-footer';
import { EmbedCardResolvedView, type EmbedCardResolvedViewProps } from './ResolvedView';

jest.mock('../../../utils/is-remix-action-enabled', () => {
	const actual = jest.requireActual('../../../utils/is-remix-action-enabled');
	return {
		isRemixActionEnabled: jest.fn(actual.isRemixActionEnabled),
	};
});

const mockIsRemixActionEnabled = jest.mocked(isRemixActionEnabled);

const mockAppearanceTestId = 'mocked-appearance-test-id';
jest.mock('../components/ImageIcon', () => ({
	...jest.requireActual('../components/ImageIcon'),
	ImageIcon: jest.fn((props) => {
		const Component = jest.requireActual('../components/ImageIcon').ImageIcon;
		return (
			<>
				<div data-testid={mockAppearanceTestId}>{props.appearance || 'no-appearance'}</div>
				<Component {...props} />
			</>
		);
	}),
}));

jest.mock('../../../extractors/flexible/actions/extract-rovo-chat-action');
jest.mock('../components/rovo-actions-footer', () =>
	jest.fn(() => <div data-testid="mock-footer" />),
);

const mockExtractRovoChatAction = jest.mocked(extractRovoChatAction);
const mockEmbedRovoActionsFooter = jest.mocked(EmbedRovoActionsFooter);

const defaultLink = 'http://atlassian.com';
const enabledRovoOptions = { isRovoEnabled: true, isRovoLLMEnabled: true };

const setup = (
	extraProps?: Partial<EmbedCardResolvedViewProps>,
	plugins?: React.ComponentProps<typeof SmartCardProvider>['plugins'],
) => {
	const link = extraProps?.link ?? defaultLink;
	const storeOptions: CardProviderStoreOpts | undefined = extraProps?.details
		? {
				initialState: {
					[link]: {
						details: extraProps.details,
						status: 'resolved' as const,
					},
				},
			}
		: undefined;

	return renderWithIntl(
		<SmartCardProvider
			plugins={plugins}
			product="CONFLUENCE"
			rovoOptions={enabledRovoOptions}
			storeOptions={storeOptions}
		>
			<EmbedCardResolvedView
				link={link}
				context={{ icon: 'icon-url', text: 'abc' }}
				{...extraProps}
			/>
		</SmartCardProvider>,
	);
};

describe('EmbedCardResolvedView', () => {
	beforeEach(() => {
		mockExtractRovoChatAction.mockReset();
		mockEmbedRovoActionsFooter.mockClear();
		mockIsRemixActionEnabled.mockClear();
		mockExtractRovoChatAction.mockReturnValue(undefined);
	});

	it('should capture and report a11y violations', async () => {
		const { container } = setup();
		await expect(container).toBeAccessible();
	});

	it('should render square icon', () => {
		setup();

		expect(screen.getByTestId(mockAppearanceTestId)).toHaveTextContent('square');
	});

	it('should render round icon', () => {
		setup({ type: ['Document', 'Profile'] });

		expect(screen.getByTestId(mockAppearanceTestId)).toHaveTextContent('round');
	});

	it('renders Rovo actions footer when the embed footer resolves action data', async () => {
		const actionOptions = { hide: false, rovoChatAction: { optIn: true } };
		const actionData = {
			actionFn: jest.fn(),
			providerKey: 'google-object-provider',
		};
		const details = {
			meta: { key: 'google-object-provider' },
			data: { '@type': ['schema:DigitalDocument'] },
		};

		mockExtractRovoChatAction.mockReturnValue(actionData as never);

		setup({ actionOptions, details: details as never, link: 'https://example.com/doc' });

		await screen.findByTestId('mock-footer');
		expect(mockExtractRovoChatAction).toHaveBeenCalledWith(
			expect.objectContaining({
				appearance: 'embed',
				actionOptions,
				response: details,
			}),
		);
		expect(mockEmbedRovoActionsFooter).toHaveBeenCalledWith(
			expect.objectContaining({
				actionData,
				prompts: expect.any(Array),
				testId: 'embed-card-resolved-view-rovo-actions-footer',
			}),
			{},
		);
	});

	it('does not offer Remix when the surface has not opted in', () => {
		passGate('platform_sl_3p_auth_visualize_killswitch');
		mockExpEnabled('platform_sl_3p_auth_visualize_exp');
		const details = {
			meta: { key: 'google-object-provider' },
			data: { '@type': ['Document', 'schema:SpreadsheetDigitalDocument'] },
		};

		setup(
			{
				actionOptions: { hide: false, rovoChatAction: { optIn: true } },
				details: details as never,
				link: 'https://docs.google.com/spreadsheets/d/example/edit',
			},
			{ resolve: () => ({ remix: { isAvailable: () => true, open: jest.fn() } }) },
		);

		expect(mockIsRemixActionEnabled).not.toHaveBeenCalled();
		expect(screen.queryByTestId('mock-footer')).not.toBeInTheDocument();
	});
});
