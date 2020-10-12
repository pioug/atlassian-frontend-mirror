import Button from '@atlaskit/button/custom-theme-button';
import Form, {
  FormFooter,
  FormSection,
  Field,
  ErrorMessage,
} from '@atlaskit/form';
import ErrorIcon from '@atlaskit/icon/glyph/error';
import { R400 } from '@atlaskit/theme/colors';
import { h500 } from '@atlaskit/theme/typography';
import Tooltip from '@atlaskit/tooltip';
import { LoadOptions } from '@atlaskit/user-picker';
import React from 'react';
import { FormattedMessage, injectIntl, InjectedIntlProps } from 'react-intl';
import styled from 'styled-components';
import { messages } from '../i18n';
import {
  ConfigResponse,
  FormChildrenArgs,
  SlackTeamsResponse,
  SlackConversationsResponse,
  SlackContentState,
  Team,
  Conversation,
  ProductName,
} from '../types';
import AsyncSelect, {
  ValueType,
  FormatOptionLabelMeta,
  createFilter,
} from '@atlaskit/select';
import { CommentField } from './CommentField';
import SlackButton from './SlackButton';
import ChevronLeftLargeIcon from '@atlaskit/icon/glyph/chevron-left-large';
import { setDefaultSlackWorkSpace } from './localStorageUtils';

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

const FormField = styled.div`
  margin-bottom: 12px;
`;

const SelectWrapper = styled.div`
  margin-bottom: 16px;
`;

/*
  The negative margin is to remove the extra padding a button component adds
  and bring the back button in line with the form
*/
const BackButtonWrapper = styled.div`
  margin-left: -18px;
`;

const BackIcon = <ChevronLeftLargeIcon label="Back button icon" />;

export const FromWrapper = styled.div`
  [class^='FormHeader__FormHeaderWrapper'] {
    h1:first-child {
      ${h500()}

      > span {
        /* jira has a class override font settings on h1 > span in gh-custom-field-pickers.css */
        font-size: inherit !important;
        line-height: inherit !important;
        letter-spacing: inherit !important;
      }
    }
  }

  [class^='FormSection__FormSectionWrapper'] {
    margin-top: 0px;
  }

  [class^='FormFooter__FormFooterWrapper'] {
    justify-content: space-between;
    margin-top: 12px;
    margin-bottom: 24px;
  }

  [class^='Field__FieldWrapper']:not(:first-child) {
    margin-top: 12px;
  }
`;

export const OptionWrapper = styled.div`
  display: flex;
  align-items: center;
`;

export const OptionLabelWrapper = styled.span`
  padding: 0 0 0 8px;
`;

type ShareError = {
  message: string;
};

export type Props = {
  config?: ConfigResponse;
  isSharing?: boolean;
  loadOptions?: LoadOptions;
  onSubmit?: (data: SlackContentState) => void;
  shareError?: ShareError;
  contentPermissions?: React.ReactNode;
  onDismiss?: (data: SlackContentState) => void;
  defaultValue?: SlackContentState;
  isFetchingConfig?: boolean;
  toggleShareToSlack?: () => void;
  isFetchingSlackTeams?: boolean;
  defaultSlackTeam?: Team;
  slackTeams: SlackTeamsResponse;
  isFetchingSlackConversations: boolean;
  fetchSlackConversations: (teamId: string) => void;
  slackConversations: SlackConversationsResponse;
  onOpen?: () => void;
  product: ProductName;
};

export const REQUIRED = 'REQUIRED';

export type InternalFormProps = FormChildrenArgs<SlackContentState> &
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

  componentDidMount() {
    const { onOpen } = this.props;
    if (onOpen) {
      onOpen();
    }
  }

  renderSubmitButton = () => {
    const {
      intl: { formatMessage },
      isSharing,
      shareError,
    } = this.props;
    const shouldShowWarning = shareError && !isSharing;
    const buttonAppearance = !shouldShowWarning ? 'default' : 'warning';
    const buttonLabel = shareError
      ? messages.formRetry
      : messages.slackShareButtonText;

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
        <SlackButton
          appearance={buttonAppearance}
          type="submit"
          isLoading={isSharing}
          text={<FormattedMessage {...buttonLabel} />}
        />
      </SubmitButtonWrapper>
    );
  };

  handleWorkspaceChange = (teamId: string | null) => {
    if (teamId) {
      setDefaultSlackWorkSpace(this.props.product, teamId);
      this.props.fetchSlackConversations(teamId);
    }
  };

  formatOptionLabel = (
    option: Team,
    { context }: FormatOptionLabelMeta<Team>,
  ) => {
    if (context === 'menu') {
      return (
        <OptionWrapper>
          <img src={option.avatarUrl} width="20" height="20" />
          <OptionLabelWrapper>{option.label}</OptionLabelWrapper>
        </OptionWrapper>
      );
    }
    return option.label;
  };

  validate = (item: ValueType<any>) => {
    if (!item) {
      return REQUIRED;
    }

    return;
  };

  render() {
    const {
      config,
      defaultValue,
      formProps,
      toggleShareToSlack,
      intl: { formatMessage },
      isFetchingConfig,
      isFetchingSlackTeams,
      slackTeams,
      slackConversations,
      isFetchingSlackConversations,
      defaultSlackTeam,
    } = this.props;

    return (
      <FromWrapper>
        <BackButtonWrapper>
          <Button
            testId="back-button"
            appearance="subtle-link"
            onClick={toggleShareToSlack}
            iconBefore={BackIcon}
          >
            <FormattedMessage {...messages.backButtonText} />
          </Button>
        </BackButtonWrapper>
        <form {...formProps}>
          <FormSection>
            <SelectWrapper>
              <Field<ValueType<Team>>
                name="team"
                isRequired
                validate={this.validate}
                defaultValue={defaultSlackTeam}
              >
                {({ fieldProps, meta: { valid }, error }) => (
                  <>
                    <AsyncSelect<Team>
                      {...fieldProps}
                      formatOptionLabel={this.formatOptionLabel}
                      maxMenuHeight={200}
                      placeholder={formatMessage(
                        messages.workspaceSelectorPlaceholder,
                      )}
                      spacing="compact"
                      isLoading={isFetchingSlackTeams || isFetchingConfig}
                      isDisabled={
                        isFetchingSlackTeams || isFetchingSlackConversations
                      }
                      options={slackTeams}
                      onChange={(newValue: ValueType<Team>) => {
                        fieldProps.onChange(newValue);
                        this.handleWorkspaceChange((newValue as Team).value);
                      }}
                    />
                    {!valid && error === REQUIRED && (
                      <ErrorMessage>
                        <FormattedMessage
                          {...messages.slackWorkspacePickerRequiredMessage}
                        />
                      </ErrorMessage>
                    )}
                  </>
                )}
              </Field>
            </SelectWrapper>
            <SelectWrapper>
              <Field<ValueType<Conversation>>
                name="conversation"
                validate={this.validate}
                isRequired
              >
                {({ fieldProps, meta: { valid }, error }) => (
                  <>
                    <AsyncSelect<Conversation>
                      {...fieldProps}
                      maxMenuHeight={150}
                      placeholder={formatMessage(
                        messages.channelSelectorPlaceholder,
                      )}
                      filterOption={createFilter({ ignoreAccents: false })}
                      spacing="compact"
                      options={slackConversations}
                      isLoading={
                        isFetchingSlackConversations || isFetchingConfig
                      }
                      isDisabled={
                        isFetchingSlackConversations ||
                        slackConversations.length < 1
                      }
                    />
                    {!valid && error === REQUIRED && (
                      <ErrorMessage>
                        <FormattedMessage
                          {...messages.slackChannelPickerRequiredMessage}
                        />
                      </ErrorMessage>
                    )}
                  </>
                )}
              </Field>
            </SelectWrapper>
            {config && config.allowComment && (
              <FormField>
                <CommentField
                  defaultValue={defaultValue && defaultValue.comment}
                />
              </FormField>
            )}
          </FormSection>
          <FormFooter align="start">{this.renderSubmitButton()}</FormFooter>
        </form>
      </FromWrapper>
    );
  }
}

const InternalFormWithIntl = injectIntl(InternalForm);

export const SlackForm: React.FC<Props> = props => (
  <Form<SlackContentState> onSubmit={props.onSubmit!}>
    {({ formProps, getValues }) => (
      <InternalFormWithIntl
        {...props}
        formProps={formProps}
        getValues={getValues}
      />
    )}
  </Form>
);

SlackForm.defaultProps = {
  isSharing: false,
  onSubmit: () => {},
};
