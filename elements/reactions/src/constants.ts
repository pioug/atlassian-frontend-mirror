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

import type { EmojiId, WithSamplingUFOExperience } from '@atlaskit/emoji';
import type { UFOExperience, ConcurrentExperience } from '@atlaskit/ufo';

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
	ReactionDetailsFetch: ConcurrentExperience;
	ReactionDialogOpened: UFOExperience;
	ReactionDialogSelectedReactionChanged: UFOExperience;
	ReactionsAdd: ConcurrentExperience;
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
