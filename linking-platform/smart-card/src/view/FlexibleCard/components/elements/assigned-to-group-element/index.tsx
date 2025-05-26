import React from 'react';

import { ElementName } from '../../../../../constants';
import { useFlexibleUiContext } from '../../../../../state/flexible-ui-context';
import {
	BaseAvatarGroupElement,
	type BaseAvatarGroupElementProps,
	toAvatarGroupProps,
} from '../common';

export type AssignedToGroupElementProps = BaseAvatarGroupElementProps;

const AssignedToGroupElement = (props: AssignedToGroupElementProps): JSX.Element | null => {
	const context = useFlexibleUiContext();
	const data = context ? toAvatarGroupProps(context.assignedToGroup, true) : null;
	return data ? (
		<BaseAvatarGroupElement {...data} {...props} name={ElementName.AssignedToGroup} />
	) : null;
};

export default AssignedToGroupElement;
