/* eslint-disable @repo/internal/deprecations/deprecation-ticket-required -- VOLTC-139 tracks removal of these deprecated re-export shims. */
import MentionItem, {
	MENTION_ITEM_HEIGHT,
	MENTION_ITEM_HEIGHT_REFRESHED,
} from './components/MentionItem';

/**
 * @deprecated Use `import MentionItem, { MENTION_ITEM_HEIGHT, MENTION_ITEM_HEIGHT_REFRESHED } from '@atlaskit/mention/mention-item'` instead.
 */
export {
	// Components
	MentionItem,
	MENTION_ITEM_HEIGHT,
	MENTION_ITEM_HEIGHT_REFRESHED,
};
