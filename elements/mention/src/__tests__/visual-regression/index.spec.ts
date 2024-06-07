import {
	getExampleUrl,
	loadPage,
	type PuppeteerPage,
	takeElementScreenShot,
	waitForNoTooltip,
} from '@atlaskit/visual-regression/helper';
import {
	MENTION_ID_HIGHLIGHTED,
	MENTION_ID_WITH_CONTAINER_ACCESS,
	MENTION_ID_WITH_NO_ACCESS,
} from '../unit/_test-constants';
import { hoverOverMentionByIdFactory } from './_interactors';

type Interaction = {
	name: string;
	func?: (page: PuppeteerPage) => Promise<void>;
};

type Scenario = {
	exampleName: string;
	interactions: Interaction[];
};

/**
 * A list of scenarios to be tested.
 * When using a new Storybook example make sure to:
 *   - include one interaction without a function
 *   - include an element with 'data-testid="vr-tested"' in that example to define a screenshot boundary
 */
const SCENARIOS: Scenario[] = [
	{
		exampleName: 'simple-mention-item',
		interactions: [{ name: 'no-interaction' }],
	},
	{
		exampleName: 'mention-item',
		interactions: [{ name: 'no-interaction' }],
	},
	// Skipped this test as it is flaky.
	// https://product-fabric.atlassian.net/browse/QS-3021
	// https://product-fabric.atlassian.net/browse/QS-3022
	// https://product-fabric.atlassian.net/browse/QS-3023
	/* {
    exampleName: 'mention-list',
    interactions: [
      { name: 'no-interaction' }, // first item is hovered already, no need for interactions
    ],
  }, */
	{
		exampleName: 'error-mention-list',
		interactions: [{ name: 'no-interaction' }],
	},
	{
		exampleName: 'simple-mention',
		interactions: [
			{ name: 'no-interaction' },
			{
				name: 'hover-over-mention-with-no-access',
				func: hoverOverMentionByIdFactory(MENTION_ID_WITH_NO_ACCESS, true),
			},
			{
				name: 'hover-over-mention-with-container-access',
				func: hoverOverMentionByIdFactory(MENTION_ID_WITH_CONTAINER_ACCESS, false),
			},
			{
				name: 'hover-over-highlighted-mention',
				func: hoverOverMentionByIdFactory(MENTION_ID_HIGHLIGHTED, false),
			},
		],
	},
];

const themeModes = ['dark', 'light', 'none'] as const;

describe('Mention VR Snapshot Test', () => {
	let page: PuppeteerPage;

	beforeEach(() => {
		page = global.page;
	});

	afterEach(async () => {
		// Hide tooltips by moving the cursor
		await page.mouse.move(0, 0);
		await waitForNoTooltip(page);
	});

	themeModes.forEach((themeMode) => {
		SCENARIOS.forEach(({ exampleName, interactions }) => {
			interactions.forEach((interaction) => {
				// FIXME: This test was automatically skipped due to failure on 31/05/2023: https://product-fabric.atlassian.net/browse/QS-3026
				it.skip(`should render ${exampleName} with theme=${themeMode} interaction=${interaction.name}`, async () => {
					const url = getExampleUrl(
						'elements',
						'mention',
						exampleName,
						global.__BASEURL__,
						themeMode,
					);

					await loadPage(page, url, {
						allowedSideEffects: {
							tooltips: true,
						},
					});

					if (interaction.func) {
						await interaction.func(page);
					}

					const image = await takeElementScreenShot(page, `[data-testid="vr-tested"]`);
					return expect(image).toMatchProdImageSnapshot();
				});
			});
		});
	});
});
