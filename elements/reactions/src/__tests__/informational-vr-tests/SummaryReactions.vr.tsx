import {
	LoadedSummaryReactions,
	LoadedReactionsWithSummaryAllowSelectFromEmojiPicker,
} from './SummaryReactions.fixtures';
import { snapshotInformational } from '@af/visual-regression';

const featureFlags = {
	'platform-component-visual-refresh': true,
};

snapshotInformational(LoadedSummaryReactions, {
	description: 'Summary Reactions open picker',
	selector: {
		byTestId: 'reactionPickerPanel-testid',
	},
	prepare: async (page) => {
		await page.getByTestId('render-trigger-button').click();
		await page.waitForTimeout(200);
	},
	featureFlags,
});

snapshotInformational(LoadedSummaryReactions, {
	description: 'Summary Reactions on click to show reactions',
	selector: {
		byTestId: 'render-summary-view-popup',
	},
	prepare: async (page) => {
		await page.getByTestId('reaction-summary-button').click();
	},
	featureFlags,
});

snapshotInformational(LoadedReactionsWithSummaryAllowSelectFromEmojiPicker, {
	description: 'Summary Reactions with allowSelectFromEmojiPicker',
	selector: {
		byTestId: 'render-summary-view-popup',
	},
	prepare: async (page) => {
		await page.getByTestId('reaction-summary-button').click();
	},
	featureFlags,
});
