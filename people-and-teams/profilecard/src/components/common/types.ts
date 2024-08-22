import { type AnalyticsEventPayload } from '@atlaskit/analytics-next';
import { type PopupProps } from '@atlaskit/popup';

import { type ProfileCardErrorType } from '../../types';

export type ProfileCardTriggerProps<T> = {
	trigger: 'hover' | 'click';
	ariaLabelledBy?: string;
	disabledAriaAttributes?: boolean;
	children: React.ReactNode;
	renderProfileCard: ({
		profileData,
		isLoading,
		error,
	}: {
		profileData?: T;
		isLoading: boolean;
		error: ProfileCardErrorType | undefined | null;
	}) => React.ReactNode;
	fetchProfile?: () => Promise<T>;
	profileCardType: 'agent' | 'user' | 'team';
	fireAnalytics?: (payload: AnalyticsEventPayload) => void;
} & Omit<PopupProps, 'trigger' | 'isOpen' | 'content'>;
