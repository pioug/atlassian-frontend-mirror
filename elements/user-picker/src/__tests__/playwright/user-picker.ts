import { test as baseTest, type Locator, type Page } from '@af/integration-testing';
import { PageRequestController } from '@af/search-test-utils';

const Selectors = {
	SELECTED_SINGLE_VALUE: '[class*="singleValue"]',
	SELECTED_MULTI_VALUE: '[class*="multiValue"]',
	MULTI_VALUE_CLEAR_BUTTON: '[data-testid="show-clear-icon"]',
};

/**
 * This class is the POM (Page Object Model) for integration tests for
 * This POM contains common code to simplify integration tests.
 *
 * For more information see: https://playwright.dev/docs/pom
 */
export class UserPicker extends PageRequestController {
	page: Page;

	readonly placeholder: Locator;
	readonly input: Locator;
	readonly option: Locator;
	readonly firstOption: Locator;
	readonly selectedSingleValue: Locator;
	readonly selectedMultiValue: Locator;
	readonly multiValueClearButton: Locator;

	constructor(page: Page) {
		super(page);

		this.page = page;

		this.placeholder = this.page.getByText('Enter people or teams...');
		this.input = this.page.locator('input');
		this.option = this.page.getByRole('option');
		this.firstOption = this.option.first();
		this.selectedSingleValue = this.page.locator(Selectors.SELECTED_SINGLE_VALUE);
		this.selectedMultiValue = this.page.locator(Selectors.SELECTED_MULTI_VALUE);
		this.multiValueClearButton = this.page.locator(Selectors.MULTI_VALUE_CLEAR_BUTTON);
	}

	/**
	 * Navigate to the integration testing
	 * example and
	 * @param queryParams
	 */
	async goTo(example: string, params?: Record<string, string>) {
		await this.page.visitExample('elements', 'user-picker', example, params);
	}

	async init(example: string, queryParams?: Record<string, string>) {
		await this.goTo(example, queryParams);
	}
}

type UserPickerTest = {
	userPicker: UserPicker;
};

export const test = baseTest.extend<UserPickerTest>({
	userPicker: async ({ page }, use) => {
		const userPicker = new UserPicker(page);
		await use(userPicker);
		await userPicker.dispose();
	},
});
