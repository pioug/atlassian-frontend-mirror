import { CardState } from '@atlaskit/linking-common';
import { OnErrorCallback } from '../../../types';
import { FlexibleUiOptions } from '../../../FlexibleCard/types';
import { OnResolveCallback } from '../../../Card/types';
import { CardProviderRenderers } from '@atlaskit/link-provider';
import { AnalyticsFacade } from '../../../../state/analytics';
import { AnchorTarget } from '../../../FlexibleCard/components/types';
import { TitleBlockProps } from '../../../FlexibleCard/components/blocks/title-block/types';

export type FlexibleBlockCardProps = {
  /**
   * An AnalyticsFacade object used for calling analytics.
   */
  analytics: AnalyticsFacade;

  /**
   * Determines the anchor target to be passed to the title block.
   */
  anchorTarget?: AnchorTarget;

  /**
   * Determines the status and data of the Smart Link.
   * @internal
   */
  cardState: CardState;

  /**
   * Provides the extensionKey of a Smart Link resolver invoked.
   */
  extensionKey?: string;

  /**
   * A unique id for this Smart Link instance, used for analytics.
   */
  id?: string;

  /**
   * An additional action that can be performed when link is not resolved, e.g.
   * connect account to gain access to 403 link.
   * @internal
   */
  onAuthorize?: () => void;

  /**
   * Determines the onClick behaviour of Flexible UI. This will proxy to the
   * TitleBlock if supplied.
   */
  onClick?: React.EventHandler<React.MouseEvent | React.KeyboardEvent>;

  /**
   * function to be called after a flexible card has rendered its error states
   */
  onError?: OnErrorCallback;

  /**
   * function to be called after a flexible card has rendered its resolved state
   */
  onResolve?: OnResolveCallback;

  /**
   * A name of the provider, needed to specify to user which account has to be connected
   */
  providerName?: string;

  /**
   * Any additional renderers required by Flexible UI. Currently used by icon
   * to render Emoji.
   */
  renderers?: CardProviderRenderers;

  /**
   * Determines whether to show available server actions.
   */
  showServerActions?: boolean;

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
   * Determines a style of the Title Block.
   */
  titleBlockProps?: TitleBlockProps;
};
