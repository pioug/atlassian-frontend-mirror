import {
  AnalyticsEventPayload,
  WithAnalyticsEventsProps,
  withAnalyticsEvents,
} from '@atlaskit/analytics-next';
import { Appearance } from '@atlaskit/button/types';
import { LoadOptions, Value } from '@atlaskit/user-picker';
import memoizeOne from 'memoize-one';
import React from 'react';
import { FormattedMessage } from 'react-intl';
import assert from 'tiny-invariant';
import {
  AtlassianUrlShortenerClient,
  UrlShortenerClient,
  ShortenRequest,
} from '../clients/AtlassianUrlShortenerClient';
import {
  ConfigResponse,
  ShareClient,
  ShareServiceClient,
} from '../clients/ShareServiceClient';
import {
  ShareToSlackClient,
  ShareToSlackServiceClient,
} from '../clients/ShareToSlackClient';
import { messages } from '../i18n';
import {
  Content,
  DialogContentState,
  DialogPlacement,
  Flag,
  MetaData,
  OriginTracing,
  OriginTracingFactory,
  ProductId,
  ProductName,
  RenderCustomTriggerButton,
  ShareButtonStyle,
  TooltipPosition,
  SlackTeamsResponse,
  SlackConversationsResponse,
  SlackContentState,
  SlackTeamsServiceResponse,
  Workspace,
  SlackConversationsServiceResponse,
  Channel,
  SlackUser,
  Team,
  Conversation,
} from '../types';
import {
  CHANNEL_ID,
  copyLinkButtonClicked,
  errorEncountered,
  shortUrlGenerated,
  shortUrlRequested,
  slackDataFetched,
} from './analytics';
import MessagesIntlProvider from './MessagesIntlProvider';
import { ShareDialogWithTrigger } from './ShareDialogWithTrigger';
import { optionDataToUsers } from './utils';
import { getDefaultSlackWorkSpace } from './localStorageUtils';
import ErrorBoundary from './ErrorBoundary';
import { IconProps } from '@atlaskit/icon';
import deepEqual from 'fast-deep-equal';

const COPY_LINK_EVENT = copyLinkButtonClicked(0);

export const defaultConfig: ConfigResponse = {
  mode: 'EXISTING_USERS_ONLY',
  allowComment: false,
};

export type Props = {
  /* Callback function to be called on trigger button click. */
  onTriggerButtonClick?: () => void;
  /* Callback function to be called on dialog open. */
  onDialogOpen?: () => void;
  /* Allow the share dialog to be opened via a Prop. */
  isAutoOpenDialog?: boolean;
  /* Enable Sharing content to slack. */
  enableShareToSlack?: boolean;
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
  /** Share to Slack client which implements the Growth Experiment API endpoints
   * Optional, a default one is provided. */
  shareToSlackClient?: ShareToSlackClient;
  /** Cloud ID of the instance.
   * Note: we assume this props is stable. */
  cloudId: string;
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
  /** Link of the resource to be shared (should NOT includes origin tracing).
   * Optional, the current page URL is used by default. */
  shareLink?: string;
  /** Title of the resource to be shared that will be sent in notifications. */
  shareTitle: string;
  /** Title of the share modal. */
  shareFormTitle?: React.ReactNode;
  /** Copy for content permissions to be displayed in share form header. */
  contentPermissions?: React.ReactNode;
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
  /* Callback function to be called on user selection change in the share form. */
  onUserSelectionChange?: (value: Value) => void;
  /* Footer component to display under the share form fields. */
  shareFieldsFooter?: React.ReactNode;
  /* Indicates if the link shared publicly accessible */
  isPublicLink?: boolean;
};

export type State = {
  config?: ConfigResponse;
  slackTeams: SlackTeamsResponse;
  defaultSlackTeam?: Team;
  isFetchingConfig: boolean;
  isFetchingSlackTeams: boolean;
  isFetchingSlackConversations: boolean;
  slackConversations: SlackConversationsResponse;
  shareActionCount: number;
  currentPageUrl: string;
  shortenedCopyLink: null | string;
  shortenedCopyLinkData?: ShortenRequest;
};

const memoizedFormatCopyLink: (
  origin: OriginTracing,
  link: string,
) => string = memoizeOne((origin: OriginTracing, link: string): string =>
  origin.addToUrl(link),
);

function getCurrentPageUrl(): string {
  return window.location.href;
}

/**
 * This component serves as a Provider to provide customizable implementations
 * to ShareDialogTrigger component
 */
export class ShareDialogContainerInternal extends React.Component<
  WithAnalyticsEventsProps & Props,
  State
> {
  private shareClient: ShareClient;
  private urlShortenerClient: UrlShortenerClient;
  private shareToSlackClient: ShareToSlackClient;
  private _isMounted = false;
  private _urlShorteningRequestCounter = 0;
  private _lastUrlShorteningWasTooSlow = false;

  static defaultProps = {
    enableSmartUserPicker: false,
    shareeAction: 'view' as 'view' | 'edit',
    product: 'confluence',
  };

  constructor(props: Props) {
    super(props);

    // v0.4 -> v0.5 .client -> .shareClient
    assert(
      !(props as any).client,
      'elements/share: Breaking change, please update your props!',
    );
    this.shareClient = props.shareClient || new ShareServiceClient();

    this.urlShortenerClient =
      props.urlShortenerClient || new AtlassianUrlShortenerClient();

    this.shareToSlackClient =
      props.shareToSlackClient || new ShareToSlackServiceClient();

    this.state = {
      shareActionCount: 0,
      config: defaultConfig,
      slackTeams: [],
      isFetchingConfig: false,
      isFetchingSlackTeams: false,
      isFetchingSlackConversations: false,
      slackConversations: [],
      currentPageUrl: getCurrentPageUrl(),
      shortenedCopyLink: null,
    };
  }

  componentDidMount() {
    this._isMounted = true;
  }

  componentWillUnmount() {
    this._isMounted = false;
  }

  componentDidUpdate(prevProps: Props) {
    if (
      !deepEqual(
        this.getShortLinkData(prevProps),
        this.getShortLinkData(this.props),
      )
    ) {
      this.updateShortCopyLink();
    }
  }

  private createAndFireEvent = (payload: AnalyticsEventPayload) => {
    const { createAnalyticsEvent } = this.props;
    if (createAnalyticsEvent) {
      createAnalyticsEvent(payload).fire(CHANNEL_ID);
    }
  };

  fetchConfig = () => {
    this.setState(
      {
        isFetchingConfig: true,
      },
      () => {
        this.shareClient
          .getConfig(this.props.productId, this.props.cloudId)
          .then((config: ConfigResponse) => {
            if (this._isMounted) {
              this.setState({
                config,
                isFetchingConfig: false,
              });
            }
          })
          .catch(() => {
            if (this._isMounted) {
              this.setState({
                config: defaultConfig,
                isFetchingConfig: false,
              });
            }
          });
      },
    );
  };

  handleSubmitShare = ({
    users,
    comment,
  }: DialogContentState): Promise<void> => {
    const shareLink = this.getFormShareLink();
    const {
      productId,
      shareAri,
      shareContentType,
      shareTitle,
      shareeAction,
    } = this.props;
    const content: Content = {
      ari: shareAri,
      link: shareLink,
      title: shareTitle,
      type: shareContentType,
    };
    const metaData: MetaData = {
      productId,
      atlOriginId: this.getFormShareOriginTracing().id,
      shareeAction,
    };

    return this.shareClient
      .share(content, optionDataToUsers(users), metaData, comment)
      .then(() => {
        if (!this._isMounted) {
          return;
        }

        // renew Origin Tracing Id per share action succeeded
        this.setState(state => ({
          shareActionCount: state.shareActionCount + 1,
        }));
      });
  };

  handleDialogOpen = async () => {
    if (this.props.onDialogOpen) {
      this.props.onDialogOpen();
    }

    this.setState(
      {
        currentPageUrl: getCurrentPageUrl(),
      },
      () => {
        this.updateShortCopyLink();
      },
    );

    // always refetch the config when modal is re-opened
    this.fetchConfig();

    if (this.props.enableShareToSlack) {
      await this.fetchSlackTeams();
    }
  };

  decorateAnalytics = (
    payload: AnalyticsEventPayload,
  ): AnalyticsEventPayload => {
    if (
      payload.type === COPY_LINK_EVENT.type &&
      payload.action === COPY_LINK_EVENT.action &&
      payload.actionSubjectId === COPY_LINK_EVENT.actionSubjectId
    ) {
      const isCopyLinkShortened = !!this.getShortenedCopyLink();

      payload = {
        ...payload,
        attributes: {
          ...payload.attributes,
          shortUrl: isCopyLinkShortened,
        },
      };

      if (this.shouldShortenCopyLink() && !isCopyLinkShortened) {
        this._lastUrlShorteningWasTooSlow = true;
      }
    }

    return payload;
  };

  // ensure origin is re-generated if the link or the factory changes
  // separate memoization is needed since copy != form
  getUniqueCopyLinkOriginTracing = memoizeOne(
    (
      link: string,
      originTracingFactory: OriginTracingFactory,
    ): OriginTracing => {
      return originTracingFactory();
    },
  );
  // form origin must furthermore be regenerated after each form share
  getUniqueFormShareOriginTracing = memoizeOne(
    (
      link: string,
      originTracingFactory: OriginTracingFactory,
      shareCount: number,
    ): OriginTracing => {
      return originTracingFactory();
    },
  );

  getUpToDateShortenedCopyLink = memoizeOne((data: ShortenRequest): Promise<
    string | null
  > => {
    this._lastUrlShorteningWasTooSlow = false;
    this._urlShorteningRequestCounter++;

    this.createAndFireEvent(shortUrlRequested());

    const start = Date.now();
    return this.urlShortenerClient
      .shorten(data)
      .then(response => {
        this.createAndFireEvent(
          shortUrlGenerated(start, this._lastUrlShorteningWasTooSlow),
        );
        return response.shortUrl;
      })
      .catch(() => {
        this.createAndFireEvent(errorEncountered('urlShortening'));
        return null;
      });
  }, deepEqual);

  getRawLink(): string {
    const { shareLink } = this.props;
    const { currentPageUrl } = this.state;
    return shareLink || currentPageUrl;
  }

  getCopyLinkOriginTracing(): OriginTracing {
    const { originTracingFactory } = this.props;
    const shareLink = this.getRawLink();
    return this.getUniqueCopyLinkOriginTracing(shareLink, originTracingFactory);
  }

  getFormShareOriginTracing(): OriginTracing {
    const { originTracingFactory } = this.props;
    const { shareActionCount } = this.state;
    const shareLink = this.getRawLink();
    return this.getUniqueFormShareOriginTracing(
      shareLink,
      originTracingFactory,
      shareActionCount,
    );
  }

  getFullCopyLink(): string {
    const { formatCopyLink } = this.props;
    const shareLink = this.getRawLink();
    const copyLinkOrigin = this.getCopyLinkOriginTracing();
    return (formatCopyLink || memoizedFormatCopyLink)(
      copyLinkOrigin,
      shareLink,
    );
  }

  shouldShortenCopyLink(): boolean {
    return !!this.props.shortLinkData || !!this.props.useUrlShortener;
  }

  getShortenedCopyLink(): string | undefined {
    return (
      (this.shouldShortenCopyLink() && this.state.shortenedCopyLink) ||
      undefined
    );
  }

  getCopyLink(): string {
    return this.getShortenedCopyLink() || this.getFullCopyLink();
  }

  addOriginToShortQuery(query = ''): string {
    const copyLinkOrigin = this.getCopyLinkOriginTracing();
    return copyLinkOrigin.addToUrl(query);
  }

  getShortLinkData(props: Props): ShortenRequest | undefined {
    let { shortLinkData, useUrlShortener, cloudId, product } = props;
    if (shortLinkData) {
      return {
        ...shortLinkData,
        query: this.addOriginToShortQuery(shortLinkData.query),
      };
    }

    // Use the legacy link type if old API is being used
    if (useUrlShortener && product === 'confluence') {
      return {
        cloudId,
        product,
        type: 'legacy',
        params: { path: this.getFullCopyLink() },
      };
    }

    return undefined;
  }

  updateShortCopyLink() {
    this.setState({
      shortenedCopyLink: null,
    });

    const shortLinkData = this.getShortLinkData(this.props);
    if (!shortLinkData) {
      return;
    }

    const shortLink = this.getUpToDateShortenedCopyLink(shortLinkData);
    const requestCounter = this._urlShorteningRequestCounter;
    shortLink.then(shortenedCopyLink => {
      if (!this._isMounted) {
        return;
      }
      const isRequestOutdated =
        requestCounter !== this._urlShorteningRequestCounter;
      if (isRequestOutdated) {
        return;
      }

      this.setState({ shortenedCopyLink });
    });
  }

  getFormShareLink = (): string => {
    // original share link is used here
    return this.getRawLink();
  };

  getProductForSlack = () => {
    const productId = this.props.productId;
    if (productId.includes('jira')) {
      return 'jira';
    }

    return productId;
  };

  parseTeamsResponse = (response: SlackTeamsServiceResponse) => {
    return response.teams.map((t: Workspace) => {
      const team = {
        label: t.name,
        value: t.id,
        avatarUrl: t.avatar,
      };

      return team;
    });
  };

  fetchSlackTeams = () => {
    this.setState(
      {
        isFetchingSlackTeams: true,
      },
      async () => {
        const defaultSlackTeamId = getDefaultSlackWorkSpace(
          this.props.product!,
        );
        try {
          const response: SlackTeamsServiceResponse = await this.shareToSlackClient.getTeams(
            this.getProductForSlack(),
            this.props.cloudId,
          );

          let defaultSlackTeam: Team | undefined;
          const slackTeams = this.parseTeamsResponse(response);
          // If there is only one workspace then set it as default/ else try to find default team
          if (slackTeams.length === 1 && !defaultSlackTeam) {
            defaultSlackTeam = slackTeams[0];
          } else if (defaultSlackTeamId) {
            defaultSlackTeam = slackTeams.find(
              t => t.value === defaultSlackTeamId,
            );
          }

          this.setState({
            slackTeams,
            isFetchingSlackTeams: false,
            defaultSlackTeam,
          });

          this.createAndFireEvent(slackDataFetched(slackTeams.length));
          if (defaultSlackTeam) {
            this.fetchSlackConversations(defaultSlackTeam.value);
          }
        } catch (e) {
          this.setState({
            slackTeams: [],
            isFetchingSlackTeams: false,
          });
        }
      },
    );
  };

  fetchSlackConversations = (teamId: string) => {
    this.setState(
      {
        isFetchingSlackConversations: true,
      },
      async () => {
        try {
          const response: SlackConversationsServiceResponse = await this.shareToSlackClient.getConversations(
            teamId,
            this.getProductForSlack(),
            this.props.cloudId,
          );

          const slackConversations = [
            {
              label: 'Channels',
              options: response.channels.map((c: Channel) => ({
                label: `#${c.name}`,
                value: `${c.id}|${c.type}`,
              })),
            },
            {
              label: 'Direct messages',
              options: response.dms.map((u: SlackUser) => ({
                label: u.displayName ? `${u.name} (@${u.displayName})` : u.name,
                value: `${u.id}|${u.type}`,
              })),
            },
          ];

          this.setState({
            slackConversations,
            isFetchingSlackConversations: false,
          });
        } catch (e) {
          this.setState({
            slackConversations: [],
            isFetchingSlackConversations: false,
          });
        } finally {
          this.setState({
            isFetchingSlackConversations: false,
          });
        }
      },
    );
  };

  handleSlackSubmit = (shareContent: SlackContentState): Promise<void> => {
    const { team, conversation, comment } = shareContent;
    const { cloudId } = this.props;
    const shareLink = this.getFormShareLink();

    const teamId = (team as Team).value;
    const [
      conversationId,
      conversationType,
    ] = (conversation as Conversation).value.split('|');

    return this.shareToSlackClient
      .share(
        teamId,
        conversationId,
        conversationType,
        shareLink,
        this.getProductForSlack(),
        cloudId,
        comment && comment.value,
      )
      .then(() => {
        if (!this._isMounted) {
          return;
        }

        // renew Origin Tracing Id per share action succeeded
        this.setState(state => ({
          shareActionCount: state.shareActionCount + 1,
        }));
      });
  };

  render() {
    const {
      cloudId,
      isAutoOpenDialog,
      dialogPlacement,
      loadUserOptions,
      renderCustomTriggerButton,
      shareContentType,
      shareFormTitle,
      contentPermissions,
      shouldCloseOnEscapePress,
      showFlags,
      enableSmartUserPicker,
      loggedInAccountId,
      triggerButtonAppearance,
      triggerButtonIcon,
      triggerButtonStyle,
      triggerButtonTooltipText,
      triggerButtonTooltipPosition,
      bottomMessage,
      shareeAction,
      product,
      customFooter,
      enableShareToSlack,
      onTriggerButtonClick,
      onUserSelectionChange,
      shareFieldsFooter,
      isPublicLink,
      shareAri,
    } = this.props;
    const {
      isFetchingConfig,
      isFetchingSlackTeams,
      slackTeams,
      isFetchingSlackConversations,
      slackConversations,
      defaultSlackTeam,
    } = this.state;
    return (
      <ErrorBoundary>
        <MessagesIntlProvider>
          <ShareDialogWithTrigger
            onTriggerButtonClick={onTriggerButtonClick}
            isAutoOpenDialog={isAutoOpenDialog}
            config={this.state.config}
            copyLink={this.getCopyLink()}
            analyticsDecorator={this.decorateAnalytics}
            dialogPlacement={dialogPlacement}
            enableShareToSlack={enableShareToSlack}
            isFetchingSlackTeams={isFetchingSlackTeams}
            defaultSlackTeam={defaultSlackTeam}
            slackTeams={slackTeams}
            isFetchingSlackConversations={isFetchingSlackConversations}
            fetchSlackConversations={this.fetchSlackConversations}
            slackConversations={slackConversations}
            isFetchingConfig={isFetchingConfig}
            loadUserOptions={loadUserOptions}
            onDialogOpen={this.handleDialogOpen}
            onShareSubmit={this.handleSubmitShare}
            onSlackSubmit={this.handleSlackSubmit}
            renderCustomTriggerButton={renderCustomTriggerButton}
            shareContentType={shareContentType}
            shareFormTitle={shareFormTitle}
            contentPermissions={contentPermissions}
            copyLinkOrigin={this.getCopyLinkOriginTracing()}
            formShareOrigin={this.getFormShareOriginTracing()}
            shouldCloseOnEscapePress={shouldCloseOnEscapePress}
            showFlags={showFlags}
            enableSmartUserPicker={enableSmartUserPicker}
            loggedInAccountId={loggedInAccountId}
            cloudId={cloudId}
            triggerButtonAppearance={triggerButtonAppearance}
            triggerButtonIcon={triggerButtonIcon}
            triggerButtonStyle={triggerButtonStyle}
            triggerButtonTooltipPosition={triggerButtonTooltipPosition}
            triggerButtonTooltipText={triggerButtonTooltipText}
            bottomMessage={bottomMessage}
            submitButtonLabel={
              shareeAction === 'edit' && (
                <FormattedMessage {...messages.inviteTriggerButtonText} />
              )
            }
            product={product!}
            customFooter={customFooter}
            onUserSelectionChange={onUserSelectionChange}
            shareFieldsFooter={shareFieldsFooter}
            isPublicLink={isPublicLink}
            shareAri={shareAri}
          />
        </MessagesIntlProvider>
      </ErrorBoundary>
    );
  }
}

export const ShareDialogContainer = withAnalyticsEvents()(
  ShareDialogContainerInternal,
);
