import React from 'react';

import { lazyForPaint, LazySuspense } from 'react-loosely-lazy';

import type { DisconnectDialogProps } from './index';

const DisconnectDialogLazyInner = lazyForPaint(() =>
	import(
		/* webpackChunkName: "@atlaskit-internal_teams-public_disconnect-dialog" */ './index'
	).then(({ DisconnectDialog }) => DisconnectDialog),
);

export const DisconnectDialogLazy = (props: DisconnectDialogProps): React.JSX.Element => (
	<LazySuspense fallback={null}>
		<DisconnectDialogLazyInner {...props} />
	</LazySuspense>
);
