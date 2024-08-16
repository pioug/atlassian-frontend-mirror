import { type PopupProps } from '@atlaskit/popup';

export type ProfileCardTriggerProps<T> = {
	trigger: 'hover' | 'click';
	ariaLabelledBy?: string;
	disabledAriaAttributes?: boolean;
	children: React.ReactNode;
	renderProfileCard: ({
		profileData,
		isLoading,
	}: {
		profileData?: T;
		isLoading: boolean;
	}) => React.ReactNode;
	fetchProfile?: () => Promise<T>;
} & Omit<PopupProps, 'trigger' | 'isOpen' | 'content'>;
