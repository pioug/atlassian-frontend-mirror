import { ACTION, ACTION_SUBJECT, EVENT_TYPE } from '@atlaskit/editor-common/analytics/types/enums';
import type {
	QuickInsertMenuEventPayload,
	QuickInsertSurface,
} from '@atlaskit/editor-common/analytics/types/quick-insert-events';
import type { QuickInsertItem } from '@atlaskit/editor-common/provider-factory/quick-insert-provider';
import { quickInsertProviderMenuItemKey } from '@atlaskit/editor-common/quick-insert/get-provider-menu-item-key';
import type { IsRecommendedItem } from '@atlaskit/editor-common/quick-insert/is-recommended-item';
import {
	ADD_SUGGESTIONS_TO_CONTENT_SKILL_MENU_ITEM,
	getNativeMenuItemName,
	SKILL_MENU_ITEM_KEY_PREFIX,
} from '@atlaskit/editor-common/quick-insert/keys';
import { fg } from '@atlaskit/platform-feature-flags/fg';

import { rankRecommendedItems } from '../ui/getRecommendedComponents';

/** Third-party apps (Forge and Connect) are named by their source, not their app-specific key. */
const ECOSYSTEM_ITEM_NAME = 'ecosystem';
/** Skills are named by kind, since custom Skill slugs are user content. */
const SKILL_ITEM_NAME = 'skill';
const UNKNOWN_ITEM_NAME = 'unknown';

const isSkillItemKey = (key: string): boolean => key.startsWith(SKILL_MENU_ITEM_KEY_PREFIX);

/** The element name for a native item key. Other keys are returned unchanged. */
const toItemName = (key: string): string => getNativeMenuItemName(key) ?? key;

/** The key both menus use for an item: its registered menu key if it has one, else its own key. */
const getLegacyItemKey = (item: QuickInsertItem): string | undefined => {
	const key = item.registeredKey ?? item.key;
	return key === undefined ? undefined : String(key);
};

/** Names a legacy menu item for analytics. */
export const getLegacyItemName = (item: QuickInsertItem): string => {
	const key = getLegacyItemKey(item);
	if (key !== undefined && isSkillItemKey(key)) {
		return SKILL_ITEM_NAME;
	}
	if (item.app?.source === 'ecosystem') {
		return ECOSYSTEM_ITEM_NAME;
	}
	return key === undefined ? UNKNOWN_ITEM_NAME : toItemName(key);
};

/**
 * Names a registered menu item for analytics from its registration key. Native items are named by
 * their element and provider items lose their registry prefix. Third-party apps are named
 * `ecosystem` and Skills `skill`.
 */
export const getRegisteredItemName = (registrationKey: string): string => {
	if (quickInsertProviderMenuItemKey.isEcosystem(registrationKey)) {
		return ECOSYSTEM_ITEM_NAME;
	}
	const sourceKey = quickInsertProviderMenuItemKey.getSourceKey(registrationKey);
	return isSkillItemKey(sourceKey) ? SKILL_ITEM_NAME : toItemName(sourceKey);
};

/**
 * Skills the platform registers. The legacy menu cannot show registered Skills, so these are ranked
 * with its items to keep a recommended Skill's slot. Extension Skills, such as Rovo Skills, are
 * legacy items already. A registered Skill missing here does not keep its slot.
 */
const KNOWN_SKILL_ITEM_KEYS: readonly string[] = [ADD_SUGGESTIONS_TO_CONTENT_SKILL_MENU_ITEM.key];

/**
 * Keys the legacy menu treats as recommended, ranked the same way as the registered menu, so both
 * menus recommend the same items.
 */
export const getLegacyRecommendedItemKeys = ({
	items,
	isRecommendedItem,
	maxRecommendedItems,
}: {
	isRecommendedItem?: IsRecommendedItem;
	items: readonly QuickInsertItem[];
	maxRecommendedItems?: number;
}): Set<string> => {
	const itemKeys = items.flatMap((item) => {
		const key = getLegacyItemKey(item);
		return key === undefined ? [] : [key];
	});
	return new Set(
		rankRecommendedItems({
			candidates: [...new Set([...itemKeys, ...KNOWN_SKILL_ITEM_KEYS])],
			getItemKey: (key) => key,
			isRecommendedItem,
			maxRecommendedItems,
		}),
	);
};

export type QuickInsertMenuAnalytics = {
	/** Fires `quickInsert selected` for an item from the legacy menus. */
	fireLegacyItemSelected: (surface: QuickInsertSurface, item: QuickInsertItem) => void;
	/** Fires `quickInsert opened`. */
	fireOpened: (surface: QuickInsertSurface) => void;
	/** Fires `quickInsert selected` for an item from the registered menus. */
	fireRegisteredItemSelected: (options: {
		/** Called only when the event fires, so the gate-off path does no ranking. */
		isRecommendedItem: () => boolean;
		registrationKey: string;
		surface: QuickInsertSurface;
	}) => void;
};

/**
 * Fires the quick insert menu events the same way in the legacy and registered menus, so the two
 * slash command experiences can be compared. Does nothing unless
 * `platform_editor_slash_command_analytics` is on.
 */
export const createQuickInsertMenuAnalytics = ({
	fireAnalyticsEvent,
	getLegacyItems,
	isRecommendedItem,
	maxRecommendedItems,
}: {
	fireAnalyticsEvent: (payload: QuickInsertMenuEventPayload) => void;
	/** Items the legacy menu shows without a query, used to rank its recommendations. */
	getLegacyItems: () => readonly QuickInsertItem[];
	isRecommendedItem?: IsRecommendedItem;
	maxRecommendedItems?: number;
}): QuickInsertMenuAnalytics => {
	const fireItemSelected = (
		surface: QuickInsertSurface,
		itemName: string,
		isRecommended: boolean,
	) =>
		fireAnalyticsEvent({
			action: ACTION.SELECTED,
			actionSubject: ACTION_SUBJECT.QUICK_INSERT,
			attributes: { isRecommendedItem: isRecommended, itemName, surface },
			eventType: EVENT_TYPE.TRACK,
		});

	return {
		fireOpened: (surface) => {
			if (!fg('platform_editor_slash_command_analytics')) {
				return;
			}
			fireAnalyticsEvent({
				action: ACTION.OPENED,
				actionSubject: ACTION_SUBJECT.QUICK_INSERT,
				attributes: { surface },
				eventType: EVENT_TYPE.TRACK,
			});
		},
		fireLegacyItemSelected: (surface, item) => {
			if (!fg('platform_editor_slash_command_analytics')) {
				return;
			}
			const itemName = getLegacyItemName(item);
			const key = getLegacyItemKey(item);
			const recommendedKeys = getLegacyRecommendedItemKeys({
				items: getLegacyItems(),
				isRecommendedItem,
				maxRecommendedItems,
			});
			fireItemSelected(surface, itemName, key !== undefined && recommendedKeys.has(key));
		},
		fireRegisteredItemSelected: ({
			isRecommendedItem: isRecommended,
			registrationKey,
			surface,
		}) => {
			if (!fg('platform_editor_slash_command_analytics')) {
				return;
			}
			fireItemSelected(surface, getRegisteredItemName(registrationKey), isRecommended());
		},
	};
};
