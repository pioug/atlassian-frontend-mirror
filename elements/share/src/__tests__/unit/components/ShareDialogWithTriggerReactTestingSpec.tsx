import React from 'react';

import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { IntlProvider, type IntlShape, type WrappedComponentProps } from 'react-intl-next';

import { ShareDialogWithTriggerInternal } from '../../../components/ShareDialogWithTrigger';
import { type ShareDialogWithTriggerProps } from '../../../types';
import mockPopper from '../_mockPopper';

// disable lazy-load component in testing.
jest.mock('../../../components/LazyShareForm/lazy', () => {
	return jest.requireActual('../../../components/LazyShareForm/LazyShareForm');
});

mockPopper();

const mockFormatMessage = (descriptor: any) => descriptor.defaultMessage;
const mockIntl = { formatMessage: mockFormatMessage };

jest.mock('react-intl-next', () => {
	return {
		...(jest.requireActual('react-intl-next') as any),
		FormattedMessage: (descriptor: any) => <span>{descriptor.defaultMessage}</span>,
		injectIntl: (Node: any) => (props: any) => <Node {...props} intl={mockIntl} />,
	};
});

const mockIntlProps: WrappedComponentProps = {
	intl: { formatMessage: mockFormatMessage } as unknown as IntlShape,
};

describe('ShareDialogWithTrigger', () => {
	let mockCreateAnalyticsEvent: jest.Mock;
	let mockOnShareSubmit: jest.Mock = jest.fn();
	const mockLoadOptions = () => [];
	const mockShowFlags: jest.Mock = jest.fn();
	const mockOnDialogOpen: jest.Mock = jest.fn();
	const mockOnDialogClose: jest.Mock = jest.fn();
	const mockOnTriggerButtonClick: jest.Mock = jest.fn();

	let defaultProps: ShareDialogWithTriggerProps &
		WrappedComponentProps & { createAnalyticsEvent: any };

	beforeEach(() => {
		mockOnTriggerButtonClick.mockReset();
		mockOnDialogOpen.mockReset();
		mockOnDialogClose.mockReset();
		mockOnShareSubmit.mockReset();
		mockShowFlags.mockReset();

		// @ts-ignore This violated type definition upgrade of @types/jest to v24.0.18 & ts-jest v24.1.0.
		//See BUILDTOOLS-210-clean: https://bitbucket.org/atlassian/atlaskit-mk-2/pull-requests/7178/buildtools-210-clean/diff
		mockCreateAnalyticsEvent = jest.fn<{}>().mockReturnValue({
			fire: jest.fn(),
		});

		defaultProps = {
			cloudId: 'test-cloud-id',
			shareAri: 'test-share-ari',
			copyLink: 'copyLink',
			loadUserOptions: mockLoadOptions,
			onTriggerButtonClick: mockOnTriggerButtonClick,
			onDialogOpen: mockOnDialogOpen,
			onDialogClose: mockOnDialogClose,
			onShareSubmit: mockOnShareSubmit,
			shareContentType: 'page',
			showFlags: mockShowFlags,
			createAnalyticsEvent: mockCreateAnalyticsEvent,
			product: 'confluence',
			...mockIntlProps,
		};
	});

	describe('Share error handling', () => {
		it('should set errors on share fail and clear them on recipient change', async () => {
			// @ts-ignore This violated type definition upgrade of @types/jest to v24.0.18 & ts-jest v24.1.0.
			//See BUILDTOOLS-210-clean: https://bitbucket.org/atlassian/atlaskit-mk-2/pull-requests/7178/buildtools-210-clean/diff
			const mockOnSubmit = jest.fn<{}>().mockRejectedValue({
				code: 403,
				reason: 'Forbidden',
				body: Promise.resolve({
					status: 403,
					messages: ['Not allowed'],
					messagesDetails: [
						{
							message: 'Not allowed',
							errorCode: 'example-error-code',
							helpUrl: 'https://example.com',
						},
					],
				}),
			});

			const props: ShareDialogWithTriggerProps & WrappedComponentProps = {
				...defaultProps,
				onShareSubmit: mockOnSubmit,
			};

			render(
				<IntlProvider messages={{}} locale="en">
					<ShareDialogWithTriggerInternal {...props} />
				</IntlProvider>,
			);

			const user = userEvent.setup();

			await user.click(screen.getByRole('button', { name: 'Share' }));
			await user.click(screen.getByRole('combobox'));
			await user.keyboard('test@test.com[Enter]');

			// There are two "Share" buttons -- one to expand the dialog, one to submit the form
			// We want the second one, to submit the form.
			await user.click(screen.getAllByRole('button', { name: 'Share' })[1]);

			expect(screen.getByText('Not allowed')).not.toBeUndefined();

			await user.click(screen.getByTestId('show-clear-icon'));
			expect(screen.queryByText('Not allowed')).toBeNull();
		});
	});
});
