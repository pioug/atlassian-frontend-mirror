/**
 * @jsxRuntime classic
 * @jsx jsx
 */

import { CategoryDescriptionMapNew, type CategoryGroupKey } from './categories';

export const sortCategoriesNew = (c1: CategoryGroupKey, c2: CategoryGroupKey): number =>
	CategoryDescriptionMapNew[c1].order - CategoryDescriptionMapNew[c2].order;
