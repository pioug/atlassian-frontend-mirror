import React from 'react';

import { ElementName } from '../../../../../constants';
import { useFlexibleUiContext } from '../../../../../state/flexible-ui-context';
import {
	BaseAvatarGroupElement,
	type BaseAvatarGroupElementProps,
	toAvatarGroupProps,
} from '../common';

export type CollaboratorGroupElementProps = BaseAvatarGroupElementProps;

const CollaboratorGroupElement = (props: CollaboratorGroupElementProps): JSX.Element | null => {
	const context = useFlexibleUiContext();
	const data = context ? toAvatarGroupProps(context.collaboratorGroup, false) : undefined;

	return data ? (
		<BaseAvatarGroupElement {...data} {...props} name={ElementName.CollaboratorGroup} />
	) : null;
};

export default CollaboratorGroupElement;
