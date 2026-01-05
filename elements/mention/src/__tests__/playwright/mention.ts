import { test as baseTest, type Locator, type Page } from '@af/integration-testing';
import { PageRequestController } from '@af/search-test-utils';

const Selectors = {
	MENTION_LIST_ITEM: '[data-mention-item]',
	EDIT_CLICK_WRAPPER: '[data-testid="click-wrapper"]',
	AK_TYPEAHEAD_ITEM: '[class*="ak-typeahead-item"]',
};

/**
 * This class is the POM (Page Object Model) for integration tests for
 * This POM contains common code to simplify integration tests.
 *
 * For more information see: https://playwright.dev/docs/pom
 */
export class Mention extends PageRequestController {
	page: Page;

	readonly input: Locator;
	readonly mentionListItems: Locator;
	readonly editClickWrapper: Locator;
	readonly akTypeaheadItems: Locator;

	constructor(page: Page) {
		super(page);

		this.page = page;

		this.input = this.page.locator('input');
		this.mentionListItems = this.page.locator(Selectors.MENTION_LIST_ITEM);
		this.editClickWrapper = this.page.locator(Selectors.EDIT_CLICK_WRAPPER).first();
		this.akTypeaheadItems = this.page.locator(Selectors.AK_TYPEAHEAD_ITEM);
	}

	/**
	 * Navigate to the integration testing
	 * example and
	 * @param queryParams
	 */
	async goTo(example: string, params?: Record<string, string>): Promise<void> {
		await this.page.visitExample('elements', 'mention', example, params);
	}

	async init(example: string, queryParams?: Record<string, string>): Promise<void> {
		await this.goTo(example, queryParams);
	}
}

type MentionTest = {
	mention: Mention;
};

export const test = baseTest.extend<MentionTest>({
	mention: async ({ page }, use) => {
		const mention = new Mention(page);
		await use(mention);
		await mention.dispose();
	},
});
