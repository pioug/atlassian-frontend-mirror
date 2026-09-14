import { isSpecialMentionText } from '../is-special-mention-text';
import { MENTION_ANALYTICS_PREFIX } from './analytics';

export const fireAnalytics: any =
	(firePrivateAnalyticsEvent?: Function) =>
	(eventName: string, text: string, accessLevel?: string): void => {
		if (firePrivateAnalyticsEvent) {
			firePrivateAnalyticsEvent(`${MENTION_ANALYTICS_PREFIX}.${eventName}`, {
				accessLevel,
				isSpecial: isSpecialMentionText(text),
			});
		}
	};
