import { snapshot } from '@af/visual-regression';
import {
	EmptySummaryReactions,
	LoadedSummaryReactions,
	LoadedSummaryReactionsWithSubtleStyle,
	LoadedSummaryReactionsAllowSelectionFromEmojiPicker,
	LoadedSummaryReactionsViewOnly,
} from './SummaryReactions.fixtures';

const featureFlags = {
	'platform-component-visual-refresh': true,
};

snapshot(EmptySummaryReactions, {
	featureFlags,
});

snapshot(LoadedSummaryReactions, {
	featureFlags,
});

snapshot(LoadedSummaryReactionsWithSubtleStyle, {
	featureFlags,
});

snapshot(LoadedSummaryReactionsAllowSelectionFromEmojiPicker, {
	featureFlags,
});

snapshot(LoadedSummaryReactionsViewOnly, {
	featureFlags,
});
