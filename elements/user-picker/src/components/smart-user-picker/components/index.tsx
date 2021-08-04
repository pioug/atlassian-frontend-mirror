import React from 'react';
import debounce from 'lodash/debounce';
import uuidV4 from 'uuid/v4';
import {
  withAnalyticsEvents,
  WithAnalyticsEventsProps,
} from '@atlaskit/analytics-next';
import memoizeOne from 'memoize-one';
import { InjectedIntlProps, injectIntl } from 'react-intl';

import {
  requestUsersEvent,
  filterUsersEvent,
  preparedUsersLoadedEvent,
  successfulRequestUsersEvent,
  failedRequestUsersEvent,
  mountedWithPrefetchEvent,
  createAndFireEventInElementsChannel,
  SmartEventCreator,
} from '../../../analytics';
import {
  DefaultValue,
  UserPickerProps,
  OptionData,
  OnChange,
  OnInputChange,
  OptionIdentifier,
  User,
  UserType,
} from '../../../types';
import { UserPicker } from '../../UserPicker';
import getUserRecommendations, {
  Context,
} from '../service/recommendationClient';
import getUsersById from '../service/UsersClient';
import MessagesIntlProvider from '../../MessagesIntlProvider';

type OnError = (
  error: any,
  request: RecommendationRequest,
) => Promise<OptionData[]> | void;
type OnValueError = (
  error: any,
  defaultValue: DefaultValue,
) => Promise<OptionData[]> | void;
type OnEmpty = (query: string) => Promise<OptionData[]>;

/**
 * @deprecated Please use @atlassian/smart-user-picker
 */
export type SupportedProduct =
  | 'jira'
  | 'confluence'
  | 'people'
  | 'bitbucket'
  | 'compass';

/**
 * @deprecated Please use @atlassian/smart-user-picker
 */
export type ProductAttributes = BitbucketAttributes | ConfluenceAttributes;

type FilterOptions = (options: OptionData[], query: string) => OptionData[];

/**
 * @deprecated Please use @atlassian/smart-user-picker
 */
export interface BitbucketAttributes {
  /**
   * Identifies whether this is a public repository or not.
   */
  isPublicRepo?: boolean;
  /**
   * A list of bitbucket workspace Ids used within container result set and noted in analytics.
   */
  workspaceIds?: string[];
  /**
   * The users current email domain which may be used to boost the results for relevant users.
   */
  emailDomain?: string;
}

/**
 * @deprecated Please use @atlassian/smart-user-picker
 */
export interface ConfluenceAttributes {
  /**
   * Identifies whether this user is a confluence guest
   */
  isEntitledConfluenceExternalCollaborator?: boolean;
}

/**
 * @deprecated Please use @atlassian/smart-user-picker
 */
export interface SmartProps {
  /**
   * The base URL of the site eg: hello.atlassian.net
   */
  baseUrl?: string;
  /**
   * Context information for analytics in URS. Eg: if a user picker was put inside a comment, the childObjectId would be the ID of the comment
   */
  childObjectId?: string;
  /**
   * The container Id to identify context. e.g. projectId/spaceId/repositoryId.
   */
  containerId?: string;
  /**
   * Whether to include groups in the resultset. @default false
   */
  includeGroups?: boolean;
  /**
   * Whether to include teams in the resultset. @default false
   */
  includeTeams?: boolean;
  /**
   * Whether to include users in the resultset. @default true
   */
  includeUsers?: boolean;
  /**
   * An identifier of the closest context object, e.g. issueId, pageId, pullRequestId
   */
  objectId?: string;
  /**
   * Id of the user interacting with the component.
   * If principalId is not provided, server will extract principalId from the context header, assuming that the user is logged in when making the request @default “context”
   */
  principalId?: string;
  /**
   * Product Attributes - you should pass in the attribute type that matches your current SupportedProduct.
   * Currently we support additional attributes (BitbucketAttributes) for bitbucket and (ConfluenceAttributes) for Confluence.
   */
  productAttributes?: ProductAttributes;
  /**
   * Product identifier. Currently supports 'jira' 'confluence' 'people'
   */
  productKey: SupportedProduct;
  /**
   * Identifier for the product's tenant, also known as tenantId or cloudId
   */
  siteId: string;
}

/**
 * @deprecated Please use @atlassian/smart-user-picker
 */
export interface Props
  extends SmartProps,
    UserPickerProps,
    WithAnalyticsEventsProps {
  /**
   * User options to show when the query is blank. If not provided, smart user picker will still provide a ranked list of suggestions for blank queries.
   */
  bootstrapOptions?: OptionData[];
  /**
   * Time to debounce the suggestions fetching (in milliseconds)
   */
  debounceTime?: number;
  /**
   * Identifier for informing the server on where the user picker has been mounted.
   * Unlike User Picker, the fieldId in Smart User Picker is mandatory.
   * The server uses the fieldId to determine which model to utilize when
   * generating suggestions. Supported contexts: "assignee", "mentions".
   * All other fieldId will be bucketed into a generic model.
   */
  fieldId: string;
  /**
   * Function to transform options suggested by the server before showing to the user. Can be used to filter out suggestions.
   * The options that are passed by the filterOptions are the options that are displayed in the list.
   */
  filterOptions?: FilterOptions;
  onChange?: OnChange;
  /**
   * Custom handler to give opportunity for caller to return list of options when server returns empty list.
   * this is called if server returns empty list or all returned list is filtered out by the passed filter {@see filterOptions}.
   */
  onEmpty?: OnEmpty;
  /**
   * Error handler for when the server fails to suggest users and returns with an error response.
   * `error`: the error.
   * `RecommendationRequest`: the original recommendationRequest containing the query and other search parameters.
   * This may be used to provide a fail over search direct to the product backend.
   * Helper fail over clients exist under /helpers.
   * Note that OnError results are not filtered - so you may wish to provide additional `filterOptions`.
   */
  onError?: OnError;
  onInputChange?: OnInputChange;
  /**
   * Error handler used to provide OptionData[] values when the server fails to hydrate `defaultValue` prop `OptionIdentifier` types.
   * error response. */
  onValueError?: OnValueError;
  /**
   * Prefetch the list of suggested assignees before the user picker is focused.
   * WARNING: please consider carefully before deciding to prefetch your suggestions
   * as this will increase the load on the recommendations services.
   * A heads-up on #smrt-experiences for a ballpark on the expected request volume will
   * be greatly appreciated.
   */
  prefetch?: boolean;
  /**
   * Filter to be applied to the eventual query to CPUS for user suggestions.
   * Example:`account_status:"active" AND (NOT email_domain:"connect.atlassian.com")`
   *  will remove inactive users from the list of suggestions.
   */
  searchQueryFilter?: string;
}

/**
 * @deprecated Please use @atlassian/smart-user-picker
 */
export interface State {
  users: OptionData[];
  loading: boolean;
  closed: boolean;
  error: boolean;
  query: string;
  sessionId?: string;
  defaultValue?: OptionData[];
  bootstrapOptions: OptionData[];
}

/**
 * @deprecated Please use @atlassian/smart-user-picker
 */
export interface RecommendationRequest {
  baseUrl?: string;
  context: Context;
  maxNumberOfResults: number;
  query?: string;
  searchQueryFilter?: string;
  includeUsers?: boolean;
  includeGroups?: boolean;
  includeTeams?: boolean;
}

const hasContextChanged = (
  oldContext: SmartProps,
  newContext: SmartProps,
): boolean =>
  oldContext.siteId !== newContext.siteId ||
  oldContext.productKey !== newContext.productKey ||
  oldContext.principalId !== newContext.principalId ||
  oldContext.containerId !== newContext.containerId ||
  oldContext.objectId !== newContext.objectId ||
  oldContext.childObjectId !== newContext.childObjectId;

const stringContains = (str: string | null | void, substr?: string | null) => {
  if (str === null || str === undefined) {
    return false;
  }

  if (substr === null || substr === '' || substr === undefined) {
    return true;
  }

  return str.toLowerCase().includes(substr.toLowerCase());
};

const getUsersForAnalytics = (users: OptionData[]) =>
  (users || []).map(({ id, type }) => ({
    id,
    type,
  }));

const sortResults = (users: User[], sortIds: string[]): User[] => {
  const resultsMap = new Map<string, User>(
    users.map((user) => [user.id, user] as [string, User]),
  );

  return sortIds.map((id) => {
    const user = resultsMap.get(id);
    if (user) {
      return user;
    }

    return {
      id: id,
      type: UserType,
      name: 'Unknown',
    };
  });
};

function isOptionData(
  option: OptionData | OptionIdentifier,
): option is OptionData {
  return (option as OptionData).name !== undefined;
}

/**
 * @deprecated Please use @atlassian/smart-user-picker
 */
export async function hydrateDefaultValues(
  value: DefaultValue,
  productKey: SupportedProduct,
): Promise<User[]> {
  //return if no value
  if (!value) {
    return [];
  }
  //return if hydrated value
  if (!Array.isArray(value) && isOptionData(value)) {
    return [value] as User[];
  }
  //return if hydrated array or empty array
  if (Array.isArray(value) && (value.length === 0 || isOptionData(value[0]))) {
    return value as User[];
  }

  //if we are not in a supported product then return
  if (productKey !== 'jira' && productKey !== 'confluence') {
    if (Array.isArray(value)) {
      return value as User[]; //return if hydrated array
    } else {
      return [value] as User[];
    }
  }
  //hydrate
  let accountIds = [];
  if (Array.isArray(value)) {
    accountIds = (value as OptionData[]).map((a) => a.id);
  } else {
    accountIds = [value.id];
  }

  const results = await getUsersById({
    productKey,
    accountIds,
  });

  return sortResults(results, accountIds);
}

/**
 * @deprecated
 */
class SmartUserPicker extends React.Component<
  Props & InjectedIntlProps,
  State
> {
  state: State = {
    users: [],
    loading: false,
    error: false,
    closed: true,
    query: '',
    defaultValue: [],
    bootstrapOptions: [],
  };

  static defaultProps = {
    onError: () => {},
    baseUrl: '',
    includeUsers: true,
    includeGroups: false,
    includeTeams: false,
    prefetch: false,
    principalId: 'Context',
  };

  async componentDidMount() {
    try {
      const value = await hydrateDefaultValues(
        this.props.defaultValue,
        this.props.productKey,
      );

      this.setState({
        defaultValue: value,
      });
    } catch (e) {
      const defaultValue: OptionData[] = await (this.props.onValueError
        ? this.props.onValueError(e, this.props.defaultValue) ||
          Promise.resolve([])
        : Promise.resolve([]));
      this.setState({ defaultValue: defaultValue });
    }

    const { prefetch } = this.props;
    if (prefetch) {
      const sessionId = uuidV4();
      this.fireEvent(mountedWithPrefetchEvent, { sessionId });
      this.setState({
        sessionId,
      });
    }
  }

  componentDidUpdate(prevProps: Props, prevState: State): void {
    if (
      hasContextChanged(prevProps, this.props) ||
      this.props.fieldId !== prevProps.fieldId
    ) {
      this.setState({
        users: [],
      });
    }
    if (
      (this.state.sessionId !== prevState.sessionId ||
        this.state.query !== prevState.query) &&
      (this.state.query !== '' || !this.props.bootstrapOptions)
    ) {
      this.getUsers();
    }
  }

  private fireEvent = (eventCreator: SmartEventCreator, ...args: any[]) => {
    const { createAnalyticsEvent } = this.props;
    if (createAnalyticsEvent) {
      createAndFireEventInElementsChannel(
        eventCreator(this.props, this.state, ...args),
      )(createAnalyticsEvent);
    }
  };

  filterOptions = (
    users: OptionData[],
    query: string,
    propFilterOptions?: FilterOptions,
  ) => (propFilterOptions ? propFilterOptions(users, query) : users);

  memoizedFilterOptions = memoizeOne(this.filterOptions);

  getUsers = debounce(async () => {
    const { query, sessionId } = this.state;
    const {
      containerId,
      childObjectId,
      objectId,
      principalId,
      productKey,
      siteId,
      baseUrl,
      includeUsers,
      includeGroups,
      includeTeams,
      maxOptions,
      searchQueryFilter,
      onEmpty,
      productAttributes,
      intl,
    } = this.props;

    const maxNumberOfResults = maxOptions || 100;
    const startTime = window.performance.now();
    const recommendationsRequest = {
      baseUrl,
      context: {
        containerId,
        contextType: this.props.fieldId,
        objectId,
        principalId,
        productKey,
        siteId,
        childObjectId,
        sessionId,
        productAttributes,
      },
      includeUsers,
      includeGroups,
      includeTeams,
      maxNumberOfResults,
      query,
      searchQueryFilter,
    };
    try {
      this.fireEvent(requestUsersEvent);
      const recommendedUsers = await getUserRecommendations(
        recommendationsRequest,
        intl,
      );
      const elapsedTimeMilli = window.performance.now() - startTime;

      const displayedUsers =
        recommendedUsers.length === 0 && onEmpty
          ? (await onEmpty(query)) ?? []
          : recommendedUsers;

      this.setState((state) => {
        const applicable = state.query === query;
        const users = applicable ? displayedUsers : state.users;
        const loading = !applicable;

        this.fireEvent(successfulRequestUsersEvent, {
          users: getUsersForAnalytics(recommendedUsers),
          elapsedTimeMilli,
          displayedUsers: getUsersForAnalytics(displayedUsers),
          productAttributes,
          applicable,
        });

        return { users, loading };
      });
    } catch (e) {
      this.setState({
        users: [],
        error: true,
      });
      const defaultUsers: OptionData[] = await (this.props.onError
        ? this.props.onError(e, recommendationsRequest) || Promise.resolve([])
        : Promise.resolve([]));
      const elapsedTimeMilli = window.performance.now() - startTime;
      this.setState({
        users: defaultUsers,
        loading: false,
      });
      this.fireEvent(failedRequestUsersEvent, {
        elapsedTimeMilli,
        productAttributes,
      });
    }
  }, this.props.debounceTime ?? 0);

  onInputChange = (newQuery?: string, sessionId?: string) => {
    const query = newQuery || '';
    const { closed } = this.state;
    if (query === this.state.query) {
      return;
    }
    if (!closed) {
      this.setState({ loading: true, query, sessionId });
      if (this.props.onInputChange) {
        this.props.onInputChange(query, sessionId);
      }
    }
  };

  filterUsers = () => {
    const { loading, users, query } = this.state;
    const filteredUsers = this.memoizedFilterOptions(
      users,
      query,
      this.props.filterOptions,
    );
    //If bootstrapOptions have been passed in and it is bootstrap
    if (
      this.props.bootstrapOptions &&
      this.props.bootstrapOptions.length !== 0 &&
      query === ''
    ) {
      const bootstrapFilteredUsers = this.memoizedFilterOptions(
        this.props.bootstrapOptions,
        query,
        this.props.filterOptions,
      );
      this.fireEvent(filterUsersEvent, {
        filtered: getUsersForAnalytics(bootstrapFilteredUsers),
        all: getUsersForAnalytics(this.props.bootstrapOptions),
      });
      return bootstrapFilteredUsers;
    }
    // while when not loading just return already filtered result from server.
    if (!loading) {
      return filteredUsers;
    }
    const queryFilteredUsers = filteredUsers.filter((user: OptionData) =>
      stringContains(user.name, query),
    );
    this.fireEvent(filterUsersEvent, {
      filtered: getUsersForAnalytics(queryFilteredUsers),
      all: getUsersForAnalytics(users),
    });

    // when loading filter previous result.
    return filteredUsers;
  };

  onFocus = (sessionId?: string) => {
    const state: Partial<State> = { query: '', closed: false };
    if (this.state.users.length === 0) {
      state.sessionId = sessionId;
      state.loading = true;
    } else {
      this.fireEvent(preparedUsersLoadedEvent, {
        users: getUsersForAnalytics(this.state.users),
        preparedSessionId: this.state.sessionId,
        sessionId,
      });
    }
    this.setState((currentState) => ({ ...currentState, ...state }));
    if (this.props.onFocus) {
      this.props.onFocus(sessionId);
    }
  };

  onBlur = (sessionId?: string) => {
    this.getUsers.cancel();
    // clear old users if query is populated so that on refocus,
    // the old list is not shown
    const users = this.state.query.length === 0 ? this.state.users : [];
    this.setState({ loading: false, closed: true, users });
    if (this.props.onBlur) {
      this.props.onBlur(sessionId);
    }
  };

  render() {
    return (
      <UserPicker
        {...this.props}
        onInputChange={this.onInputChange}
        onBlur={this.onBlur}
        onFocus={this.onFocus}
        defaultValue={this.state.defaultValue}
        isLoading={
          this.props.isLoading ||
          (this.state.loading &&
            !this.state.closed &&
            (!this.props.bootstrapOptions || this.state.query !== ''))
        }
        options={this.filterUsers()}
      />
    );
  }
}

const WrappedSmartUserPicker = withAnalyticsEvents()(
  injectIntl(SmartUserPicker),
);

/**
 * @deprecated
 */
const SmartUserPickerWithIntlProvider: React.FunctionComponent<Props> = (
  props,
) => (
  <MessagesIntlProvider>
    <WrappedSmartUserPicker {...props} />
  </MessagesIntlProvider>
);

/**
 * Please use AK/SUP instead
 * @deprecated
 */
export default SmartUserPickerWithIntlProvider;
