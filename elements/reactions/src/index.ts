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
import type { EmojiId, WithSamplingUFOExperience } from '@atlaskit/emoji';
import type { UFOExperience, ConcurrentExperience } from '@atlaskit/ufo';

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
	Reactions as ReactionsType,
	StorePropInput,
	State,
} from './types';
export { ReactionUpdateType, ReactionStatus, type ReactionSummary } from './types';

export const constants: {
	DefaultReactions: EmojiId[];
	DefaultReactionsByShortName: Map<string, EmojiId>;
	ExtendedReactions: EmojiId[];
	ExtendedReactionsByShortName: Map<string, EmojiId>;
	NUMBER_OF_REACTIONS_TO_DISPLAY: number;
	SAMPLING_RATE_REACTIONS_RENDERED_EXP: number;
	TOOLTIP_USERS_LIMIT: number;
} = {
	DefaultReactions,
	DefaultReactionsByShortName,
	ExtendedReactions,
	ExtendedReactionsByShortName,
	NUMBER_OF_REACTIONS_TO_DISPLAY,
	SAMPLING_RATE_REACTIONS_RENDERED_EXP,
	TOOLTIP_USERS_LIMIT,
};

export const UFO: {
	ComponentName: typeof ComponentName;
	ExperienceName: typeof ExperienceName;
	PickerRender: UFOExperience;
	ReactionsAdd: ConcurrentExperience;
	ReactionDetailsFetch: ConcurrentExperience;
	ReactionDialogOpened: UFOExperience;
	ReactionDialogSelectedReactionChanged: UFOExperience;
	ReactionsRemove: ConcurrentExperience;
	ReactionsRendered: ConcurrentExperience;
	sampledReactionsRendered: (instanceId: string) => WithSamplingUFOExperience;
} = {
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
