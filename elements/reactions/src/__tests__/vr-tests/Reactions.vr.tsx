import { snapshot } from '@af/visual-regression';
import {
	DisabledReactions,
	ErrorReactions,
	LoadingReactions,
	NotLoadedReactions,
	LoadedReactions,
	StaticReactions,
	LoadedReactionsMiniMode,
	QuickReactions,
	LoadedReactionsWithOpaqueBackground,
	StaticReactionsSingleReaction,
	LoadedReactionSingleReaction,
	LoadedReactionSingleReactionReacted,
	ReactionsWithShowAddReactionText,
	LoadedReactionsWithOnlyRenderPicker,
} from './Reactions.fixtures';

const featureFlags = {
	'platform-component-visual-refresh': true,
};

snapshot(LoadedReactions, {
	featureFlags,
});

snapshot(ReactionsWithShowAddReactionText, {
	featureFlags,
});

snapshot(LoadedReactionSingleReactionReacted, {
	description: 'Loaded reacted reactions on hover',
	states: [{ state: 'hovered', selector: { byTestId: 'render_reaction_wrapper' } }],
	featureFlags,
});

snapshot(LoadedReactionSingleReaction, {
	description: 'Loaded reactions on hover',
	states: [{ state: 'hovered', selector: { byTestId: 'render_reaction_wrapper' } }],
	featureFlags,
});

snapshot(DisabledReactions, {
	featureFlags,
});

snapshot(NotLoadedReactions, {
	featureFlags,
});

snapshot(LoadingReactions, {
	featureFlags,
});

snapshot(LoadedReactionsWithOnlyRenderPicker, {
	featureFlags,
});

snapshot(ErrorReactions, {
	featureFlags,
});

snapshot(StaticReactions, {
	featureFlags,
});

snapshot(StaticReactionsSingleReaction, {
	description: 'Static reactions on hover',
	featureFlags,
	states: [{ state: 'hovered', selector: { byTestId: 'render_reaction_wrapper' } }],
});

snapshot(LoadedReactionsMiniMode, {
	featureFlags,
});

snapshot(QuickReactions, {
	featureFlags,
});

snapshot(LoadedReactionsWithOpaqueBackground, {
	featureFlags,
});
