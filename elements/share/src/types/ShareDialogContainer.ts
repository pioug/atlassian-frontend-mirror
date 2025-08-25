import type { IconButtonProps } from '@atlaskit/button/new';
import type { NewCoreIconProps } from '@atlaskit/icon';
import type {
	LoadOptions,
	Props as SmartUserPickerProps,
	Value,
} from '@atlaskit/smart-user-picker';

import type { ShortenRequest, UrlShortenerClient } from '../clients/AtlassianUrlShortenerClient';
import type { ShareClient } from '../clients/ShareServiceClient';
import type { ShareData } from '../types';

import type { Flag } from './Flag';
import type { OriginTracing, OriginTracingFactory } from './OriginTracing';
import type { ProductId, ProductName } from './Products';
import type { ShareButtonStyle, TooltipPosition } from './ShareButton';
import type { DialogPlacement, RenderCustomTriggerButton } from './ShareDialogWithTrigger';
import type { AdditionalTab, Integration, IntegrationMode } from './ShareEntities';
import type { RenderCustomSubmitButtonProps } from './ShareForm';
import type { UserPickerOptions } from './UserPickerOptions';

export type ShareDialogContainerProps = {
	/* List of additional tabs to be displayed */
	additionalTabs?: Array<AdditionalTab>;
	/* Additional user fields to be displayed alongside the user picker */
	additionalUserFields?: React.ReactNode;
	/** Message to be appended to the modal. */
	bottomMessage?: React.ReactNode;
	/* Content container width used by built-in tabs */
	builtInTabContentWidth?: number;
	/** Cloud ID of the instance.
	 * Note: we assume this props is stable. */
	cloudId: string;
	/* If present, will add a tooltip to the copy link and display link tooltip text */
	copyTooltipText?: string;
	/**
	 * Footer for the share dialog.
	 */
	customFooter?: React.ReactNode;
	/**
	 * Header for the share dialog.
	 */
	customHeader?: React.ReactNode;
	/* Custom Share Dialog Submit Button. */
	CustomSubmitButton?: React.FC<RenderCustomSubmitButtonProps>;
	/** An Icon used for the custom Share Dialog Trigger Button */
	customTriggerButtonIcon?: React.ComponentType<NewCoreIconProps>;
	/** Placement of the modal to the trigger button. */
	dialogPlacement?: DialogPlacement;
	/**
	 * Z-index that the popup should be displayed in.
	 * This is passed to the portal component.
	 * Defaults to `layers.modal()` from `@atlaskit/theme`.
	 */
	dialogZIndex?: number;
	/**
	 * Power the user picker with smarts. To enable smart user picker, the following props are used:
	 * - `product`: 'jira' or 'confluence'
	 * - `loggedInAccountId`: if not provided, defaults to obtaining from request context
	 * - `cloudId`
	 */
	enableSmartUserPicker?: boolean;
	/** Transform function to provide custom formatted copy link.
	 * Optional, a default one is provided. */
	formatCopyLink?: (origin: OriginTracing, link: string) => string;
	/* Indicates the mode for integrations to be displayed */
	integrationMode?: IntegrationMode;
	/* Allow the share dialog to be opened via a Prop. */
	isAutoOpenDialog?: boolean;
	/* disable looking up users and teams */
	isBrowseUsersDisabled?: boolean;
	/* Indicates if the copy link and share link are disabled */
	isCopyDisabled?: boolean;
	/* Enables rendering of additional user fields alongside UI updates for project access level integrations */
	isExtendedShareDialogEnabled?: boolean;
	/* Indicates if the menu item was clicked when 'integrationMode=menu' is active */
	isMenuItemSelected?: boolean;
	/* Indicates if the link shared publicly accessible */
	isPublicLink?: boolean;
	/* Indicates if share submit button is disabled */
	isSubmitShareDisabled?: boolean;
	/** Function used to load users options asynchronously. Not needed if smart user picker is enabled. */
	loadUserOptions?: LoadOptions;
	/**
	 * The userId of the sharer. If not provided, smart user picker
	 * defaults it to the value 'Context'
	 * which will tell the recommendation service to extract the
	 * value from the request context.
	 */
	loggedInAccountId?: string;
	/* Callback function to be called on dialog close. */
	onDialogClose?: () => void;
	/* Callback function to be called on dialog open. */
	onDialogOpen?: () => void;
	/* Callback function to be called on share submit in the share form, this does not override the default share action. */
	onSubmit?: (formValues: ShareData) => void | Promise<void>;
	/* Callback function to be called on trigger button click. */
	onTriggerButtonClick?: () => void;
	/* Callback function to be called on user selection change in the share form. */
	onUserSelectionChange?: (value: Value) => void;
	/** Organisation ID of the instance. */
	orgId?: string;
	/** Factory function to generate new Origin Tracing instance. */
	originTracingFactory: OriginTracingFactory;
	/**
	 * Optional, this prop can be `jira` or `confluence`. Default value is `confluence`.
	 * We use this prop to control different text messages in UI.
	 */
	product?: ProductName;
	/* attributes that apply to the product */
	productAttributes?: SmartUserPickerProps['productAttributes'];
	/** Product ID (Canonical ID) in ARI of the share request.
	 * Note: we assume this props is stable. */
	productId: ProductId;
	/** Render function for a custom Share Dialog Trigger Button. */
	renderCustomTriggerButton?: RenderCustomTriggerButton;
	/** Atlassian Resource Identifier of a Site resource to be shared. */
	shareAri: string;
	/** Share service client implementation that gets share configs and performs share.
	 * Optional, a default one is provided. */
	shareClient?: ShareClient;
	/** Content ID of the resource to be shared. Optional. */
	shareContentId?: string;
	/** Content SubType of the resource to be shared. Optional. */
	/** embed */
	shareContentSubType?: string;
	/** Content Type of the resource to be shared. It will also affect on the successful share message in the flag. A pre-defined list as follows:*/
	/** blogpost */
	/** board */
	/** calendar */
	/** draft */
	/** filter */
	/** issue */
	/** media */
	/** page */
	/** project */
	/** pullrequest */
	/** question */
	/** report */
	/** repository */
	/** request */
	/** roadmap */
	/** site */
	/** space */
	/** Any other unlisted type will have a default message of "Link shared". */
	shareContentType: string;
	/** Action that will be performed by the recipient when he/she receives the notification. */
	shareeAction?: 'view' | 'edit';
	/* Footer component to display under the share form fields. */
	shareFieldsFooter?: React.ReactNode;
	/** Copy for helper message to be displayed under share form input box.
	 * If set to empty string, no helper message will be displayed
	 */
	shareFormHelperMessage?: string;
	/** Title of the share modal. */
	shareFormTitle?: React.ReactNode;
	/* List of share integrations */
	shareIntegrations?: Array<Integration>;
	/** Link of the resource to be shared (should NOT includes origin tracing).
	 * Optional, the current page URL is used by default. */
	shareLink?: string;
	/** Title of the resource to be shared that will be sent in notifications. */
	shareTitle: string;
	/** Data provided to the `urlShortenerClient` to shorten the shared URL.
	 * If it is not provided, the link will not be shortened.
	 * If link shortening fails, the full URL will be shared instead. */
	shortLinkData?: ShortenRequest;
	/** To enable closing the modal on escape key press. */
	shouldCloseOnEscapePress?: boolean;
	/**
	 * Callback function for showing successful share flag(s) with a parameter providing details of the flag, including the type of the message with a localized default title
	 * This package has an opinion on showing flag(s) upon successful share, and Flag system is NOT provided. Instead, showFlag prop is available for this purpose.
	 */
	showFlags: (flags: Array<Flag>) => void;
	/**
	 * Optionally sets a tabIndex value if you need to set focus
	 */
	tabIndex?: number;
	/** Appearance of the share modal trigger button  */
	triggerButtonAppearance?: IconButtonProps['appearance'];
	/** Share button Icon */
	triggerButtonIcon?: React.ComponentType<NewCoreIconProps>;
	/** Style of the share modal trigger button. */
	triggerButtonStyle?: ShareButtonStyle;
	/** Position of the tooltip on share modal trigger button. */
	triggerButtonTooltipPosition?: TooltipPosition;
	/** Custom text of the tooltip on share modal trigger button. */
	triggerButtonTooltipText?: React.ReactNode;
	/** URL Shortener service client implementation that may shorten links for copy.
	 * Optional, a default one is provided. */
	urlShortenerClient?: UrlShortenerClient;
	/* common Props to pass to userPicker */
	userPickerOptions?: UserPickerOptions;
	/** @deprecated Use the `shortLinkData` prop instead.
	 *
	 * Whether we should use the Atlassian Url Shortener or not.
	 * Note that all products may not be supported. */
	useUrlShortener?: boolean;
	/* Atlassian resource identifier of the workspace initiating the share */
	workspaceAri?: string;
};
