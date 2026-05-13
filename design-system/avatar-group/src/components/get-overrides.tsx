import React from 'react';

import type { AvatarGroupOverrides, DeepRequired } from './types';
import { composeUniqueKey } from './utils';

export function getOverrides(overrides?: AvatarGroupOverrides): DeepRequired<AvatarGroupOverrides> {
	return {
		AvatarGroupItem: {
			render: (Component, props, index) => (
				<Component {...props} key={composeUniqueKey(props.avatar, index)} />
			),
			...(overrides && overrides.AvatarGroupItem),
		},
		Avatar: {
			render: (Component, props, index) => (
				//@ts-ignore - TS2604/TS2786: Component type union causing issues for help-center local consumption with TS 5.9.2
				<Component {...props} key={composeUniqueKey(props, index)} />
			),
			...(overrides && overrides.Avatar),
		},
		MoreIndicator: {
			render: (Component, props) => <Component {...props} />,
			...(overrides && overrides.MoreIndicator),
		},
	};
}
