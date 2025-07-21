import React from 'react';

import { render, screen } from '@testing-library/react';
import { shallow } from 'enzyme';
import { FormattedMessage, IntlProvider } from 'react-intl-next';

import Button from '@atlaskit/button/new';
import { shallowWithIntl } from '@atlaskit/editor-test-helpers/enzyme';
import Form, { type FormProps, HelperMessage } from '@atlaskit/form';
import ErrorIcon from '@atlaskit/icon/core/migration/error';
import { MenuGroup } from '@atlaskit/menu';
// eslint-disable-next-line @atlaskit/design-system/no-emotion-primitives -- to be migrated to @atlaskit/primitives/compiled – go/akcss
import { Box } from '@atlaskit/primitives';
import Tabs, { Tab, TabList } from '@atlaskit/tabs';
import Tooltip from '@atlaskit/tooltip';

import { CommentField } from '../../../components/CommentField';
import CopyLinkButton from '../../../components/CopyLinkButton';
import { ShareForm } from '../../../components/ShareForm';
import { ShareHeader } from '../../../components/ShareHeader';
import { ShareMenuItem } from '../../../components/ShareMenuItem';
import { UserPickerField } from '../../../components/UserPickerField';
import { messages } from '../../../i18n';
import { type AdditionalTab, type DialogContentState, type ShareError } from '../../../types';
import { renderProp } from '../_testUtils';

const mockFormatMessage = (descriptor: any) => descriptor.defaultMessage;
const mockIntl = { formatMessage: mockFormatMessage };

const defaultProps = {
	cloudId: 'test-cloud-id',
};

jest.mock('react-intl-next', () => {
	return {
		...(jest.requireActual('react-intl-next') as any),
		FormattedMessage: (descriptor: any) => <span>{descriptor.defaultMessage}</span>,
		injectIntl: (Node: any) => (props: any) => <Node {...props} intl={mockIntl} />,
	};
});

describe('ShareForm', () => {
	it.each`
		allowComment | submitButtonLabel
		${true}      | ${undefined}
		${true}      | ${'Invite'}
	`(
		'should render Form with fields (allowComment $allowComment, submitButton $submitButtonLabel)',
		({ allowComment, submitButtonLabel }) => {
			const mockLink = 'link';
			const loadOptions = jest.fn();
			const onSubmit = jest.fn();
			const component = shallow(
				<ShareForm
					{...defaultProps}
					copyLink={mockLink}
					loadOptions={loadOptions}
					onSubmit={onSubmit}
					title="some title"
					submitButtonLabel={submitButtonLabel}
					product="confluence"
				/>,
			);

			const akForm = component.find<FormProps<{}>>(Form);
			expect(akForm).toHaveLength(1);
			expect(akForm.prop('onSubmit')).toBe(onSubmit);

			const formProps = {};
			const form = renderProp(akForm, 'children', { formProps }).dive().dive().find('form');
			expect(form).toHaveLength(1);
			expect(form.find(ShareHeader).prop('title')).toEqual('some title');

			const userPickerField = form.find(UserPickerField);
			expect(userPickerField).toHaveLength(1);
			expect(userPickerField.props()).toMatchObject({
				loadOptions,
			});
			expect(form.find(CommentField)).toHaveLength(allowComment ? 1 : 0);

			const footer = form.find('[data-testid="form-footer"]');
			expect(footer).toHaveLength(1);
			const button = footer.find(Button);
			expect(button).toHaveLength(1);
			expect(button.props()).toMatchObject({
				appearance: 'primary',
				type: 'submit',
				isLoading: false,
				isDisabled: undefined,
				children: <>{submitButtonLabel || <FormattedMessage {...messages.formShare} />}</>,
			});
			const copyLinkButton = footer.find(CopyLinkButton);
			expect(copyLinkButton.length).toBe(1);
			expect(copyLinkButton.prop('link')).toEqual(mockLink);

			const helperMessage = form.find(HelperMessage);
			expect(helperMessage).toHaveLength(0);
		},
	);

	describe('isSharing prop', () => {
		it('should set isLoading prop to true to the Send button', () => {
			const mockLink = 'link';
			const loadOptions = jest.fn();
			const wrapper = shallow(
				<ShareForm
					{...defaultProps}
					copyLink={mockLink}
					loadOptions={loadOptions}
					isSharing
					product="confluence"
				/>,
			);

			const akForm = wrapper.find<FormProps<{}>>(Form);
			const form = renderProp(akForm, 'children', { formProps: {} }).dive().dive().find('form');
			const footer = form.find('[data-testid="form-footer"]');
			expect(footer.find(Button).prop('isLoading')).toBeTruthy();
		});

		it('should set appearance prop to "primary" and isLoading prop to true to the Send button, and hide the tooltip', () => {
			const mockLink = 'link';
			const mockShareError: ShareError = { message: 'error', retryable: true };
			const loadOptions = jest.fn();
			const wrapper = shallow(
				<ShareForm
					{...defaultProps}
					copyLink={mockLink}
					loadOptions={loadOptions}
					shareError={mockShareError}
					isSharing
					product="confluence"
				/>,
			);

			const akForm = wrapper.find<FormProps<{}>>(Form);
			const form = renderProp(akForm, 'children', { formProps: {} }).dive().dive().find('form');
			const footer = form.find('[data-testid="form-footer"]');
			expect(footer.find(Tooltip)).toHaveLength(0);
			expect(footer.find(Button).prop('isLoading')).toBeTruthy();
			expect(footer.find(Button).prop('appearance')).toEqual('primary');
		});
	});

	describe('isFetchingConfig prop', () => {
		it('should set isLoading prop to true to the UserPickerField', () => {
			const mockLink = 'link';
			const loadOptions = jest.fn();
			const wrapper = (shallowWithIntl as typeof shallow)(
				<ShareForm
					{...defaultProps}
					copyLink={mockLink}
					loadOptions={loadOptions}
					isFetchingConfig
					product="confluence"
				/>,
			);

			const akForm = wrapper.find<FormProps<{}>>(Form);
			const form = renderProp(akForm, 'children', { formProps: {} }).dive().dive().find('form');
			const userPickerField = form.find(UserPickerField);
			expect(userPickerField.prop('isLoading')).toBeTruthy();
		});
	});

	describe('shareError prop', () => {
		it('should render Retry button with an ErrorIcon and Tooltip', () => {
			const mockShareError: ShareError = {
				message: 'error',
				retryable: true,
			};
			const wrapper = shallow(
				<ShareForm
					{...defaultProps}
					copyLink="link"
					loadOptions={jest.fn()}
					shareError={mockShareError}
					product="confluence"
				/>,
			);

			const akForm = wrapper.find<FormProps<{}>>(Form);
			const form = renderProp(akForm, 'children', { formProps: {} }).dive().dive().find('form');
			const footer = form.find('[data-testid="form-footer"]');
			const button = footer.find(Button);
			expect(button).toHaveLength(1);
			expect(button.prop('appearance')).toEqual('warning');

			const buttonLabel = button.find('strong').find(FormattedMessage);
			expect(buttonLabel).toHaveLength(1);
			expect(buttonLabel.props()).toMatchObject(messages.formRetry);

			const tooltip = form.find(Tooltip);
			expect(tooltip).toHaveLength(1);
			expect(tooltip.prop('content')).toEqual(
				<FormattedMessage {...messages.shareFailureMessage} />,
			);

			const errorIcon = tooltip.find(ErrorIcon);
			expect(errorIcon).toHaveLength(1);
		});

		it('should render disabeld Share button with no ErrorIcon when client error', () => {
			const mockShareError: ShareError = {
				message: 'error',
				errorCode: 'blah',
				retryable: false,
			};
			const wrapper = shallow(
				<ShareForm
					{...defaultProps}
					copyLink="link"
					loadOptions={jest.fn()}
					shareError={mockShareError}
					product="confluence"
				/>,
			);

			const akForm = wrapper.find<FormProps<{}>>(Form);
			const form = renderProp(akForm, 'children', { formProps: {} }).dive().dive().find('form');
			const footer = form.find('[data-testid="form-footer"]');
			const button = footer.find(Button);
			expect(button).toHaveLength(1);
			expect(button.prop('appearance')).toEqual('primary');
			expect(button.prop('isDisabled')).toEqual(true);

			expect(form.find(ErrorIcon).exists()).toBe(false);
		});
	});

	describe('Additional user fields', () => {
		it('should render additional user fields when isExtendedShareDialogEnabled is true', () => {
			render(
				<IntlProvider locale="en">
					<ShareForm
						{...defaultProps}
						title="Share"
						showTitle={false}
						copyLink="link"
						product="jira"
						isExtendedShareDialogEnabled={true}
						additionalUserFields={<div>User role field</div>}
					/>
				</IntlProvider>,
			);

			expect(screen.getByText('User role field')).toBeVisible();
		});

		it('should not render additional user fields when isExtendedShareDialogEnabled is false', () => {
			render(
				<IntlProvider locale="en">
					<ShareForm
						{...defaultProps}
						title="Share"
						showTitle={false}
						copyLink="link"
						product="jira"
						isExtendedShareDialogEnabled={false}
						additionalUserFields={<div>User role field</div>}
					/>
				</IntlProvider>,
			);

			expect(screen.queryByText('User role field')).not.toBeInTheDocument();
		});

		it('should not render additional user fields when they do not exist', () => {
			render(
				<IntlProvider locale="en">
					<ShareForm
						{...defaultProps}
						title="Share"
						showTitle={false}
						copyLink="link"
						product="jira"
						isExtendedShareDialogEnabled={true}
					/>
				</IntlProvider>,
			);

			expect(screen.queryByText('User role field')).not.toBeInTheDocument();
		});
	});

	describe('shareFieldsFooter prop', () => {
		it('should render the shareForm with the fields footer content', () => {
			const wrapper = shallow(
				<ShareForm
					{...defaultProps}
					copyLink="link"
					loadOptions={jest.fn()}
					product="confluence"
					fieldsFooter={'Some message'}
				/>,
			);

			const akForm = wrapper.find<FormProps<{}>>(Form);
			const form = renderProp(akForm, 'children', { formProps: {} }).dive().dive().find('form');
			expect(form.contains('Some message')).toBeTruthy();
		});
	});

	it('should set defaultValue', () => {
		const mockLink = 'link';
		const loadOptions = jest.fn();
		const defaultValue: DialogContentState = {
			users: [],
			comment: {
				format: 'plain_text',
				value: 'some comment',
			},
		};
		const component = shallow(
			<ShareForm
				{...defaultProps}
				copyLink={mockLink}
				loadOptions={loadOptions}
				title="some title"
				defaultValue={defaultValue}
				product="confluence"
			/>,
		);
		const formProps = {};
		const akForm = component.find<FormProps<{}>>(Form);
		const form = renderProp(akForm, 'children', { formProps }).dive().dive();

		expect(form.find(UserPickerField).prop('defaultValue')).toBe(defaultValue.users);
		expect(form.find(CommentField).prop('defaultValue')).toBe(defaultValue.comment);
	});

	describe('isPublicLink prop', () => {
		it('should render Share button with the correct text', () => {
			const wrapper = shallow(
				<ShareForm
					{...defaultProps}
					copyLink="link"
					loadOptions={jest.fn()}
					isPublicLink={true}
					product="confluence"
				/>,
			);

			const akForm = wrapper.find<FormProps<{}>>(Form);
			const form = renderProp(akForm, 'children', { formProps: {} }).dive().dive().find('form');
			const footer = form.find('[data-testid="form-footer"]');
			const button = footer.find(Button);
			expect(button).toHaveLength(1);

			const buttonLabel = button.find(FormattedMessage);
			expect(buttonLabel).toHaveLength(1);
			expect(buttonLabel.props()).toMatchObject(messages.formSendPublic);
		});

		it('should render Share button with the share text for integration mode "tabs"', () => {
			const wrapper = shallow(
				<ShareForm
					{...defaultProps}
					copyLink="link"
					loadOptions={jest.fn()}
					isPublicLink={true}
					product="confluence"
					integrationMode="tabs"
				/>,
			);

			const akForm = wrapper.find<FormProps<{}>>(Form);
			const form = renderProp(akForm, 'children', { formProps: {} }).dive().dive().find('form');
			const footer = form.find('[data-testid="form-footer"]');
			const button = footer.find(Button);
			expect(button).toHaveLength(1);

			const buttonLabel = button.find(FormattedMessage);
			expect(buttonLabel).toHaveLength(1);
			expect(buttonLabel.props()).toMatchObject(messages.formSharePublic);
		});

		it('should pass value to CopyLinkButton', () => {
			const wrapper = shallow(
				<ShareForm
					{...defaultProps}
					copyLink="link"
					loadOptions={jest.fn()}
					isDisabled={true}
					product="confluence"
				/>,
			);
			const akForm = wrapper.find<FormProps<{}>>(Form);
			const form = renderProp(akForm, 'children', { formProps: {} }).dive().dive().find('form');

			const footer = form.find('[data-testid="form-footer"]');
			expect(footer).toHaveLength(1);
			const copyLinkButton = footer.find(CopyLinkButton);
			expect(copyLinkButton.length).toBe(1);
			expect(copyLinkButton.prop('isDisabled')).toEqual(true);
		});
	});

	describe('showTitle prop', () => {
		it('should not render the share form header if showTitle is false', () => {
			const wrapper = (shallowWithIntl as typeof shallow)(
				<ShareForm
					{...defaultProps}
					title="Share"
					showTitle={false}
					copyLink="link"
					product="confluence"
				/>,
			);

			const akForm = wrapper.find<FormProps<{}>>(Form);
			const form = renderProp(akForm, 'children', { formProps: {} }).dive().dive().find('form');
			const shareHeader = form.find(ShareHeader);
			expect(shareHeader).toHaveLength(0);
		});
	});

	describe('integrationMode prop', () => {
		it('should not render Tabs when integrationMode is "off" and shareIntegrations has content', () => {
			const wrapper = (shallowWithIntl as typeof shallow)(
				<ShareForm
					{...defaultProps}
					copyLink="link"
					product="confluence"
					integrationMode="off"
					shareIntegrations={[
						{
							type: 'Slack',
							Icon: () => <div />,
							Content: () => <div />,
						},
					]}
				/>,
			);

			const akForm = wrapper.find<FormProps<{}>>(Form);
			const form = renderProp(akForm, 'children', { formProps: {} }).dive().dive().find(Tabs);

			const tabs = form.find(Tabs);
			expect(tabs).toHaveLength(0);
		});

		it('should not render Tabs when integrationMode is "menu" and shareIntegrations has content', () => {
			const wrapper = (shallowWithIntl as typeof shallow)(
				<ShareForm
					{...defaultProps}
					copyLink="link"
					product="confluence"
					integrationMode="menu"
					shareIntegrations={[
						{
							type: 'Slack',
							Icon: () => <div />,
							Content: () => <div />,
						},
					]}
				/>,
			);

			const akForm = wrapper.find<FormProps<{}>>(Form);
			const form = renderProp(akForm, 'children', { formProps: {} }).dive().dive().find(Tabs);

			const tabs = form.find(Tabs);
			expect(tabs).toHaveLength(0);
		});

		it('should render the share button text as "share" when integrationMode is "tabs"', () => {
			const wrapper = shallow(
				<ShareForm
					{...defaultProps}
					copyLink="link"
					loadOptions={jest.fn()}
					product="confluence"
					integrationMode="tabs"
				/>,
			);

			const akForm = wrapper.find<FormProps<{}>>(Form);
			const form = renderProp(akForm, 'children', { formProps: {} }).dive().dive().find('form');
			const footer = form.find('[data-testid="form-footer"]');
			const button = footer.find(Button);
			expect(button).toHaveLength(1);

			const buttonLabel = button.find(FormattedMessage);
			expect(buttonLabel).toHaveLength(1);
			expect(buttonLabel.props()).toMatchObject(messages.formShare);
		});

		it('should render menu items with the share text for integration mode "menu"', () => {
			const wrapper = shallow(
				<ShareForm
					{...defaultProps}
					copyLink="link"
					loadOptions={jest.fn()}
					isPublicLink={true}
					product="confluence"
					integrationMode="menu"
					shareIntegrations={[
						{
							type: 'Slack',
							Icon: () => <div />,
							Content: () => <div />,
						},
					]}
				/>,
			);

			const akForm = wrapper.find<FormProps<{}>>(Form);
			const box = renderProp(akForm, 'children', { formProps: {} }).dive().dive().find(Box);

			expect(box).toHaveLength(1);
			const menuGroup = box.find(MenuGroup);
			expect(menuGroup).toHaveLength(1);
			const menuItems = menuGroup.find(ShareMenuItem);
			expect(menuItems).toHaveLength(2);
		});
	});

	describe('shareIntegrations prop', () => {
		it('should not render Tabs when shareIntegrations array is empty', () => {
			const wrapper = (shallowWithIntl as typeof shallow)(
				<ShareForm
					{...defaultProps}
					copyLink="link"
					product="confluence"
					integrationMode="tabs"
					shareIntegrations={[]}
				/>,
			);

			const akForm = wrapper.find<FormProps<{}>>(Form);
			const form = renderProp(akForm, 'children', { formProps: {} }).dive().dive().find(Tabs);

			const tabs = form.find(Tabs);
			expect(tabs).toHaveLength(0);
		});

		it('should render Integration Tab when shareIntegrations array is filled in', () => {
			const wrapper = (shallowWithIntl as typeof shallow)(
				<ShareForm
					{...defaultProps}
					title="Share"
					showTitle={false}
					copyLink="link"
					product="confluence"
					integrationMode="tabs"
					shareIntegrations={[
						{
							type: 'Slack',
							Icon: () => <div />,
							Content: () => <div />,
						},
					]}
				/>,
			);

			const akForm = wrapper.find<FormProps<{}>>(Form);
			const tabs = renderProp(akForm, 'children', { formProps: {} }).dive().dive().find(Tabs);

			const tabList = tabs.find(TabList);
			const childTabs = tabList.find(Tab);
			expect(childTabs).toHaveLength(2);
		});
	});

	it('should render helper text on top to explain asterisk', () => {
		render(
			<IntlProvider locale="en">
				<ShareForm {...defaultProps} title="Share" copyLink="link" product="confluence" />
			</IntlProvider>,
		);
		expect(screen.getByText('Required fields are marked with an asterisk')).toBeInTheDocument();
	});

	it('should not render required fields helper text to explain asterisk when isExtendedShareDialogEnabled = true', () => {
		render(
			<IntlProvider locale="en">
				<ShareForm
					{...defaultProps}
					title="Share"
					copyLink="link"
					product="jira"
					isExtendedShareDialogEnabled={true}
				/>
			</IntlProvider>,
		);

		expect(
			screen.queryByText('Required fields are marked with an asterisk'),
		).not.toBeInTheDocument();
	});

	describe('additionalTabs', () => {
		const mockAdditionalTabs: AdditionalTab[] = [
			{
				label: 'Custom Tab',
				Content: () => <div>Custom Tab Content</div>,
			},
		];

		it('should render additional tabs when provided', () => {
			const wrapper = shallow(
				<ShareForm
					{...defaultProps}
					copyLink="link"
					integrationMode="tabs"
					additionalTabs={mockAdditionalTabs}
					shareIntegrations={[
						{
							type: 'Slack',
							Icon: () => <div>Icon</div>,
							Content: () => <div>Content</div>,
						},
					]}
				/>,
			);

			const akForm = wrapper.find<FormProps<{}>>(Form);
			const tabs = renderProp(akForm, 'children', { formProps: {} }).dive().dive().find(Tab);
			expect(tabs).toHaveLength(3); // Default tab + Slack tab + Custom tab
			expect(tabs.at(2).prop('children')).toBe('Custom Tab');
		});

		it('should not render additional tabs when not in tabs mode', () => {
			const wrapper = shallow(
				<ShareForm
					{...defaultProps}
					copyLink="link"
					integrationMode="off"
					additionalTabs={mockAdditionalTabs}
				/>,
			);

			const akForm = wrapper.find<FormProps<{}>>(Form);
			const tabs = renderProp(akForm, 'children', { formProps: {} }).dive().dive().find(Tab);
			expect(tabs).toHaveLength(0);
		});

		it('should render additional tabs when slack integration is not present', () => {
			const wrapper = shallow(
				<ShareForm
					{...defaultProps}
					copyLink="link"
					integrationMode="tabs"
					additionalTabs={mockAdditionalTabs}
				/>,
			);

			const akForm = wrapper.find<FormProps<{}>>(Form);
			const tabs = renderProp(akForm, 'children', { formProps: {} }).dive().dive().find(Tab);
			expect(tabs).toHaveLength(2); // Default tab + Custom tab
			expect(tabs.at(1).prop('children')).toBe('Custom Tab');
		});
	});
});

describe('helperMessage prop', () => {
	it('should pass helper message when the helperMessage prop is available', () => {
		const mockLink = 'link';
		const loadOptions = jest.fn();
		const onSubmit = jest.fn();
		const helperMessage = 'this is the helper message to be displayed';
		const shareForm = (shallowWithIntl as typeof shallow)(
			<ShareForm
				{...defaultProps}
				copyLink={mockLink}
				loadOptions={loadOptions}
				onSubmit={onSubmit}
				title="some title"
				product="confluence"
				helperMessage={helperMessage}
			/>,
		);
		const akForm = shareForm.find<FormProps<{}>>(Form);
		const form = renderProp(akForm, 'children', { formProps: {} }).dive().dive().find('form');
		const userPickerField = form.find(UserPickerField);

		expect(userPickerField.props().helperMessage).toEqual(helperMessage);
	});
});

describe('orgId prop', () => {
	it('should pass org id to userPickerField', () => {
		const mockLink = 'link';
		const mockOrgId = 'org-id';
		const loadOptions = jest.fn();
		const onSubmit = jest.fn();
		const helperMessage = 'this is the helper message to be displayed';
		const shareForm = (shallowWithIntl as typeof shallow)(
			<ShareForm
				{...defaultProps}
				copyLink={mockLink}
				loadOptions={loadOptions}
				onSubmit={onSubmit}
				title="some title"
				product="confluence"
				helperMessage={helperMessage}
				orgId={mockOrgId}
				enableSmartUserPicker
			/>,
		);
		const akForm = shareForm.find<FormProps<{}>>(Form);
		const form = renderProp(akForm, 'children', { formProps: {} }).dive().dive().find('form');
		const userPickerField = form.find(UserPickerField);

		expect(userPickerField.props().orgId).toEqual(mockOrgId);
	});
});
