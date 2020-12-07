import {
  AnalyticsContext,
  AnalyticsEventPayload,
  WithAnalyticsEventsProps,
  withAnalyticsEvents,
} from '@atlaskit/analytics-next';
import { Appearance } from '@atlaskit/button/types';
import Button from '@atlaskit/button/custom-theme-button';
import ShareIcon from '@atlaskit/icon/glyph/share';
import Popup, { TriggerProps } from '@atlaskit/popup';
import Portal from '@atlaskit/portal';
import SectionMessage from '@atlaskit/section-message';
import Aktooltip from '@atlaskit/tooltip';
import { gridSize, layers } from '@atlaskit/theme/constants';
import { h500 } from '@atlaskit/theme/typography';
import { LoadOptions, Value } from '@atlaskit/user-picker';
import React from 'react';
import { FormattedMessage, InjectedIntlProps, injectIntl } from 'react-intl';
import styled from 'styled-components';
import { messages } from '../i18n';
import {
  ADMIN_NOTIFIED,
  ConfigResponse,
  DialogContentState,
  DialogPlacement,
  Flag,
  OBJECT_SHARED,
  OriginTracing,
  ProductName,
  RenderCustomTriggerButton,
  ShareButtonStyle,
  ShareError,
  TooltipPosition,
  SlackTeamsResponse,
  SlackConversationsResponse,
  SlackContentState,
  Conversation,
  Team,
} from '../types';
import {
  cancelShare,
  CHANNEL_ID,
  copyLinkButtonClicked,
  formShareSubmitted,
  screenEvent,
  shareTriggerButtonClicked,
  shareSlackModalScreenEvent,
  shareSlackButtonEvent,
  submitShareSlackButtonEvent,
  dismissSlackOnboardingEvent,
  shareSlackBackButtonEvent,
  ANALYTICS_SOURCE,
} from './analytics';
import ShareButton from './ShareButton';
import { ShareForm } from './ShareForm';
import { showAdminNotifiedFlag, generateSelectZIndex } from './utils';
import { IconProps } from '@atlaskit/icon';
import CrossIcon from '@atlaskit/icon/glyph/cross';
import PeopleIcon from '@atlaskit/icon/glyph/people';
import { SlackForm } from './SlackForm';
import {
  getIsOnboardingDismissed,
  setIsOnboardingDismissed,
} from './localStorageUtils';
import { InlineDialogContentWrapper } from './styles';

type DialogState = {
  isDialogOpen: boolean;
  isSharing: boolean;
  isSlackSharing: boolean;
  shareError?: ShareError;
  slackShareError?: ShareError;
  ignoreIntermediateState: boolean;
  defaultValue: DialogContentState;
  defaultSlackValue: SlackContentState;
  showSlackForm: boolean;
  isSlackOnboardingDismissed: boolean;
};

export type State = DialogState;

export type Props = {
  onTriggerButtonClick?: () => void;
  isAutoOpenDialog?: boolean;
  config?: ConfigResponse;
  children?: RenderCustomTriggerButton;
  copyLink: string;
  analyticsDecorator?: (
    payload: AnalyticsEventPayload,
  ) => AnalyticsEventPayload;
  dialogPlacement?: DialogPlacement;
  dialogZIndex?: number;
  isDisabled?: boolean;
  isFetchingConfig?: boolean;
  loadUserOptions?: LoadOptions;
  onDialogOpen?: () => void;
  onShareSubmit?: (shareContentState: DialogContentState) => Promise<any>;
  onSlackSubmit?: (slackShareContent: SlackContentState) => Promise<any>;
  renderCustomTriggerButton?: RenderCustomTriggerButton;
  shareContentType: string;
  shareFormTitle?: React.ReactNode;
  contentPermissions?: React.ReactNode;
  copyLinkOrigin?: OriginTracing;
  formShareOrigin?: OriginTracing;
  shouldCloseOnEscapePress?: boolean;
  showFlags: (flags: Array<Flag>) => void;
  enableSmartUserPicker?: boolean;
  loggedInAccountId?: string;
  cloudId?: string;
  triggerButtonAppearance?: Appearance;
  triggerButtonIcon?: React.ComponentType<IconProps>;
  triggerButtonStyle?: ShareButtonStyle;
  triggerButtonTooltipPosition?: TooltipPosition;
  triggerButtonTooltipText?: React.ReactNode;
  bottomMessage?: React.ReactNode;
  submitButtonLabel?: React.ReactNode;
  product: ProductName;
  customFooter?: React.ReactNode;
  enableShareToSlack?: boolean;
  isFetchingSlackTeams?: boolean;
  defaultSlackTeam?: Team;
  slackTeams: SlackTeamsResponse;
  isFetchingSlackConversations: boolean;
  slackConversations: SlackConversationsResponse;
  fetchSlackConversations: (teamId: string) => void;
  onUserSelectionChange?: (value: Value) => void;
  shareFieldsFooter?: React.ReactNode;
  isPublicLink?: boolean;
  /** Atlassian Resource Identifier of a Site resource to be shared. */
  shareAri?: string;
  tabIndex?: number;
};

const ShareButtonWrapper = styled.div`
  display: inline-flex;
  outline: none;
`;

const InlineDialogFormWrapper = styled.div`
  width: 352px;
`;

const BottomMessageWrapper = styled.div`
  width: 352px;
`;

const CustomFooterWrapper = styled.div`
  /* Must match inline dialog padding. */
  margin: 0 ${-gridSize() * 3}px ${-gridSize() * 2}px ${-gridSize() * 3}px;
`;

export const defaultShareContentState: DialogContentState = {
  users: [],
  comment: {
    format: 'plain_text' as const,
    value: '',
  },
};

export const defaultSlackContentState: SlackContentState = {
  team: {
    avatarUrl: '',
    label: '',
    value: '',
  },
  conversation: {
    label: '',
    value: '',
  },
  comment: {
    format: 'plain_text' as const,
    value: '',
  },
};

const SlackOnboardingFooterWrapper = styled.div`
  width: 400px;
  white-space: normal;
  margin-top: 20px;
  > * {
    border-radius: 0;
  }

  /* jira has a class override font settings on h1 in gh-custom-field-pickers.css */
  #ghx-modes-tools #ghx-share & h1:first-child {
    ${h500()}
    margin-top: 0;
  }
`;

const DismissOnboardingWrapper = styled.div`
  float: right;
  /* To position the cross icon */
  margin-top: -30px;
`;

export const CloseButton = (props: { dismissHandler: () => void }) => (
  <Button
    appearance="subtle-link"
    onClick={() => {
      props.dismissHandler();
    }}
  >
    <CrossIcon label="dismiss message" />
  </Button>
);

export const SlackOnboardingFooter = (
  props: {
    dismissHandler: () => void;
  } & InjectedIntlProps,
) => (
  <CustomFooterWrapper>
    <SlackOnboardingFooterWrapper>
      <SectionMessage
        appearance="change"
        icon={PeopleIcon}
        title={props.intl.formatMessage(messages.slackOnboardingFooterTitle)}
      >
        <DismissOnboardingWrapper>
          <CloseButton dismissHandler={props.dismissHandler} />
        </DismissOnboardingWrapper>
        <FormattedMessage {...messages.slackOnboardingFooterDescription} />
      </SectionMessage>
    </SlackOnboardingFooterWrapper>
  </CustomFooterWrapper>
);

type ShareDialogWithTriggerInternalProps = Props &
  InjectedIntlProps &
  WithAnalyticsEventsProps;

export class ShareDialogWithTriggerInternal extends React.PureComponent<
  ShareDialogWithTriggerInternalProps,
  State
> {
  static defaultProps: Partial<Props> = {
    isDisabled: false,
    dialogPlacement: 'bottom-end',
    shouldCloseOnEscapePress: true,
    triggerButtonAppearance: 'subtle',
    triggerButtonStyle: 'icon-only',
    triggerButtonTooltipPosition: 'top',
    dialogZIndex: layers.modal(),
  };
  private containerRef = React.createRef<HTMLDivElement>();
  /**
   * Because the PopUp component has a higher zIndex it causes
   * the select to be rendered within it, and add scrollbars.
   * We will render the select options the PopUp outside,
   */
  private selectPortalRef = React.createRef<HTMLDivElement>();
  private start: number = 0;

  state: State = {
    isDialogOpen: false,
    isSharing: false,
    isSlackSharing: false,
    ignoreIntermediateState: false,
    defaultValue: defaultShareContentState,
    defaultSlackValue: defaultSlackContentState,
    showSlackForm: false,
    isSlackOnboardingDismissed: false,
  };

  constructor(props: ShareDialogWithTriggerInternalProps) {
    super(props);

    let isSlackOnboardingDismissed = getIsOnboardingDismissed(props.product);

    if (isSlackOnboardingDismissed === null) {
      isSlackOnboardingDismissed = 'no';
    }

    this.state = {
      ...this.state,
      isSlackOnboardingDismissed:
        isSlackOnboardingDismissed === 'no' ? false : true,
    };
  }

  componentDidMount() {
    if (this.props.isAutoOpenDialog) {
      this.handleDialogOpen();
    }
  }

  componentDidUpdate(prevProps: Props) {
    if (
      this.props.isAutoOpenDialog !== prevProps.isAutoOpenDialog &&
      this.props.isAutoOpenDialog
    ) {
      this.handleDialogOpen();
    }
  }

  private closeAndResetDialog = () => {
    this.setState({
      defaultValue: defaultShareContentState,
      defaultSlackValue: defaultSlackContentState,
      ignoreIntermediateState: true,
      shareError: undefined,
      slackShareError: undefined,
      isDialogOpen: false,
      showSlackForm: false,
    });

    const { onUserSelectionChange } = this.props;
    if (onUserSelectionChange) {
      onUserSelectionChange(defaultShareContentState.users);
    }
  };

  private createAndFireEvent = (payload: AnalyticsEventPayload) => {
    const { createAnalyticsEvent, analyticsDecorator } = this.props;
    if (analyticsDecorator) {
      payload = analyticsDecorator(payload);
    }
    if (createAnalyticsEvent) {
      createAnalyticsEvent(payload).fire(CHANNEL_ID);
    }
  };

  private getFlags = (
    config: ConfigResponse | undefined,
    data: DialogContentState,
  ) => {
    const {
      intl: { formatMessage },
      isPublicLink = false,
    } = this.props;

    const flags: Array<Flag> = [];
    const shouldShowAdminNotifiedFlag = showAdminNotifiedFlag(
      config,
      data.users,
      isPublicLink,
    );

    if (shouldShowAdminNotifiedFlag) {
      flags.push({
        appearance: 'success',
        title: {
          ...messages.adminNotifiedMessage,
          defaultMessage: formatMessage(messages.adminNotifiedMessage),
        },
        type: ADMIN_NOTIFIED,
      });
    }

    flags.push({
      appearance: 'success',
      title: {
        ...messages.shareSuccessMessage,
        defaultMessage: formatMessage(messages.shareSuccessMessage, {
          object: this.props.shareContentType.toLowerCase(),
        }),
      },
      type: OBJECT_SHARED,
    });

    // The reason for providing message property is that in jira,
    // the Flag system takes only Message Descriptor as payload
    // and formatMessage is called for every flag
    // if the translation data is not provided, a translated default message
    // will be displayed
    return flags;
  };

  private getSlackFlags = (slackEntity: string) => {
    const { formatMessage } = this.props.intl;
    const flags: Array<Flag> = [];

    flags.push({
      appearance: 'success',
      title: {
        ...messages.slackSuccessMessage,
        defaultMessage: formatMessage(messages.slackSuccessMessage, {
          slackEntity,
        }),
      },
      type: OBJECT_SHARED,
    });

    // The reason for providing message property is that in jira,
    // the Flag system takes only Message Descriptor as payload
    // and formatMessage is called for every flag
    // if the translation data is not provided, a translated default message
    // will be displayed
    return flags;
  };

  private handleKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    const { isDialogOpen } = this.state;
    const { shouldCloseOnEscapePress } = this.props;
    if (isDialogOpen) {
      switch (event.key) {
        case 'Esc':
        case 'Escape':
          // The @atlaskit/popup will capture the event and auto-close, we
          // need to prevent that if the dialog is set to not close on `ESC`
          if (!shouldCloseOnEscapePress) {
            event.preventDefault();
            event.stopPropagation();
            // put the focus back onto the share dialog so that
            // the user can press the escape key again to close the dialog
            if (this.containerRef.current) {
              this.containerRef.current.focus();
            }
            return;
          }
          // The dialog will auto-close in @atlaskit/popup, we just need to fire
          // the right events.
          if (shouldCloseOnEscapePress) {
            this.createAndFireEvent(cancelShare(this.start));
            this.closeAndResetDialog();
          }
      }
    }
  };

  private handleDialogOpen = () => {
    this.setState(
      state => ({
        isDialogOpen: !state.isDialogOpen,
        ignoreIntermediateState: false,
      }),
      () => {
        const { onDialogOpen, isPublicLink, enableShareToSlack } = this.props;
        const { isDialogOpen, isSlackOnboardingDismissed } = this.state;
        if (isDialogOpen) {
          this.start = Date.now();

          const shareSlackOnboardingShown =
            enableShareToSlack && !isSlackOnboardingDismissed;
          this.createAndFireEvent(
            screenEvent({
              isPublicLink,
              enableShareToSlack,
              shareSlackOnboardingShown,
            }),
          );

          if (onDialogOpen) {
            onDialogOpen();
          }

          if (this.containerRef.current) {
            this.containerRef.current.focus();
          }
        }
      },
    );
  };

  private onTriggerClick = () => {
    const { onTriggerButtonClick } = this.props;
    this.createAndFireEvent(shareTriggerButtonClicked());
    this.handleDialogOpen();
    if (onTriggerButtonClick) {
      onTriggerButtonClick();
    }
  };

  private handleCloseDialog = (): void => {
    this.setState({ isDialogOpen: false, showSlackForm: false });
  };

  private handleShareSubmit = (data: DialogContentState) => {
    const {
      onShareSubmit,
      shareContentType,
      formShareOrigin,
      showFlags,
      config,
      isPublicLink,
    } = this.props;
    if (!onShareSubmit) {
      return;
    }

    this.setState({ isSharing: true });

    this.createAndFireEvent(
      formShareSubmitted(
        this.start,
        data,
        shareContentType,
        formShareOrigin,
        config,
        isPublicLink,
      ),
    );

    onShareSubmit(data)
      .then(() => {
        this.closeAndResetDialog();
        this.setState({ isSharing: false });
        showFlags(this.getFlags(config, data));
      })
      .catch((err: Error) => {
        this.setState({
          isSharing: false,
          shareError: {
            message: err.message,
          },
        });
      });
  };

  private handleFormDismiss = (data: DialogContentState) => {
    this.setState(({ ignoreIntermediateState }) =>
      ignoreIntermediateState ? null : { defaultValue: data },
    );
  };

  private handleSlackFormDismiss = (data: SlackContentState) => {
    this.setState(({ ignoreIntermediateState }) =>
      ignoreIntermediateState ? null : { defaultSlackValue: data },
    );
  };

  handleCopyLink = () => {
    const {
      copyLinkOrigin,
      shareContentType,
      isPublicLink,
      shareAri,
    } = this.props;
    this.createAndFireEvent(
      copyLinkButtonClicked(
        this.start,
        shareContentType,
        copyLinkOrigin,
        isPublicLink,
        shareAri,
      ),
    );
  };

  private handleSlackSubmit = async (data: SlackContentState) => {
    const { onSlackSubmit, showFlags, config, shareContentType } = this.props;
    if (!onSlackSubmit) {
      return;
    }

    this.setState({ isSlackSharing: true });

    // Form share submitted event
    this.createAndFireEvent(
      submitShareSlackButtonEvent(data, config, shareContentType),
    );

    try {
      await onSlackSubmit(data);

      this.closeAndResetDialog();
      this.setState({ isSlackSharing: false });
      showFlags(this.getSlackFlags((data.conversation as Conversation).label));
    } catch (err) {
      this.setState({
        isSlackSharing: false,
        slackShareError: {
          message: err.message,
        },
      });
    }
  };

  renderShareTriggerButton = (triggerProps: TriggerProps) => {
    const { isDialogOpen } = this.state;
    const {
      intl: { formatMessage },
      isDisabled,
      renderCustomTriggerButton,
      triggerButtonIcon,
      triggerButtonTooltipText,
      triggerButtonTooltipPosition,
      triggerButtonAppearance,
      triggerButtonStyle,
    } = this.props;

    let button: React.ReactNode;
    const ShareButtonIcon: React.ComponentType<IconProps> =
      triggerButtonIcon || ShareIcon;

    if (renderCustomTriggerButton) {
      const { shareError } = this.state;
      button = renderCustomTriggerButton(
        {
          error: shareError,
          isSelected: isDialogOpen,
          onClick: this.onTriggerClick,
        },
        triggerProps,
      );
    } else {
      button = (
        <ShareButton
          appearance={triggerButtonAppearance}
          text={
            triggerButtonStyle !== 'icon-only' ? (
              <FormattedMessage {...messages.shareTriggerButtonText} />
            ) : null
          }
          onClick={this.onTriggerClick}
          iconBefore={
            triggerButtonStyle !== 'text-only' ? (
              <ShareButtonIcon
                label={formatMessage(messages.shareTriggerButtonIconLabel)}
              />
            ) : undefined
          }
          isSelected={isDialogOpen}
          isDisabled={isDisabled}
          {...triggerProps}
        />
      );
    }

    if (triggerButtonStyle === 'icon-only') {
      button = (
        <Aktooltip
          content={
            triggerButtonTooltipText ||
            formatMessage(messages.shareTriggerButtonTooltipText)
          }
          position={triggerButtonTooltipPosition}
          hideTooltipOnClick
        >
          {button}
        </Aktooltip>
      );
    }

    return button;
  };

  toggleShareToSlack = () => {
    this.setState(
      {
        showSlackForm: !this.state.showSlackForm,
      },
      () => {
        const { showSlackForm } = this.state;
        this.handleOnboardingDismiss(true);

        if (showSlackForm) {
          this.createAndFireEvent(shareSlackButtonEvent());
        } else {
          this.createAndFireEvent(shareSlackBackButtonEvent());
        }
      },
    );
  };

  handleSlackFormOpen = () => {
    this.createAndFireEvent(shareSlackModalScreenEvent());
  };

  handleOnboardingDismiss = (doNotFireEvent: Boolean = false) => {
    this.setState({
      isSlackOnboardingDismissed: true,
    });

    if (doNotFireEvent === false) {
      this.createAndFireEvent(dismissSlackOnboardingEvent());
    }

    setIsOnboardingDismissed(this.props.product, 'yes');
  };

  handleUserInputChanged = (query?: string) => {
    const { enableShareToSlack } = this.props;
    const { isSlackOnboardingDismissed } = this.state;
    if (enableShareToSlack && !isSlackOnboardingDismissed && query) {
      this.handleOnboardingDismiss(true);
    }
  };

  render() {
    const {
      isDialogOpen,
      isSharing,
      isSlackSharing,
      shareError,
      slackShareError,
      defaultValue,
      defaultSlackValue,
      showSlackForm,
      isSlackOnboardingDismissed,
    } = this.state;
    const {
      copyLink,
      dialogPlacement,
      isFetchingConfig,
      loadUserOptions,
      shareFormTitle,
      contentPermissions,
      config,
      bottomMessage,
      submitButtonLabel,
      product,
      customFooter,
      enableShareToSlack,
      isFetchingSlackTeams,
      slackTeams,
      isFetchingSlackConversations,
      fetchSlackConversations,
      slackConversations,
      defaultSlackTeam,
      enableSmartUserPicker,
      loggedInAccountId,
      cloudId,
      shareFieldsFooter,
      onUserSelectionChange,
      dialogZIndex,
      isPublicLink,
      tabIndex,
    } = this.props;

    const showSlackOnboardingBanner =
      enableShareToSlack &&
      !isSlackOnboardingDismissed &&
      slackTeams.length > 0;
    const style =
      typeof tabIndex !== 'undefined' && tabIndex >= 0
        ? { outline: 'none' }
        : undefined;

    // for performance purposes, we may want to have a loadable content i.e. ShareForm
    return (
      <ShareButtonWrapper
        tabIndex={tabIndex}
        onKeyDown={this.handleKeyDown}
        style={style}
      >
        <Popup
          content={() => (
            <AnalyticsContext data={{ source: ANALYTICS_SOURCE }}>
              <InlineDialogContentWrapper innerRef={this.containerRef}>
                {showSlackForm ? (
                  <InlineDialogFormWrapper>
                    <SlackForm
                      loadOptions={loadUserOptions}
                      isSharing={isSlackSharing}
                      onSubmit={this.handleSlackSubmit}
                      contentPermissions={contentPermissions}
                      shareError={slackShareError}
                      onOpen={this.handleSlackFormOpen}
                      onDismiss={this.handleSlackFormDismiss}
                      defaultValue={defaultSlackValue}
                      config={config}
                      isFetchingConfig={isFetchingConfig}
                      toggleShareToSlack={this.toggleShareToSlack}
                      isFetchingSlackTeams={isFetchingSlackTeams}
                      defaultSlackTeam={defaultSlackTeam}
                      slackTeams={slackTeams}
                      isFetchingSlackConversations={
                        isFetchingSlackConversations
                      }
                      fetchSlackConversations={fetchSlackConversations}
                      slackConversations={slackConversations}
                      product={product}
                    />
                  </InlineDialogFormWrapper>
                ) : (
                  <InlineDialogFormWrapper>
                    <ShareForm
                      copyLink={copyLink}
                      loadOptions={loadUserOptions}
                      isSharing={isSharing}
                      onSubmit={this.handleShareSubmit}
                      title={shareFormTitle}
                      contentPermissions={contentPermissions}
                      shareError={shareError}
                      onDismiss={this.handleFormDismiss}
                      defaultValue={defaultValue}
                      config={config}
                      onLinkCopy={this.handleCopyLink}
                      isFetchingConfig={isFetchingConfig}
                      submitButtonLabel={submitButtonLabel}
                      product={product}
                      enableShareToSlack={enableShareToSlack}
                      toggleShareToSlack={this.toggleShareToSlack}
                      slackTeams={slackTeams}
                      onUserInputChange={this.handleUserInputChanged}
                      enableSmartUserPicker={enableSmartUserPicker}
                      loggedInAccountId={loggedInAccountId}
                      cloudId={cloudId}
                      onUserSelectionChange={onUserSelectionChange}
                      fieldsFooter={shareFieldsFooter}
                      selectPortalRef={this.selectPortalRef}
                      isPublicLink={isPublicLink}
                    />
                  </InlineDialogFormWrapper>
                )}
                {!showSlackOnboardingBanner &&
                !isFetchingSlackTeams &&
                bottomMessage ? (
                  <BottomMessageWrapper>{bottomMessage}</BottomMessageWrapper>
                ) : null}
                {customFooter && (
                  <CustomFooterWrapper>{customFooter}</CustomFooterWrapper>
                )}
                {showSlackOnboardingBanner && (
                  <SlackOnboardingFooter
                    dismissHandler={this.handleOnboardingDismiss}
                    intl={this.props.intl}
                  />
                )}
              </InlineDialogContentWrapper>
            </AnalyticsContext>
          )}
          isOpen={isDialogOpen}
          onClose={this.handleCloseDialog}
          placement={dialogPlacement}
          trigger={(triggerProps: TriggerProps) =>
            this.renderShareTriggerButton(triggerProps)
          }
          zIndex={dialogZIndex}
        />
        {/* The select menu portal */}
        <Portal zIndex={generateSelectZIndex(dialogZIndex)}>
          <div ref={this.selectPortalRef} />
        </Portal>
      </ShareButtonWrapper>
    );
  }
}

export const ShareDialogWithTrigger = withAnalyticsEvents()(
  injectIntl(ShareDialogWithTriggerInternal),
);
