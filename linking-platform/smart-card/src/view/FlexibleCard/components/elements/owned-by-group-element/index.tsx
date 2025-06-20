import React, { useEffect } from 'react';

import { fg } from '@atlaskit/platform-feature-flags';

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
	// eslint-disable-next-line @atlaskit/platform/ensure-feature-flag-prefix
	if (fg('platform-linking-additional-flexible-element-props')) {
		// eslint-disable-next-line react-hooks/rules-of-hooks
		useEffect(() => {
			onRender?.(!!data);
		}, [data, onRender]);
	}

	return data ? (
		<BaseAvatarGroupElement {...data} {...restProps} name={ElementName.OwnedByGroup} />
	) : null;
};

export default OwnedByGroupElement;
