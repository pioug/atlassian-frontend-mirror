import { mountWithIntl } from '@atlaskit/editor-test-helpers/enzyme';
import { ReactWrapper } from 'enzyme';
import React from 'react';
import { messages } from '../../../../components/i18n';
import { CategoryDescriptionMap } from '../../../../components/picker/categories';
import CategorySelector, {
  Props,
  sortCategories,
} from '../../../../components/picker/CategorySelector';
import * as styles from '../../../../components/picker/styles';
import { defaultCategories } from '../../../../util/constants';
import { isMessagesKey } from '../../../../util/type-helpers';
import { CategoryId } from '../../../../types';

const setupComponent = (props?: Props): ReactWrapper<any, any> =>
  mountWithIntl(<CategorySelector {...props} />);

describe('<CategorySelector />', () => {
  it('all standard categories visible by default', () => {
    const component = setupComponent();
    const categoryButtons = component.find('button');
    expect(categoryButtons.length).toEqual(defaultCategories.length);
  });

  it('adds categories dynamically based on what has been passed in', () => {
    const component = setupComponent({
      dynamicCategories: ['CUSTOM', 'FREQUENT'],
    });
    const categoryButtons = component.find('button');
    expect(categoryButtons.length).toEqual(defaultCategories.length + 2);
  });

  it('displays categories in sorted order', () => {
    const dynamicCategories: CategoryId[] = ['CUSTOM', 'FREQUENT', 'ATLASSIAN'];
    const component = setupComponent({
      dynamicCategories,
    });
    const orderedCategories = dynamicCategories
      .concat(defaultCategories)
      .sort(sortCategories);
    const categoryButtons = component.find('button');
    orderedCategories.forEach((categoryId, i) => {
      const button = categoryButtons.at(i);
      const categoryKey = CategoryDescriptionMap[categoryId].name;
      // eslint-disable-next-line
      expect(isMessagesKey(categoryKey)).toBeTruthy();
      if (isMessagesKey(categoryKey)) {
        expect(button.prop('title')).toEqual(
          messages[categoryKey].defaultMessage,
        );
      }
    });
  });

  it('all categories disabled if flag is set', () => {
    const component = setupComponent({ disableCategories: true });
    const categoryButtons = component.find('button');
    expect(categoryButtons.length).toEqual(defaultCategories.length);
    defaultCategories.forEach((categoryId, i) => {
      const button = categoryButtons.at(i);
      const categoryKey = CategoryDescriptionMap[categoryId].name;
      // eslint-disable-next-line
      expect(isMessagesKey(categoryKey)).toBeTruthy();
      if (isMessagesKey(categoryKey)) {
        expect(button.prop('title')).toEqual(
          messages[categoryKey].defaultMessage,
        );
        expect(button.hasClass(styles.disable)).toEqual(true);
      }
    });
  });

  it('onCategorySelected called which clicking a category', () => {
    let selectedCategoryId;
    const component = setupComponent({
      dynamicCategories: ['CUSTOM', 'FREQUENT'],
      onCategorySelected: (id) => {
        selectedCategoryId = id;
      },
    });
    const categoryButtons = component.find('button');
    categoryButtons.at(defaultCategories.length + 1).simulate('click');
    expect(selectedCategoryId).toEqual('CUSTOM');
  });

  it('active category highlighted', () => {
    const activeCategoryId = defaultCategories[3];
    const component = setupComponent({
      activeCategoryId,
    });
    const categoryButtons = component.find('button');
    expect(categoryButtons.length).toEqual(defaultCategories.length);
    defaultCategories.forEach((categoryId, i) => {
      const button = categoryButtons.at(i);
      const categoryKey = CategoryDescriptionMap[categoryId].name;
      // eslint-disable-next-line
      expect(isMessagesKey(categoryKey)).toBeTruthy();
      if (isMessagesKey(categoryKey)) {
        expect(button.prop('title')).toEqual(
          messages[categoryKey].defaultMessage,
        );
      }
      const shouldBeActive = i === 3;
      expect(button.hasClass(styles.active)).toEqual(shouldBeActive);
    });
  });
});
