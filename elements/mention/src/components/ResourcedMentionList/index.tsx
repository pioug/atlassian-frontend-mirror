import React from 'react';

import withAnalyticsEvents, {
	type WithAnalyticsEventsProps,
} from '@atlaskit/analytics-next/withAnalyticsEvents';

import { type MentionProvider } from '../../api/MentionResource';
import { type PresenceProvider } from '../../api/PresenceResource';
import { type MentionDescription, type OnMentionEvent } from '../../types';
import { ResourcedMentionListWithoutAnalytics } from './ResourcedMentionListWithoutAnalytics';

export interface Props {
	onSelection?: OnMentionEvent;
	presenceProvider?: PresenceProvider;
	query?: string;
	resourceError?: Error;
	resourceProvider: MentionProvider;
}

export interface State {
	mentions: MentionDescription[];
	resourceError?: Error;
}

// oxlint-disable-next-line eslint/no-redeclare
const ResourcedMentionList: React.ForwardRefExoticComponent<
	Omit<Props, keyof WithAnalyticsEventsProps> & React.RefAttributes<any>
> = withAnalyticsEvents({})(ResourcedMentionListWithoutAnalytics);

type ResourcedMentionList = ResourcedMentionListWithoutAnalytics;

export default ResourcedMentionList;
