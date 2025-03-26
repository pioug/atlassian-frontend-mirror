import { LoadedReactionsWithModal, MoreLoadedReactionsWithModal } from './ReactionsDialog.fixtures';
import { snapshotInformational } from '@af/visual-regression';
import mockPeopleSpriteImage from './assets/people.png';
import mockSymbolSpriteImage from './assets/symbols.png';
import mockNatureSpriteImage from './assets/nature.png';
import mockBlueStarImage from './assets/blue_star_64.png';
import mockWtfImage from './assets/wtf.png';

const featureFlags = {
	platform_editor_css_migrate_reactions: [true, false],
};

const mockRequests = [
	{
		urlPattern: /spritesheets\/people.png$/,
		asset: mockPeopleSpriteImage,
	},
	{
		urlPattern: /spritesheets\/nature.png$/,
		asset: mockNatureSpriteImage,
	},
	{
		urlPattern: /spritesheets\/symbols.png$/,
		asset: mockSymbolSpriteImage,
	},
	{
		urlPattern: /blue_star_64.png$/,
		asset: mockBlueStarImage,
	},
	{
		urlPattern: /wtf@4x.png$/,
		asset: mockWtfImage,
	},
];

snapshotInformational(LoadedReactionsWithModal, {
	description: 'Reactions modal dialog',
	selector: {
		byTestId: 'render-reactions-modal',
	},
	prepare: async (page) => {
		await page.getByLabel('React with Blue Star emoji').hover();
		await page.getByTestId('render-reactionTooltip').getByText('and 5 others').click();
	},
	featureFlags,
	mockRequests,
});

snapshotInformational(MoreLoadedReactionsWithModal, {
	description: 'Reactions modal dialog first page',
	selector: {
		byTestId: 'render-reactions-modal',
	},
	prepare: async (page) => {
		await page.getByLabel('React with Blue Star emoji').hover();
		await page.getByTestId('render-reactionTooltip').getByText('and 5 others').click();
	},
	featureFlags,
	mockRequests,
});

snapshotInformational(MoreLoadedReactionsWithModal, {
	description: 'Reactions modal dialog middle page',
	selector: {
		byTestId: 'render-reactions-modal',
	},
	prepare: async (page) => {
		await page.getByLabel('React with Blue Star emoji').hover();
		await page.getByTestId('render-reactionTooltip').getByText('and 5 others').click();
		await page.getByRole('button', { name: 'Right Navigate' }).click();
	},
	featureFlags,
	mockRequests,
});

snapshotInformational(MoreLoadedReactionsWithModal, {
	description: 'Reactions modal dialog last page',
	selector: {
		byTestId: 'render-reactions-modal',
	},
	prepare: async (page) => {
		await page.getByLabel('React with Blue Star emoji').hover();
		await page.getByTestId('render-reactionTooltip').getByText('and 5 others').click();
		await page.getByRole('button', { name: 'Right Navigate' }).click();
		await page.getByRole('button', { name: 'Right Navigate' }).click();
	},
	featureFlags,
	mockRequests,
});
