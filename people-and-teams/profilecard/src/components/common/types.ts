import { type AnalyticsEventPayload } from '@atlaskit/analytics-next';
import { type PopupProps } from '@atlaskit/popup';
import type { AnalyticsEventAttributes } from '@atlaskit/teams-app-internal-analytics';

import { type ProfileCardErrorType, type ProfileType } from '../../types';

export type ProfileCardTriggerProps<T> = {
	trigger: 'hover' | 'click';
	ariaLabelledBy?: string;
	disabledAriaAttributes?: boolean;
	children: React.ReactNode;
	renderProfileCard: ({
		profileData,
		error,
	}: {
		profileData?: T;
		error: ProfileCardErrorType | undefined | null;
	}) => React.ReactNode;
	fetchProfile?: () => Promise<T>;
	profileCardType: ProfileType;
	testId?: string;
	fireAnalytics?: (payload: AnalyticsEventPayload) => void;
	fireAnalyticsNext?: <K extends keyof AnalyticsEventAttributes>(
		eventKey: K,
		attributes: AnalyticsEventAttributes[K],
	) => void;
} & Omit<PopupProps, 'trigger' | 'isOpen' | 'content'>;
