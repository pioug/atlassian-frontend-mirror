import React from 'react';

import { SmartCardProvider, type CardProviderStoreOpts } from '@atlaskit/link-provider';
import { renderWithIntl } from '@atlaskit/link-test-helpers';
import { eeTest } from '@atlaskit/tmp-editor-statsig/editor-experiments-test-utils';
import { ffTest } from '@atlassian/feature-flags-test-utils';
import { screen } from '@atlassian/testing-library';

import extractRovoChatAction from '../../../extractors/flexible/actions/extract-rovo-chat-action';
import EmbedRovoActionsFooter from '../components/rovo-actions-footer';

import { EmbedCardResolvedView, type EmbedCardResolvedViewProps } from './ResolvedView';

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

const setup = (extraProps?: Partial<EmbedCardResolvedViewProps>) => {
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

	ffTest.on('platform_sl_3p_auth_rovo_embed_footer_kill_switch', '', () => {
		eeTest
			.describe('platform_sl_3p_auth_rovo_embed_footer_exp', 'embed footer resolved view')
			.variant(true, () => {
				it('renders Rovo actions footer when the embed footer experiment resolves action data', async () => {
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
							isEmbedRovoActionsFooterExperimentEnabled: true,
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
			});
	});

	ffTest.off('platform_sl_3p_auth_rovo_embed_footer_kill_switch', '', () => {
		eeTest
			.describe('platform_sl_3p_auth_rovo_embed_footer_exp', 'embed footer resolved view')
			.variant(true, () => {
				it('does not render Rovo actions footer when the kill switch is disabled', () => {
					setup({ details: { meta: { key: 'google-object-provider' } } as never });

					expect(screen.queryByTestId('mock-footer')).not.toBeInTheDocument();
					expect(mockExtractRovoChatAction).not.toHaveBeenCalled();
				});
			});
	});
});
