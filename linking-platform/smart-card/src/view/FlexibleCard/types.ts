import { MessageDescriptor } from 'react-intl-next';
import type { JsonLd } from 'json-ld-types';
import {
  CardState,
  LinkingPlatformFeatureFlags,
} from '@atlaskit/linking-common';
import { CardProviderRenderers } from '@atlaskit/link-provider';
import {
  SmartLinkSize,
  SmartLinkStatus,
  SmartLinkTheme,
} from '../../constants';
import type {
  CardInnerAppearance,
  OnResolveCallback,
  CardActionOptions,
} from '../Card/types';
import { OnErrorCallback } from '../types';
import { AnalyticsFacade } from '../../state/analytics';
import { AISummaryConfig } from '../../state/hooks/use-ai-summary-config/types';

export type FlexibleCardProps = {
  /**
   * @internal A unique ID for a Smart Link.
   */
  id?: string;

  /**
   * An analytics facade object which will be used to send analytics.
   * @internal
   */
  analytics?: AnalyticsFacade;

  /**
   * Determines the appearance of the Smart Link.
   * @internal
   */
  appearance?: CardInnerAppearance;

  /**
   * Determines the status and data of the Smart Link.
   * @internal
   */
  cardState: CardState;

  /**
   * The Flexible UI block component(s) to be rendered.
   * The minimum is a TitleBlock.
   */
  children: React.ReactNode;

  /**
   * Determines the onClick behaviour of Flexible UI. This will proxy to the
   * TitleBlock if supplied.
   */
  onClick?: React.EventHandler<React.MouseEvent | React.KeyboardEvent>;

  /**
   * An additional action that can be performed when link is not resolved, e.g.
   * connect account to gain access to 403 link.
   * @internal
   */
  onAuthorize?: () => void;

  /**
   * function to be called after a flexible card has rendered its error states
   */
  onError?: OnErrorCallback;

  /**
   * function to be called after a flexible card has rendered its resolved state
   */
  onResolve?: OnResolveCallback;

  /**
   * Any additional renderers required by Flexible UI. Currently used by icon
   * to render Emoji.
   */
  renderers?: CardProviderRenderers;

  /**
   * Configure visibility of server and client actions
   */
  actionOptions?: CardActionOptions;

  /**
   * A `testId` prop is provided for specified elements, which is a unique
   * string that appears as a data attribute `data-testid` in the rendered code,
   * serving as a hook for automated tests
   */
  testId?: string;

  /**
   * Determines the appearance of Flexible UI.
   * @see FlexibleUiOptions
   */
  ui?: FlexibleUiOptions;

  /**
   * Determines the URL of the Smart Link.
   */
  url: string;

  /**
   * Determine whether or not a preview card should show up when a user hovers
   * over the smartlink. Default value is false.
   */
  showHoverPreview?: boolean;

  /**
   * Determines whether to show an unauthorised view of the hover card
   * when a user hovers over a smartlink.
   */
  showAuthTooltip?: boolean;
};

export type FlexibleUiOptions = {
  /**
   * Determines whether the entire Smart Link container should be clickable.
   */
  clickableContainer?: boolean;

  /**
   * Determines whether to hide elevation styling.
   */
  hideElevation?: boolean;

  /**
   * Determines whether to hide hover preview's full screen view.
   * Only applies if showHoverPreview from FlexibleCardProps is true
   */
  hideHoverCardPreviewButton?: boolean;

  /**
   * Determines whether to hide css padding styling.
   */
  hidePadding?: boolean;

  /**
   * Determines whether to hide css background color styling.
   */
  hideBackground?: boolean;

  /**
   * Determines the default padding and sizing of the underlying blocks and
   * elements within Flexible UI.
   */
  size?: SmartLinkSize;

  /**
   * Determines the default theme of the Flexible UI.
   * Can be Black or Link (default URL blue)
   */
  theme?: SmartLinkTheme;

  /**
   * Z-index that Atlaskit portal component should be displayed in.
   * This is passed to the portal component.
   */
  zIndex?: number;
};

/**
 * Retry options used if Smart Link resolves to an errored state.
 */
export type RetryOptions = {
  /**
   * Determines the error message to show.
   */
  descriptor?: MessageDescriptor;

  /**
   * Determines the onClick behaviour of the error message.
   */
  onClick?: ((e: React.MouseEvent<HTMLElement>) => void) | undefined;

  /**
   * A list of optional value pairs for string interpolation in the message.
   */
  values?: Record<string, string>;
};

export type ExtractFlexibleUiDataContextParams = Pick<
  FlexibleCardProps,
  'id' | 'actionOptions' | 'renderers' | 'url'
> & {
  status?: SmartLinkStatus;
  response?: JsonLd.Response;
  featureFlags?: Partial<LinkingPlatformFeatureFlags>;
  aiSummaryConfig?: AISummaryConfig;
};

/**
 * Mark a specific props in the type as optional.
 * FlexibleCard use this concept where base component has required props
 * and the extended component provides these props. The props become an optional
 * for the extended component but is still available for override/callback.
 *
 * For example: Action component require onClick callback to perform action
 * but PreviewAction defines the onClick behaviour inside its component.
 * PreviewAction still wants the onClick for a callback to executed after the
 * action completes, but it is optional.
 *
 * Usage:
 *   type ActionProps = { onClick: () => {}, content: string, icon?: React.ReactNode }
 *   type PreviewActionProps = Optional<ActionProps, 'onClick'>
 */
export type Optional<T, K extends keyof T> = Omit<T, K> & {
  [K in keyof T]?: T[K];
};
