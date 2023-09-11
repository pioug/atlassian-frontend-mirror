/** @jsx jsx */
import React from 'react';

import { css, jsx } from '@emotion/react';
import {
  FormattedMessage,
  injectIntl,
  WrappedComponentProps,
} from 'react-intl-next';

import { AnalyticsContext } from '@atlaskit/analytics-next';
import Button from '@atlaskit/button/custom-theme-button';
import Form from '@atlaskit/form';
import ErrorIcon from '@atlaskit/icon/glyph/error';
import Tabs, { Tab, TabList, TabPanel } from '@atlaskit/tabs';
import { R400 } from '@atlaskit/theme/colors';
import { token } from '@atlaskit/tokens';
import Tooltip from '@atlaskit/tooltip';

import { messages } from '../i18n';
import { FormChildrenArgs, ShareData, ShareFormProps, TabType } from '../types';

import {
  ANALYTICS_SOURCE,
  INTEGRATION_MODAL_SOURCE,
} from './analytics/analytics';
import { CommentField } from './CommentField';
import CopyLinkButton from './CopyLinkButton';
import { IntegrationForm } from './IntegrationForm';
import { ShareHeader } from './ShareHeader';
import { UserPickerField } from './UserPickerField';

const submitButtonWrapperStyles = css`
  display: flex;
  margin-left: auto;
`;

const centerAlignedIconWrapperStyles = css`
  display: flex;
  align-self: center;
  padding: 0 10px;

  > div {
    line-height: 1;
  }
`;

export const formWrapperStyles = css`
  margin-top: ${token('space.100', '8px')};
  width: 100%;

  /* jira has a class override font settings on h1 in gh-custom-field-pickers.css */
  #ghx-modes-tools #ghx-share & h1:first-child {
    margin-top: 0;
  }
`;

export const formFooterStyles = css`
  display: flex;
  justify-content: flex-start;
`;

const formFieldStyles = css`
  margin-bottom: ${token('space.150', '12px')};
`;

const integrationWrapperStyles = css`
  display: flex;
  align-items: center;
`;

const integrationIconWrapperStyles = css`
  margin-bottom: ${token('space.negative.075', '-6px')};
  margin-right: 5px;
`;

const integrationTabText = (integrationName: string) => (
  <FormattedMessage
    {...messages.shareInIntegrationButtonText}
    values={{ integrationName }}
  />
);

export type State = {
  selectedTab: TabType;
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
    } = this.props;

    return (
      <AnalyticsContext data={{ source: ANALYTICS_SOURCE }}>
        <form {...formProps}>
          {showTitle && <ShareHeader title={title} />}
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
                isPublicLink
                  ? messages.copyPublicLinkButtonText
                  : messages.copyLinkButtonText,
              )}
              copiedToClipboardText={formatMessage(
                messages.copiedToClipboardMessage,
              )}
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
    const formPublicLabel = tabMode
      ? messages.formSharePublic
      : messages.formSendPublic;
    const formSendLabel = messages.formShare;
    const sendLabel = isPublicLink ? formPublicLabel : formSendLabel;
    const buttonLabel = isRetryableError ? messages.formRetry : sendLabel;
    const buttonDisabled = isDisabled || isNonRetryableError;
    const ButtonLabelWrapper =
      buttonAppearance === 'warning' ? 'strong' : React.Fragment;

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

  render() {
    const {
      integrationMode = 'off',
      shareIntegrations,
      handleCloseDialog,
    } = this.props;

    if (
      integrationMode === 'off' ||
      !shareIntegrations ||
      !shareIntegrations.length
    ) {
      return this.renderShareForm();
    }

    const firstIntegration = shareIntegrations[0];

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
      <InternalFormWithIntl
        {...props}
        formProps={formProps}
        getValues={getValues}
      />
    )}
  </Form>
);

ShareForm.defaultProps = {
  isSharing: false,
  product: 'confluence',
  onSubmit: () => {},
};
