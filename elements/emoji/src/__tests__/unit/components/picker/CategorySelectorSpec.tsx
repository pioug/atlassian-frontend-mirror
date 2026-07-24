/* eslint-disable
  @atlaskit/design-system/no-to-match-snapshot,
  @atlaskit/design-system/no-unsafe-inline-snapshot
  -- TODO(IND-4952): existing snapshot tests will be removed in a follow-up cleanup PR.
  See https://hello.atlassian.net/wiki/spaces/afm/pages/7146174189/LDR+Unit+Tests+-+Ban+Snapshot+tests+in+Platform
  and raise concerns in https://atlassian.enterprise.slack.com/archives/C0BD4K40BLH
*/

import React from 'react';
import FeatureGates from '@atlaskit/feature-gate-js-client/feature-gates';
import { messages } from '../../../../components/i18n';
import { CategoryDescriptionMap } from '../../../../components/picker/categories';
import CategorySelector, {
	type Props,
	sortCategories,
} from '../../../../components/picker/CategorySelector';
import { RENDER_EMOJI_PICKER_LIST_TESTID } from '../../../../components/picker/EmojiPickerList';
import { defaultCategories } from '../../../../util/constants';
import { isMessagesKey } from '../../../../util/type-helpers';
import type { CategoryId } from '../../../../types';
import { renderWithIntl } from '../../_testing-library';
import { fireEvent, screen, waitFor } from '@testing-library/react';
import { expectTabIndexFromList } from './_emoji-picker-test-helpers';
import { act } from 'react-test-renderer';

describe('<CategorySelector />', () => {
	const setupComponent = (props?: Props) => renderWithIntl(<CategorySelector {...props} />);
	const setupComponentWithTabPanel = (props?: Props) =>
		renderWithIntl(
			<div data-emoji-picker-container>
				<CategorySelector {...props} />
				<input aria-label="Search emojis" />
				<div id={RENDER_EMOJI_PICKER_LIST_TESTID} />
			</div>,
		);
	const enableInitialFocusFix = () => {
		jest.spyOn(FeatureGates, 'initializeCompleted').mockReturnValue(true);
		jest
			.spyOn(FeatureGates, 'getExperimentValue')
			.mockImplementation((experimentName, _parameterName, defaultValue) =>
				experimentName === 'tef_fix_a11y_keyboard_control_emoji_picker' ? true : defaultValue,
			);
	};

	afterEach(() => {
		jest.restoreAllMocks();
	});

	it('all standard categories visible by default', async () => {
		await setupComponent();
		const categoryButtons = await screen.getAllByRole('tab');
		expect(categoryButtons.length).toEqual(defaultCategories.length);
	});

	it('adds categories dynamically based on what has been passed in', async () => {
		await setupComponent({
			dynamicCategories: ['CUSTOM', 'FREQUENT'],
		});
		const categoryButtons = await screen.getAllByRole('tab');
		expect(categoryButtons.length).toEqual(defaultCategories.length + 2);
	});

	it('displays categories in sorted order', async () => {
		const dynamicCategories: CategoryId[] = ['CUSTOM', 'FREQUENT', 'ATLASSIAN'];
		await setupComponent({
			dynamicCategories,
		});
		const orderedCategories = dynamicCategories.concat(defaultCategories).sort(sortCategories);
		const categoryButtons = await screen.getAllByRole('tab');
		orderedCategories.forEach((categoryId, i) => {
			const button: HTMLElement = categoryButtons[i];
			const categoryKey = CategoryDescriptionMap[categoryId].name;
			// eslint-disable-next-line
			expect(isMessagesKey(categoryKey)).toBeTruthy();
			if (isMessagesKey(categoryKey)) {
				expect(button).toHaveAttribute('aria-label', messages[categoryKey].defaultMessage);
			}
		});
	});

	it('all categories disabled if flag is set', async () => {
		await setupComponent({ disableCategories: true });
		const categoryButtons = await screen.getAllByRole('tab');
		expect(categoryButtons.length).toEqual(defaultCategories.length);
		defaultCategories.forEach((categoryId, i) => {
			const button = categoryButtons[i];
			const categoryKey = CategoryDescriptionMap[categoryId].name;
			expect(isMessagesKey(categoryKey)).toBeTruthy();
			if (isMessagesKey(categoryKey)) {
				expect(button).toHaveAttribute('aria-label', messages[categoryKey].defaultMessage);

				expect(button).toBeDisabled();
			}
		});
	});

	it('onCategorySelected called which clicking a category', async () => {
		let selectedCategoryId;
		await setupComponent({
			dynamicCategories: ['CUSTOM', 'FREQUENT'],
			onCategorySelected: (id) => {
				selectedCategoryId = id;
			},
		});
		const categoryButtons = await screen.getAllByRole('tab');
		const button = categoryButtons[defaultCategories.length + 1];
		fireEvent.click(button);
		expect(selectedCategoryId).toEqual('CUSTOM');
	});

	it('active category highlighted', async () => {
		const activeCategoryId = defaultCategories[3];
		await setupComponent({
			activeCategoryId,
		});
		const categoryButtons = await screen.getAllByRole('tab');
		// screen.debug()
		expect(categoryButtons.length).toEqual(defaultCategories.length);
		defaultCategories.forEach((categoryId, i) => {
			const button = categoryButtons[i];
			const categoryKey = CategoryDescriptionMap[categoryId].name;
			// eslint-disable-next-line
			expect(isMessagesKey(categoryKey)).toBeTruthy();
			if (isMessagesKey(categoryKey)) {
				expect(button).toHaveAttribute('aria-label', messages[categoryKey].defaultMessage);
			}
			const shouldBeActive = i === 3;
			if (shouldBeActive) {
				expect(button).toMatchSnapshot();
			}
		});
	});

	it('navigate categories via arrow keys', async () => {
		await setupComponent({
			dynamicCategories: ['CUSTOM', 'FREQUENT'],
		});
		const categoryButtons = await screen.getAllByRole('tab');
		const lastCategoryIndex = defaultCategories.length + 1;
		const customCategoryButton = categoryButtons[lastCategoryIndex];

		// first category should have tabIndex=0 by default
		expectTabIndexFromList(categoryButtons, 0);

		// focus on first category of categories
		categoryButtons[0].focus();
		expect(categoryButtons[0]).toHaveFocus();

		// press key left on first category, should move focus to last category
		act(() => {
			fireEvent.keyDown(categoryButtons[0], { key: 'ArrowLeft' });
		});
		expect(customCategoryButton).toHaveFocus();
		expectTabIndexFromList(categoryButtons, lastCategoryIndex);

		// press key right on last category, should move focus to first category
		act(() => {
			fireEvent.keyDown(customCategoryButton, { key: 'ArrowRight' });
		});
		expect(categoryButtons[0]).toHaveFocus();
		expectTabIndexFromList(categoryButtons, 0);

		// press key right on first category, should move focus to next one on the right hand side
		act(() => {
			fireEvent.keyDown(categoryButtons[0], { key: 'ArrowRight' });
		});
		expect(categoryButtons[1]).toHaveFocus();
		expectTabIndexFromList(categoryButtons, 1);

		// press key left on 2nd category, should move focus to next one on the left hand side
		act(() => {
			fireEvent.keyDown(categoryButtons[1], { key: 'ArrowLeft' });
		});
		expect(categoryButtons[0]).toHaveFocus();
		expectTabIndexFromList(categoryButtons, 0);

		// press key end should move focus to last category
		act(() => {
			fireEvent.keyDown(categoryButtons[0], { key: 'End' });
		});
		expect(customCategoryButton).toHaveFocus();
		expectTabIndexFromList(categoryButtons, lastCategoryIndex);

		// press key home should move focus to first category
		act(() => {
			fireEvent.keyDown(customCategoryButton, { key: 'Home' });
		});
		expect(categoryButtons[0]).toHaveFocus();
		expectTabIndexFromList(categoryButtons, 0);
	});

	it('focuses the selected category when the initial focus fix is enabled', async () => {
		enableInitialFocusFix();
		const activeCategoryId = defaultCategories[0];

		await setupComponentWithTabPanel({ activeCategoryId });

		await waitFor(() => {
			expect(screen.getByTestId(`category-selector-${activeCategoryId}`)).toHaveFocus();
		});
	});

	it('focuses the selected dynamic frequent category', async () => {
		enableInitialFocusFix();

		await setupComponentWithTabPanel({
			activeCategoryId: 'FREQUENT',
			dynamicCategories: ['FREQUENT'],
		});

		await waitFor(() => {
			expect(screen.getByTestId('category-selector-FREQUENT')).toHaveFocus();
		});
	});

	it('only sets initial focus once', async () => {
		enableInitialFocusFix();
		const initialCategoryId = defaultCategories[0];
		const laterCategoryId = defaultCategories[2];
		const { rerender } = await setupComponentWithTabPanel({
			activeCategoryId: initialCategoryId,
		});
		const categoryButtons = screen.getAllByRole('tab');

		await waitFor(() => {
			expect(categoryButtons[0]).toHaveFocus();
		});

		fireEvent.keyDown(categoryButtons[0], { key: 'ArrowRight' });
		expect(categoryButtons[1]).toHaveFocus();

		rerender(
			<div data-emoji-picker-container>
				<CategorySelector activeCategoryId={laterCategoryId} />
				<input aria-label="Search emojis" />
				<div id={RENDER_EMOJI_PICKER_LIST_TESTID} />
			</div>,
		);

		await waitFor(() => {
			expect(categoryButtons[1]).toHaveFocus();
			expectTabIndexFromList(categoryButtons, 1);
		});
	});

	it('does not move focus when the user focuses search before the active category is set', async () => {
		enableInitialFocusFix();
		const activeCategoryId = defaultCategories[0];
		const { rerender } = await setupComponentWithTabPanel();
		const searchInput = screen.getByRole('textbox', { name: 'Search emojis' });

		searchInput.focus();
		expect(searchInput).toHaveFocus();

		rerender(
			<div data-emoji-picker-container>
				<CategorySelector activeCategoryId={activeCategoryId} />
				<input aria-label="Search emojis" />
				<div id={RENDER_EMOJI_PICKER_LIST_TESTID} />
			</div>,
		);

		await waitFor(() => {
			expect(searchInput).toHaveFocus();
		});
	});
});
