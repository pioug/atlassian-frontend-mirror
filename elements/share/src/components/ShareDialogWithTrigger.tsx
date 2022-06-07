import React from 'react';

import {
  FormattedMessage,
  injectIntl,
  WrappedComponentProps,
} from 'react-intl-next';
import styled from 'styled-components';

import {
  AnalyticsEventPayload,
  withAnalyticsEvents,
  WithAnalyticsEventsProps,
} from '@atlaskit/analytics-next';
import { IconProps } from '@atlaskit/icon';
import ShareIcon from '@atlaskit/icon/glyph/share';
import Popup, { TriggerProps } from '@atlaskit/popup';
import Portal from '@atlaskit/portal';
import { layers } from '@atlaskit/theme/constants';
import Aktooltip from '@atlaskit/tooltip';

import { messages } from '../i18n';
import {
  Flag,
  Integration,
  OBJECT_SHARED,
  ShareData,
  ShareDialogWithTriggerProps,
  ShareDialogWithTriggerStates,
} from '../types';

import {
  cancelShare,
  CHANNEL_ID,
  copyLinkButtonClicked,
  formShareSubmitted,
  screenEvent,
  shareSplitButtonEvent,
  shareTabClicked,
  shareTriggerButtonClicked,
  // type TabSubjectIdType,
} from './analytics/analytics';
// eslint-disable-next-line no-duplicate-imports
import type { TabSubjectIdType } from './analytics/analytics';
import { isValidFailedExperience } from './analytics/ufoExperienceHelper';
import {
  renderShareDialogExp,
  shareSubmitExp,
} from './analytics/ufoExperiences';
import LazyShareFormLazy from './LazyShareForm/lazy';
import ShareButton from './ShareButton';
import SplitButton from './SplitButton';
import { generateSelectZIndex, resolveShareFooter } from './utils';

const ShareButtonWrapper = styled.div`
  display: inline-flex;
  outline: none;
`;

export const defaultShareContentState: ShareData = {
  users: [],
  comment: {
    format: 'plain_text' as const,
    value: '',
  },
};

type ShareDialogWithTriggerInternalProps = ShareDialogWithTriggerProps &
  WrappedComponentProps &
  WithAnalyticsEventsProps;

// eslint-disable-next-line @repo/internal/react/no-class-components
export class ShareDialogWithTriggerInternal extends React.PureComponent<
  ShareDialogWithTriggerInternalProps,
  ShareDialogWithTriggerStates
> {
  static defaultProps: Partial<ShareDialogWithTriggerProps> = {
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

  state: ShareDialogWithTriggerStates = {
    isDialogOpen: false,
    isSharing: false,
    ignoreIntermediateState: false,
    defaultValue: defaultShareContentState,
    isUsingSplitButton: false,
    showIntegrationForm: false,
    selectedIntegration: null,
    tabIndex: 0,
  };

  componentDidMount() {
    if (this.props.isAutoOpenDialog) {
      this.handleDialogOpen();
    }
  }

  componentDidUpdate(prevProps: ShareDialogWithTriggerProps) {
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

  private onTabChange = (index: number) => {
    let subjectId = 'shareTab' as TabSubjectIdType;

    if (index === 1) {
      subjectId = 'shareToSlackTab';
    }

    this.createAndFireEvent(shareTabClicked(subjectId));
    this.setState({ tabIndex: index });
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
            // This experience should be aborted in a scenario when a user closes the dialog before the shareClient.getConfig() call is finished
            // It is a race condition between the `SUCCEEDED` case and the `ABORTED` case of this experience
            // UFO experiences can only have one FINAL state so it doesn't matter if we call .abort() after the experience has succeeded and vice versa
            renderShareDialogExp.abort();
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

    // This experience should be aborted in a scenario when a user closes the dialog before the shareClient.getConfig() call is finished
    // It is a race condition between the `SUCCEEDED` case and the `ABORTED` case of this experience
    // UFO experiences can only have one FINAL state so it doesn't matter if we call .abort() after the experience has succeeded and vice versa
    renderShareDialogExp.abort();

    this.setState({
      isDialogOpen: false,
      showIntegrationForm: false,
      selectedIntegration: null,
      tabIndex: 0,
    });
  };

  private handleShareSubmit = (data: ShareData) => {
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

    shareSubmitExp.start();

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

        shareSubmitExp.success();
      })
      .catch((err: Error) => {
        this.setState({
          isSharing: false,
          shareError: {
            message: err.message,
          },
        });

        isValidFailedExperience(shareSubmitExp, err);
      });
  };

  private handleFormDismiss = (data: ShareData) => {
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
      integrationMode,
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
          isDisabled,
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
          aria-label={formatMessage(messages.shareTriggerButtonText)}
          onClick={this.onTriggerClick}
          iconBefore={
            triggerButtonStyle !== 'text-only' ? (
              <ShareButtonIcon label="" />
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
    if (integrationMode === 'split' && shareIntegrations?.length) {
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
    this.setState(
      {
        isUsingSplitButton: true,
      },
      () => this.handleCloseDialog(),
    );
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
      config,
      isFetchingConfig,
      loadUserOptions,
      shareFormTitle,
      shareFormHelperMessage,
      bottomMessage,
      submitButtonLabel,
      product,
      customFooter,
      enableSmartUserPicker,
      loggedInAccountId,
      cloudId,
      orgId,
      shareFieldsFooter,
      onUserSelectionChange,
      dialogZIndex,
      isPublicLink,
      tabIndex,
      copyTooltipText,
      integrationMode,
      shareIntegrations,
    } = this.props;

    const style =
      typeof tabIndex !== 'undefined' && tabIndex >= 0
        ? { outline: 'none' }
        : undefined;

    const footer = resolveShareFooter(
      integrationMode,
      this.state.tabIndex,
      customFooter,
    );

    // for performance purposes, we may want to have a loadable content i.e. ShareForm
    return (
      <ShareButtonWrapper
        tabIndex={tabIndex}
        onKeyDown={this.handleKeyDown}
        style={style}
      >
        <Popup
          content={() => (
            <div ref={this.containerRef}>
              <LazyShareFormLazy
                Content={selectedIntegration && selectedIntegration.Content}
                selectedIntegration={selectedIntegration}
                copyLink={copyLink}
                showIntegrationForm={showIntegrationForm}
                bottomMessage={bottomMessage}
                customFooter={footer}
                loadOptions={loadUserOptions}
                isSharing={isSharing}
                shareFormTitle={shareFormTitle}
                showTitle={
                  integrationMode !== 'tabs' ||
                  !shareIntegrations ||
                  !shareIntegrations.length
                }
                shareFormHelperMessage={shareFormHelperMessage}
                shareError={shareError}
                defaultValue={defaultValue}
                config={config}
                isFetchingConfig={isFetchingConfig}
                submitButtonLabel={submitButtonLabel}
                product={product}
                enableSmartUserPicker={enableSmartUserPicker}
                loggedInAccountId={loggedInAccountId}
                cloudId={cloudId}
                orgId={orgId}
                onUserSelectionChange={onUserSelectionChange}
                shareFieldsFooter={shareFieldsFooter}
                isPublicLink={isPublicLink}
                copyTooltipText={copyTooltipText}
                integrationMode={integrationMode}
                shareIntegrations={shareIntegrations}
                // actions
                onLinkCopy={this.handleCopyLink}
                onSubmit={this.handleShareSubmit}
                onDismiss={this.handleFormDismiss}
                onDialogClose={this.handleCloseDialog}
                onTabChange={this.onTabChange}
                //ref
                selectPortalRef={this.selectPortalRef}
              />
            </div>
          )}
          isOpen={isDialogOpen}
          onClose={this.handleCloseDialog}
          placement={dialogPlacement}
          trigger={this.renderShareTriggerButton}
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

export const ShareDialogWithTrigger: React.ComponentType<ShareDialogWithTriggerProps> = withAnalyticsEvents()(
  injectIntl(ShareDialogWithTriggerInternal),
);
