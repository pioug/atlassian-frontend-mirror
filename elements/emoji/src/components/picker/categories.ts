import BasketballIcon from '@atlaskit/icon/core/basketball';
import AddIcon from '@atlaskit/icon/core/add';
import FlagIcon from '@atlaskit/icon/core/flag';
import TakeoutFoodIcon from '@atlaskit/icon/core/takeout-food';
import ClockIcon from '@atlaskit/icon/core/clock';
import TreeIcon from '@atlaskit/icon/core/tree';
import LightbulbIcon from '@atlaskit/icon/core/lightbulb';
import EmojiIcon from '@atlaskit/icon/core/emoji';
import HeartIcon from '@atlaskit/icon/core/heart';
import VehicleCarIcon from '@atlaskit/icon/core/vehicle-car';
import CheckCircleIcon from '@atlaskit/icon/core/check-circle';

import type { CategoryDescription } from '../../types';
import { customCategory, userCustomTitle, customTitle } from '../../util/constants';

export type CategoryId =
	| 'FREQUENT'
	| 'PEOPLE'
	| 'NATURE'
	| 'FOODS'
	| 'ACTIVITY'
	| 'PLACES'
	| 'OBJECTS'
	| 'SYMBOLS'
	| 'FLAGS'
	| 'ATLASSIAN'
	| 'CUSTOM';

export type CategoryGroupKey = CategoryId | 'USER_CUSTOM' | 'SEARCH';

type CategoryDescriptionRecord = {
	[key in CategoryGroupKey]: CategoryDescription;
};

export const CategoryDescriptionMap: CategoryDescriptionRecord = {
	SEARCH: {
		id: 'SEARCH',
		name: 'categoriesSearchResults', // refers to i18n categoriesSearchResults key
		icon: undefined,
		order: 0,
	},
	FREQUENT: {
		id: 'FREQUENT',
		name: 'frequentCategory',
		icon: ClockIcon,
		order: 1,
	},
	PEOPLE: {
		id: 'PEOPLE',
		name: 'peopleCategory',
		icon: EmojiIcon,
		order: 2,
	},
	NATURE: {
		id: 'NATURE',
		name: 'natureCategory',
		icon: TreeIcon,
		order: 3,
	},
	FOODS: {
		id: 'FOODS',
		name: 'foodsCategory',
		icon: TakeoutFoodIcon,
		order: 4,
	},
	ACTIVITY: {
		id: 'ACTIVITY',
		name: 'activityCategory',
		icon: BasketballIcon,
		order: 5,
	},
	PLACES: {
		id: 'PLACES',
		name: 'placesCategory',
		icon: VehicleCarIcon,
		order: 6,
	},
	OBJECTS: {
		id: 'OBJECTS',
		name: 'objectsCategory',
		icon: LightbulbIcon,
		order: 7,
	},
	SYMBOLS: {
		id: 'SYMBOLS',
		name: 'symbolsCategory',
		icon: HeartIcon,
		order: 8,
	},
	FLAGS: {
		id: 'FLAGS',
		name: 'flagsCategory',
		icon: FlagIcon,
		order: 9,
	},
	ATLASSIAN: {
		id: 'ATLASSIAN',
		name: 'productivityCategory',
		icon: CheckCircleIcon,
		order: 10,
	},
	USER_CUSTOM: {
		id: customCategory,
		name: userCustomTitle,
		icon: AddIcon,
		order: 11,
	},
	CUSTOM: {
		id: customCategory,
		name: customTitle,
		icon: AddIcon,
		order: 12,
	},
};
