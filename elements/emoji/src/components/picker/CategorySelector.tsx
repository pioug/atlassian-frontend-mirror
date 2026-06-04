/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import { useCallback, useEffect, useRef, useState } from 'react';
import { css, jsx } from '@compiled/react';
import { cssMap, cx } from '@atlaskit/css';
import { token } from '@atlaskit/tokens';
import { useIntl } from 'react-intl';
import { Pressable } from '@atlaskit/primitives/compiled';
import Tooltip from '@atlaskit/tooltip';
import {
	CATEGORYSELECTOR_KEYBOARD_KEYS_SUPPORTED,
	defaultCategories,
	KeyboardKeys,
} from '../../util/constants';
import type { CategoryDescription, OnCategory } from '../../types';
import FeatureGates from '@atlaskit/feature-gate-js-client';
import { messages } from '../i18n';
import {
	CategoryDescriptionMap,
	CategoryDescriptionMapNew,
	type CategoryGroupKey,
	type CategoryId,
} from './categories';
import { usePrevious } from '../../hooks/usePrevious';
import { RENDER_EMOJI_PICKER_LIST_TESTID } from './EmojiPickerList';

const styles = cssMap({
	commonCategory: {
		backgroundColor: token('color.background.neutral.subtle'),
		borderWidth: 0,
		borderRadius: token('radius.small'),
		paddingTop: token('space.0'),
		paddingBottom: token('space.0'),
		paddingLeft: token('space.0'),
		paddingRight: token('space.0'),
		transition: 'color 0.2s ease',
	},

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

	defaultCategory: {
		color: token('color.text.subtlest'),

		'&:hover': {
			color: token('color.text.selected'),
		},
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

	activeCategory: {
		color: token('color.text.selected'),

		'&:hover': {
			color: token('color.text.selected'),
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

	disabledCategory: {
		color: token('color.text.subtlest'),
	},
});

const categorySelector = css({
	flex: '0 0 auto',
	backgroundColor: token('elevation.surface.sunken'),

	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors -- Ignored via go/DSP-18766
	button: {
		display: 'flex',
	},
});

const categorySelectorNew = css({
	flex: '0 0 auto',
	backgroundColor: token('elevation.surface'),
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

const categorySelectorTablist = css({
	paddingTop: token('space.075'),
	paddingBottom: token('space.075'),
	paddingLeft: token('space.100'),
	paddingRight: token('space.100'),
	display: 'flex',
	flexDirection: 'row',
	justifyContent: 'space-around',
	alignItems: 'center',
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

export const sortCategories = (c1: CategoryGroupKey, c2: CategoryGroupKey): number =>
	CategoryDescriptionMap[c1].order - CategoryDescriptionMap[c2].order;

export const sortCategoriesNew = (c1: CategoryGroupKey, c2: CategoryGroupKey): number =>
	CategoryDescriptionMapNew[c1].order - CategoryDescriptionMapNew[c2].order;

const addNewCategories = (
	oldCategories: CategoryId[],
	newCategories?: CategoryId[],
): CategoryId[] => {
	if (!newCategories) {
		return oldCategories;
	}
	return oldCategories
		.concat(
			newCategories.filter(
				(category) =>
					!!(
						FeatureGates.getExperimentValue('platform_teamoji_26_refresh_emoji_picker', 'isEnabled', false) ? CategoryDescriptionMapNew : CategoryDescriptionMap
					)[category],
			),
		)
		.sort(FeatureGates.getExperimentValue('platform_teamoji_26_refresh_emoji_picker', 'isEnabled', false) ? sortCategoriesNew : sortCategories);
};

export const categorySelectorComponentTestId = 'category-selector-component';
export const categorySelectorCategoryTestId = (categoryId: string) =>
	`category-selector-${categoryId}`;

const CategorySelector = (props: Props): JSX.Element => {
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
		categoriesSection = FeatureGates.getExperimentValue('platform_teamoji_26_refresh_emoji_picker', 'isEnabled', false) ? (
			<div
				role="tablist"
				aria-label={formatMessage(messages.categoriesSelectorLabel)}
				data-testid={categorySelectorComponentTestId}
				ref={categoryRef}
				css={categorySelectorTablistNew}
			>
				{categories.map((categoryId: CategoryId, index: number) => {
					const category = FeatureGates.getExperimentValue('platform_teamoji_26_refresh_emoji_picker', 'isEnabled', false)
						? CategoryDescriptionMapNew[categoryId]
						: CategoryDescriptionMap[categoryId];

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
		) : (
			<div
				role="tablist"
				aria-label={formatMessage(messages.categoriesSelectorLabel)}
				data-testid={categorySelectorComponentTestId}
				ref={categoryRef}
				css={categorySelectorTablist}
			>
				{categories.map((categoryId: CategoryId, index: number) => {
					const category = FeatureGates.getExperimentValue('platform_teamoji_26_refresh_emoji_picker', 'isEnabled', false)
						? CategoryDescriptionMapNew[categoryId]
						: CategoryDescriptionMap[categoryId];

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
									styles.commonCategory,
									styles.defaultCategory,
									categoryId === activeCategoryId && styles.activeCategory,
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
	return FeatureGates.getExperimentValue('platform_teamoji_26_refresh_emoji_picker', 'isEnabled', false) ? (
		<div css={categorySelectorNew}>{categoriesSection}</div>
	) : (
		<div css={categorySelector}>{categoriesSection}</div>
	);
};

export default CategorySelector;
