/** @jsx jsx */
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { jsx } from '@emotion/react';
import { useIntl } from 'react-intl-next';
import Tooltip from '@atlaskit/tooltip';
import {
	CATEGORYSELECTOR_KEYBOARD_KEYS_SUPPORTED,
	defaultCategories,
	KeyboardKeys,
} from '../../util/constants';
import type { CategoryDescription, OnCategory } from '../../types';
import { messages } from '../i18n';
import { CategoryDescriptionMap, type CategoryGroupKey, type CategoryId } from './categories';
import {
	active,
	categorySelector,
	disable,
	categoryStyles,
	categorySelectorTablist,
} from './styles';
import { usePrevious } from '../../hooks/usePrevious';
import { RENDER_EMOJI_PICKER_LIST_TESTID } from './EmojiPickerList';

export interface Props {
	dynamicCategories?: CategoryId[];
	activeCategoryId?: CategoryId | null;
	disableCategories?: boolean;
	onCategorySelected?: OnCategory;
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
		.concat(newCategories.filter((category) => !!CategoryDescriptionMap[category]))
		.sort(sortCategories);
};

export const categorySelectorComponentTestId = 'category-selector-component';
export const categorySelectorCategoryTestId = (categoryId: string) =>
	`category-selector-${categoryId}`;

const CategorySelector = (props: Props) => {
	const { disableCategories, dynamicCategories, activeCategoryId, onCategorySelected } = props;
	const [categories, setCategories] = useState<CategoryId[]>(
		addNewCategories(defaultCategories, dynamicCategories),
	);
	const [currentFocus, setCurrentFocus] = useState(0);
	const categoryRef = useRef<HTMLDivElement>(null);
	const prevDynamicCategories = usePrevious(dynamicCategories);
	const { formatMessage } = useIntl();

	const updateCategories = useCallback(() => {
		const newCategories = addNewCategories(defaultCategories, dynamicCategories);
		setCategories(newCategories);
	}, [dynamicCategories]);

	useEffect(() => {
		if (prevDynamicCategories !== dynamicCategories) {
			updateCategories();
		}
	}, [prevDynamicCategories, dynamicCategories, updateCategories]);

	const focusCategory = useCallback(
		(index: number) => {
			const categoryToFocus: HTMLButtonElement | undefined | null =
				categoryRef.current?.querySelector(`[data-focus-index="${index}"]`);
			categoryToFocus && categoryToFocus.focus();
			setCurrentFocus(index);
		},
		[categoryRef, setCurrentFocus],
	);

	const handleKeyDown = (e: React.KeyboardEvent<HTMLButtonElement>) => {
		if (!CATEGORYSELECTOR_KEYBOARD_KEYS_SUPPORTED.includes(e.key)) {
			return;
		}
		e.preventDefault();
		e.stopPropagation();
		const lastCategoryIndex = categories.length - 1;
		switch (e.key) {
			// navigate to the right category
			case KeyboardKeys.ArrowRight:
				focusCategory(currentFocus === lastCategoryIndex ? 0 : currentFocus + 1);
				break;
			// navigate to the left category
			case KeyboardKeys.ArrowLeft:
				focusCategory(currentFocus === 0 ? lastCategoryIndex : currentFocus - 1);
				break;
			// navigate to the first category
			case KeyboardKeys.Home:
				focusCategory(0);
				break;
			// navigate to the last category
			case KeyboardKeys.End:
				focusCategory(lastCategoryIndex);
				break;
		}
	};

	const handleClick = (categoryId: CategoryId, index: number) => (event: React.SyntheticEvent) => {
		if (disableCategories) {
			event.preventDefault();
			return;
		}
		if (onCategorySelected) {
			onCategorySelected(categoryId);
		}
		setCurrentFocus(index);
	};

	let categoriesSection;
	if (categories) {
		categoriesSection = (
			<div
				role="tablist"
				aria-label={formatMessage(messages.categoriesSelectorLabel)}
				data-testid={categorySelectorComponentTestId}
				ref={categoryRef}
				css={categorySelectorTablist}
			>
				{categories.map((categoryId: CategoryId, index: number) => {
					const category = CategoryDescriptionMap[categoryId];
					const categoryClasses = [categoryStyles];

					if (categoryId === activeCategoryId) {
						categoryClasses.push(active);
					}

					if (disableCategories) {
						categoryClasses.push(disable);
					}

					const Icon = category.icon;
					const categoryName = formatMessage(messages[category.name]);
					return (
						<Tooltip content={categoryName} position="bottom" key={category.id}>
							<button
								type="button"
								id={`category-selector-${category.id}`}
								data-focus-index={index}
								aria-label={categoryName}
								aria-controls={currentFocus === index ? RENDER_EMOJI_PICKER_LIST_TESTID : undefined}
								aria-selected={categoryId === activeCategoryId}
								css={categoryClasses}
								disabled={disableCategories}
								onClick={handleClick(categoryId, index)}
								data-testid={categorySelectorCategoryTestId(categoryId)}
								tabIndex={currentFocus === index ? 0 : -1}
								onKeyDown={handleKeyDown}
								role="tab"
							>
								<Icon label={categoryName} />
							</button>
						</Tooltip>
					);
				})}
			</div>
		);
	}
	return <div css={categorySelector}>{categoriesSection}</div>;
};

export default CategorySelector;
