import {
	DefaultReactions,
	DefaultReactionsByShortName,
	ExtendedReactions,
	ExtendedReactionsByShortName,
	NUMBER_OF_REACTIONS_TO_DISPLAY,
	SAMPLING_RATE_REACTIONS_RENDERED_EXP,
	TOOLTIP_USERS_LIMIT,
} from './shared/constants';
import {
	ComponentName,
	ExperienceName,
	PickerRender,
	ReactionsAdd,
	ReactionDetailsFetch,
	ReactionDialogOpened,
	ReactionDialogSelectedReactionChanged,
	ReactionsRemove,
	ReactionsRendered,
	sampledReactionsRendered,
} from './ufo';

import { ReactionPicker } from './components/ReactionPicker';

export { ReactionServiceClient } from './client';

export { Reaction } from './components/Reaction';
export { ReactionPicker };

export { Reactions } from './components/Reactions';

export { useCloseManager } from './hooks/useCloseManager';
export { ConnectedReactionPicker, ConnectedReactionsView } from './containers';
export { MemoryReactionsStore, ReactionConsumer } from './store';
// TODO: Convert all calls for ReactionRequest to Request, RequestClient to Client and ReactionsStore to Store
export type {
	Client as ReactionClient,
	Request as ReactionRequest,
	Store as ReactionsStore,
	StorePropInput,
	State,
} from './types';
export { ReactionUpdateType, ReactionStatus, type ReactionSummary } from './types';

export const constants = {
	DefaultReactions,
	DefaultReactionsByShortName,
	ExtendedReactions,
	ExtendedReactionsByShortName,
	NUMBER_OF_REACTIONS_TO_DISPLAY,
	SAMPLING_RATE_REACTIONS_RENDERED_EXP,
	TOOLTIP_USERS_LIMIT,
};

export const UFO = {
	ComponentName,
	ExperienceName,
	PickerRender,
	ReactionsAdd,
	ReactionDetailsFetch,
	ReactionDialogOpened,
	ReactionDialogSelectedReactionChanged,
	ReactionsRemove,
	ReactionsRendered,
	sampledReactionsRendered,
};
