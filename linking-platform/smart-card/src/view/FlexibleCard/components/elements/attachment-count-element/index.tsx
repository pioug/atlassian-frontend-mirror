import React from 'react';

import { ElementName, IconType } from '../../../../../constants';
import { useFlexibleUiContext } from '../../../../../state/flexible-ui-context';
import { BaseBadgeElement, type BaseBadgeElementProps, toBadgeProps } from '../common';

export type AttachmentCountElementProps = BaseBadgeElementProps;

const AttachmentCountElement = (props: AttachmentCountElementProps): JSX.Element | null => {
	const context = useFlexibleUiContext();
	const data = context ? toBadgeProps(context.attachmentCount?.toString()) : null;

	return data ? (
		<BaseBadgeElement
			icon={IconType.Attachment}
			{...data}
			{...props}
			name={ElementName.AttachmentCount}
		/>
	) : null;
};

export default AttachmentCountElement;
