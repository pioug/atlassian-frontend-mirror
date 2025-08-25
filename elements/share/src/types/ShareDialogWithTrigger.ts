import type { AnalyticsEventPayload } from '@atlaskit/analytics-next';
import { type NewCoreIconProps } from '@atlaskit/icon';
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
		iconBefore?: React.ComponentType<NewCoreIconProps>;
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
	| 'customTriggerButtonIcon'
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
	| 'customHeader'
	| 'customFooter'
	| 'isCopyDisabled'
	| 'isPublicLink'
	| 'integrationMode'
	| 'isMenuItemSelected'
	| 'shareFieldsFooter'
	| 'shareIntegrations'
	| 'additionalTabs'
	| 'builtInTabContentWidth'
	| 'shareAri'
	| 'tabIndex'
	| 'copyTooltipText'
	| 'dialogZIndex'
	| 'orgId'
	| 'isBrowseUsersDisabled'
	| 'userPickerOptions'
	| 'isSubmitShareDisabled'
	| 'additionalUserFields'
	| 'isExtendedShareDialogEnabled'
	| 'CustomSubmitButton'
> & {
	analyticsDecorator?: (payload: AnalyticsEventPayload) => AnalyticsEventPayload;
	children?: RenderCustomTriggerButton;
	config?: ConfigResponse;
	copyLink: string;
	copyLinkOrigin?: OriginTracing;
	formShareOrigin?: OriginTracing;
	isDisabled?: boolean;
	isFetchingConfig?: boolean;
	onShareSubmit?: (shareContentState: ShareData) => Promise<any>;
	submitButtonLabel?: React.ReactNode;
};

export type ShareDialogWithTriggerStates = {
	defaultValue: ShareData;
	ignoreIntermediateState: boolean;
	isDialogOpen: boolean;
	isLoading: boolean;
	isMenuItemSelected: boolean;
	isSharing: boolean;
	isUsingSplitButton: boolean;
	selectedIntegration: Integration | null;
	shareError?: ShareError;
	showIntegrationForm: boolean;
	tabIndex: number;
};
