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
> & {
	config?: ConfigResponse;
	isFetchingConfig?: boolean;
	copyLink: string;
	isSharing?: boolean;
	shareError?: ShareError;
	submitButtonLabel?: React.ReactNode;
	title?: React.ReactNode;
	showTitle?: boolean;
	helperMessage?: string;
	defaultValue?: ShareData;
	product?: ProductName;
	fieldsFooter?: React.ReactNode;
	selectPortalRef?: React.Ref<HTMLDivElement>;
	isDisabled?: boolean;
	isSplitButton?: boolean;
	loadOptions?: LoadOptions;
	onLinkCopy?: (link: string) => void;
	onSubmit?: (data: ShareData) => void;
	onDismiss?: (data: ShareData) => void;
	onUserInputChange?: (query?: string, sessionId?: string) => void;
	onTabChange?: (index: number) => void;
	onMenuItemChange?: (menuItem: MenuType) => void;
	selectedMenuItem?: number;
	Content?: React.ReactNode;
	handleCloseDialog?: () => void;
};
