import { expect, type Locator, type Page, type Response } from '@af/integration-testing';
export class JQLEditorPage {
	private page;
	public input: Locator;
	public errorToken: Locator;
	public searchButton: Locator;
	public validationTooltip: Locator;
	public validation: Locator;
	public richInlineNodes: Locator;
	public autocomplete: Locator;
	public autocompleteLoading: Locator;

	constructor(page: Page) {
		this.page = page;
		this.input = this.getEditorLocatorByTestId('input');
		this.errorToken = page.locator("[data-token-type='error']");
		this.searchButton = this.getEditorLocatorByTestId('search');
		this.validationTooltip = this.getValidationLocatorByTestId('tooltip');
		this.validation = this.getEditorLocatorByTestId('validation');
		// eslint-disable-next-line testing-library/prefer-screen-queries -- Playwright Locator, not @testing-library
		this.richInlineNodes = page.getByTestId('jql-editor-node-view');
		this.autocomplete = this.getEditorLocatorByTestId('autocomplete');
		this.autocompleteLoading = this.getEditorLocatorByTestId('autocomplete-loading');
	}

	getEditorLocatorByTestId(text: string): Locator {
		return this.page.getByTestId(`jql-editor-${text}`);
	}

	getValidationLocatorByTestId(text: string): Locator {
		return this.page.getByTestId(`jql-validation-${text}`);
	}

	visitExample<_T = unknown>(exampleId: string): Promise<Response | null> {
		return this.page.visitExample('jql', 'jql-editor', exampleId);
	}

	/**
	 * Waits until the editor has finished hydrating its rich inline nodes.
	 *
	 * Hydration renders in three phases: the hydration callback resolves, ProseMirror then swaps the
	 * raw query text for empty node view containers, and React finally fills those containers in
	 * through a portal. Each phase is awaited on its own product signal so that a slow phase can't
	 * consume the assertion budget of the next one — on a loaded machine the whole chain can otherwise
	 * take longer than a single assertion allows, and the editor is observed mid-transition with the
	 * node views still empty.
	 *
	 * @param nodeText Text expected to be rendered by each rich inline node, in document order.
	 */
	waitForHydratedNodes = async (nodeText: string[]): Promise<void> => {
		// Hydrated values have been resolved and applied to the document.
		await expect(this.richInlineNodes).toHaveCount(nodeText.length);
		// Node views have rendered their content.
		await expect(this.richInlineNodes).toHaveText(nodeText);
	};

	/**
	 * Clears the query.
	 *
	 * `Locator.clear` empties a contenteditable by mutating its DOM directly. ProseMirror reads that
	 * mutation back through its DOM observer, and when it can't reconcile it against the current
	 * document — which is the case once rich inline nodes have been rendered into it — it discards
	 * the change and redraws from its own state, leaving the previous query in place. Selecting the
	 * document and deleting it goes through the same key handling as a user would, and the
	 * assertion pins the editor as empty before the caller reads or appends to it.
	 */
	clearInput = async (): Promise<void> => {
		await this.input.click();
		await this.page.keyboard.press('ControlOrMeta+a');
		await this.page.keyboard.press('Backspace');
		await expect(this.input).toHaveText('');
	};

	appendInputValue = async (text: string): Promise<void> => {
		let currentText = await this.input.textContent();
		await this.input.fill(currentText + text);
	};

	pressKeyNTimes = async (key: string, count: number): Promise<void> => {
		// await this.input.focus();
		for (let i = 0; i < count; i++) {
			await this.page.keyboard.press(key);
		}
	};

	/**
	 * Locates a single autocomplete option by its exact name.
	 *
	 * The match is scoped to the dropdown and is exact because the name of an option is also
	 * rendered elsewhere: into a tooltip while the option is hovered, and into the editor once the
	 * option has been inserted. An unscoped substring match can therefore resolve to more than one
	 * element — and whether it does depends on timing — which fails in strict mode.
	 *
	 * The text is matched on a descendant rather than on the option itself so that the surrounding
	 * option chrome, such as the field type label or the highlighting of the matched substring,
	 * doesn't have to be accounted for by callers.
	 */
	getAutocompleteOption = (optionText: string): Locator =>
		this.autocomplete
			// eslint-disable-next-line testing-library/prefer-screen-queries -- Playwright Locator, not @testing-library
			.getByRole('option')
			// eslint-disable-next-line testing-library/prefer-screen-queries -- Playwright Locator, not @testing-library
			.filter({ has: this.page.getByText(optionText, { exact: true }) });

	/**
	 * Waits until the autocomplete dropdown has settled on the options for the current query, and
	 * returns the option with the given name.
	 *
	 * Suggestions are fetched asynchronously, so the dropdown is first rendered with the options of
	 * the previous editor state and is only then updated with the results of the in-flight request.
	 * Waiting for the loading footer to disappear means callers act on the final set of options
	 * rather than on whichever set happened to be rendered when the locator resolved.
	 */
	waitForAutocompleteOption = async (optionText: string): Promise<Locator> => {
		const option = this.getAutocompleteOption(optionText);
		await expect(option).toHaveCount(1);
		await expect(this.autocompleteLoading).toBeHidden();
		await expect(option).toBeVisible();
		return option;
	};

	selectAutocompleteOption = async (optionText: string): Promise<void> => {
		const option = await this.waitForAutocompleteOption(optionText);
		await option.click();
	};

	/**
	 * Selects an autocomplete option by navigating to it with the arrow keys.
	 *
	 * The number of key presses is derived from the position of the option in the settled list
	 * rather than by inspecting the dropdown after each press: the selection is applied in a React
	 * render, so a read that lands between the key press and the render observes the previous
	 * selection and walks straight past the target. The option that is about to be inserted is
	 * confirmed through the `aria-activedescendant` of the editor before Enter is pressed, so a
	 * mismatch fails on the selection rather than on the resulting query.
	 */
	selectAutocompleteOptionWithKeyboard = async (optionText: string): Promise<void> => {
		const target = await this.waitForAutocompleteOption(optionText);
		const targetId = await target.getAttribute('id');
		const optionIds = await this.autocomplete
			// eslint-disable-next-line testing-library/prefer-screen-queries -- Playwright Locator, not @testing-library
			.getByRole('option')
			.evaluateAll((options) => options.map((option) => option.id));
		const selectedId = await this.input.getAttribute('aria-activedescendant');

		const targetIndex = targetId !== null ? optionIds.indexOf(targetId) : -1;
		if (targetIndex === -1) {
			throw new Error(`Unable to find the autocomplete option "${optionText}"`);
		}
		// An unselected dropdown behaves like being positioned before the first option.
		const selectedIndex = selectedId !== null ? optionIds.indexOf(selectedId) : -1;

		// Arrow down moves the selection one option down the list and cycles back to the top
		// through an unselected state, which is one extra press.
		await this.pressKeyNTimes(
			'ArrowDown',
			targetIndex >= selectedIndex
				? targetIndex - selectedIndex
				: optionIds.length - selectedIndex + targetIndex + 1,
		);

		await expect(this.input).toHaveAttribute('aria-activedescendant', targetId ?? '');
		await this.page.keyboard.press('Enter');
	};

	selectText = async (text: string): Promise<void> => {
		let currentText = await this.input.innerText();
		const startIndex = currentText.indexOf(text);
		const endIndex = startIndex + text.length;
		await this.pressKeyNTimes('ArrowLeft', currentText.length - endIndex);
		await this.page.keyboard.down('Shift');
		await this.pressKeyNTimes('ArrowLeft', text.length);
		await this.page.keyboard.up('Shift');
	};

	pasteText = async (text: string): Promise<void> => {
		await this.input.evaluate(
			(element, [text]) => {
				const clipboardData = new DataTransfer();
				clipboardData.setData('text/plain', text);
				const clipboardEvent = new ClipboardEvent('paste', {
					clipboardData,
				});
				element.dispatchEvent(clipboardEvent);
			},
			[text],
		);
	};

	setCursorBefore = async (text: string): Promise<void> => {
		await this.input.click();
		const currentText = await this.input.innerText();
		const startIndex = currentText.indexOf(text);
		await this.pressKeyNTimes('ArrowLeft', currentText.length - startIndex);
	};

	setCursorAfter = async (text: string): Promise<void> => {
		await this.input.click();
		const currentText = await this.input.innerText();
		const startIndex = currentText.indexOf(text);
		const endIndex = startIndex + text.length;
		await this.pressKeyNTimes('ArrowLeft', currentText.length - endIndex);
	};
}
