import React from 'react';
import { messages } from '../../../../components/i18n';
import { CategoryDescriptionMap } from '../../../../components/picker/categories';
import CategorySelector, {
  type Props,
  sortCategories,
} from '../../../../components/picker/CategorySelector';
import { defaultCategories } from '../../../../util/constants';
import { isMessagesKey } from '../../../../util/type-helpers';
import type { CategoryId } from '../../../../types';
import { renderWithIntl } from '../../_testing-library';
import { fireEvent, screen } from '@testing-library/dom';
import { expectTabIndexFromList } from './_emoji-picker-test-helpers';

describe('<CategorySelector />', () => {
  const setupComponent = (props?: Props) =>
    renderWithIntl(<CategorySelector {...props} />);

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
    const orderedCategories = dynamicCategories
      .concat(defaultCategories)
      .sort(sortCategories);
    const categoryButtons = await screen.getAllByRole('tab');
    orderedCategories.forEach((categoryId, i) => {
      const button: HTMLElement = categoryButtons[i];
      const categoryKey = CategoryDescriptionMap[categoryId].name;
      // eslint-disable-next-line
      expect(isMessagesKey(categoryKey)).toBeTruthy();
      if (isMessagesKey(categoryKey)) {
        expect(button).toHaveAttribute(
          'aria-label',
          messages[categoryKey].defaultMessage,
        );
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
        expect(button).toHaveAttribute(
          'aria-label',
          messages[categoryKey].defaultMessage,
        );

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
        expect(button).toHaveAttribute(
          'aria-label',
          messages[categoryKey].defaultMessage,
        );
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
    fireEvent.keyDown(categoryButtons[0], { key: 'ArrowLeft' });
    expect(customCategoryButton).toHaveFocus();
    expectTabIndexFromList(categoryButtons, lastCategoryIndex);

    // press key right on last category, should move focus to first category
    fireEvent.keyDown(customCategoryButton, { key: 'ArrowRight' });
    expect(categoryButtons[0]).toHaveFocus();
    expectTabIndexFromList(categoryButtons, 0);

    // press key right on first category, should move focus to next one on the right hand side
    fireEvent.keyDown(categoryButtons[0], { key: 'ArrowRight' });
    expect(categoryButtons[1]).toHaveFocus();
    expectTabIndexFromList(categoryButtons, 1);

    // press key left on 2nd category, should move focus to next one on the left hand side
    fireEvent.keyDown(categoryButtons[1], { key: 'ArrowLeft' });
    expect(categoryButtons[0]).toHaveFocus();
    expectTabIndexFromList(categoryButtons, 0);

    // press key end should move focus to last category
    fireEvent.keyDown(categoryButtons[0], { key: 'End' });
    expect(customCategoryButton).toHaveFocus();
    expectTabIndexFromList(categoryButtons, lastCategoryIndex);

    // press key home should move focus to first category
    fireEvent.keyDown(customCategoryButton, { key: 'Home' });
    expect(categoryButtons[0]).toHaveFocus();
    expectTabIndexFromList(categoryButtons, 0);
  });
});
