/** @jsx jsx */
import React from 'react';

import { css, jsx } from '@emotion/react';
import { FormattedMessage, injectIntl, type WrappedComponentProps } from 'react-intl-next';

import { AnalyticsContext } from '@atlaskit/analytics-next';
import Button from '@atlaskit/button/new';
import Form, { RequiredAsterisk } from '@atlaskit/form';
import EmailIcon from '@atlaskit/icon/glyph/email';
import ErrorIcon from '@atlaskit/icon/glyph/error';
import { MenuGroup } from '@atlaskit/menu';
import { Box, xcss } from '@atlaskit/primitives';
import Tabs, { Tab, TabList, TabPanel } from '@atlaskit/tabs';
import { N300, R400 } from '@atlaskit/theme/colors';
import { fontSizeSmall } from '@atlaskit/theme/constants';
import { token } from '@atlaskit/tokens';
import Tooltip from '@atlaskit/tooltip';

import { messages } from '../i18n';
import {
	type FormChildrenArgs,
	type MenuType,
	type ShareData,
	type ShareFormProps,
	TabType,
} from '../types';

import { ANALYTICS_SOURCE, INTEGRATION_MODAL_SOURCE } from './analytics/analytics';
import { CommentField } from './CommentField';
import CopyLinkButton from './CopyLinkButton';
import { IntegrationForm } from './IntegrationForm';
import { ShareHeader } from './ShareHeader';
import { ShareMenuItem } from './ShareMenuItem';
import { UserPickerField } from './UserPickerField';

const submitButtonWrapperStyles = css({
	display: 'flex',
	marginLeft: 'auto',
});

const centerAlignedIconWrapperStyles = css({
	display: 'flex',
	alignSelf: 'center',
	padding: `${token('space.0', '0px')} ${token('space.150', '12px')}`,
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors -- Ignored via go/DSP-18766
	'> div': {
		lineHeight: 1,
	},
});

// eslint-disable-next-line @atlaskit/ui-styling-standard/no-exported-styles, @atlaskit/design-system/no-exported-css -- Ignored via go/DSP-18766
export const formWrapperStyles = css({
	marginTop: token('space.100', '8px'),
	width: '100%',
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors, @atlaskit/ui-styling-standard/no-unsafe-selectors -- Ignored via go/DSP-18766
	'#ghx-modes-tools #ghx-share & h1:first-child': {
		marginTop: 0,
	},
});

// eslint-disable-next-line @atlaskit/ui-styling-standard/no-exported-styles, @atlaskit/design-system/no-exported-css -- Ignored via go/DSP-18766
export const formFooterStyles = css({
	display: 'flex',
	justifyContent: 'flex-start',
});

const formFieldStyles = css({
	marginBottom: token('space.150', '12px'),
});

const integrationWrapperStyles = css({
	display: 'flex',
	alignItems: 'center',
});

const integrationIconWrapperStyles = css({
	marginBottom: token('space.negative.075', '-6px'),
	marginRight: token('space.050', '4px'),
});

const requiredFieldInfoStyles = css({
	marginBottom: token('space.200', '16px'),
	color: token('color.text.subtle', N300),
	fontSize: `${fontSizeSmall()}px`,
});

const menuGroupContainerStyles = xcss({
	color: 'color.text',
	borderRadius: 'border.radius',
	backgroundColor: 'elevation.surface.overlay',
	alignItems: 'flex-start',
	width: '150px',
	margin: `${token('space.negative.100')} ${token('space.negative.300')}`,
});

const integrationTabText = (integrationName: string) => (
	<FormattedMessage {...messages.shareInIntegrationButtonText} values={{ integrationName }} />
);

export type State = {
	selectedTab: TabType;
	selectedMenuItem: MenuType;
};

export type InternalFormProps = FormChildrenArgs<ShareData> &
	ShareFormProps &
	WrappedComponentProps;

// eslint-disable-next-line @repo/internal/react/no-class-components
class InternalForm extends React.PureComponent<InternalFormProps> {
	static defaultProps = {
		onSubmit: () => {},
	};

	state: State = {
		selectedTab: TabType.default,
		selectedMenuItem: 'none',
	};

	componentWillUnmount() {
		const { onDismiss, getValues } = this.props;
		if (onDismiss) {
			onDismiss(getValues());
		}
	}

	renderShareForm = () => {
		const {
			formProps,
			title,
			showTitle = true,
			loadOptions,
			onLinkCopy,
			copyLink,
			defaultValue,
			config,
			isFetchingConfig,
			product,
			onUserInputChange,
			enableSmartUserPicker,
			loggedInAccountId,
			cloudId,
			onUserSelectionChange,
			fieldsFooter,
			selectPortalRef,
			isDisabled,
			isPublicLink,
			copyTooltipText,
			helperMessage,
			orgId,
			isBrowseUsersDisabled,
			intl: { formatMessage },
			shareError,
			userPickerOptions,
		} = this.props;

		return (
			<AnalyticsContext data={{ source: ANALYTICS_SOURCE }}>
				<form {...formProps}>
					{showTitle && <ShareHeader title={title} />}
					<div css={requiredFieldInfoStyles}>
						<FormattedMessage {...messages.requiredFieldSummary} />
						<RequiredAsterisk />
					</div>
					<div css={formFieldStyles}>
						<UserPickerField
							onInputChange={onUserInputChange}
							onChange={onUserSelectionChange}
							loadOptions={loadOptions}
							defaultValue={defaultValue && defaultValue.users}
							config={config}
							isLoading={isFetchingConfig}
							product={product || 'confluence'}
							enableSmartUserPicker={enableSmartUserPicker}
							loggedInAccountId={loggedInAccountId}
							cloudId={cloudId}
							selectPortalRef={selectPortalRef}
							isPublicLink={isPublicLink}
							helperMessage={helperMessage}
							orgId={orgId}
							isBrowseUsersDisabled={isBrowseUsersDisabled}
							shareError={shareError}
							userPickerOptions={userPickerOptions}
						/>
					</div>
					<div css={formFieldStyles}>
						<CommentField defaultValue={defaultValue && defaultValue.comment} />
					</div>
					{fieldsFooter}
					<div css={formFooterStyles} data-testid="form-footer">
						<CopyLinkButton
							isDisabled={isDisabled}
							onLinkCopy={onLinkCopy}
							link={copyLink}
							copyTooltipText={copyTooltipText}
							copyLinkButtonText={formatMessage(
								isPublicLink ? messages.copyPublicLinkButtonText : messages.copyLinkButtonText,
							)}
							copiedToClipboardText={formatMessage(messages.copiedToClipboardMessage)}
						/>
						{this.renderSubmitButton()}
					</div>
				</form>
			</AnalyticsContext>
		);
	};

	renderSubmitButton = () => {
		const {
			intl: { formatMessage },
			isSharing,
			shareError,
			submitButtonLabel,
			isDisabled,
			isPublicLink,
			integrationMode,
		} = this.props;
		const isRetryableError = !!shareError?.retryable;
		const isNonRetryableError = shareError && !shareError.retryable;
		const shouldShowWarning = isRetryableError && !isSharing;

		const buttonAppearance = !shouldShowWarning ? 'primary' : 'warning';
		const tabMode = integrationMode === 'tabs';
		const formPublicLabel = tabMode ? messages.formSharePublic : messages.formSendPublic;
		const formSendLabel = messages.formShare;
		const sendLabel = isPublicLink ? formPublicLabel : formSendLabel;
		const buttonLabel = isRetryableError ? messages.formRetry : sendLabel;
		const buttonDisabled = isDisabled || isNonRetryableError;
		const ButtonLabelWrapper = buttonAppearance === 'warning' ? 'strong' : React.Fragment;

		return (
			<div css={submitButtonWrapperStyles}>
				<div css={centerAlignedIconWrapperStyles}>
					{shouldShowWarning && (
						<Tooltip
							content={<FormattedMessage {...messages.shareFailureMessage} />}
							position="top"
						>
							<ErrorIcon
								label={formatMessage(messages.shareFailureIconLabel)}
								primaryColor={token('color.icon.danger', R400)}
							/>
						</Tooltip>
					)}
				</div>
				<Button
					appearance={buttonAppearance}
					type="submit"
					isLoading={isSharing}
					isDisabled={buttonDisabled}
				>
					<ButtonLabelWrapper>
						{submitButtonLabel || <FormattedMessage {...buttonLabel} />}
					</ButtonLabelWrapper>
				</Button>
			</div>
		);
	};

	renderMainTabTitle = () => {
		const { title, product } = this.props;

		if (title) {
			return title;
		}

		if (!product) {
			return <FormattedMessage {...messages.formTitle} />;
		}

		const productShareType =
			product === 'jira'
				? { ...messages.shareMainTabTextJira }
				: { ...messages.shareMainTabTextConfluence };

		return <FormattedMessage {...productShareType} />;
	};

	changeTab = (tab: TabType) => {
		this.setState({ selectedTab: tab });
		this.props.onTabChange?.(tab);
	};

	changeMenuItem = (menuItem: MenuType) => {
		this.setState({ selectedMenuItem: menuItem });
		this.props.onMenuItemChange?.(menuItem);
	};

	render() {
		const { integrationMode = 'off', shareIntegrations, handleCloseDialog } = this.props;

		const { selectedMenuItem } = this.state;

		if (integrationMode === 'off' || !shareIntegrations || !shareIntegrations.length) {
			return this.renderShareForm();
		}

		const firstIntegration = shareIntegrations[0];

		if (selectedMenuItem === 'default') {
			return this.renderShareForm();
		}

		if (selectedMenuItem === 'Slack') {
			return (
				<IntegrationForm
					Content={firstIntegration.Content}
					onIntegrationClose={() => handleCloseDialog?.()}
				/>
			);
		}

		if (integrationMode === 'menu') {
			return (
				<Box xcss={menuGroupContainerStyles}>
					<MenuGroup>
						<ShareMenuItem
							iconName={<firstIntegration.Icon />}
							labelId={messages.slackMenuItemText}
							onClickHandler={() => this.changeMenuItem('Slack')}
						/>
						<ShareMenuItem
							iconName={<EmailIcon label="" size="medium" />}
							labelId={messages.emailMenuItemText}
							onClickHandler={() => this.changeMenuItem('default')}
						/>
					</MenuGroup>
				</Box>
			);
		}

		if (integrationMode === 'tabs') {
			return (
				<Tabs
					id="ShareForm-Tabs-Integrations"
					onChange={this.changeTab}
					selected={this.state.selectedTab}
				>
					<TabList>
						<Tab key={`share-tab-default`}>{this.renderMainTabTitle()}</Tab>
						<Tab key={`share-tab-${firstIntegration.type}`}>
							<div css={integrationWrapperStyles}>
								<span css={integrationIconWrapperStyles}>
									<firstIntegration.Icon />
								</span>
								{integrationTabText(firstIntegration.type)}
							</div>
						</Tab>
					</TabList>
					<TabPanel key={`share-tabPanel-default`}>
						<div css={formWrapperStyles}>{this.renderShareForm()}</div>
					</TabPanel>
					<TabPanel key={`share-tabPanel-integration`}>
						<AnalyticsContext data={{ source: INTEGRATION_MODAL_SOURCE }}>
							<div css={formWrapperStyles}>
								<IntegrationForm
									Content={firstIntegration.Content}
									onIntegrationClose={() => handleCloseDialog?.()}
									changeTab={this.changeTab}
								/>
							</div>
						</AnalyticsContext>
					</TabPanel>
				</Tabs>
			);
		}

		return this.renderShareForm();
	}
}

const InternalFormWithIntl = injectIntl(InternalForm);

export const ShareForm: React.FC<ShareFormProps> = (props) => (
	<Form<ShareData> onSubmit={props.onSubmit!}>
		{({ formProps, getValues }) => (
			<InternalFormWithIntl {...props} formProps={formProps} getValues={getValues} />
		)}
	</Form>
);

ShareForm.defaultProps = {
	isSharing: false,
	product: 'confluence',
	onSubmit: () => {},
};
