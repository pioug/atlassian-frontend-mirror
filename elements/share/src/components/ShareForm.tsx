import Button from '@atlaskit/button/custom-theme-button';
import Form from '@atlaskit/form';
import ErrorIcon from '@atlaskit/icon/glyph/error';
import { R400 } from '@atlaskit/theme/colors';
import { gridSize } from '@atlaskit/theme/constants';
import Tooltip from '@atlaskit/tooltip';
import { LoadOptions, OptionData, Value } from '@atlaskit/user-picker';
import Tabs, { Tab, TabList, TabPanel } from '@atlaskit/tabs';
import React from 'react';
import {
  FormattedMessage,
  injectIntl,
  WrappedComponentProps,
} from 'react-intl-next';
import styled from 'styled-components';
import { messages } from '../i18n';
import {
  Comment,
  ConfigResponse,
  DialogContentState,
  FormChildrenArgs,
  Integration,
  ProductName,
} from '../types';
import { CommentField } from './CommentField';
import CopyLinkButton from './CopyLinkButton';
import { ShareHeader } from './ShareHeader';
import { UserPickerField } from './UserPickerField';
import { IntegrationForm } from './IntegrationForm';
import { IntegrationMode } from '../types/ShareEntities';

const SubmitButtonWrapper = styled.div`
  display: flex;
  margin-left: auto;
`;

const CenterAlignedIconWrapper = styled.div`
  display: flex;
  align-self: center;
  padding: 0 10px;

  > div {
    line-height: 1;
  }
`;

interface FormWrapperType {
  isMainShare?: boolean;
}

export const FormWrapper = styled.div<FormWrapperType>`
  margin-top: ${(props) => (props.isMainShare ? gridSize() : gridSize() * 2)}px;
  width: 100%;

  /* jira has a class override font settings on h1 in gh-custom-field-pickers.css */
  #ghx-modes-tools #ghx-share & h1:first-child {
    margin-top: 0;
  }
`;

export const FormFooter = styled.div`
  margin-bottom: ${gridSize}px;
  display: flex;
  justify-content: flex-start;
`;

const FormField = styled.div`
  margin-bottom: 12px;
`;

const IntegrationWrapper = styled.div`
  display: flex;
  align-items: center;
`;

const IntegrationIconWrapper = styled.span`
  margin-right: 5px;
`;

const integrationTabText = (integrationName: string) => (
  <FormattedMessage
    {...messages.shareInIntegrationButtonText}
    values={{ integrationName }}
  />
);

type ShareError = {
  message: string;
};

export type ShareData = {
  users: OptionData[];
  comment: Comment;
};

export type Props = {
  config?: ConfigResponse;
  isFetchingConfig?: boolean;
  copyLink: string;
  isSharing?: boolean;
  loadOptions?: LoadOptions;
  onLinkCopy?: (link: string) => void;
  onSubmit?: (data: ShareData) => void;
  shareError?: ShareError;
  submitButtonLabel?: React.ReactNode;
  title?: React.ReactNode;
  showTitle?: boolean;
  helperMessage?: string;
  onDismiss?: (data: ShareData) => void;
  defaultValue?: DialogContentState;
  product: ProductName;
  onUserInputChange?: (query?: string, sessionId?: string) => void;
  onTabChange?: (index: number) => void;
  enableSmartUserPicker?: boolean;
  loggedInAccountId?: string;
  cloudId?: string;
  onUserSelectionChange?: (value: Value) => void;
  fieldsFooter?: React.ReactNode;
  selectPortalRef?: React.Ref<HTMLDivElement>;
  isDisabled?: boolean;
  isPublicLink?: boolean;
  isSplitButton?: boolean;
  copyTooltipText?: string;
  integrationMode?: IntegrationMode;
  shareIntegrations?: Array<Integration>;
};

export type InternalFormProps = FormChildrenArgs<ShareData> &
  Props &
  WrappedComponentProps;

class InternalForm extends React.PureComponent<InternalFormProps> {
  static defaultProps = {
    onSubmit: () => {},
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
    } = this.props;

    return (
      <form {...formProps}>
        {showTitle && <ShareHeader title={title} />}
        <FormField>
          <UserPickerField
            onInputChange={onUserInputChange}
            onChange={onUserSelectionChange}
            loadOptions={loadOptions}
            defaultValue={defaultValue && defaultValue.users}
            config={config}
            isLoading={isFetchingConfig}
            product={product}
            enableSmartUserPicker={enableSmartUserPicker}
            loggedInAccountId={loggedInAccountId}
            cloudId={cloudId}
            selectPortalRef={selectPortalRef}
            isPublicLink={isPublicLink}
            helperMessage={helperMessage}
          />
        </FormField>
        <FormField>
          <CommentField defaultValue={defaultValue && defaultValue.comment} />
        </FormField>
        {fieldsFooter}
        <FormFooter>
          <CopyLinkButton
            isDisabled={isDisabled}
            onLinkCopy={onLinkCopy}
            link={copyLink}
            isPublicLink={isPublicLink}
            copyTooltipText={copyTooltipText}
          />
          {this.renderSubmitButton()}
        </FormFooter>
      </form>
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
    } = this.props;
    const shouldShowWarning = shareError && !isSharing;
    const buttonAppearance = !shouldShowWarning ? 'primary' : 'warning';
    const sendLabel = isPublicLink
      ? messages.formSendPublic
      : messages.formSend;
    const buttonLabel = shareError ? messages.formRetry : sendLabel;
    const ButtonLabelWrapper =
      buttonAppearance === 'warning' ? 'strong' : React.Fragment;

    return (
      <SubmitButtonWrapper>
        <CenterAlignedIconWrapper>
          {shouldShowWarning && (
            <Tooltip
              content={<FormattedMessage {...messages.shareFailureMessage} />}
              position="top"
            >
              <ErrorIcon
                label={formatMessage(messages.shareFailureIconLabel)}
                primaryColor={R400}
              />
            </Tooltip>
          )}
        </CenterAlignedIconWrapper>
        <Button
          appearance={buttonAppearance}
          type="submit"
          isLoading={isSharing}
          isDisabled={isDisabled}
        >
          <ButtonLabelWrapper>
            {submitButtonLabel || <FormattedMessage {...buttonLabel} />}
          </ButtonLabelWrapper>
        </Button>
      </SubmitButtonWrapper>
    );
  };

  render() {
    const {
      title,
      integrationMode = 'off',
      shareIntegrations,
      onTabChange,
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
          onChange={(index) => {
            onTabChange?.(index);
          }}
        >
          <TabList>
            <Tab key={`share-tab-default`}>
              {title || <FormattedMessage {...messages.formTitle} />}
            </Tab>
            <Tab key={`share-tab-${firstIntegration.type}`}>
              <IntegrationWrapper>
                <IntegrationIconWrapper>
                  <firstIntegration.Icon />
                </IntegrationIconWrapper>
                {integrationTabText(firstIntegration.type)}
              </IntegrationWrapper>
            </Tab>
          </TabList>
          <TabPanel key={`share-tabPanel-default`}>
            <FormWrapper isMainShare>{this.renderShareForm()}</FormWrapper>
          </TabPanel>
          <TabPanel key={`share-tabPanel-integration`}>
            <FormWrapper isMainShare={false}>
              <IntegrationForm
                Content={firstIntegration.Content}
                onIntegrationClose={() => {
                  return null;
                }}
              />
            </FormWrapper>
          </TabPanel>
        </Tabs>
      );
    }

    return this.renderShareForm();
  }
}

const InternalFormWithIntl = injectIntl(InternalForm);

export const ShareForm: React.FC<Props> = (props) => (
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
