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
} from './Reactions.fixtures';

const featureFlags = {
	'platform-component-visual-refresh': true,
	platform_editor_css_migrate_reactions: [true, false],
};

snapshot(LoadedReactions, {
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

snapshot(ErrorReactions, {
	featureFlags,
});

snapshot(StaticReactions, {
	featureFlags,
});

snapshot(LoadedReactionsMiniMode, {
	featureFlags,
});

snapshot(QuickReactions, {
	featureFlags,
});
