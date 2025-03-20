import { LoadedReactions, LoadedReactionsWithSummaryView } from './Reactions.fixtures';
import { snapshotInformational } from '@af/visual-regression';

const featureFlags = {
	platform_editor_css_migrate_reactions: [true, false],
};

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

snapshotInformational(LoadedReactionsWithSummaryView, {
	description: 'Reactions summary view',
	selector: {
		byTestId: 'render-reactions',
	},
	featureFlags,
});

snapshotInformational(LoadedReactionsWithSummaryView, {
	description: 'Reactions summary view on click to show reactions',
	selector: {
		byTestId: 'render-summary-view-popup',
	},
	prepare: async (page) => {
		await page.getByTestId('reaction-summary-button').click();
	},
	featureFlags,
});

snapshotInformational(LoadedReactionsWithSummaryView, {
	description: 'Reactions summary view with viewOnly mode',
	selector: {
		byTestId: 'render-reactions',
	},
	featureFlags,
});
