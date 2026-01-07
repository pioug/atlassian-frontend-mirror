import React from 'react';
import debounce from 'lodash/debounce';
// eslint-disable-next-line @atlaskit/platform/prefer-crypto-random-uuid -- Use crypto.randomUUID instead
import { v4 as uuidV4 } from 'uuid';
import { withAnalyticsEvents } from '@atlaskit/analytics-next';
import memoizeOne from 'memoize-one';
import { type WrappedComponentProps, injectIntl } from 'react-intl-next';
import { type CustomData, type UFOExperience, UFOExperienceState } from '@atlaskit/ufo';
import UserPicker, {
	type OptionData,
	type Team,
	isExternalUser,
	isTeam,
	isGroup,
	isUser,
	isValidEmail,
} from '@atlaskit/user-picker';
import { fg } from '@atlaskit/platform-feature-flags';

import {
	requestUsersEvent,
	filterUsersEvent,
	preparedUsersLoadedEvent,
	successfulRequestUsersEvent,
	failedRequestUsersEvent,
	mountedWithPrefetchEvent,
	createAndFireEventInElementsChannel,
	failedUserResolversEvent,
	type SmartEventCreator,
} from '../analytics';
import MessagesIntlProvider from './MessagesIntlProvider';
import {
	type SmartProps,
	type Props,
	type State,
	type FilterOptions,
	UserEntityType,
} from '../types';
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

const hasContextChanged = (oldContext: SmartProps, newContext: SmartProps): boolean =>
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

const checkIf500Event = (statusCode: number) => 500 <= statusCode && statusCode < 600;

const isEmailQuery = (query: string): boolean => {
	return isValidEmail(query.trim()) === 'VALID';
};

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

	// Track if the last search was an email search that found matches
	private lastEmailSearchFoundMatches = false;

	optionsShownUfoExperienceInstance: UFOExperience;

	static defaultProps = {
		baseUrl: '',
		includeUsers: true,
		includeGroups: false,
		includeTeams: false,
		includeTeamsUpdates: false,
		includeNonLicensedUsers: false,
		displayEmailInByline: false,
		prefetch: false,
		principalId: 'Context',
		debounceTime: DEFAULT_DEBOUNCE_TIME_MS,
		userResolvers: [],
		enableEmailSearch: false,
		allowEmailSelectionWhenEmailMatched: true,
		verifiedTeams: false,
	};

	constructor(props: Props & WrappedComponentProps) {
		super(props);
		this.optionsShownUfoExperienceInstance = smartUserPickerOptionsShownUfoExperience.getInstance(
			props.inputId || props.fieldId,
		);
	}

	async componentDidMount() {
		try {
			const value = await hydrateDefaultValues(
				this.props.baseUrl,
				this.props.defaultValue,
				this.props.productKey,
				this.props.siteId,
			);

			this.setState({
				defaultValue: value,
			});
		} catch (e) {
			const defaultValue: OptionData[] = await (this.props.onValueError
				? this.props.onValueError(e, this.props.defaultValue) || Promise.resolve([])
				: Promise.resolve([]));
			this.setState({ defaultValue: defaultValue });
		}

		const { prefetch } = this.props;
		if (prefetch) {
			// eslint-disable-next-line @atlaskit/platform/prefer-crypto-random-uuid -- Use crypto.randomUUID instead
			const sessionId = uuidV4();
			this.fireEvent(mountedWithPrefetchEvent, { sessionId });
			this.setState({
				sessionId,
			});
		}
	}

	componentDidUpdate(prevProps: Props, prevState: State): void {
		if (hasContextChanged(prevProps, this.props) || this.props.fieldId !== prevProps.fieldId) {
			this.setState({
				users: [],
			});
		}
		if (
			(this.state.sessionId !== prevState.sessionId || this.state.query !== prevState.query) &&
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
				this.optionsShownUfoExperienceInstance.success(ufoEndStateConfig(this.props.fieldId));
			}
		}
	}

	abortOptionsShownUfoExperience = () => {
		if (this.optionsShownUfoExperienceInstance.state.id === UFOExperienceState.STARTED.id) {
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
			createAndFireEventInElementsChannel(eventCreator(this.props, this.state, ...args))(
				createAnalyticsEvent,
			);
		}
	};

	filterOptions = (users: OptionData[], query: string, propFilterOptions?: FilterOptions) =>
		propFilterOptions ? propFilterOptions(users, query) : users;

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
			includeTeamsUpdates,
			includeUsers,
			includeNonLicensedUsers,
			intl,
			fetchOptions,
			maxOptions,
			objectId,
			onEmpty,
			onError,
			overrideByline,
			displayEmailInByline,
			verifiedTeams,
			orgId,
			principalId,
			productAttributes,
			productKey,
			restrictTo,
			searchQueryFilter,
			siteId,
			transformOptions,
			userResolvers,
			enableEmailSearch,
		} = this.props;

		const maxNumberOfResults = maxOptions || 100;
		const startTime = window.performance.now();

		// Check if this is an email search
		const isEmail = enableEmailSearch && isEmailQuery(query);

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
			// For email searches, disable groups and teams
			includeGroups,
			includeTeams,
			includeNonLicensedUsers,
			maxNumberOfResults,
			query,
			searchEmail: isEmail,
			verifiedTeams,
			/*
				For email-based searches, we have decided to filter out apps.
				Also - because the other 2 filters ((NOT not_mentionable:true) AND (account_status:active)) are included
				when filter is empty, they have been added here to maintain consistency.

				Further ref: https://developer.atlassian.com/platform/user-recommendations/guides/frequently-asked-questions/#filter-behavior
			 */
			searchQueryFilter:
				isEmail && !searchQueryFilter
					? '(NOT not_mentionable:true) AND (account_status:active) AND (NOT account_type:app)'
					: searchQueryFilter,
			...(restrictTo && fg('smart-user-picker-restrict-to-gate') && { restrictTo }),
		};
		try {
			const { query } = this.state;
			this.fireEvent(requestUsersEvent);

			let recommendedUsers;
			if (fetchOptions && fg('smart-user-picker-load-options-gate')) {
				recommendedUsers = await fetchOptions(query);
			} else if (fg('twcg-444-invite-usd-improvements-m2-gate')) {
				const userRecommendationsPromise = getUserRecommendations(recommendationsRequest, intl);

				const userResolversPromises = (userResolvers ?? []).map((resolver) =>
					resolver(query).catch((error) => {
						this.fireEvent(failedUserResolversEvent, {
							resolverName: resolver.name,
							error,
						});

						return [] as OptionData[];
					}),
				);

				const [mainRecommendations, ...userResolverResults] = await Promise.all([
					userRecommendationsPromise,
					...userResolversPromises,
				]);

				recommendedUsers = [mainRecommendations, ...userResolverResults].flat();
			} else {
				recommendedUsers = await getUserRecommendations(recommendationsRequest, intl);
			}

			if (overrideByline) {
				for (let option of recommendedUsers) {
					if (isUser(option) || isExternalUser(option) || isTeam(option)) {
						option.byline = overrideByline(option);
					}
				}
			}

			if (displayEmailInByline) {
				for (let option of recommendedUsers) {
					if (isUser(option) || isExternalUser(option)) {
						if (
							option.userType === UserEntityType.DEFAULT ||
							option.userType === UserEntityType.CUSTOMER
						) {
							// Respect existing byline if present
							if (option.email && !option.byline) {
								option.byline = option.email;
							}
						}
					}
				}
			}

			if (includeTeamsUpdates) {
				for (let option of recommendedUsers) {
					if (isGroup(option) || isTeam(option)) {
						option.includeTeamsUpdates = includeTeamsUpdates;
					}
				}
			}

			// Filter to only verified teams when verifiedTeams is true and feature flag is enabled
			if (verifiedTeams && includeTeams && fg('smart-user-picker-managed-teams-gate')) {
				recommendedUsers = recommendedUsers.filter((option) => {
					if (isTeam(option)) {
						// Only include teams that are verified
						// The verified property is set by the transformer from the server response
						const team = option as Team & { verified?: boolean };
						return team.verified === true;
					}
					return true; // Keep non-team options
				});
			}

			// Track if email search found matches for conditional allowEmail logic
			if (isEmail) {
				this.lastEmailSearchFoundMatches = recommendedUsers.length > 0;
			} else {
				this.lastEmailSearchFoundMatches = false;
			}

			const elapsedTimeMilli = window.performance.now() - startTime;

			const transformedOptions = transformOptions
				? await transformOptions(recommendedUsers, query)
				: recommendedUsers;

			const displayedUsers =
				transformedOptions.length === 0 && onEmpty
					? ((await onEmpty(query)) ?? [])
					: transformedOptions;

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
					...(fg('twcg-444-invite-usd-improvements-m2-gate') && {
						userResolvers: Array.isArray(userResolvers)
							? userResolvers.map((resolver) => resolver.name)
							: [],
					}),
				});

				return { users, loading };
			});
		} catch (e) {
			const is5xxEvent = checkIf500Event((e as SUPError).statusCode);
			if (!closed && !onError && is5xxEvent) {
				// If the user lookup fails while the menu is open, and the consumer is not providing a
				// fallback data source via the onError prop, then send UFO failure
				this.optionsShownUfoExperienceInstance.failure(ufoEndStateConfig(this.props.fieldId));
			}
			this.setState({ users: [] });

			let onErrorProducedError = false;
			let defaultUsers: OptionData[] = [];
			try {
				defaultUsers = onError ? (await onError(e, recommendationsRequest)) || [] : [];
			} catch {
				onErrorProducedError = true;
			}
			if (onErrorProducedError && is5xxEvent) {
				// Log error from fallback data source `onError` to UFO
				this.optionsShownUfoExperienceInstance.failure(ufoEndStateConfig(this.props.fieldId));
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
		const filteredUsers = this.memoizedFilterOptions(users, query, this.props.filterOptions);
		//If bootstrapOptions have been passed in and it is bootstrap
		if (this.props.bootstrapOptions && this.props.bootstrapOptions.length !== 0 && query === '') {
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
		const state: Partial<State> = { closed: false };
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

	render(): React.JSX.Element {
		const { allowEmail, enableEmailSearch, allowEmailSelectionWhenEmailMatched, ...restProps } =
			this.props;

		// Determine whether to allow email selection based on allowEmailSelectionWhenEmailMatched, if needed
		let shouldAllowEmail = allowEmail;

		if (allowEmail && enableEmailSearch && !allowEmailSelectionWhenEmailMatched) {
			// Only allow email selection if we're in an email search that found no matches
			const isCurrentQueryEmail = isEmailQuery(this.state.query);
			shouldAllowEmail = !isCurrentQueryEmail || !this.lastEmailSearchFoundMatches;
		}

		return (
			<MessagesIntlProvider>
				<UserPicker
					{...restProps}
					allowEmail={shouldAllowEmail}
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
					menuIsOpen={this.props.menuIsOpen}
				/>
			</MessagesIntlProvider>
		);
	}
}

// TODO: Smart User picker team will have to add a type annotation here
export const SmartUserPicker: any = withAnalyticsEvents()(
	injectIntl(SmartUserPickerWithoutAnalytics),
);
