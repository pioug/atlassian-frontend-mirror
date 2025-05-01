// Remove when cleaning up fg `platform-smart-card-remove-legacy-button`

import { MessageDescriptor } from 'react-intl-next';

import { IconProp } from '@atlaskit/button/new';

// EDM-12433
export type OldLinkInfoButtonProps = {
	content: React.ReactNode;
	icon: React.ReactChild;
	onClick?: () => void;
	href?: string;
	target?: string;
	testId?: string;
};

export type LinkInfoButtonProps = {
	content: React.ReactNode;
	icon: IconProp;
	label: MessageDescriptor;
	onClick?: () => void;
	testId?: string;
};
