import EmojiActivityIcon from '@atlaskit/icon/glyph/emoji/activity';
import EmojiCustomIcon from '@atlaskit/icon/glyph/emoji/custom';
import EmojiFlagsIcon from '@atlaskit/icon/glyph/emoji/flags';
import EmojiFoodIcon from '@atlaskit/icon/glyph/emoji/food';
import EmojiFrequentIcon from '@atlaskit/icon/glyph/emoji/frequent';
import EmojiNatureIcon from '@atlaskit/icon/glyph/emoji/nature';
import EmojiObjectsIcon from '@atlaskit/icon/glyph/emoji/objects';
import EmojiPeopleIcon from '@atlaskit/icon/glyph/emoji/people';
import EmojiSymbolsIcon from '@atlaskit/icon/glyph/emoji/symbols';
import EmojiTravelIcon from '@atlaskit/icon/glyph/emoji/travel';
import EmojiProductivityIcon from '@atlaskit/icon/glyph/emoji/productivity';

import { CategoryDescription } from '../../types';
import {
  customCategory,
  userCustomTitle,
  customTitle,
} from '../../util/constants';

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

export type CategoryDescriptionMap = {
  [key in CategoryGroupKey]: CategoryDescription;
};

export const CategoryDescriptionMap: CategoryDescriptionMap = {
  SEARCH: {
    id: 'SEARCH',
    name: 'categoriesSearchResults', // refers to i18n categoriesSearchResults key
    icon: undefined,
    order: 0,
  },
  FREQUENT: {
    id: 'FREQUENT',
    name: 'frequentCategory',
    icon: EmojiFrequentIcon,
    order: 1,
  },
  PEOPLE: {
    id: 'PEOPLE',
    name: 'peopleCategory',
    icon: EmojiPeopleIcon,
    order: 2,
  },
  NATURE: {
    id: 'NATURE',
    name: 'natureCategory',
    icon: EmojiNatureIcon,
    order: 3,
  },
  FOODS: {
    id: 'FOODS',
    name: 'foodsCategory',
    icon: EmojiFoodIcon,
    order: 4,
  },
  ACTIVITY: {
    id: 'ACTIVITY',
    name: 'activityCategory',
    icon: EmojiActivityIcon,
    order: 5,
  },
  PLACES: {
    id: 'PLACES',
    name: 'placesCategory',
    icon: EmojiTravelIcon,
    order: 6,
  },
  OBJECTS: {
    id: 'OBJECTS',
    name: 'objectsCategory',
    icon: EmojiObjectsIcon,
    order: 7,
  },
  SYMBOLS: {
    id: 'SYMBOLS',
    name: 'symbolsCategory',
    icon: EmojiSymbolsIcon,
    order: 8,
  },
  FLAGS: {
    id: 'FLAGS',
    name: 'flagsCategory',
    icon: EmojiFlagsIcon,
    order: 9,
  },
  ATLASSIAN: {
    id: 'ATLASSIAN',
    name: 'productivityCategory',
    icon: EmojiProductivityIcon,
    order: 10,
  },
  USER_CUSTOM: {
    id: customCategory,
    name: userCustomTitle,
    icon: EmojiCustomIcon,
    order: 11,
  },
  CUSTOM: {
    id: customCategory,
    name: customTitle,
    icon: EmojiCustomIcon,
    order: 12,
  },
};
