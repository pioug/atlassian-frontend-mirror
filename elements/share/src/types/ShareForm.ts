import type { LoadOptions } from '@atlaskit/smart-user-picker';

import type { ConfigResponse } from '../clients/ShareServiceClient';

import type { ProductName } from './Products';
import type { ShareData, ShareError } from './ShareContentState';
import type { ShareDialogContainerProps } from './ShareDialogContainer';
import { type MenuType } from './ShareEntities';

export type ShareFormProps = Pick<
	ShareDialogContainerProps,
	| 'integrationMode'
	| 'shareIntegrations'
	| 'additionalTabs'
	| 'builtInTabContentWidth'
	| 'copyTooltipText'
	| 'isPublicLink'
	| 'onUserSelectionChange'
	| 'cloudId'
	| 'loggedInAccountId'
	| 'enableSmartUserPicker'
	| 'orgId'
	| 'isBrowseUsersDisabled'
	| 'userPickerOptions'
	| 'productAttributes'
	| 'additionalUserFields'
	| 'isExtendedShareDialogEnabled'
	| 'CustomSubmitButton'
> & {
	config?: ConfigResponse;
	Content?: React.ReactNode;
	copyLink: string;
	defaultValue?: ShareData;
	fieldsFooter?: React.ReactNode;
	handleCloseDialog?: () => void;
	helperMessage?: string;
	isDisabled?: boolean;
	isFetchingConfig?: boolean;
	isSharing?: boolean;
	isSplitButton?: boolean;
	isSubmitShareDisabled?: boolean;
	loadOptions?: LoadOptions;
	onDismiss?: (data: ShareData) => void;
	onLinkCopy?: (link: string) => void;
	onMenuItemChange?: (menuItem: MenuType) => void;
	onSubmit?: (data: ShareData) => void;
	onTabChange?: (index: number) => void;
	onUserInputChange?: (query?: string, sessionId?: string) => void;
	product?: ProductName;
	selectedMenuItem?: number;
	selectPortalRef?: React.Ref<HTMLDivElement>;
	shareError?: ShareError;
	showTitle?: boolean;
	submitButtonLabel?: React.ReactNode;
	title?: React.ReactNode;
};

export type RenderCustomSubmitButtonProps = Pick<
	ShareFormProps,
	| 'isSharing'
	| 'isDisabled'
	| 'isSubmitShareDisabled'
	| 'isPublicLink'
	| 'shareError'
	| 'integrationMode'
	| 'submitButtonLabel'
>;
