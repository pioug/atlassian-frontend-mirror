import React from 'react';

import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { mount, type ReactWrapper, shallow, type ShallowWrapper } from 'enzyme';
import {
	FormattedMessage,
	IntlProvider,
	type IntlShape,
	type WrappedComponentProps,
} from 'react-intl-next';

import WorldIcon from '@atlaskit/icon/core/globe';
import Popup from '@atlaskit/popup';
import { type Props as SmartUserPickerProps } from '@atlaskit/smart-user-picker';
import { layers } from '@atlaskit/theme/constants';
import Aktooltip from '@atlaskit/tooltip';
// AFP-2532 TODO: Fix automatic suppressions below
// eslint-disable-next-line @atlassian/tangerine/import/entry-points

import ShareButton, { type Props as ShareButtonProps } from '../../../components/ShareButton';
import {
	defaultShareContentState,
	IconShare,
	ShareDialogWithTriggerInternalLegacy as ShareDialogWithTriggerInternal,
} from '../../../components/ShareDialogWithTrigger';
import { ShareForm } from '../../../components/ShareForm';
import SplitButton from '../../../components/SplitButton';
import { messages } from '../../../i18n';
import {
	type DialogPlacement,
	OBJECT_SHARED,
	type RenderCustomTriggerButton,
	type ShareData,
	type ShareDialogWithTriggerProps,
	type ShareDialogWithTriggerStates,
	type TooltipPosition,
} from '../../../types';
import mockPopper from '../_mockPopper';
import { type PropsOf } from '../_testUtils';

// disable lazy-load component in testing.
jest.mock('../../../components/LazyShareForm/lazy', () => {
	return jest.requireActual('../../../components/LazyShareForm/LazyShareForm');
});

// Mock feature flags
jest.mock('@atlaskit/platform-feature-flags', () => ({
	fg: jest.fn(),
}));

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

type ProductAttributes = SmartUserPickerProps['productAttributes'];

const mockIntlProps: WrappedComponentProps = {
	intl: { formatMessage: mockFormatMessage } as unknown as IntlShape,
};

const renderDialogContent = (wrapper: any) => {
	const popup = wrapper.find(Popup);

	let contentProp = popup.prop('content');
	// skip first div
	contentProp = contentProp().props.children;

	return mount(
		<IntlProvider messages={{}} locale="en">
			{contentProp}
		</IntlProvider>,
	);
};

describe('ShareDialogWithTrigger', () => {
	let mockCreateAnalyticsEvent: jest.Mock;
	let mockOnShareSubmit: jest.Mock = jest.fn();
	const mockLoadOptions = () => [];
	const mockShowFlags: jest.Mock = jest.fn();
	const mockOnDialogOpen: jest.Mock = jest.fn();
	const mockOnDialogClose: jest.Mock = jest.fn();
	const mockOnTriggerButtonClick: jest.Mock = jest.fn();

	function getWrapper(
		overrides: Partial<PropsOf<ShareDialogWithTriggerInternal>> = {},
	): ShallowWrapper<ShareDialogWithTriggerProps & WrappedComponentProps> {
		const defaultMockOriginTracing = {
			id: 'mock-origin-id',
			addToUrl: jest.fn(),
			toAnalyticsAttributes: jest.fn().mockReturnValue({ originId: 'mock-origin-id' }),
		};

		const props: ShareDialogWithTriggerProps & WrappedComponentProps = {
			cloudId: 'test-cloud-id',
			shareAri: 'test-share-ari',
			copyLink: 'copyLink',
			loadUserOptions: mockLoadOptions,
			onTriggerButtonClick: mockOnTriggerButtonClick,
			onDialogOpen: mockOnDialogOpen,
			onDialogClose: mockOnDialogClose,
			onShareSubmit: mockOnShareSubmit,
			shareContentType: 'page',
			shareContentId: 'test-content-id',
			shareContentSubType: undefined,
			showFlags: mockShowFlags,
			createAnalyticsEvent: mockCreateAnalyticsEvent,
			product: 'confluence',
			isPublicLink: false,
			formShareOrigin: defaultMockOriginTracing,
			copyLinkOrigin: defaultMockOriginTracing,
			productAttributes: {
				projectType: 'software',
				projectStyle: 'TEAM_MANAGED_PROJECT',
				userLocation: 'issue:issue',
				isAdmin: false,
				isProjectAdmin: false,
			} as ProductAttributes,
			loggedInAccountId: 'mock-user-account-id',
			...overrides,
			...mockIntlProps,
		};

		return shallow<ShareDialogWithTriggerProps & WrappedComponentProps>(
			<ShareDialogWithTriggerInternal {...props} />,
		);
	}

	function getMountWrapper(
		overrides: Partial<PropsOf<ShareDialogWithTriggerInternal>> = {},
	): ReactWrapper<
		ShareDialogWithTriggerProps & WrappedComponentProps,
		ShareDialogWithTriggerStates,
		any
	> {
		const defaultMockOriginTracing = {
			id: 'mock-origin-id',
			addToUrl: jest.fn(),
			toAnalyticsAttributes: jest.fn().mockReturnValue({ originId: 'mock-origin-id' }),
		};

		const props: PropsOf<ShareDialogWithTriggerInternal> = {
			cloudId: 'test-cloud-id',
			shareAri: 'test-share-ari',
			copyLink: 'https://example.com/share-link',
			loadUserOptions: mockLoadOptions,
			onTriggerButtonClick: mockOnTriggerButtonClick,
			onDialogOpen: mockOnDialogOpen,
			onDialogClose: mockOnDialogClose,
			onShareSubmit: mockOnShareSubmit,
			shareContentType: 'page',
			shareContentId: 'test-content-id',
			shareContentSubType: 'blog',
			showFlags: mockShowFlags,
			createAnalyticsEvent: mockCreateAnalyticsEvent,
			product: 'confluence',
			isPublicLink: false,
			formShareOrigin: defaultMockOriginTracing,
			copyLinkOrigin: defaultMockOriginTracing,
			productAttributes: {
				projectType: 'software',
				projectStyle: 'TEAM_MANAGED_PROJECT',
				userLocation: 'issue:issue',
				isAdmin: false,
				isProjectAdmin: false,
			} as ProductAttributes,
			loggedInAccountId: 'mock-user-account-id',
			...overrides,
			...mockIntlProps,
		};

		return mount(
			<IntlProvider messages={{}} locale="en">
				<ShareDialogWithTriggerInternal {...props} />
			</IntlProvider>,
		);
	}

	function renderComponent(overrides: Partial<PropsOf<ShareDialogWithTriggerInternal>> = {}) {
		const defaultMockOriginTracing = {
			id: 'mock-origin-id',
			addToUrl: jest.fn(),
			toAnalyticsAttributes: jest.fn().mockReturnValue({ originId: 'mock-origin-id' }),
		};

		const props: PropsOf<ShareDialogWithTriggerInternal> = {
			cloudId: 'test-cloud-id',
			shareAri: 'test-share-ari',
			copyLink: 'https://example.com/share-link',
			loadUserOptions: mockLoadOptions,
			onTriggerButtonClick: mockOnTriggerButtonClick,
			onDialogOpen: mockOnDialogOpen,
			onDialogClose: mockOnDialogClose,
			onShareSubmit: mockOnShareSubmit,
			shareContentType: 'page',
			shareContentId: 'test-content-id',
			shareContentSubType: 'blog',
			showFlags: mockShowFlags,
			createAnalyticsEvent: mockCreateAnalyticsEvent,
			product: 'confluence',
			isPublicLink: false,
			formShareOrigin: defaultMockOriginTracing,
			copyLinkOrigin: defaultMockOriginTracing,
			productAttributes: {
				projectType: 'software',
				projectStyle: 'TEAM_MANAGED_PROJECT',
				userLocation: 'issue:issue',
				isAdmin: false,
				isProjectAdmin: false,
			} as ProductAttributes,
			loggedInAccountId: 'mock-user-account-id',
			...overrides,
			...mockIntlProps,
		};

		return render(
			<IntlProvider messages={{}} locale="en">
				<ShareDialogWithTriggerInternal {...props} />
			</IntlProvider>,
		);
	}

	beforeEach(() => {
		// @ts-ignore This violated type definition upgrade of @types/jest to v24.0.18 & ts-jest v24.1.0.
		//See BUILDTOOLS-210-clean: https://bitbucket.org/atlassian/atlaskit-mk-2/pull-requests/7178/buildtools-210-clean/diff
		mockCreateAnalyticsEvent = jest.fn<{}>().mockReturnValue({
			fire: jest.fn(),
		});
		mockOnShareSubmit.mockReset();
		mockShowFlags.mockReset();
		mockOnDialogOpen.mockReset();
		mockOnDialogClose.mockReset();
		mockOnTriggerButtonClick.mockReset();
	});

	describe('default', () => {
		it('should render', async () => {
			const wrapper = getMountWrapper();
			expect(wrapper.find(Popup).length).toBe(1);
			expect(wrapper.find(Popup).prop('isOpen')).toBe(false);
			expect(wrapper.find(ShareForm).length).toBe(0);
			expect(wrapper.find(ShareButton).length).toBe(1);

			await expect(document.body).toBeAccessible();
		});
	});

	describe('orgId prop', () => {
		it('should be passed to the ShareForm', async () => {
			const mockOrgId = 'test-org-id';
			const wrapper = getMountWrapper({
				orgId: mockOrgId,
			});
			wrapper.setState({ isDialogOpen: true });

			const popupContent = renderDialogContent(wrapper);

			const ShareFormProps = popupContent.find(ShareForm).props();
			expect(ShareFormProps.orgId).toBe(mockOrgId);

			await expect(document.body).toBeAccessible();
		});
	});

	describe('onTriggerButtonClick prop', () => {
		it('passed function should be called when share button is clicked', async () => {
			const wrapper = getMountWrapper();
			wrapper.find('button').simulate('click');
			expect(mockOnTriggerButtonClick).toHaveBeenCalledTimes(1);

			await expect(document.body).toBeAccessible();
		});
	});

	describe('isDialogOpen state', () => {
		beforeEach(() => {
			jest.clearAllMocks();
		});

		it('should be false by default', async () => {
			const wrapper = getMountWrapper();
			const shareDialogWithTriggerInternal = wrapper.find(ShareDialogWithTriggerInternal);
			expect(
				(shareDialogWithTriggerInternal.state() as ShareDialogWithTriggerStates).isDialogOpen,
			).toBe(false);

			await expect(document.body).toBeAccessible();
		});

		it('opens the dialog on click', async () => {
			renderComponent({
				renderCustomTriggerButton: (props) => (
					<button {...props} data-testId="test-custom-button" />
				),
			});

			await userEvent.click(screen.getByTestId('test-custom-button'));

			const popup = screen.getByRole('dialog');
			expect(popup).toBeInTheDocument();

			// eslint-disable-next-line @atlassian/a11y/no-violation-count
			await expect(document.body).toBeAccessible({ violationCount: 1 });
		});

		it('should be toggled if clicked on ShareButton', async () => {
			const wrapper = getMountWrapper();
			const shareDialogWithTriggerInternal = wrapper.find(ShareDialogWithTriggerInternal);
			expect(
				(shareDialogWithTriggerInternal.state() as ShareDialogWithTriggerStates).isDialogOpen,
			).toEqual(false);
			shareDialogWithTriggerInternal.find('button').simulate('click');
			expect(
				(shareDialogWithTriggerInternal.state() as ShareDialogWithTriggerStates).isDialogOpen,
			).toEqual(true);
			shareDialogWithTriggerInternal.find('button').simulate('click');
			expect(
				(shareDialogWithTriggerInternal.state() as ShareDialogWithTriggerStates).isDialogOpen,
			).toEqual(false);

			await expect(document.body).toBeAccessible();
		});
	});

	describe('triggerButtonAppearance prop', () => {
		it('should pass to the value into ShareButton as appearance, and have a default value of "subtle"', async () => {
			let wrapper = getMountWrapper();
			let shareDialogWithTriggerInternal = wrapper.find(ShareDialogWithTriggerInternal);
			expect(
				shareDialogWithTriggerInternal.find(Popup).find(ShareButton).prop('appearance'),
			).toEqual('subtle');

			const mockAppearance = 'primary';

			wrapper = getMountWrapper({ triggerButtonAppearance: mockAppearance });
			shareDialogWithTriggerInternal = wrapper.find(ShareDialogWithTriggerInternal);

			expect(
				shareDialogWithTriggerInternal.find(Popup).find(ShareButton).prop('appearance'),
			).toEqual(mockAppearance);

			await expect(document.body).toBeAccessible();
		});
	});

	describe('triggerButtonStyle prop', () => {
		it('should render only ShareIcon without text in the share button if the value is "icon-only"', async () => {
			const wrapper = getMountWrapper({
				triggerButtonStyle: 'icon-only',
			});
			wrapper.setState({ isDialogOpen: true });
			expect(wrapper.find(Popup).find(ShareButton).prop('text')).toBeNull();
			const iconBefore = wrapper.find(Popup).find(ShareButton).prop('iconBefore');
			expect(iconBefore.type).toBe(IconShare);
			expect(wrapper.find(Popup).find(ShareButton).prop('aria-label')).toBe('Share');

			await expect(document.body).toBeAccessible();
		});

		it('should render text in the share button if the value is "icon-with-text"', async () => {
			const wrapper = getMountWrapper({
				triggerButtonStyle: 'icon-with-text',
			});
			wrapper.setState({ isDialogOpen: true });

			const text = wrapper.find(Popup).find(ShareButton).prop('text');
			expect(text.type).toBe(FormattedMessage);
			expect(text.props).toMatchObject(messages.shareTriggerButtonText);

			const iconBefore = wrapper.find(Popup).find(ShareButton).prop('iconBefore');
			expect(iconBefore.type).toBe(IconShare);
			expect(wrapper.find(Popup).find(ShareButton).prop('aria-label')).toBe('Share');

			await expect(document.body).toBeAccessible();
		});

		it('should render only text without ShareIcon in the share button if the value is "text-only"', async () => {
			const wrapper = getMountWrapper({
				triggerButtonStyle: 'text-only',
			});
			wrapper.setState({ isDialogOpen: true });

			const text = wrapper.find(Popup).find(ShareButton).prop('text');
			expect(text.type).toBe(FormattedMessage);
			expect(text.props).toMatchObject(messages.shareTriggerButtonText);

			expect(wrapper.find(Popup).find(ShareButton).prop('iconBefore')).toBeUndefined();

			await expect(document.body).toBeAccessible();
		});
	});

	describe('triggerButtonIcon prop', () => {
		it('should override the default icon when a new icon is passed', async () => {
			const wrapper = getMountWrapper({
				triggerButtonIcon: WorldIcon,
			});
			wrapper.setState({ isDialogOpen: true });

			const iconBefore = wrapper.find(Popup).find(ShareButton).prop('iconBefore');
			expect(iconBefore.type).toBe(WorldIcon);
			expect(wrapper.find(Popup).find(ShareButton).prop('aria-label')).toBe('Share');

			await expect(document.body).toBeAccessible();
		});

		it('should show the default icon when no icon is passed', async () => {
			const wrapper = getMountWrapper();
			wrapper.setState({ isDialogOpen: true });

			const iconBefore = wrapper.find(Popup).find(ShareButton).prop('iconBefore');
			expect(iconBefore.type).toBe(IconShare);
			expect(wrapper.find(Popup).find(ShareButton).prop('aria-label')).toBe('Share');

			await expect(document.body).toBeAccessible();
		});
	});

	describe('dialogPlacement prop', () => {
		it('should be passed into Popup component as placement prop', async () => {
			const defaultPlacement: string = 'bottom-end';
			let wrapper = getMountWrapper();
			let shareDialogWithTriggerInternal = wrapper.find(ShareDialogWithTriggerInternal);
			expect(shareDialogWithTriggerInternal.find(Popup).prop('placement')).toEqual(
				defaultPlacement,
			);
			const newPlacement: DialogPlacement = 'bottom-start';
			wrapper = getMountWrapper({ dialogPlacement: newPlacement });
			shareDialogWithTriggerInternal = wrapper.find(ShareDialogWithTriggerInternal);
			expect(shareDialogWithTriggerInternal.find(Popup).prop('placement')).toEqual(newPlacement);

			await expect(document.body).toBeAccessible();
		});
	});

	describe('dialogZIndex prop', () => {
		it('should be passed into Popup component as zIndex element prop', async () => {
			const zIndex = layers.modal();
			const wrapper = getWrapper();
			expect(wrapper.find(Popup).prop('zIndex')).toEqual(zIndex);
			const newZIndex: number = 500;
			wrapper.setProps({ dialogZIndex: newZIndex });
			expect(wrapper.find(Popup).prop('zIndex')).toEqual(newZIndex);

			await expect(document.body).toBeAccessible();
		});
	});

	describe('isDisabled prop', () => {
		it('should be passed into ShareButton', async () => {
			let isDisabled: boolean = false;
			let wrapper = getMountWrapper({
				isDisabled,
			});
			let shareButtonProps: ShareButtonProps = wrapper
				.find(ShareDialogWithTriggerInternal)
				.find(ShareButton)
				.props();
			expect(shareButtonProps.isDisabled).toEqual(isDisabled);

			wrapper = getMountWrapper({ isDisabled: !isDisabled });

			shareButtonProps = wrapper.find(ShareDialogWithTriggerInternal).find(ShareButton).props();
			expect(shareButtonProps.isDisabled).toEqual(!isDisabled);

			await expect(document.body).toBeAccessible();
		});
	});

	describe('renderCustomTriggerButton prop', () => {
		it('should render a ShareButton if children prop is not given', async () => {
			const wrapper = getMountWrapper();
			expect(wrapper.find(ShareButton).length).toBe(1);

			await expect(document.body).toBeAccessible();
		});

		it('should call renderCustomTriggerButton prop if it is given', async () => {
			const mockRenderCustomTriggerButton: jest.Mock = jest.fn(() => <button />);
			const wrapper = getMountWrapper({
				isDisabled: false,
				renderCustomTriggerButton: mockRenderCustomTriggerButton,
				shareFormTitle: 'Share this page',
			});
			expect(mockRenderCustomTriggerButton).toHaveBeenCalledTimes(1);
			expect(mockRenderCustomTriggerButton).toHaveBeenCalledWith(
				{
					error: (
						wrapper.find(ShareDialogWithTriggerInternal).state() as ShareDialogWithTriggerStates
					).shareError,
					isDisabled: Boolean(wrapper.props().isDisabled),
					isSelected: (
						wrapper.find(ShareDialogWithTriggerInternal).state() as ShareDialogWithTriggerStates
					).isDialogOpen,
					onClick: (wrapper.find(ShareDialogWithTriggerInternal).instance() as any).onTriggerClick,
				},
				{
					'aria-controls': undefined,
					'aria-expanded': false,
					'aria-haspopup': true,
					ref: expect.any(Function),
				},
			);
			expect(wrapper.find(ShareDialogWithTriggerInternal).find('button').length).toBe(1);
			expect(wrapper.find(ShareDialogWithTriggerInternal).find(ShareButton).length).toBe(0);

			await expect(document.body).toBeAccessible();
		});
	});

	describe('customTriggerButtonIcon prop', () => {
		it('should pass an Icon to the CustomTriggerButton if it is given', async () => {
			const mockRenderCustomTriggerButton: jest.Mock = jest.fn(() => <button />);
			const mockCustomTriggerButtonIcon: jest.Mock = jest.fn().mockReturnValue(<>Custom Icon</>);
			const wrapper = getMountWrapper({
				isDisabled: false,
				renderCustomTriggerButton: mockRenderCustomTriggerButton,
				customTriggerButtonIcon: mockCustomTriggerButtonIcon,
				shareFormTitle: 'Share this page',
			});
			expect(mockRenderCustomTriggerButton).toHaveBeenCalledTimes(1);
			expect(mockRenderCustomTriggerButton).toHaveBeenCalledWith(
				{
					error: (
						wrapper.find(ShareDialogWithTriggerInternal).state() as ShareDialogWithTriggerStates
					).shareError,
					isDisabled: Boolean(wrapper.props().isDisabled),
					isSelected: (
						wrapper.find(ShareDialogWithTriggerInternal).state() as ShareDialogWithTriggerStates
					).isDialogOpen,
					onClick: (wrapper.find(ShareDialogWithTriggerInternal).instance() as any).onTriggerClick,
					iconBefore: wrapper.find(ShareDialogWithTriggerInternal).props().customTriggerButtonIcon,
				},
				{
					'aria-controls': undefined,
					'aria-expanded': false,
					'aria-haspopup': true,
					ref: expect.any(Function),
				},
			);
			expect(wrapper.find(ShareDialogWithTriggerInternal).prop('customTriggerButtonIcon')).toEqual(
				mockCustomTriggerButtonIcon,
			);

			await expect(document.body).toBeAccessible();
		});
	});

	describe('shareFormTitle prop', () => {
		it('should be passed to the ShareForm', async () => {
			const wrapper = getMountWrapper({
				shareFormTitle: 'Share this page',
			});
			wrapper.setState({ isDialogOpen: true });
			const popupContent = renderDialogContent(wrapper);

			const ShareFormProps = popupContent.find(ShareForm).props();
			expect(ShareFormProps.title).toEqual('Share this page');

			await expect(document.body).toBeAccessible();
		});
	});

	describe('isAutoOpenDialog prop', () => {
		it('should open dialog if isAutoOpenDialog is true', async () => {
			const wrapper = getWrapper({
				isAutoOpenDialog: true,
			});

			expect((wrapper.state() as ShareDialogWithTriggerStates).isDialogOpen).toEqual(true);
			expect(mockOnDialogOpen).toHaveBeenCalledTimes(1);

			await expect(document.body).toBeAccessible();
		});
	});

	describe('customHeader prop', () => {
		it('should render', async () => {
			const wrapper = getWrapper({
				customHeader: 'Header message',
				integrationMode: 'tabs',
			});
			wrapper.setState({ isDialogOpen: true });
			const popupContent = renderDialogContent(wrapper);
			expect(popupContent.contains('Header message')).toBeTruthy();

			await expect(document.body).toBeAccessible();
		});
	});

	describe('customFooter prop', () => {
		it('should render', async () => {
			const wrapper = getWrapper({
				customFooter: 'Some message',
				integrationMode: 'tabs',
			});
			wrapper.setState({ isDialogOpen: true });
			const popupContent = renderDialogContent(wrapper);
			expect(popupContent.contains('Some message')).toBeTruthy();

			await expect(document.body).toBeAccessible();
		});
	});

	describe('SplitButton props and functions', () => {
		it('should render when shareIntegrations and shareIntegrationsHandler are passed and integrationMode is Split', async () => {
			const wrapper = getMountWrapper({
				integrationMode: 'split',
				shareIntegrations: [{ type: 'Slack', Icon: () => <div />, Content: () => <div /> }],
			});
			expect(wrapper.find(SplitButton)).toHaveLength(1);

			await expect(document.body).toBeAccessible();
		});
		it('should not render when shareIntegrations is an empty array', async () => {
			const wrapper = getMountWrapper({
				shareIntegrations: [],
			});
			expect(wrapper.find(SplitButton)).toHaveLength(0);

			await expect(document.body).toBeAccessible();
		});
		it('should not render when integrationMode is not Split', async () => {
			const wrapper = getMountWrapper({
				integrationMode: 'tabs',
				shareIntegrations: [{ type: 'Slack', Icon: () => <div />, Content: () => <div /> }],
			});
			expect(wrapper.find(SplitButton)).toHaveLength(0);

			await expect(document.body).toBeAccessible();
		});
	});

	describe('handleOpenDialog', () => {
		it('should set the isDialogOpen state to true', async () => {
			const wrapper = getMountWrapper();
			const shareDialogWithTriggerInternal = wrapper.find(ShareDialogWithTriggerInternal);
			expect(
				(shareDialogWithTriggerInternal.state() as ShareDialogWithTriggerStates).isDialogOpen,
			).toEqual(false);
			shareDialogWithTriggerInternal.find('button').simulate('click');
			expect(
				(shareDialogWithTriggerInternal.state() as ShareDialogWithTriggerStates).isDialogOpen,
			).toEqual(true);

			await expect(document.body).toBeAccessible();
		});

		it('should call the onDialogOpen prop if present', async () => {
			const wrapper = getMountWrapper();
			const shareDialogWithTriggerInternal = wrapper.find(ShareDialogWithTriggerInternal);
			expect(
				(shareDialogWithTriggerInternal.state() as ShareDialogWithTriggerStates).isDialogOpen,
			).toEqual(false);
			expect(mockOnDialogOpen).not.toHaveBeenCalled();

			shareDialogWithTriggerInternal.find('button').simulate('click');
			expect(
				(shareDialogWithTriggerInternal.state() as ShareDialogWithTriggerStates).isDialogOpen,
			).toEqual(true);
			expect(mockOnDialogOpen).toHaveBeenCalledTimes(1);

			await expect(document.body).toBeAccessible();
		});

		it('should send an analytic event', async () => {
			const wrapper = getMountWrapper();
			expect(mockCreateAnalyticsEvent).not.toHaveBeenCalled();

			wrapper.find('button').simulate('click');
			expect(mockCreateAnalyticsEvent).toHaveBeenCalledTimes(2);
			// Share button clicked event
			expect(mockCreateAnalyticsEvent.mock.calls[0][0]).toMatchObject({
				eventType: 'ui',
				action: 'clicked',
				actionSubject: 'button',
				actionSubjectId: 'share',
				attributes: {
					packageName: expect.any(String),
					packageVersion: expect.any(String),
				},
			});
			// Share modal screen event
			expect(mockCreateAnalyticsEvent.mock.calls[1][0]).toMatchObject({
				eventType: 'screen',
				name: 'shareModal',
				attributes: {
					packageName: expect.any(String),
					packageVersion: expect.any(String),
				},
			});

			await expect(document.body).toBeAccessible();
		});
	});

	describe('handleCloseDialog', () => {
		it('should set the isDialogOpen state to false', async () => {
			const wrapper = getWrapper();
			wrapper.setState({ isDialogOpen: true });
			expect((wrapper.state() as ShareDialogWithTriggerStates).isDialogOpen).toEqual(true);
			wrapper.find(Popup).simulate('close', { isOpen: false, event: { type: 'submit' } });
			expect((wrapper.state() as ShareDialogWithTriggerStates).isDialogOpen).toEqual(false);
			expect(mockOnDialogClose).toHaveBeenCalledTimes(1);

			await expect(document.body).toBeAccessible();
		});

		it('should be triggered when the Popup is closed', async () => {
			const wrapper = getWrapper();
			const mockClickEvent: Partial<Event> = {
				target: document.createElement('div'),
				type: 'click',
			};
			wrapper.setState({ isDialogOpen: true });
			expect((wrapper.state() as ShareDialogWithTriggerStates).isDialogOpen).toEqual(true);
			wrapper.find(Popup).simulate('close', { isOpen: false, event: mockClickEvent });
			expect((wrapper.state() as ShareDialogWithTriggerStates).isDialogOpen).toEqual(false);
			expect(mockOnDialogClose).toHaveBeenCalledTimes(1);

			await expect(document.body).toBeAccessible();
		});

		it('should call the onDialogClose prop if present', async () => {
			const wrapper = getWrapper();
			wrapper.setState({ isDialogOpen: true });
			expect(mockOnDialogClose).not.toHaveBeenCalled();
			wrapper.find(Popup).simulate('close', { isOpen: false, event: { type: 'submit' } });
			expect((wrapper.state() as ShareDialogWithTriggerStates).isDialogOpen).toEqual(false);
			expect(mockOnDialogClose).toHaveBeenCalledTimes(1);

			await expect(document.body).toBeAccessible();
		});
	});

	describe('handleKeyDown', () => {
		const mockTarget = document.createElement('div');

		function getWrapperWithRef() {
			const wrapper = getWrapper();
			(wrapper.instance() as any).containerRef = { current: mockTarget };
			wrapper.instance().forceUpdate();
			return wrapper;
		}

		it('should preventDefault if shouldCloseOnEscapePress is false, and dialog should stay open', async () => {
			const wrapper = getWrapperWithRef();
			wrapper.setProps({ shouldCloseOnEscapePress: false });
			const escapeKeyDownEvent: Partial<KeyboardEvent> = {
				target: document.createElement('div'),
				type: 'keydown',
				key: 'Escape',
				stopPropagation: jest.fn(),
				preventDefault: jest.fn(),
				defaultPrevented: false,
			};
			const mockShareData: ShareData = {
				users: [
					{ type: 'user', id: 'id', name: 'name' },
					{ type: 'email', id: 'email', name: 'email' },
				],
				comment: {
					format: 'plain_text',
					value: 'comment',
				},
			};
			wrapper.setState({
				isDialogOpen: true,
				ignoreIntermediateState: false,
				defaultValue: mockShareData,
				shareError: { message: 'unable to share', retryable: true },
			});
			wrapper.find('EmotionCssPropInternal').first().simulate('keydown', escapeKeyDownEvent);
			expect(escapeKeyDownEvent.preventDefault).toHaveBeenCalledTimes(1);
			expect((wrapper.state() as ShareDialogWithTriggerStates).isDialogOpen).toBeTruthy();
			expect((wrapper.state() as ShareDialogWithTriggerStates).ignoreIntermediateState).toBeFalsy();
			expect((wrapper.state() as ShareDialogWithTriggerStates).shareError).toMatchObject({
				message: 'unable to share',
				retryable: true,
			});

			await expect(document.body).toBeAccessible();
		});

		it('should not preventDefault if shouldCloseOnEscapePress is true, and dialog should close', async () => {
			const wrapper = getWrapperWithRef();
			wrapper.setProps({ shouldCloseOnEscapePress: true });
			const escapeKeyDownEvent: Partial<KeyboardEvent> = {
				target: document.createElement('div'),
				type: 'keydown',
				key: 'Escape',
				stopPropagation: jest.fn(),
				preventDefault: jest.fn(),
				defaultPrevented: true,
			};
			const mockShareData: ShareData = {
				users: [
					{ type: 'user', id: 'id', name: 'name' },
					{ type: 'email', id: 'email', name: 'email' },
				],
				comment: {
					format: 'plain_text',
					value: 'comment',
				},
			};
			const state = {
				isDialogOpen: true,
				ignoreIntermediateState: false,
				defaultValue: mockShareData,
				shareError: { message: 'unable to share', retryable: true },
			};

			wrapper.setState(state);
			wrapper.find('EmotionCssPropInternal').first().simulate('keydown', escapeKeyDownEvent);
			expect(escapeKeyDownEvent.preventDefault).toHaveBeenCalledTimes(0);
			expect(
				(wrapper.state() as ShareDialogWithTriggerStates).ignoreIntermediateState,
			).toBeTruthy();
			expect((wrapper.state() as ShareDialogWithTriggerStates).shareError).toBeUndefined();
			expect((wrapper.state() as ShareDialogWithTriggerStates).isDialogOpen).toBeFalsy();

			await expect(document.body).toBeAccessible();
		});

		it('should clear the state if an escape key is pressed down on the container regardless of the event.preventDefault value', () => {
			const wrapper = getWrapperWithRef();
			wrapper.setProps({ shouldCloseOnEscapePress: true });
			const escapeKeyDownEvent: Partial<KeyboardEvent> = {
				target: mockTarget,
				type: 'keydown',
				key: 'Escape',
				preventDefault: jest.fn(),
				defaultPrevented: true,
			};
			const mockShareData: ShareData = {
				users: [
					{ type: 'user', id: 'id', name: 'name' },
					{ type: 'email', id: 'email', name: 'email' },
				],
				comment: {
					format: 'plain_text',
					value: 'comment',
				},
			};
			wrapper.setState({
				isDialogOpen: true,
				ignoreIntermediateState: false,
				defaultValue: mockShareData,
				shareError: { message: 'unable to share', retryable: true },
			});
			wrapper.find('EmotionCssPropInternal').first().simulate('keydown', escapeKeyDownEvent);
			// @atlaskit/popup will catch the ESC, and close the window, we only
			// .preventDefault() when we don't want to close the popup on ESC
			expect(escapeKeyDownEvent.preventDefault).toHaveBeenCalledTimes(0);
			expect((wrapper.state() as ShareDialogWithTriggerStates).isDialogOpen).toBeFalsy();
			expect(mockOnDialogClose).toHaveBeenCalledTimes(1);
			expect(
				(wrapper.state() as ShareDialogWithTriggerStates).ignoreIntermediateState,
			).toBeTruthy();
			expect((wrapper.state() as ShareDialogWithTriggerStates).defaultValue).toEqual(
				defaultShareContentState,
			);
			expect((wrapper.state() as ShareDialogWithTriggerStates).shareError).toBeUndefined();
		});
	});

	describe('handleShareSubmit', () => {
		it('should call onSubmit props with an object of users and comment as an argument', async () => {
			// @ts-ignore This violated type definition upgrade of @types/jest to v24.0.18 & ts-jest v24.1.0.
			//See BUILDTOOLS-210-clean: https://bitbucket.org/atlassian/atlaskit-mk-2/pull-requests/7178/buildtools-210-clean/diff
			const mockOnSubmit = jest.fn<{}>().mockResolvedValue({});
			const values: ShareData = {
				users: [
					{ type: 'user', id: 'id', name: 'name' },
					{ type: 'email', id: 'email@atlassian.com', name: 'email' },
				],
				comment: {
					format: 'plain_text',
					value: 'comment',
				},
			};
			const mockState: Partial<ShareDialogWithTriggerStates> = {
				isDialogOpen: true,
				isSharing: false,
				ignoreIntermediateState: false,
				defaultValue: values,
			};
			const wrapper = getWrapper({
				onShareSubmit: mockOnSubmit,
			});

			wrapper.setState(mockState);

			const popupContent = renderDialogContent(wrapper);
			popupContent.find(ShareForm).simulate('submit', values);
			expect(mockOnSubmit).toHaveBeenCalledTimes(1);
			expect(mockOnSubmit).toHaveBeenCalledWith(values);
			expect(mockCreateAnalyticsEvent).toHaveBeenCalledWith({
				type: 'sendTrackEvent',
				data: {
					action: 'shared',
					actionSubject: 'page',
					source: 'shareModal',
					attributes: {
						contentType: 'page',
						subContentType: undefined,
						shareData: values,
					},
				},
			});

			await expect(document.body).toBeAccessible();
		});

		it('should close inline dialog and reset the state and call props.showFlags when onSubmit resolves a value', async () => {
			// @ts-ignore This violated type definition upgrade of @types/jest to v24.0.18 & ts-jest v24.1.0.
			//See BUILDTOOLS-210-clean: https://bitbucket.org/atlassian/atlaskit-mk-2/pull-requests/7178/buildtools-210-clean/diff
			const mockOnSubmit = jest.fn<{}>().mockResolvedValue({});
			const values: ShareData = {
				users: [
					{ type: 'user', id: 'id', name: 'name' },
					{ type: 'email', id: 'email@atlassian.com', name: 'email' },
				],
				comment: {
					format: 'plain_text',
					value: 'comment',
				},
			};
			const mockState: Partial<ShareDialogWithTriggerStates> = {
				isDialogOpen: true,
				isSharing: false,
				ignoreIntermediateState: false,
				defaultValue: values,
				shareError: { message: 'unable to share', retryable: true },
			};
			const wrapper = getWrapper({
				onShareSubmit: mockOnSubmit,
			});
			wrapper.setState(mockState);

			mockShowFlags.mockReset();

			const popupContent = renderDialogContent(wrapper);
			popupContent.find(ShareForm).simulate('submit', values);
			expect(mockOnSubmit).toHaveBeenCalledTimes(1);
			expect(mockOnSubmit).toHaveBeenCalledWith(values);

			await new Promise((resolve) => setTimeout(resolve, 0));

			expect(mockOnDialogClose).toHaveBeenCalledTimes(1);
			expect(wrapper.state('isDialogOpen')).toBeFalsy();
			expect(wrapper.state('defaultValue')).toEqual(defaultShareContentState);
			expect(wrapper.state('ignoreIntermediateState')).toBeTruthy();
			expect(wrapper.state('isDialogOpen')).toBeFalsy();
			expect(wrapper.state('isSharing')).toBeFalsy();
			expect(wrapper.state('shareError')).toBeUndefined();
			expect(mockShowFlags).toHaveBeenCalledTimes(1);
			expect(mockShowFlags).toHaveBeenCalledWith([
				{
					appearance: 'success',
					title: expect.objectContaining({
						...messages.shareSuccessMessage,
						defaultMessage: expect.any(String),
					}),
					type: OBJECT_SHARED,
				},
			]);

			await expect(document.body).toBeAccessible();
		});

		it('should not show flag if no users are shared and extended dialog is enabled', async () => {
			renderComponent({
				isExtendedShareDialogEnabled: true,
				renderCustomTriggerButton: (props) => <button {...props}>Open form</button>,
				onShareSubmit: () => Promise.resolve(),
			});

			await userEvent.click(screen.getByRole('button', { name: 'Open form' }));
			await userEvent.click(screen.getByRole('button', { name: 'Share' }));

			expect(mockShowFlags).not.toHaveBeenCalled();

			await expect(document.body).toBeAccessible();
		});

		it('should set shareError when onShareSubmit fails', async () => {
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

			const values: ShareData = {
				users: [
					{ type: 'user', id: 'id', name: 'name' },
					{ type: 'email', id: 'email@atlassian.com', name: 'email' },
				],
				comment: {
					format: 'plain_text',
					value: 'comment',
				},
			};
			const mockState: Partial<ShareDialogWithTriggerStates> = {
				isDialogOpen: true,
				isSharing: false,
				ignoreIntermediateState: false,
				defaultValue: values,
			};
			const wrapper = getWrapper({
				onShareSubmit: mockOnSubmit,
			});

			wrapper.setState(mockState);

			const popupContent = renderDialogContent(wrapper);
			popupContent.find(ShareForm).simulate('submit', values);
			expect(mockOnSubmit).toHaveBeenCalledTimes(1);
			expect(mockOnSubmit).toHaveBeenCalledWith(values);

			// eslint-disable-next-line @atlaskit/platform/no-set-immediate
			setImmediate(() => {
				const shareError = (wrapper.update().state() as any).shareError;
				expect(shareError.message).toBe('Not allowed');
				expect(shareError.errorCode).toBe('example-error-code');
				expect(shareError.helpUrl).toBe('https://example.com');
				expect(shareError.retryable).toBe(false);
			});

			await expect(document.body).toBeAccessible();
		});
	});

	describe('Aktooltip', () => {
		it('should be rendered if the props.triggerButtonStyle is `icon-only`', async () => {
			let wrapper = getMountWrapper({
				triggerButtonStyle: 'icon-only',
			});
			let shareDialogWithTriggerInternal = wrapper.find(ShareDialogWithTriggerInternal);
			expect(shareDialogWithTriggerInternal.find(Aktooltip)).toHaveLength(1);
			expect(shareDialogWithTriggerInternal.find(Aktooltip).find(ShareButton)).toHaveLength(1);

			wrapper = getMountWrapper({ triggerButtonStyle: 'icon-with-text' });
			shareDialogWithTriggerInternal = wrapper.find(ShareDialogWithTriggerInternal);
			expect(shareDialogWithTriggerInternal.find(Aktooltip)).toHaveLength(0);
			expect(shareDialogWithTriggerInternal.find(ShareButton)).toHaveLength(1);

			wrapper = getMountWrapper({ triggerButtonStyle: 'text-only' });
			shareDialogWithTriggerInternal = wrapper.find(ShareDialogWithTriggerInternal);
			expect(shareDialogWithTriggerInternal.find(Aktooltip)).toHaveLength(0);
			expect(shareDialogWithTriggerInternal.find(ShareButton)).toHaveLength(1);

			const MockCustomButton = () => <button />;
			const renderCustomTriggerButton: RenderCustomTriggerButton = ({ onClick = () => {} }) => (
				<MockCustomButton />
			);

			wrapper = getMountWrapper({
				triggerButtonStyle: 'icon-only',
				renderCustomTriggerButton,
			});
			shareDialogWithTriggerInternal = wrapper.find(ShareDialogWithTriggerInternal);

			expect(shareDialogWithTriggerInternal.find(Aktooltip)).toHaveLength(1);
			expect(shareDialogWithTriggerInternal.find(Aktooltip).find(MockCustomButton)).toHaveLength(1);

			await expect(document.body).toBeAccessible();
		});

		it('should digest props.triggerButtonTooltipText as content and props.triggerButtonTooltipPosition as position', async () => {
			let wrapper = getMountWrapper({
				triggerButtonStyle: 'icon-only',
			});
			expect(
				(wrapper.find(ShareDialogWithTriggerInternal).find(Aktooltip).props() as any).content,
			).toEqual('Share');
			expect(
				(wrapper.find(ShareDialogWithTriggerInternal).find(Aktooltip).props() as any).position,
			).toEqual('top');

			const customTooltipText = 'Custom Share';
			const customTooltipPosition: TooltipPosition = 'mouse';

			wrapper = getMountWrapper({
				triggerButtonTooltipText: customTooltipText,
				triggerButtonTooltipPosition: customTooltipPosition,
			});

			expect(
				(wrapper.find(ShareDialogWithTriggerInternal).find(Aktooltip).props() as any).content,
			).toEqual('Custom Share');
			expect(
				(wrapper.find(ShareDialogWithTriggerInternal).find(Aktooltip).props() as any).position,
			).toEqual('mouse');

			await expect(document.body).toBeAccessible();
		});
	});

	describe('bottomMessage', () => {
		it('should display the bottom message', async () => {
			const wrapper = getWrapper({
				bottomMessage: 'Some message',
			});
			wrapper.setState({ isDialogOpen: true });

			const popupContent = renderDialogContent(wrapper);
			expect(popupContent.contains('Some message')).toBeTruthy();

			await expect(document.body).toBeAccessible();
		});
	});

	describe('jiraPageSharedEvent analytics', () => {
		beforeEach(() => {
			const fg = require('@atlaskit/platform-feature-flags').fg;
			fg.mockReturnValue(true);
		});

		it('should trigger jiraPageSharedEvent for copy link action', async () => {
			const wrapper = getWrapper({
				shareContentType: 'issue',
				shareContentSubType: 'task',
				shareContentId: 'test-issue-123',
				isPublicLink: false,
				productAttributes: {
					projectType: 'software',
					projectStyle: 'TEAM_MANAGED_PROJECT',
					userLocation: 'issue:issue',
					isAdmin: true,
					isProjectAdmin: false,
				} as ProductAttributes,
				loggedInAccountId: 'user-account-123',
			});

			(wrapper.instance() as any).handleCopyLink();

			expect(mockCreateAnalyticsEvent).toHaveBeenCalledTimes(2);
			expect(mockCreateAnalyticsEvent.mock.calls[1][0]).toMatchObject({
				eventType: 'track',
				action: 'shared',
				actionSubject: 'page',
				actionSubjectId: 'copyLink',
				attributes: {
					packageName: '@product/platform',
					packageVersion: expect.any(String),
					duration: expect.any(Number),
					source: 'shareModal',
					contentType: 'issue',
					projectType: 'software',
					projectStyle: 'TEAM_MANAGED_PROJECT',
					userLocation: 'issue:issue',
					isAdmin: true,
					isProjectAdmin: false,
					originId: 'mock-origin-id',
					contentId: 'test-issue-123',
					isPublicLink: false,
					loggedInAccountId: 'user-account-123',
					shareContentSubType: 'task',
					externalUsers: [],
				},
			});

			await expect(document.body).toBeAccessible();
		});

		it('should trigger jiraPageSharedEvent on share submit', async () => {
			const mockOnSubmit = jest.fn().mockResolvedValue({});
			const shareData: ShareData = {
				users: [
					{ type: 'user', id: 'id', name: 'name' },
					{ type: 'email', id: 'email@atlassian.com', name: 'email' },
				],
				comment: {
					format: 'plain_text',
					value: 'comment',
				},
			};
			const mockState: Partial<ShareDialogWithTriggerStates> = {
				isDialogOpen: true,
				isSharing: false,
				ignoreIntermediateState: false,
				defaultValue: shareData,
			};
			const wrapper = getWrapper({
				onShareSubmit: mockOnSubmit,
				shareContentType: 'issue',
				shareContentSubType: 'task',
				shareContentId: 'test-issue-123',
				isPublicLink: false,
				productAttributes: {
					projectType: 'software',
					projectStyle: 'TEAM_MANAGED_PROJECT',
					userLocation: 'issue:issue',
					isAdmin: true,
					isProjectAdmin: false,
				} as ProductAttributes,
				loggedInAccountId: 'user-account-123',
			});

			wrapper.setState(mockState);

			const popupContent = renderDialogContent(wrapper);
			popupContent.find(ShareForm).simulate('submit', shareData);
			expect(mockCreateAnalyticsEvent.mock.calls[1][0]).toMatchObject({
				eventType: 'track',
				action: 'shared',
				actionSubject: 'page',
				actionSubjectId: 'submitShare',
				attributes: {
					packageName: '@product/platform',
					packageVersion: expect.any(String),
					duration: expect.any(Number),
					source: 'shareModal',
					contentType: 'issue',
					projectType: 'software',
					projectStyle: 'TEAM_MANAGED_PROJECT',
					userLocation: 'issue:issue',
					isAdmin: true,
					isProjectAdmin: false,
					originId: 'mock-origin-id',
					contentId: 'test-issue-123',
					isPublicLink: false,
					loggedInAccountId: 'user-account-123',
					shareContentSubType: 'task',
					externalUsers: [],
				},
			});

			await expect(document.body).toBeAccessible();
		});
	});
});
