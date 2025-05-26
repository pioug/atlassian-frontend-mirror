import React from 'react';

import { ElementName } from '../../../../../constants';
import { useFlexibleUiContext } from '../../../../../state/flexible-ui-context';
import {
	BaseAvatarGroupElement,
	type BaseAvatarGroupElementProps,
	toAvatarGroupProps,
} from '../common';

export type OwnedByGroupElementProps = BaseAvatarGroupElementProps;

const OwnedByGroupElement = (props: OwnedByGroupElementProps): JSX.Element | null => {
	const context = useFlexibleUiContext();
	const data = context ? toAvatarGroupProps(context.ownedByGroup, false) : null;

	return data ? (
		<BaseAvatarGroupElement {...data} {...props} name={ElementName.OwnedByGroup} />
	) : null;
};

export default OwnedByGroupElement;
