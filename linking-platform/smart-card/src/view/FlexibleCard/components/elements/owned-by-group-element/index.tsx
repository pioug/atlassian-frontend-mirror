import React, { useEffect } from 'react';

import { ElementName } from '../../../../../constants';
import { useFlexibleUiContext } from '../../../../../state/flexible-ui-context';
import {
	BaseAvatarGroupElement,
	type BaseAvatarGroupElementProps,
	toAvatarGroupProps,
} from '../common';

export type OwnedByGroupElementProps = BaseAvatarGroupElementProps & {
	onRender?: (hasData: boolean) => void;
};

const OwnedByGroupElement = (props: OwnedByGroupElementProps): JSX.Element | null => {
	const context = useFlexibleUiContext();
	const data = context ? toAvatarGroupProps(context.ownedByGroup, false) : null;

	const { onRender, ...restProps } = props || {};

	useEffect(() => {
		onRender?.(!!data);
	}, [data, onRender]);

	return data ? (
		<BaseAvatarGroupElement {...data} {...restProps} name={ElementName.OwnedByGroup} />
	) : null;
};

export default OwnedByGroupElement;
