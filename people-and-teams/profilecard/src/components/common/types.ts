import { type AnalyticsEventPayload } from '@atlaskit/analytics-next';
import { type PopupProps } from '@atlaskit/popup';

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
	fireAnalytics?: (payload: AnalyticsEventPayload) => void;
	hideOverflow?: boolean;
} & Omit<PopupProps, 'trigger' | 'isOpen' | 'content'>;
