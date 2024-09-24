import { lazy } from 'react';

const AsyncLockCircleIcon = lazy(() =>
	import(
		/* webpackChunkName: "@atlaskit-internal_mention/LockCircleIcon" */ '@atlaskit/icon/core/migration/lock-locked--lock-circle'
	).then((module) => ({
		default: module.default,
	})),
);

export default AsyncLockCircleIcon;
