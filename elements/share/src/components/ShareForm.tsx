import Button from '@atlaskit/button/custom-theme-button';
import Form from '@atlaskit/form';
import ErrorIcon from '@atlaskit/icon/glyph/error';
import { R400 } from '@atlaskit/theme/colors';
import { gridSize } from '@atlaskit/theme/constants';
import Tooltip from '@atlaskit/tooltip';
import { LoadOptions, OptionData, Value } from '@atlaskit/user-picker';
import React from 'react';
import { FormattedMessage, injectIntl, InjectedIntlProps } from 'react-intl';
import styled from 'styled-components';
import { messages } from '../i18n';
import {
  Comment,
  DialogContentState,
  FormChildrenArgs,
  ProductName,
} from '../types';
import { CommentField } from './CommentField';
import CopyLinkButton from './CopyLinkButton';
import { ShareHeader } from './ShareHeader';
import { UserPickerField } from './UserPickerField';

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

export const FormWrapper = styled.div`
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

type ShareError = {
  message: string;
};

export type ShareData = {
  users: OptionData[];
  comment: Comment;
};

export type Props = {
  copyLink: string;
  isSharing?: boolean;
  loadOptions?: LoadOptions;
  onLinkCopy?: (link: string) => void;
  onSubmit?: (data: ShareData) => void;
  shareError?: ShareError;
  submitButtonLabel?: React.ReactNode;
  title?: React.ReactNode;
  contentPermissions?: React.ReactNode;
  onDismiss?: (data: ShareData) => void;
  defaultValue?: DialogContentState;
  product: ProductName;
  onUserInputChange?: (query?: string, sessionId?: string) => void;
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
};

export type InternalFormProps = FormChildrenArgs<ShareData> &
  Props &
  InjectedIntlProps;

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
      formProps,
      title,
      contentPermissions,
      loadOptions,
      onLinkCopy,
      copyLink,
      defaultValue,
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
    } = this.props;
    return (
      <FormWrapper>
        <form {...formProps}>
          <ShareHeader title={title} contentPermissions={contentPermissions} />
          <FormField>
            <UserPickerField
              onInputChange={onUserInputChange}
              onChange={onUserSelectionChange}
              loadOptions={loadOptions}
              defaultValue={defaultValue && defaultValue.users}
              product={product}
              enableSmartUserPicker={enableSmartUserPicker}
              loggedInAccountId={loggedInAccountId}
              cloudId={cloudId}
              selectPortalRef={selectPortalRef}
              isPublicLink={isPublicLink}
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
      </FormWrapper>
    );
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
