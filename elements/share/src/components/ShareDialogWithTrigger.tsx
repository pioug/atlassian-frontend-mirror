/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import React from 'react';

// eslint-disable-next-line @atlaskit/ui-styling-standard/use-compiled -- Ignored via go/DSP-18766
import { css, jsx } from '@emotion/react';
import { FormattedMessage, injectIntl, type WrappedComponentProps } from 'react-intl-next';

import {
	type AnalyticsEventPayload,
	withAnalyticsEvents,
	type WithAnalyticsEventsProps,
} from '@atlaskit/analytics-next';
import { type Appearance } from '@atlaskit/button';
import { type NewCoreIconProps } from '@atlaskit/icon';
import ShareIcon from '@atlaskit/icon/core/migration/share';
import { fg } from '@atlaskit/platform-feature-flags';
import Popup, { type TriggerProps } from '@atlaskit/popup';
import Portal from '@atlaskit/portal';
import { layers } from '@atlaskit/theme/constants';
import Aktooltip from '@atlaskit/tooltip';
import { type Value } from '@atlaskit/user-picker';

import { messages } from '../i18n';
import {
	type Flag,
	type Integration,
	type MenuType,
	OBJECT_SHARED,
	type ShareData,
	type ShareDialogWithTriggerProps,
	type ShareDialogWithTriggerStates,
	type ShareError,
} from '../types';

import {
	ANALYTICS_SOURCE,
	cancelShare,
	CHANNEL_ID,
	copyLinkButtonClicked,
	formShareSubmitted,
	screenEvent,
	shareMenuItemClicked,
	shareSplitButtonEvent,
	shareTabClicked,
	shareTriggerButtonClicked,
	// type TabSubjectIdType,
} from './analytics/analytics';
// eslint-disable-next-line no-duplicate-imports
import type { MenuItemSubjectIdType, TabSubjectIdType } from './analytics/analytics';
import { isValidFailedExperience } from './analytics/ufoExperienceHelper';
import { renderShareDialogExp, shareSubmitExp } from './analytics/ufoExperiences';
import LazyShareFormLazy from './LazyShareForm/lazy';
import ShareButton from './ShareButton';
import { ShareDialogWithTriggerInternal as ShareDialogWithTriggerInternalNext } from './ShareDialogWithTriggerNext';
import SplitButton from './SplitButton';
import { generateSelectZIndex, resolveShareFooter } from './utils';

const shareButtonWrapperStyles = css({
	display: 'inline-flex',
	outline: 'none',
});

export const defaultShareContentState: ShareData = {
	users: [],
	comment: {
		format: 'plain_text' as const,
		value: '',
	},
};

export type ShareDialogWithTriggerInternalProps = ShareDialogWithTriggerProps &
	WrappedComponentProps &
	WithAnalyticsEventsProps;

export const IconShare = () => <ShareIcon spacing="spacious" label="" color="currentColor" />;

// eslint-disable-next-line @repo/internal/react/no-class-components
export class ShareDialogWithTriggerInternalLegacy extends React.PureComponent<
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
		isMenuItemSelected: false,
		isLoading: false,
	};

	componentDidMount() {
		if (this.props.isAutoOpenDialog) {
			this.handleDialogOpen();
		}
	}

	componentDidUpdate(prevProps: ShareDialogWithTriggerProps) {
		if (this.props.isAutoOpenDialog !== prevProps.isAutoOpenDialog && this.props.isAutoOpenDialog) {
			this.handleDialogOpen();
		}
	}

	componentWillUnmount() {
		if (this.props.isAutoOpenDialog && this.props.onDialogClose) {
			this.props.onDialogClose();
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
			isMenuItemSelected: false,
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
		const { shareContentType } = this.props;

		if (index === 1) {
			subjectId = 'shareToSlackTab';
		}

		this.createAndFireEvent(shareTabClicked(subjectId, shareContentType));
		this.setState({ tabIndex: index });
	};

	private onMenuItemChange = (menuType: MenuType) => {
		let subjectId: MenuItemSubjectIdType =
			menuType === 'Slack' ? 'shareToSlackMenuItem' : 'shareMenuItem';
		const { shareContentType } = this.props;

		this.createAndFireEvent(shareMenuItemClicked(subjectId, shareContentType));
		this.setState({ isMenuItemSelected: true });
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

	private setIsLoading = (isLoading: boolean) => {
		this.setState({ isLoading });
	};

	private focus = () => {
		if (this.containerRef.current) {
			this.containerRef.current.focus();
		}
	};

	private handleKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
		const { isLoading, isDialogOpen } = this.state;
		const { shouldCloseOnEscapePress } = this.props;

		if (isLoading) {
			event.stopPropagation();
			this.focus();
		}

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
						this.focus();
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

					this.focus();
				} else {
					this.handleCloseDialog();
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
			isMenuItemSelected: false,
		});
	};

	private async generateShareError(err: any): Promise<ShareError> {
		const errorBody = err.body ? await err.body : {};

		// We'll only try and deal with the first error, sorry
		const firstErrorFromBody = errorBody.messagesDetails?.[0];

		return {
			message: firstErrorFromBody?.message || err.message,
			errorCode: firstErrorFromBody?.errorCode,
			helpUrl: firstErrorFromBody?.helpUrl,
			retryable: firstErrorFromBody?.errorCode === undefined,
		};
	}

	private handleShareSubmit = (data: ShareData) => {
		const {
			onShareSubmit,
			shareContentType,
			shareContentSubType,
			shareContentId,
			formShareOrigin,
			showFlags,
			isPublicLink,
			createAnalyticsEvent,
			isExtendedShareDialogEnabled,
		} = this.props;
		if (!onShareSubmit) {
			return;
		}

		shareSubmitExp.start();

		this.setState({ isSharing: true });

		this.createAndFireEvent(
			formShareSubmitted({
				start: this.start,
				data,
				shareContentType,
				shareOrigin: formShareOrigin,
				isPublicLink,
				shareContentSubType,
				shareContentId,
			}),
		);

		if (createAnalyticsEvent) {
			createAnalyticsEvent({
				type: 'sendTrackEvent',
				data: {
					action: 'shared',
					actionSubject: 'page',
					source: ANALYTICS_SOURCE,
					attributes: {
						contentType: shareContentType,
						subContentType: shareContentSubType,
						shareData: data,
					},
				},
			}).fire();
		}

		onShareSubmit(data)
			.then(() => {
				this.closeAndResetDialog();
				this.setState({ isSharing: false });

				if (isExtendedShareDialogEnabled && data.users.length === 0) {
					shareSubmitExp.abort();
				} else {
					showFlags(this.getFlags());
					shareSubmitExp.success();
				}
			})
			.catch(async (err: Error) => {
				const shareError = await this.generateShareError(err).catch((errorGenFailed) => ({
					message: err.message || errorGenFailed.message || 'Unknown error',
					retryable: true,
				}));

				this.setState({
					isSharing: false,
					shareError,
				});

				isValidFailedExperience(shareSubmitExp, err);
			});
	};

	private handleFormDismiss = (data: ShareData) => {
		this.setState(({ ignoreIntermediateState }) =>
			ignoreIntermediateState ? null : { defaultValue: data },
		);
	};

	private calculatePopupOffset = ({
		isMenuItemSelected,
		dialogPlacement,
	}: {
		isMenuItemSelected?: boolean;
		dialogPlacement?: string;
	}): [number, number] => {
		if (isMenuItemSelected && dialogPlacement === 'bottom-end') {
			return [-0.1, 8];
		}
		return [0, 8];
	};

	handleCopyLink = () => {
		const {
			copyLinkOrigin,
			shareContentType,
			shareContentSubType,
			shareContentId,
			isPublicLink,
			shareAri,
		} = this.props;
		this.createAndFireEvent(
			copyLinkButtonClicked({
				start: this.start,
				shareContentType,
				shareOrigin: copyLinkOrigin,
				isPublicLink,
				ari: shareAri,
				shareContentSubType,
				shareContentId,
			}),
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
		const ShareButtonIcon: React.ComponentType<NewCoreIconProps> = triggerButtonIcon || IconShare;

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
					appearance={triggerButtonAppearance as Appearance}
					text={
						triggerButtonStyle !== 'icon-only' ? (
							<FormattedMessage {...messages.shareTriggerButtonText} />
						) : null
					}
					aria-label={formatMessage(messages.shareTriggerButtonText)}
					onClick={this.onTriggerClick}
					iconBefore={triggerButtonStyle !== 'text-only' ? <ShareButtonIcon label="" /> : undefined}
					isSelected={isDialogOpen}
					isDisabled={isDisabled}
					ref={triggerProps.ref}
					// When we autoFocus the dialog, we want to autofocus the trigger as well, that way when the dialog is closed, the trigger is focused
					autoFocus={this.props.isAutoOpenDialog}
				/>
			);
		}

		// If the button only shows the icon, wrap it in a tooltip containing the button text.
		if (triggerButtonStyle === 'icon-only') {
			button = (
				<Aktooltip
					content={
						!isUsingSplitButton
							? triggerButtonTooltipText || formatMessage(messages.shareTriggerButtonTooltipText)
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

	handleOnUserSelectionChange = (value: Value) => {
		const { onUserSelectionChange } = this.props;
		this.setState({
			shareError: undefined,
		});
		onUserSelectionChange?.(value);
	};

	render() {
		const {
			isDialogOpen,
			isSharing,
			shareError,
			defaultValue,
			showIntegrationForm,
			selectedIntegration,
			isMenuItemSelected,
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
			productAttributes,
			customHeader,
			customFooter,
			enableSmartUserPicker,
			loggedInAccountId,
			cloudId,
			orgId,
			shareFieldsFooter,
			dialogZIndex,
			isPublicLink,
			tabIndex,
			copyTooltipText,
			integrationMode,
			shareIntegrations,
			additionalTabs,
			builtInTabContentWidth,
			isBrowseUsersDisabled,
			userPickerOptions,
			isSubmitShareDisabled,
			additionalUserFields,
			isExtendedShareDialogEnabled,
			CustomSubmitButton,
		} = this.props;

		const style =
			typeof tabIndex !== 'undefined' && tabIndex >= 0 ? { outline: 'none' } : undefined;

		const footer = resolveShareFooter(integrationMode, this.state.tabIndex, customFooter);

		// for performance purposes, we may want to have a loadable content i.e. ShareForm
		return (
			// eslint-disable-next-line jsx-a11y/no-static-element-interactions
			<div
				css={shareButtonWrapperStyles}
				tabIndex={tabIndex}
				onKeyDown={this.handleKeyDown}
				// eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop -- Ignored via go/DSP-18766
				style={style}
			>
				{/* eslint-disable-next-line @atlaskit/design-system/use-should-render-to-parent */}
				<Popup
					content={() => (
						<div ref={this.containerRef}>
							<LazyShareFormLazy
								Content={selectedIntegration && selectedIntegration.Content}
								selectedIntegration={selectedIntegration}
								copyLink={copyLink}
								showIntegrationForm={showIntegrationForm}
								bottomMessage={bottomMessage}
								customHeader={customHeader}
								customFooter={footer}
								loadOptions={loadUserOptions}
								isSharing={isSharing}
								shareFormTitle={shareFormTitle}
								showTitle={
									integrationMode !== 'tabs' || !shareIntegrations || !shareIntegrations.length
								}
								shareFormHelperMessage={shareFormHelperMessage}
								shareError={shareError}
								defaultValue={defaultValue}
								config={config}
								isFetchingConfig={isFetchingConfig}
								setIsLoading={this.setIsLoading}
								submitButtonLabel={submitButtonLabel}
								product={product}
								productAttributes={productAttributes}
								enableSmartUserPicker={enableSmartUserPicker}
								loggedInAccountId={loggedInAccountId}
								cloudId={cloudId}
								orgId={orgId}
								onUserSelectionChange={this.handleOnUserSelectionChange}
								shareFieldsFooter={shareFieldsFooter}
								isPublicLink={isPublicLink}
								copyTooltipText={copyTooltipText}
								integrationMode={integrationMode}
								shareIntegrations={shareIntegrations}
								additionalTabs={additionalTabs}
								builtInTabContentWidth={builtInTabContentWidth}
								isMenuItemSelected={isMenuItemSelected}
								isSubmitShareDisabled={isSubmitShareDisabled}
								// actions
								onLinkCopy={this.handleCopyLink}
								onSubmit={this.handleShareSubmit}
								onDismiss={this.handleFormDismiss}
								onDialogClose={this.handleCloseDialog}
								onTabChange={this.onTabChange}
								onMenuItemChange={this.onMenuItemChange}
								//ref
								selectPortalRef={this.selectPortalRef}
								isBrowseUsersDisabled={isBrowseUsersDisabled}
								userPickerOptions={userPickerOptions}
								additionalUserFields={additionalUserFields}
								isExtendedShareDialogEnabled={isExtendedShareDialogEnabled}
								CustomSubmitButton={CustomSubmitButton}
							/>
						</div>
					)}
					isOpen={isDialogOpen}
					onClose={this.handleCloseDialog}
					placement={dialogPlacement}
					trigger={this.renderShareTriggerButton}
					zIndex={dialogZIndex}
					label={this.props.intl.formatMessage(messages.sharePopupLabel)}
					role="dialog"
					// TODO: remove after https://hello.atlassian.net/wiki/x/SoEGzQ experiment is finished
					offset={this.calculatePopupOffset({
						isMenuItemSelected,
						dialogPlacement,
					})}
					shouldRenderToParent={fg('enable-appropriate-reading-order-in-share-dialog')}
				/>

				{/* The select menu portal */}
				<Portal zIndex={generateSelectZIndex(dialogZIndex)}>
					<div ref={this.selectPortalRef} />
				</Portal>
			</div>
		);
	}
}

export const ShareDialogWithTriggerInternal = (props: ShareDialogWithTriggerInternalProps) =>
	fg('share-compiled-migration') ? (
		<ShareDialogWithTriggerInternalNext {...props} />
	) : (
		<ShareDialogWithTriggerInternalLegacy {...props} />
	);

export const ShareDialogWithTrigger: React.ComponentType<ShareDialogWithTriggerProps> =
	withAnalyticsEvents()(injectIntl(ShareDialogWithTriggerInternal));
