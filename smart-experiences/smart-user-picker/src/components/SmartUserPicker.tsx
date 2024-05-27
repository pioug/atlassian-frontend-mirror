import React from 'react';
import debounce from 'lodash/debounce';
import { v4 as uuidV4 } from 'uuid';
import { withAnalyticsEvents } from '@atlaskit/analytics-next';
import memoizeOne from 'memoize-one';
import { type WrappedComponentProps, injectIntl } from 'react-intl-next';
import { type CustomData, type UFOExperience, UFOExperienceState } from '@atlaskit/ufo';
import UserPicker, {
  type OptionData,
  isExternalUser,
  isTeam,
  isUser,
} from '@atlaskit/user-picker';

import {
  requestUsersEvent,
  filterUsersEvent,
  preparedUsersLoadedEvent,
  successfulRequestUsersEvent,
  failedRequestUsersEvent,
  mountedWithPrefetchEvent,
  createAndFireEventInElementsChannel,
  type SmartEventCreator,
} from '../analytics';
import MessagesIntlProvider from './MessagesIntlProvider';
import { type SmartProps, type Props, type State, type FilterOptions } from '../types';
import { getUserRecommendations, hydrateDefaultValues } from '../service';
import { smartUserPickerOptionsShownUfoExperience } from '../ufoExperiences';
import { type SUPError } from '../service/recommendation-client';

const DEFAULT_DEBOUNCE_TIME_MS = 150;

type EndStateConfig = {
  force?: boolean;
  metadata?: CustomData;
};

const ufoEndStateConfig = (fieldId: string): EndStateConfig => {
  return {
    metadata: {
      contextType: fieldId,
    },
  };
};

const hasContextChanged = (
  oldContext: SmartProps,
  newContext: SmartProps,
): boolean =>
  oldContext.siteId !== newContext.siteId ||
  oldContext.orgId !== newContext.orgId ||
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

const checkIf500Event = (statusCode: number) =>
  500 <= statusCode && statusCode < 600;

export class SmartUserPickerWithoutAnalytics extends React.Component<
  Props & WrappedComponentProps,
  State
> {
  state: State = {
    users: [],
    loading: false,
    closed: true,
    query: '',
    defaultValue: [],
    bootstrapOptions: [],
  };

  optionsShownUfoExperienceInstance: UFOExperience;

  static defaultProps = {
    baseUrl: '',
    includeUsers: true,
    includeGroups: false,
    includeTeams: false,
    includeNonLicensedUsers: false,
    prefetch: false,
    principalId: 'Context',
    debounceTime: DEFAULT_DEBOUNCE_TIME_MS,
  };

  constructor(props: Props & WrappedComponentProps) {
    super(props);
    this.optionsShownUfoExperienceInstance =
      smartUserPickerOptionsShownUfoExperience.getInstance(
        props.inputId || props.fieldId,
      );
  }

  async componentDidMount() {
    try {
      const value = await hydrateDefaultValues(
        this.props.baseUrl,
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
    } else if (!this.state.closed && !this.state.loading) {
      // If the component has rendered (including its dropdown list) and it
      // is not loading anything further, send the success UFO event
      if (
        ![
          UFOExperienceState.FAILED.id,
          UFOExperienceState.SUCCEEDED.id,
          UFOExperienceState.ABORTED.id,
        ].includes(this.optionsShownUfoExperienceInstance.state.id)
      ) {
        this.optionsShownUfoExperienceInstance.success(
          ufoEndStateConfig(this.props.fieldId),
        );
      }
    }
  }

  abortOptionsShownUfoExperience = () => {
    if (
      this.optionsShownUfoExperienceInstance.state.id ===
      UFOExperienceState.STARTED.id
    ) {
      // There may be an existing UFO timing running from previous key entry or focus,
      // so abort it and restart it just in case.
      this.optionsShownUfoExperienceInstance.abort();
    }
  };

  startOptionsShownUfoExperience = () => {
    this.abortOptionsShownUfoExperience();
    this.optionsShownUfoExperienceInstance.start();
  };

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
    const { query, sessionId, closed } = this.state;

    const {
      baseUrl,
      childObjectId,
      containerId,
      fieldId,
      includeGroups,
      includeTeams,
      includeUsers,
      includeNonLicensedUsers,
      intl,
      maxOptions,
      objectId,
      onEmpty,
      onError,
      overrideByline,
      orgId,
      principalId,
      productAttributes,
      productKey,
      searchQueryFilter,
      siteId,
    } = this.props;

    const maxNumberOfResults = maxOptions || 100;
    const startTime = window.performance.now();
    const recommendationsRequest = {
      baseUrl,
      context: {
        containerId,
        contextType: fieldId,
        objectId,
        principalId,
        productKey,
        siteId,
        organizationId: orgId,
        childObjectId,
        sessionId,
        productAttributes,
      },
      includeUsers,
      includeGroups,
      includeTeams,
      includeNonLicensedUsers,
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

      if (overrideByline) {
        for (let option of recommendedUsers) {
          if (isUser(option) || isExternalUser(option) || isTeam(option)) {
            option.byline = overrideByline(option);
          }
        }
      }

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
      const is5xxEvent = checkIf500Event((e as SUPError).statusCode);
      if (!closed && !onError && is5xxEvent) {
        // If the user lookup fails while the menu is open, and the consumer is not providing a
        // fallback data source via the onError prop, then send UFO failure
        this.optionsShownUfoExperienceInstance.failure(
          ufoEndStateConfig(this.props.fieldId),
        );
      }
      this.setState({ users: [] });

      let onErrorProducedError = false;
      let defaultUsers: OptionData[] = [];
      try {
        defaultUsers = onError
          ? (await onError(e, recommendationsRequest)) || []
          : [];
      } catch (error) {
        onErrorProducedError = true;
      }
      if (onErrorProducedError && is5xxEvent) {
        // Log error from fallback data source `onError` to UFO
        this.optionsShownUfoExperienceInstance.failure(
          ufoEndStateConfig(this.props.fieldId),
        );
      }
      if (!is5xxEvent && ((!onError && !closed) || onErrorProducedError)) {
        this.abortOptionsShownUfoExperience();
      }

      this.setState({ users: defaultUsers, loading: false });

      const elapsedTimeMilli = window.performance.now() - startTime;
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
      // If the input has been typed into and the dropdown has not been closed
      // (i.e. input blurred) then start the UFO timer.
      // If there's a previous UFO timer running for the same "options shown" experience,
      // it will be aborted first.
      this.startOptionsShownUfoExperience();

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
    this.startOptionsShownUfoExperience();
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

    this.abortOptionsShownUfoExperience();

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
      <MessagesIntlProvider>
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
      </MessagesIntlProvider>
    );
  }
}

// TODO: Smart User picker team will have to add a type annotation here
export const SmartUserPicker: any = withAnalyticsEvents()(
  injectIntl(SmartUserPickerWithoutAnalytics),
);
