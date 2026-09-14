import { type Props, type State } from './types';

export const createDefaultSmartPickerAttributes: any = (props: Props, state: State) => {
	const {
		fieldId,
		objectId,
		containerId,
		childObjectId,
		prefetch,
		maxOptions,
		includeTeams,
		productKey,
		principalId,
		siteId,
		orgId,
		filterOptions,
	} = props;
	const { sessionId, query } = state;

	const maxNumberOfResults = maxOptions || 100;
	return {
		context: fieldId,
		childObjectId,
		containerId,
		hasFilterOptions: Boolean(filterOptions),
		includeTeams,
		maxNumberOfResults,
		objectId,
		prefetch,
		principalId,
		productKey,
		queryLength: (query || '').length,
		siteId,
		orgId,
		sessionId,
	};
};
