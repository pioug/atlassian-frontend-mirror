import AtlassianIcon from '@atlaskit/icon-lab/core/atlassian';
import BasketballIcon from '@atlaskit/icon/core/basketball';
import ClockIcon from '@atlaskit/icon/core/clock';
import EmojiIcon from '@atlaskit/icon/core/emoji';
import EmojiAddIcon from '@atlaskit/icon/core/emoji-add';
import FlagIcon from '@atlaskit/icon/core/flag';
import HeartIcon from '@atlaskit/icon/core/heart';
import LightbulbIcon from '@atlaskit/icon/core/lightbulb';
import TakeoutFoodIcon from '@atlaskit/icon/core/takeout-food';
import TreeIcon from '@atlaskit/icon/core/tree';
import VehicleCarIcon from '@atlaskit/icon/core/vehicle-car';

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

export const CategoryDescriptionMapNew: CategoryDescriptionRecord = {
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
	ATLASSIAN: {
		id: 'ATLASSIAN',
		name: 'productivityCategory',
		icon: AtlassianIcon,
		order: 2,
	},
	PEOPLE: {
		id: 'PEOPLE',
		name: 'peopleCategory',
		icon: EmojiIcon,
		order: 3,
	},
	NATURE: {
		id: 'NATURE',
		name: 'natureCategory',
		icon: TreeIcon,
		order: 4,
	},
	FOODS: {
		id: 'FOODS',
		name: 'foodsCategory',
		icon: TakeoutFoodIcon,
		order: 5,
	},
	ACTIVITY: {
		id: 'ACTIVITY',
		name: 'activityCategory',
		icon: BasketballIcon,
		order: 6,
	},
	PLACES: {
		id: 'PLACES',
		name: 'placesCategory',
		icon: VehicleCarIcon,
		order: 7,
	},
	OBJECTS: {
		id: 'OBJECTS',
		name: 'objectsCategory',
		icon: LightbulbIcon,
		order: 8,
	},
	SYMBOLS: {
		id: 'SYMBOLS',
		name: 'symbolsCategory',
		icon: HeartIcon,
		order: 9,
	},
	FLAGS: {
		id: 'FLAGS',
		name: 'flagsCategory',
		icon: FlagIcon,
		order: 10,
	},
	USER_CUSTOM: {
		id: customCategory,
		name: userCustomTitle,
		icon: EmojiAddIcon,
		order: 11,
	},
	CUSTOM: {
		id: customCategory,
		name: customTitle,
		icon: EmojiAddIcon,
		order: 12,
	},
};
