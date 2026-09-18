import { type GasPayload, UI_EVENT_TYPE } from '@atlaskit/analytics-gas-types';
import type { CreateUIAnalyticsEvent } from '@atlaskit/analytics-next/types';
import type UIAnalyticsEvent from '@atlaskit/analytics-next/UIAnalyticsEvent';

import { ELEMENTS_CHANNEL } from '../_constants';
import { isSpecialMentionText } from '../is-special-mention-text';
import { ComponentNames } from '../types';
import { packageName } from './package-name';
import { packageVersion } from './package-version';

export const fireAnalyticsMentionEvent: any =
	(createEvent: CreateUIAnalyticsEvent) =>
	(
		actionSubject: string,
		action: string,
		text: string,
		id: string,
		accessLevel?: string,
	): UIAnalyticsEvent => {
		const payload: GasPayload = {
			action,
			actionSubject,
			eventType: UI_EVENT_TYPE,
			attributes: {
				packageName,
				packageVersion,
				componentName: ComponentNames.MENTION,
				accessLevel,
				isSpecial: isSpecialMentionText(text),
				userId: id,
			},
		};
		const event = createEvent(payload);
		event.fire(ELEMENTS_CHANNEL);
		return event;
	};
