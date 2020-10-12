import React from 'react';
import debounce from 'lodash/debounce';
import uuidV4 from 'uuid/v4';
import {
  withAnalyticsEvents,
  WithAnalyticsEventsProps,
} from '@atlaskit/analytics-next';

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
} from '../../../types';
import { UserPicker } from '../../UserPicker';
import getUserRecommendations from '../service/recommendationClient';
import getUsersById from '../service/UsersClient';

type OnError = (error: any, query: string) => Promise<OptionData[]> | void;
type OnValueError = (
  error: any,
  defaultValue: DefaultValue,
) => Promise<OptionData[]> | void;
type OnEmpty = (query: string) => Promise<OptionData[]>;

export type SupportedProduct = 'jira' | 'confluence' | 'people' | 'bitbucket';

export type ProductAttributes = BitbucketAttributes;

type FilterOptions = (options: OptionData[]) => OptionData[];

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

export interface SmartProps {
  /**
   * The container Id to identify context. For bitbucket this is the repositoryId.
   */
  containerId?: string;
  /**
   * An identifier of the closest context object, for example in bitbucket this may be a Pull Request Id, branch Id or commit Id
   */
  objectId?: string;
  /** Id of the user interacting with the component. Default value is set to
   * the value "Context" which will tell the server to extract the
   * principalId from the context.
   */
  principalId: string;
  childObjectId?: string;
  /**
   * Product identifier. Currently supports 'jira' 'confluence' 'people'
   */
  productKey: SupportedProduct;
  siteId: string;
  baseUrl?: string;
  /**
   * Whether to include users in the resultset. The default for this is true.
   */
  includeUsers?: boolean;
  /**
   * Whether to include groups in the resultset. The default for this is false.
   */
  includeGroups?: boolean;
  /**
   * Whether to include teams in the resultset. The default for this is false.
   */
  includeTeams?: boolean;

  /**
   * Product Attributes - you should pass in the attribute type that matches your current SupportedProduct.
   * Currently we only support additional attributes (BitbucketAttributes) for bitbucket.
   */
  productAttributes?: ProductAttributes;
}

export interface Props
  extends SmartProps,
    UserPickerProps,
    WithAnalyticsEventsProps {
  /** Identifier for informing the server on where the user picker has been mounted.
   * Unlike User Picker, the fieldId in Smart User Picker is mandatory.
   * The server uses the fieldId to determine which model to utilize when
   * generating suggestions. Supported contexts: "assignee", "mentions".
   * All other fieldId will be bucketed into a generic model.
   */
  fieldId: string;
  options?: [];
  /** Error handler for when the server fails to suggest users and returns with an
   * error response. */
  onError?: OnError;
  /**
   * Error handler used to provide OptionData[] values when the server fails to hydrate `defaultValue` prop `OptionIdentifier` types.
   * error response. */
  onValueError?: OnValueError;
  /** custom handler to give opportunity for caller to return list of options when server returns empty list.
   * this is called if server returns empty list or all returned list is filtered out by the passed filter {@see filterOptions}.
   */
  onEmpty?: OnEmpty;
  onChange?: OnChange;
  onInputChange?: OnInputChange;
  /** Function to filter out suggested items before showing to the user */
  filterOptions?: FilterOptions;
  /** Time to debounce the suggestions fetching (in milliseconds) */
  debounceTime?: number;
  /** Prefetch the list of suggested assignees before the user picker is focused.
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

export interface State {
  users: OptionData[];
  loading: boolean;
  closed: boolean;
  error: boolean;
  query: string;
  sessionId?: string;
  defaultValue?: OptionData[];
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

class SmartUserPicker extends React.Component<Props, State> {
  state: State = {
    users: [],
    loading: false,
    error: false,
    closed: true,
    query: '',
    defaultValue: [],
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
      let value = await this.hydrateDefaultValues(this.props.defaultValue);
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
      this.state.sessionId !== prevState.sessionId ||
      this.state.query !== prevState.query
    ) {
      this.debouncedGetUsers();
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

  isOptionData(option: OptionData | OptionIdentifier): option is OptionData {
    return (option as OptionData).name !== undefined;
  }

  hydrateDefaultValues = async (value: DefaultValue): Promise<User[]> => {
    const { productKey } = this.props;

    //return if no value
    if (!value) {
      return [];
    }
    //return if hydrated value
    if (!Array.isArray(value) && this.isOptionData(value)) {
      return [value] as User[];
    }
    //return if hydrated array or empty array
    if (
      Array.isArray(value) &&
      (value.length === 0 || this.isOptionData(value[0]))
    ) {
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
      accountIds = (value as OptionData[]).map(a => a.id);
    } else {
      accountIds = [value.id];
    }

    return await getUsersById({
      productKey,
      accountIds,
    });
  };

  getUsers = async () => {
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
    } = this.props;

    const maxNumberOfResults = maxOptions || 100;
    const startTime = window.performance.now();
    try {
      this.fireEvent(requestUsersEvent);

      const users = await getUserRecommendations({
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
      });
      const elapsedTimeMilli = window.performance.now() - startTime;

      const filteredUsers = this.props.filterOptions
        ? this.props.filterOptions(users)
        : users;

      let displayedList = filteredUsers;
      if (filteredUsers.length === 0 && onEmpty) {
        displayedList = await onEmpty(query);
        displayedList = displayedList || [];
      }

      this.setState({ users: displayedList, loading: false });
      this.fireEvent(successfulRequestUsersEvent, {
        users: getUsersForAnalytics(users),
        filteredUsers: getUsersForAnalytics(filteredUsers),
        elapsedTimeMilli,
        displayedUsers: getUsersForAnalytics(displayedList),
      });
    } catch (e) {
      this.setState({
        users: [],
        error: true,
      });
      const defaultUsers: OptionData[] = await (this.props.onError
        ? this.props.onError(e, query || '') || Promise.resolve([])
        : Promise.resolve([]));
      const elapsedTimeMilli = window.performance.now() - startTime;
      this.setState({ users: defaultUsers, loading: false });
      this.fireEvent(failedRequestUsersEvent, { elapsedTimeMilli });
    }
  };

  debouncedGetUsers = debounce(
    this.getUsers,
    this.props.debounceTime ? this.props.debounceTime : 0,
  );

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
    // while when not loading just return already filtered result from server.
    if (!loading) {
      return users;
    }
    const filteredUsers = users.filter((user: OptionData) =>
      stringContains(user.name, query),
    );
    this.fireEvent(filterUsersEvent, {
      filtered: getUsersForAnalytics(filteredUsers),
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
    this.setState(currentState => ({ ...currentState, ...state }));
    if (this.props.onFocus) {
      this.props.onFocus(sessionId);
    }
  };

  onBlur = (sessionId?: string) => {
    this.debouncedGetUsers.cancel();
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
          this.props.isLoading || (this.state.loading && !this.state.closed)
        }
        options={this.filterUsers()}
      />
    );
  }
}

export default withAnalyticsEvents()(SmartUserPicker);
