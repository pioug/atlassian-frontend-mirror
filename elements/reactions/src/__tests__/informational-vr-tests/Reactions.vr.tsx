import {
	LoadedReactions,
	LoadedReactionsDisallowAllEmojis,
	LoadedReactionsMiniMode,
	LoadedReactionsWithPickerQuickReactionEmojiIds,
} from './Reactions.fixtures';
import { snapshotInformational } from '@af/visual-regression';

const featureFlags = {
	'platform-component-visual-refresh': true,
	platform_editor_css_migrate_reactions: [true, false],
};

snapshotInformational(LoadedReactions, {
	description: 'Reactions trigger button selected',
	prepare: async (page) => {
		await page.getByTestId('render-trigger-button').click();
	},
	selector: {
		byTestId: 'render-reactions',
	},
	featureFlags,
});

snapshotInformational(LoadedReactionsMiniMode, {
	description: 'Reactions miniMode trigger button selected',
	selector: {
		byTestId: 'render-reactions',
	},
	prepare: async (page) => {
		await page.getByTestId('render-trigger-button').click();
	},
	featureFlags,
});

snapshotInformational(LoadedReactions, {
	description: 'Reactions Picker',
	prepare: async (page) => {
		await page.getByTestId('render-trigger-button').click();
		await page.waitForTimeout(200);
	},
	featureFlags,
	selector: {
		byTestId: 'reactionPickerPanel-testid',
	},
});

snapshotInformational(LoadedReactionsDisallowAllEmojis, {
	description: 'Reactions Picker with allowAllEmojis false',
	prepare: async (page) => {
		await page.getByTestId('render-trigger-button').click();
		await page.waitForTimeout(200);
	},
	featureFlags,
	selector: {
		byTestId: 'reactionPickerPanel-testid',
	},
});

snapshotInformational(LoadedReactionsWithPickerQuickReactionEmojiIds, {
	description: 'Reactions Picker with pickerQuickReactionEmojiIds',
	prepare: async (page) => {
		await page.getByTestId('render-trigger-button').click();
		await page.waitForTimeout(200);
	},
	featureFlags,
	selector: {
		byTestId: 'reactionPickerPanel-testid',
	},
});

snapshotInformational(LoadedReactions, {
	description: 'Reaction tooltip with users less than limit',
	prepare: async (page) => {
		await page.getByLabel('React with grinning face emoji').hover();
		await page.getByLabel('Black Panther').isVisible();
	},
	selector: {
		byTestId: 'render-reactionTooltip',
	},
	featureFlags,
});

snapshotInformational(LoadedReactions, {
	description: 'Reaction tooltip with users more than limit',
	prepare: async (page) => {
		await page.getByLabel('React with Blue Star emoji').hover();
		await page.getByLabel('and 5 others').isVisible();
	},
	selector: {
		byTestId: 'render-reactionTooltip',
	},
	featureFlags,
});
