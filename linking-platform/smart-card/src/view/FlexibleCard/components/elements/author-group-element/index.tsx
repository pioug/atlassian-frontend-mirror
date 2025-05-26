import React from 'react';

import { ElementName } from '../../../../../constants';
import { useFlexibleUiContext } from '../../../../../state/flexible-ui-context';
import {
	BaseAvatarGroupElement,
	type BaseAvatarGroupElementProps,
	toAvatarGroupProps,
} from '../common';

export type AuthorGroupElementProps = BaseAvatarGroupElementProps;

const AuthorGroupElement = (props: AuthorGroupElementProps): JSX.Element | null => {
	const context = useFlexibleUiContext();
	const data = context ? toAvatarGroupProps(context.authorGroup, false) : null;

	return data ? (
		<BaseAvatarGroupElement {...data} {...props} name={ElementName.AuthorGroup} />
	) : null;
};

export default AuthorGroupElement;
