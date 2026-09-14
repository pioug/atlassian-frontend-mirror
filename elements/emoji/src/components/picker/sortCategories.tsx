/**
 * @jsxRuntime classic
 * @jsx jsx
 */

import { CategoryDescriptionMap, type CategoryGroupKey } from './categories';

export const sortCategories = (c1: CategoryGroupKey, c2: CategoryGroupKey): number =>
	CategoryDescriptionMap[c1].order - CategoryDescriptionMap[c2].order;
