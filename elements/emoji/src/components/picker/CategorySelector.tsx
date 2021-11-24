import classNames from 'classnames';
import React from 'react';
import { PureComponent } from 'react';
import { injectIntl, WrappedComponentProps } from 'react-intl-next';
import { defaultCategories } from '../../util/constants';
import { CategoryDescription, OnCategory } from '../../types';
import { messages } from '../i18n';
import {
  CategoryDescriptionMap,
  CategoryGroupKey,
  CategoryId,
} from './categories';
import * as styles from './styles';

export interface Props {
  dynamicCategories?: CategoryId[];
  activeCategoryId?: CategoryId;
  disableCategories?: boolean;
  onCategorySelected?: OnCategory;
}

export interface State {
  categories: CategoryId[];
}

export type CategoryMap = {
  [id: string]: CategoryDescription;
};

export const sortCategories = (c1: CategoryGroupKey, c2: CategoryGroupKey) =>
  CategoryDescriptionMap[c1].order - CategoryDescriptionMap[c2].order;

const addNewCategories = (
  oldCategories: CategoryId[],
  newCategories?: CategoryId[],
): CategoryId[] => {
  if (!newCategories) {
    return oldCategories;
  }
  return oldCategories
    .concat(
      newCategories.filter((category) => !!CategoryDescriptionMap[category]),
    )
    .sort(sortCategories);
};

class CategorySelector extends PureComponent<
  Props & WrappedComponentProps,
  State
> {
  static defaultProps = {
    onCategorySelected: () => {},
    dynamicCategories: [],
  };

  constructor(props: Props & WrappedComponentProps) {
    super(props);
    const { dynamicCategories } = props;

    let categories = defaultCategories;
    if (dynamicCategories) {
      categories = addNewCategories(categories, dynamicCategories);
    }
    this.state = {
      categories,
    };
  }

  onClick = (event: React.SyntheticEvent) => {
    const { onCategorySelected, disableCategories } = this.props;

    if (disableCategories) {
      event.preventDefault();
      return;
    }

    const categoryId = event.currentTarget.getAttribute(
      'data-category-id',
    ) as CategoryId;

    if (onCategorySelected) {
      onCategorySelected(categoryId);
    }
  };

  UNSAFE_componentWillUpdate(nextProps: Props) {
    if (this.props.dynamicCategories !== nextProps.dynamicCategories) {
      this.setState({
        categories: addNewCategories(
          defaultCategories,
          nextProps.dynamicCategories,
        ),
      });
    }
  }

  render() {
    const { disableCategories, intl } = this.props;
    const { categories } = this.state;
    let categoriesSection;
    if (categories) {
      const { formatMessage } = intl;

      categoriesSection = (
        <ul>
          {categories.map((categoryId: CategoryId) => {
            const category = CategoryDescriptionMap[categoryId];
            const categoryClasses = [styles.category];
            if (categoryId === this.props.activeCategoryId) {
              categoryClasses.push(styles.active);
            }

            if (disableCategories) {
              categoryClasses.push(styles.disable);
            }

            const Icon = category.icon;
            const categoryName = formatMessage(messages[category.name]);
            return (
              <li key={category.id}>
                <button
                  aria-label={categoryName}
                  data-category-id={category.id}
                  className={classNames(categoryClasses)}
                  onClick={this.onClick}
                  title={categoryName}
                  type="button"
                >
                  <Icon label={categoryName} />
                </button>
              </li>
            );
          })}
        </ul>
      );
    }
    return (
      <div className={classNames([styles.categorySelector])}>
        {categoriesSection}
      </div>
    );
  }
}

export default injectIntl(CategorySelector);
