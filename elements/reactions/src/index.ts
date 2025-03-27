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

import { Reaction as EmotionReaction } from './components/Reaction';
import { Reaction as CompiledReaction } from './components/compiled/Reaction';
import { Reactions as EmotionReactions } from './components/Reactions';
import { Reactions as CompiledReactions } from './components/compiled/Reactions';
import { ReactionPicker as EmotionReactionPicker } from './components/ReactionPicker/ReactionPicker';
import { ReactionPicker as CompiledReactionPicker } from './components/ReactionPicker/ReactionPicker';
import { componentWithFG } from '@atlaskit/platform-feature-flags-react';

const Reaction = componentWithFG(
	'platform_editor_css_migrate_reactions',
	CompiledReaction,
	EmotionReaction,
);

const Reactions = componentWithFG(
	'platform_editor_css_migrate_reactions',
	CompiledReactions,
	EmotionReactions,
);

const ReactionPicker = componentWithFG(
	'platform_editor_css_migrate_reactions',
	CompiledReactionPicker,
	EmotionReactionPicker,
);

export { ReactionServiceClient } from './client';

export { Reaction };
export { Reactions };
export { ReactionPicker };

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
export { ReactionUpdateType, ReactionStatus } from './types';

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
