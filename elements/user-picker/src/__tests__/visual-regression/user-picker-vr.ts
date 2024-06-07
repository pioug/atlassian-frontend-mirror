import {
	disableCaretCursor,
	getExampleUrl,
	loadPage,
	type PuppeteerPage,
} from '@atlaskit/visual-regression/helper';
import {
	AVATAR_EMAIL_ITEM_SECONDARY_TEXT,
	AVATAR_TEAM_ITEM_SECONDARY_TEXT,
	AVATAR_GROUP_ITEM_SECONDARY_TEXT,
	AVATAR_CUSTOM_ITEM_SECONDARY_TEXT,
	CLEAR_INDICATOR_SELECTOR,
	LOZENGE_CLEAR_ICON_SELECTOR,
	DISABLE_INPUT_ID_SINGLE,
	DISABLE_INPUT_ID_MULTI,
	POPUP_BUTTON,
	CONTROL_SELECTOR,
	MENU_LIST_SELECTOR,
} from './_constants';

import { hoverOverUserPicker, inputTypingFactory, selectItemFactory } from './_testUtils';

type InteractionTest = {
	name: string;
	setUp?: (page: PuppeteerPage) => Promise<void>;
};

const themeModes = ['dark', 'light', 'none'] as const;

const examples = [
	'single',
	'single-compact',
	'single-subtle-and-compact',
	'multi',
	'multi-compact',
];

/**
 * Add to interactions if your test case has unique UI implications across
 * different user picker examples.
 */
const interactions: Array<InteractionTest> = [
	{
		name: 'before interaction',
	},
	{
		name: 'hover',
		setUp: hoverOverUserPicker,
	},
	{
		name: 'type blank',
		setUp: inputTypingFactory(''),
	},
	{
		name: 'show team items',
		setUp: async (page: PuppeteerPage) => {
			await inputTypingFactory('team')(page);
			await page.waitForSelector(AVATAR_TEAM_ITEM_SECONDARY_TEXT);
		},
	},
	{
		name: 'show group items',
		setUp: async (page: PuppeteerPage) => {
			await inputTypingFactory('group')(page);
			await page.waitForSelector(AVATAR_GROUP_ITEM_SECONDARY_TEXT);
		},
	},
	{
		name: 'show custom options',
		setUp: async (page: PuppeteerPage) => {
			await inputTypingFactory('custom')(page);
			await page.waitForSelector(AVATAR_CUSTOM_ITEM_SECONDARY_TEXT);
		},
	},
	{
		name: 'select top item',
		setUp: selectItemFactory(''),
	},
	{
		name: 'select team item',
		setUp: selectItemFactory('team'),
	},
	{
		name: 'select group item',
		setUp: selectItemFactory('admin-groups-group'),
	},
	{
		name: 'select custom item',
		setUp: selectItemFactory('Custom option with lozenge'),
	},
];

describe('UserPicker VR Snapshot Test', () => {
	themeModes.forEach((themeMode) => {
		describe(`theme=${themeMode}`, () => {
			async function vrForExample(
				exampleName: string,
				optionalSetup?: (page: PuppeteerPage) => Promise<void>,
			) {
				const page: PuppeteerPage = global.page;
				await loadPage(
					page,
					getExampleUrl('elements', 'user-picker', exampleName, global.__BASEURL__, themeMode),
				);
				if (optionalSetup) {
					await optionalSetup(page);
				}

				const image = await page.screenshot();
				expect(image).toMatchProdImageSnapshot();
			}

			/**
			 * Loops through each theme-example-interaction combination to create
			 * a VR snapshot.
			 */
			examples.forEach((example) => {
				describe(`user picker type=${example}`, () => {
					interactions.forEach((interaction) => {
						// TODO: Unskip tests https://product-fabric.atlassian.net/browse/ED-17208
						const skipCondition =
							interaction.name === 'show group items' &&
							themeMode === 'light' &&
							example === 'multi-compact';

						const itOrSkip = skipCondition ? it.skip : it;

						itOrSkip(`interaction=${interaction.name}`, async () => {
							await vrForExample(example, interaction.setUp);
						});
					});
				});
			});

			describe('custom interactions', () => {
				/**
				 * Add to this section if your test case doesn't need to generalize across
				 * all the different picker examples.
				 */
				describe('single', () => {
					describe('disabled', () => {
						it('no change on hover', async () => {
							await vrForExample('single-disabled', async (page: PuppeteerPage) => {
								await page.hover(CONTROL_SELECTOR);
							});
						});

						it('no change on click', async () => {
							await vrForExample('single-disabled', async (page: PuppeteerPage) => {
								await page.click(CONTROL_SELECTOR);
							});
						});
					});

					describe('menu closing', () => {
						it('menu is closed on double click', async () => {
							await vrForExample('single', async (page: PuppeteerPage) => {
								await disableCaretCursor(page);

								await page.click(CONTROL_SELECTOR);
								await page.waitForSelector(MENU_LIST_SELECTOR);

								await page.click(CONTROL_SELECTOR);
								await page.waitForSelector(MENU_LIST_SELECTOR, {
									hidden: true,
								});
							});
						});

						it('menu is opened on triple click', async () => {
							await vrForExample('single', async (page: PuppeteerPage) => {
								await disableCaretCursor(page);

								await page.click(CONTROL_SELECTOR);
								await page.waitForSelector(MENU_LIST_SELECTOR);

								await page.click(CONTROL_SELECTOR);
								await page.waitForSelector(MENU_LIST_SELECTOR, {
									hidden: true,
								});

								await page.click(CONTROL_SELECTOR);
								await page.waitForSelector(MENU_LIST_SELECTOR);
							});
						});
					});

					it('highlights clear indicator when hovered', async () => {
						await vrForExample('single', async (page: PuppeteerPage) => {
							await selectItemFactory('')(page);

							await page.hover(CLEAR_INDICATOR_SELECTOR);
						});
					});

					it('clears picker when clear indicator clicked', async () => {
						await vrForExample('single', async (page: PuppeteerPage) => {
							await selectItemFactory('')(page);

							await page.click(CLEAR_INDICATOR_SELECTOR);
						});
					});

					it('cannot select a disabled item', async () => {
						await vrForExample('disable-options', selectItemFactory(''));
					});

					it('input disabled after item selected', async () => {
						await vrForExample('disable-input', async (page: PuppeteerPage) => {
							await selectItemFactory('', DISABLE_INPUT_ID_SINGLE)(page);

							await page.focus(DISABLE_INPUT_ID_SINGLE);
							await page.type(DISABLE_INPUT_ID_SINGLE, 'a');
						});
					});
				});

				describe('multi', () => {
					describe('emails', () => {
						it('prompts entering email', async () => {
							await vrForExample('creatable-with-locale', async (page: PuppeteerPage) => {
								await inputTypingFactory('email@')(page);

								// required since item options are async loaded
								await page.waitForSelector(AVATAR_EMAIL_ITEM_SECONDARY_TEXT);
							});
						});

						it('prompts selecting valid email', async () => {
							await vrForExample('creatable-with-locale', async (page: PuppeteerPage) => {
								await inputTypingFactory('email@gmail.com')(page);

								// required since item options are async loaded
								await page.waitForSelector(AVATAR_EMAIL_ITEM_SECONDARY_TEXT);
							});
						});

						it('selects new email', async () => {
							await vrForExample('creatable-with-locale', selectItemFactory('email@gmail.com'));
						});
					});

					it('highlights value lozenge', async () => {
						await vrForExample('multi-with-default-values', async (page: PuppeteerPage) => {
							// focus
							await inputTypingFactory('')(page);

							await page.keyboard.press('ArrowLeft');
						});
					});

					it('highlights lozenge clear indicator', async () => {
						await vrForExample('multi', async (page: PuppeteerPage) => {
							await selectItemFactory('')(page);
							await page.hover(LOZENGE_CLEAR_ICON_SELECTOR);
						});
					});

					it('deletes lozenge when clear indicator clicked', async () => {
						await vrForExample('multi', async (page: PuppeteerPage) => {
							await selectItemFactory('')(page);
							await selectItemFactory('')(page);
							await page.click(LOZENGE_CLEAR_ICON_SELECTOR);
						});
					});

					it('deletes a default item with backspace key', async () => {
						await vrForExample('multi-with-default-values', async (page: PuppeteerPage) => {
							// focus
							await inputTypingFactory('')(page);

							await page.keyboard.press('Backspace');
						});
					});

					it('deletes the first default item with left arrows and delete key', async () => {
						await vrForExample('multi-with-default-values', async (page: PuppeteerPage) => {
							// focus
							await inputTypingFactory('')(page);

							await page.keyboard.press('ArrowLeft');
							await page.keyboard.press('ArrowLeft');
							await page.keyboard.press('Backspace');
						});
					});

					it('types with default item present', async () => {
						await vrForExample('multi-with-default-values', inputTypingFactory('a'));
					});

					it('does not delete a fixed item with delete key', async () => {
						await vrForExample('multi-with-fixed-values', async (page: PuppeteerPage) => {
							// focus
							await inputTypingFactory('')(page);

							await page.keyboard.press('Backspace');
						});
					});

					it('autoscrolls after selected items exceed bounded height', async () => {
						// no options
						await vrForExample('multi', async (page: PuppeteerPage) => {
							// focus
							await inputTypingFactory('')(page);

							// 9 required to start autoscrolling
							const numSelections = 9;
							for (let i = 0; i < numSelections; i++) {
								await page.keyboard.press('Enter');
							}
						});
					});

					it('input is disabled after item selected', async () => {
						await vrForExample('disable-input', async (page: PuppeteerPage) => {
							await selectItemFactory('', DISABLE_INPUT_ID_MULTI)(page);

							await page.focus(DISABLE_INPUT_ID_MULTI);
							await page.type(DISABLE_INPUT_ID_MULTI, 'a');
						});
					});
				});

				describe('popup user picker', () => {
					it('opened', async () => {
						await vrForExample('modal', async (page: PuppeteerPage) => {
							await disableCaretCursor(page);
							await page.click(POPUP_BUTTON);
							await page.waitForSelector(MENU_LIST_SELECTOR);
						});
					});

					it('selected', async () => {
						await vrForExample('modal', async (page: PuppeteerPage) => {
							await disableCaretCursor(page);
							await page.click(POPUP_BUTTON);
							await page.waitForSelector(MENU_LIST_SELECTOR);
							// closes menu on pressing enter
							await page.keyboard.press('Enter');
							await page.waitForSelector(MENU_LIST_SELECTOR, {
								hidden: true,
							});

							// click again to verify selection
							await page.click(POPUP_BUTTON);
							await page.waitForSelector(MENU_LIST_SELECTOR);
						});
					});
				});

				describe('user picker with a footer', () => {
					it('renders a footer', async () => {
						await vrForExample('footer', async (page: PuppeteerPage) => {
							await disableCaretCursor(page);

							await page.click(CONTROL_SELECTOR);
							await page.waitForSelector(MENU_LIST_SELECTOR);
						});
					});
				});
			});
		});
	});
});
