import { type PopupProps } from '@atlaskit/popup';

export type ProfileCardTriggerProps = {
	trigger: 'hover' | 'click';
	ariaLabelledBy?: string;
	disabledAriaAttributes?: boolean;
	children: React.ReactNode;
	renderProfileCard: () => React.ReactNode;
	fetchProfile?: () => Promise<void>;
} & Omit<PopupProps, 'trigger' | 'isOpen' | 'content'>;
