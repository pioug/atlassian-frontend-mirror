import { type DetailedHTMLProps, type IframeHTMLAttributes } from 'react';

type IframeProps = DetailedHTMLProps<IframeHTMLAttributes<HTMLIFrameElement>, HTMLIFrameElement>;

export type NotificationsProps = Omit<IframeProps, 'src'> & {
	// Reserved for testing, avoid using this
	_url?: string;
	isNewExperience?: boolean;
	locale?: string;
	product?: 'confluence' | 'jira' | string;
	subproduct?: 'software' | 'serviceManagement' | 'workManagement' | string;
	testId?: string;
};
