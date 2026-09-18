import { lazy, type LazyExoticComponent } from 'react';

import type { NewCoreIconProps } from '@atlaskit/icon/types';

const AsyncLockCircleIcon: LazyExoticComponent<{
	(props: NewCoreIconProps): JSX.Element;
	displayName: string;
}> = lazy(() =>
	import(
		/* webpackChunkName: "@atlaskit-internal_mention/LockCircleIcon" */ '@atlaskit/icon/core/lock-locked'
	).then((module) => ({
		default: module.default,
	})),
);

export default AsyncLockCircleIcon;
