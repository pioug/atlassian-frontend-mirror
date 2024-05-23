import type { Appearance } from '@atlaskit/button/types';
import type { IconProps } from '@atlaskit/icon';
import type { LoadOptions, Value } from '@atlaskit/smart-user-picker';

import type {
  ShortenRequest,
  UrlShortenerClient,
} from '../clients/AtlassianUrlShortenerClient';
import type { ShareClient } from '../clients/ShareServiceClient';

import type { Flag } from './Flag';
import type { OriginTracing, OriginTracingFactory } from './OriginTracing';
import type { ProductId, ProductName } from './Products';
import type { ShareButtonStyle, TooltipPosition } from './ShareButton';
import type {
  DialogPlacement,
  RenderCustomTriggerButton,
} from './ShareDialogWithTrigger';
import type { Integration, IntegrationMode } from './ShareEntities';
import type { UserPickerOptions } from './UserPickerOptions';

export type ShareDialogContainerProps = {
  /* Callback function to be called on trigger button click. */
  onTriggerButtonClick?: () => void;
  /* Callback function to be called on dialog open. */
  onDialogOpen?: () => void;
  /* Callback function to be called on dialog close. */
  onDialogClose?: () => void;
  /* Allow the share dialog to be opened via a Prop. */
  isAutoOpenDialog?: boolean;
  /** Share service client implementation that gets share configs and performs share.
   * Optional, a default one is provided. */
  shareClient?: ShareClient;
  /** URL Shortener service client implementation that may shorten links for copy.
   * Optional, a default one is provided. */
  urlShortenerClient?: UrlShortenerClient;
  /** Data provided to the `urlShortenerClient` to shorten the shared URL.
   * If it is not provided, the link will not be shortened.
   * If link shortening fails, the full URL will be shared instead. */
  shortLinkData?: ShortenRequest;
  /** Cloud ID of the instance.
   * Note: we assume this props is stable. */
  cloudId: string;
  /** Organisation ID of the instance. */
  orgId?: string;
  /** Placement of the modal to the trigger button. */
  dialogPlacement?: DialogPlacement;
  /**
   * Z-index that the popup should be displayed in.
   * This is passed to the portal component.
   * Defaults to `layers.modal()` from `@atlaskit/theme`.
   */
  dialogZIndex?: number;
  /** Transform function to provide custom formatted copy link.
   * Optional, a default one is provided. */
  formatCopyLink?: (origin: OriginTracing, link: string) => string;
  /** Function used to load users options asynchronously. Not needed if smart user picker is enabled. */
  loadUserOptions?: LoadOptions;
  /** Factory function to generate new Origin Tracing instance. */
  originTracingFactory: OriginTracingFactory;
  /** Product ID (Canonical ID) in ARI of the share request.
   * Note: we assume this props is stable. */
  productId: ProductId;
  /** Render function for a custom Share Dialog Trigger Button. */
  renderCustomTriggerButton?: RenderCustomTriggerButton;
  /** Atlassian Resource Identifier of a Site resource to be shared. */
  shareAri: string;
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
  /** Content SubType of the resource to be shared. Optional. */
  /** embed */
  shareContentSubType?: string;
  /** Content ID of the resource to be shared. Optional. */
  shareContentId?: string;
  /** Link of the resource to be shared (should NOT includes origin tracing).
   * Optional, the current page URL is used by default. */
  shareLink?: string;
  /** Title of the resource to be shared that will be sent in notifications. */
  shareTitle: string;
  /** Title of the share modal. */
  shareFormTitle?: React.ReactNode;
  /** Copy for helper message to be displayed under share form input box.
   * If set to empty string, no helper message will be displayed
   */
  shareFormHelperMessage?: string;
  /** To enable closing the modal on escape key press. */
  shouldCloseOnEscapePress?: boolean;
  /**
   * Callback function for showing successful share flag(s) with a parameter providing details of the flag, including the type of the message with a localized default title
   * This package has an opinion on showing flag(s) upon successful share, and Flag system is NOT provided. Instead, showFlag prop is available for this purpose.
   */
  showFlags: (flags: Array<Flag>) => void;
  /**
   * Power the user picker with smarts. To enable smart user picker, the following props are used:
   * - `product`: 'jira' or 'confluence'
   * - `loggedInAccountId`: if not provided, defaults to obtaining from request context
   * - `cloudId`
   */
  enableSmartUserPicker?: boolean;
  /**
   * The userId of the sharer. If not provided, smart user picker
   * defaults it to the value 'Context'
   * which will tell the recommendation service to extract the
   * value from the request context.
   */
  loggedInAccountId?: string;
  /** Appearance of the share modal trigger button  */
  triggerButtonAppearance?: Appearance;
  /** Share button Icon */
  triggerButtonIcon?: React.ComponentType<IconProps>;
  /** Style of the share modal trigger button. */
  triggerButtonStyle?: ShareButtonStyle;
  /** Position of the tooltip on share modal trigger button. */
  triggerButtonTooltipPosition?: TooltipPosition;
  /** Custom text of the tooltip on share modal trigger button. */
  triggerButtonTooltipText?: React.ReactNode;
  /** Message to be appended to the modal. */
  bottomMessage?: React.ReactNode;
  /** @deprecated Use the `shortLinkData` prop instead.
   *
   * Whether we should use the Atlassian Url Shortener or not.
   * Note that all products may not be supported. */
  useUrlShortener?: boolean;
  /** Action that will be performed by the recipient when he/she receives the notification. */
  shareeAction?: 'view' | 'edit';
  /**
   * Optional, this prop can be `jira` or `confluence`. Default value is `confluence`.
   * We use this prop to control different text messages in UI.
   */
  product?: ProductName;
  /**
   * Footer for the share dialog.
   */
  customFooter?: React.ReactNode;
  /* common Props to pass to userPicker */
  userPickerOptions?: UserPickerOptions;
  /* Callback function to be called on user selection change in the share form. */
  onUserSelectionChange?: (value: Value) => void;
  /* Footer component to display under the share form fields. */
  shareFieldsFooter?: React.ReactNode;
  /* Indicates if the copy link and share link are disabled */
  isCopyDisabled?: boolean;
  /* Indicates if the link shared publicly accessible */
  isPublicLink?: boolean;
  /* Indicates the mode for integrations to be displayed */
  integrationMode?: IntegrationMode;
  /* Indicates if the menu item was clicked when 'integrationMode=menu' is active */
  isMenuItemSelected?: boolean
  /* List of share integrations */
  shareIntegrations?: Array<Integration>;
  /**
   * Optionally sets a tabIndex value if you need to set focus
   */
  tabIndex?: number;
  /* If present, will add a tooltip to the copy link and display link tooltip text */
  copyTooltipText?: string;
  /* disable looking up users and teams */
  isBrowseUsersDisabled?: boolean;
  /* Atlassian resource identifier of the workspace initiating the share */
  workspaceAri?: string;
};
