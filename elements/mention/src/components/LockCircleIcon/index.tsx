import { lazy } from 'react';

const AsyncLockCircleIcon = lazy(() =>
	import(
		/* webpackChunkName: "@atlaskit-internal_mention/LockCircleIcon" */ '@atlaskit/icon/glyph/lock-circle'
	).then((module) => ({
		default: module.default,
	})),
);

export default AsyncLockCircleIcon;
