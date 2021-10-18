import {
  AnalyticsContext,
  AnalyticsEventPayload,
  WithAnalyticsEventsProps,
  withAnalyticsEvents,
} from '@atlaskit/analytics-next';
import { Appearance } from '@atlaskit/button/types';
import SplitButton from './SplitButton';
import ShareIcon from '@atlaskit/icon/glyph/share';
import Popup, { TriggerProps } from '@atlaskit/popup';
import Portal from '@atlaskit/portal';
import Aktooltip from '@atlaskit/tooltip';
import { gridSize, layers } from '@atlaskit/theme/constants';
import { LoadOptions, Value } from '@atlaskit/user-picker';
import React from 'react';
import { FormattedMessage, InjectedIntlProps, injectIntl } from 'react-intl';
import styled from 'styled-components';
import { messages } from '../i18n';
import {
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
  Integration,
} from '../types';
import {
  cancelShare,
  CHANNEL_ID,
  copyLinkButtonClicked,
  formShareSubmitted,
  screenEvent,
  shareTriggerButtonClicked,
  shareSplitButtonEvent,
  ANALYTICS_SOURCE,
} from './analytics';
import ShareButton from './ShareButton';
import { ShareForm } from './ShareForm';
import { generateSelectZIndex } from './utils';
import { IconProps } from '@atlaskit/icon';
import { InlineDialogContentWrapper } from './styles';
import { IntegrationForm } from './IntegrationForm';

type DialogState = {
  isDialogOpen: boolean;
  isSharing: boolean;
  shareError?: ShareError;
  ignoreIntermediateState: boolean;
  defaultValue: DialogContentState;
  isUsingSplitButton: boolean;
  showIntegrationForm: boolean;
  selectedIntegration: Integration | null;
};

export type State = DialogState;

export type Props = {
  onTriggerButtonClick?: () => void;
  isAutoOpenDialog?: boolean;
  children?: RenderCustomTriggerButton;
  copyLink: string;
  analyticsDecorator?: (
    payload: AnalyticsEventPayload,
  ) => AnalyticsEventPayload;
  dialogPlacement?: DialogPlacement;
  dialogZIndex?: number;
  isDisabled?: boolean;
  loadUserOptions?: LoadOptions;
  onDialogOpen?: () => void;
  onDialogClose?: () => void;
  onShareSubmit?: (shareContentState: DialogContentState) => Promise<any>;
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
  onUserSelectionChange?: (value: Value) => void;
  shareFieldsFooter?: React.ReactNode;
  isCopyDisabled?: boolean;
  isPublicLink?: boolean;
  shareIntegrations?: Array<Integration>;
  /** Atlassian Resource Identifier of a Site resource to be shared. */
  shareAri?: string;
  tabIndex?: number;
  copyTooltipText?: string;
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
    ignoreIntermediateState: false,
    defaultValue: defaultShareContentState,
    isUsingSplitButton: false,
    showIntegrationForm: false,
    selectedIntegration: null,
  };

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
      ignoreIntermediateState: true,
      shareError: undefined,
      isDialogOpen: false,
      showIntegrationForm: false,
      selectedIntegration: null,
    });

    const { onUserSelectionChange, onDialogClose } = this.props;
    if (onUserSelectionChange) {
      onUserSelectionChange(defaultShareContentState.users);
    }
    if (onDialogClose) {
      onDialogClose();
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

  private getFlags = () => {
    const {
      intl: { formatMessage },
    } = this.props;

    // The reason for providing message property is that in jira,
    // the Flag system takes only Message Descriptor as payload
    // and formatMessage is called for every flag
    // if the translation data is not provided, a translated default message
    // will be displayed
    return [
      {
        appearance: 'success',
        title: {
          ...messages.shareSuccessMessage,
          defaultMessage: formatMessage(messages.shareSuccessMessage, {
            object: this.props.shareContentType.toLowerCase(),
          }),
        },
        type: OBJECT_SHARED,
      },
    ] as Flag[];
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
      (state) => ({
        isDialogOpen: !state.isDialogOpen,
        ignoreIntermediateState: false,
        showIntegrationForm: false,
        selectedIntegration: null,
      }),
      () => {
        const { onDialogOpen, isPublicLink } = this.props;
        const { isDialogOpen } = this.state;
        if (isDialogOpen) {
          this.start = Date.now();

          this.createAndFireEvent(
            screenEvent({
              isPublicLink,
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
    if (this.props.onDialogClose) {
      this.props.onDialogClose();
    }
    this.setState({
      isDialogOpen: false,
      showIntegrationForm: false,
      selectedIntegration: null,
    });
  };

  private handleShareSubmit = (data: DialogContentState) => {
    const {
      onShareSubmit,
      shareContentType,
      formShareOrigin,
      showFlags,
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
        isPublicLink,
      ),
    );

    onShareSubmit(data)
      .then(() => {
        this.closeAndResetDialog();
        this.setState({ isSharing: false });
        showFlags(this.getFlags());
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

  handleIntegrationClick = (integration: Integration) => {
    this.setState({
      isUsingSplitButton: false,
      isDialogOpen: true,
      showIntegrationForm: true,
      selectedIntegration: integration,
    });
  };

  renderShareTriggerButton = (triggerProps: TriggerProps) => {
    const { isDialogOpen, isUsingSplitButton } = this.state;
    const {
      intl: { formatMessage },
      isDisabled,
      renderCustomTriggerButton,
      triggerButtonIcon,
      triggerButtonTooltipText,
      triggerButtonTooltipPosition,
      triggerButtonAppearance,
      triggerButtonStyle,
      shareIntegrations,
      dialogZIndex,
      dialogPlacement,
    } = this.props;

    let button: React.ReactNode;
    const ShareButtonIcon: React.ComponentType<IconProps> =
      triggerButtonIcon || ShareIcon;

    // Render a custom or standard button.
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

    // If the button only shows the icon, wrap it in a tooltip containing the button text.
    if (triggerButtonStyle === 'icon-only') {
      button = (
        <Aktooltip
          content={
            !isUsingSplitButton
              ? triggerButtonTooltipText ||
                formatMessage(messages.shareTriggerButtonTooltipText)
              : null
          }
          position={triggerButtonTooltipPosition}
          hideTooltipOnClick
        >
          {button}
        </Aktooltip>
      );
    }

    // If there are any integrations, wrap the share button in a split button with integrations.
    if (shareIntegrations?.length) {
      button = (
        <SplitButton
          shareButton={button}
          handleOpenSplitButton={this.handleOpenSplitButton}
          handleCloseSplitButton={this.handleCloseSplitButton}
          isUsingSplitButton={isUsingSplitButton}
          triggerButtonAppearance={triggerButtonAppearance}
          dialogZIndex={dialogZIndex}
          dialogPlacement={dialogPlacement}
          shareIntegrations={shareIntegrations}
          onIntegrationClick={this.handleIntegrationClick}
          createAndFireEvent={this.createAndFireEvent}
        />
      );
    }

    return button;
  };

  handleOpenSplitButton = () => {
    this.handleDialogOpen();
    this.setState({
      isUsingSplitButton: true,
    });
    this.createAndFireEvent(shareSplitButtonEvent());
  };

  handleCloseSplitButton = () => {
    this.setState({
      isUsingSplitButton: false,
    });
  };

  render() {
    const {
      isDialogOpen,
      isSharing,
      shareError,
      defaultValue,
      showIntegrationForm,
      selectedIntegration,
    } = this.state;
    const {
      copyLink,
      dialogPlacement,
      loadUserOptions,
      shareFormTitle,
      contentPermissions,
      bottomMessage,
      submitButtonLabel,
      product,
      customFooter,
      enableSmartUserPicker,
      loggedInAccountId,
      cloudId,
      shareFieldsFooter,
      onUserSelectionChange,
      dialogZIndex,
      isPublicLink,
      tabIndex,
      copyTooltipText,
    } = this.props;

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
                {showIntegrationForm && selectedIntegration !== null ? (
                  <InlineDialogFormWrapper>
                    <IntegrationForm
                      Content={selectedIntegration.Content}
                      onIntegrationClose={this.handleCloseDialog}
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
                      onLinkCopy={this.handleCopyLink}
                      submitButtonLabel={submitButtonLabel}
                      product={product}
                      enableSmartUserPicker={enableSmartUserPicker}
                      loggedInAccountId={loggedInAccountId}
                      cloudId={cloudId}
                      onUserSelectionChange={onUserSelectionChange}
                      fieldsFooter={shareFieldsFooter}
                      selectPortalRef={this.selectPortalRef}
                      isPublicLink={isPublicLink}
                      copyTooltipText={copyTooltipText}
                    />
                  </InlineDialogFormWrapper>
                )}
                {bottomMessage ? (
                  <BottomMessageWrapper>{bottomMessage}</BottomMessageWrapper>
                ) : null}
                {customFooter && (
                  <CustomFooterWrapper>{customFooter}</CustomFooterWrapper>
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
