import type { AnalyticsEventPayload } from '@atlaskit/analytics-next';
import type { Placement } from '@atlaskit/popper';
import type { TriggerProps } from '@atlaskit/popup';

import type { ConfigResponse } from '../clients/ShareServiceClient';

import type { OriginTracing } from './OriginTracing';
import type { ShareData, ShareError } from './ShareContentState';
import type { ShareDialogContainerProps } from './ShareDialogContainer';
import type { Integration } from './ShareEntities';

export type RenderCustomTriggerButton = (
	args: {
		error?: ShareError;
		isDisabled?: boolean;
		isSelected?: boolean;
		onClick: () => void;
	},
	triggerProps: TriggerProps,
) => React.ReactNode;

export type DialogPlacement = Placement;

/**
 * Ideally, this would be Pick<PopupProps, ''>, but that doesn't play well
 * with the demo page and clearly visible options on that page.
 */
export type DialogBoundariesElement = 'viewport' | 'window' | 'scrollParent';

export type ShareDialogWithTriggerProps = Pick<
	ShareDialogContainerProps,
	| 'onTriggerButtonClick'
	| 'isAutoOpenDialog'
	| 'shouldCloseOnEscapePress'
	| 'dialogPlacement'
	| 'loadUserOptions'
	| 'onDialogOpen'
	| 'onDialogClose'
	| 'onUserSelectionChange'
	| 'renderCustomTriggerButton'
	| 'shareContentType'
	| 'shareContentSubType'
	| 'shareContentId'
	| 'shareFormTitle'
	| 'shareFormHelperMessage'
	| 'showFlags'
	| 'enableSmartUserPicker'
	| 'loggedInAccountId'
	| 'triggerButtonAppearance'
	| 'triggerButtonIcon'
	| 'triggerButtonStyle'
	| 'triggerButtonTooltipPosition'
	| 'triggerButtonTooltipText'
	| 'cloudId'
	| 'bottomMessage'
	| 'product'
	| 'productAttributes'
	| 'customFooter'
	| 'isCopyDisabled'
	| 'isPublicLink'
	| 'integrationMode'
	| 'isMenuItemSelected'
	| 'shareFieldsFooter'
	| 'shareIntegrations'
	| 'additionalTabs'
	| 'shareAri'
	| 'tabIndex'
	| 'copyTooltipText'
	| 'dialogZIndex'
	| 'orgId'
	| 'isBrowseUsersDisabled'
	| 'userPickerOptions'
> & {
	config?: ConfigResponse;
	isFetchingConfig?: boolean;
	children?: RenderCustomTriggerButton;
	copyLink: string;
	analyticsDecorator?: (payload: AnalyticsEventPayload) => AnalyticsEventPayload;
	isDisabled?: boolean;
	onShareSubmit?: (shareContentState: ShareData) => Promise<any>;
	copyLinkOrigin?: OriginTracing;
	formShareOrigin?: OriginTracing;
	submitButtonLabel?: React.ReactNode;
};

export type ShareDialogWithTriggerStates = {
	isLoading: boolean;
	isDialogOpen: boolean;
	isSharing: boolean;
	shareError?: ShareError;
	ignoreIntermediateState: boolean;
	defaultValue: ShareData;
	isUsingSplitButton: boolean;
	showIntegrationForm: boolean;
	selectedIntegration: Integration | null;
	tabIndex: number;
	isMenuItemSelected: boolean;
};
