/**
 * @jsxRuntime classic
 * @jsx jsx
 */

import { useCallback, useEffect, useRef, useState } from 'react';

import { css, jsx } from '@compiled/react';
import { useIntl } from 'react-intl';

import { cssMap, cx } from '@atlaskit/css';
import { fg } from '@atlaskit/platform-feature-flags/fg';
import { Pressable } from '@atlaskit/primitives/compiled/pressable';
import { token } from '@atlaskit/tokens';
import Tooltip from '@atlaskit/tooltip/Tooltip';

import { usePrevious } from '../../hooks/usePrevious';
import type { CategoryDescription, OnCategory } from '../../types';
import {
	CATEGORYSELECTOR_KEYBOARD_KEYS_SUPPORTED,
	defaultCategories,
	KeyboardKeys,
} from '../../util/constants';
import { messages } from '../i18n';
import { CategoryDescriptionMapNew, type CategoryId } from './categories';
import { categorySelectorCategoryTestId } from './categorySelectorCategoryTestId';
import { RENDER_EMOJI_PICKER_LIST_TESTID } from './EmojiPickerList';
import { sortCategoriesNew } from './sortCategoriesNew';

const styles = cssMap({
	commonCategoryNew: {
		backgroundColor: token('color.background.neutral.subtle'),
		borderWidth: 0,
		paddingTop: token('space.100'),
		paddingBottom: token('space.100'),
		paddingLeft: token('space.075'),
		paddingRight: token('space.075'),
		transition: 'color 0.2s ease',
		display: 'flex',
		alignItems: 'center',
		justifyContent: 'center',
	},

	defaultCategoryNew: {
		color: token('color.text.subtlest'),
		borderBottomWidth: token('border.width.selected'),
		borderBottomStyle: 'solid',
		borderBottomColor: 'transparent',

		'&:hover': {
			color: token('color.text.subtlest'),
			borderBottomColor: token('color.border.bold'),
		},
	},

	activeCategoryNew: {
		color: token('color.text.selected'),
		borderBottomWidth: token('border.width.selected'),
		borderBottomStyle: 'solid',
		borderBottomColor: token('color.border.brand'),

		'&:hover': {
			color: token('color.text.selected'),
			borderBottomColor: token('color.border.brand'),
		},
	},

	focusedCategoryNew: {
		'&:focus-visible': {
			outlineColor: token('color.border.focused'),
			outlineStyle: 'solid',
			outlineWidth: token('border.width.focused'),
			outlineOffset: token('space.negative.025'),
		},
	},

	disabledCategory: {
		color: token('color.text.subtlest'),
	},
});

const categorySelectorNew = css({
	flex: '0 0 auto',
	backgroundColor: token('elevation.surface'),
	borderTopLeftRadius: token('radius.large', '8px'),
	borderTopRightRadius: token('radius.large', '8px'),
	paddingTop: token('space.0'),
	paddingBottom: token('space.0'),
	borderBottomWidth: token('border.width'),
	borderBottomStyle: 'solid',
	borderBottomColor: token('color.border'),

	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors -- Ignored via go/DSP-18766
	button: {
		display: 'flex',
	},
});

const categorySelectorTablistNew = css({
	paddingTop: token('space.0'),
	paddingBottom: token('space.0'),
	paddingLeft: token('space.100'),
	paddingRight: token('space.100'),
	display: 'flex',
	flexDirection: 'row',
	justifyContent: 'space-around',
	alignItems: 'stretch',
});

export interface Props {
	activeCategoryId?: CategoryId | null;
	disableCategories?: boolean;
	dynamicCategories?: CategoryId[];
	onCategorySelected?: OnCategory;
}

export type CategoryMap = {
	[id: string]: CategoryDescription;
};

const addNewCategories = (
	oldCategories: CategoryId[],
	newCategories?: CategoryId[],
): CategoryId[] => {
	if (!newCategories) {
		return oldCategories;
	}
	return oldCategories
		.concat(newCategories.filter((category) => !!CategoryDescriptionMapNew[category]))
		.sort(sortCategoriesNew);
};

export const categorySelectorComponentTestId = 'category-selector-component';

const CategorySelector = (props: Props): JSX.Element => {
	const { disableCategories, dynamicCategories, activeCategoryId, onCategorySelected } = props;
	const [categories, setCategories] = useState<CategoryId[]>(
		addNewCategories(defaultCategories, dynamicCategories),
	);
	const [currentFocus, setCurrentFocus] = useState(0);
	const categoryRef = useRef<HTMLDivElement>(null);
	const hasSetInitialFocus = useRef(false);
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

	useEffect(() => {
		if (hasSetInitialFocus.current || !activeCategoryId) {
			return;
		}

		const activeCategoryIndex = categories.indexOf(activeCategoryId);
		if (activeCategoryIndex === -1) {
			return;
		}

		const picker = categoryRef.current?.closest('[data-emoji-picker-container]');
		const activeElement = categoryRef.current?.ownerDocument.activeElement;

		if (activeElement && picker?.contains(activeElement)) {
			hasSetInitialFocus.current = true;
			return;
		}

		focusCategory(activeCategoryIndex);
		hasSetInitialFocus.current = true;
	}, [activeCategoryId, categories, focusCategory]);

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
				css={categorySelectorTablistNew}
			>
				{categories.map((categoryId: CategoryId, index: number) => {
					const category = CategoryDescriptionMapNew[categoryId];

					const Icon = category.icon;
					const categoryName = formatMessage(messages[category.name]);
					return (
						<Tooltip content={categoryName} position="bottom" key={category.id}>
							<Pressable
								id={`category-selector-${category.id}`}
								data-focus-index={index}
								aria-label={categoryName}
								aria-controls={currentFocus === index ? RENDER_EMOJI_PICKER_LIST_TESTID : undefined}
								aria-selected={categoryId === activeCategoryId}
								xcss={cx(
									styles.commonCategoryNew,
									styles.defaultCategoryNew,
									fg('platform_ally_emoji_fixes_various') && styles.focusedCategoryNew,
									categoryId === activeCategoryId && styles.activeCategoryNew,
									disableCategories && styles.disabledCategory,
								)}
								isDisabled={disableCategories}
								onClick={handleClick(categoryId, index)}
								testId={categorySelectorCategoryTestId(categoryId)}
								tabIndex={currentFocus === index ? 0 : -1}
								onKeyDown={handleKeyDown}
								role="tab"
							>
								<Icon label={categoryName} />
							</Pressable>
						</Tooltip>
					);
				})}
			</div>
		);
	}
	return <div css={categorySelectorNew}>{categoriesSection}</div>;
};

export default CategorySelector;
