import type { NewCoreIconProps } from '@atlaskit/icon';
import { lazy, type LazyExoticComponent } from 'react';

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
