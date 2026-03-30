import { useEffect } from 'react';

import { fg } from '@atlaskit/platform-feature-flags';

import { spaceInviteScheduler } from '../utils/spaceInviteScheduler';

/**
 * Registers `visibilitychange` and `beforeunload` listeners that flush all
 * pending scheduled invites when the page is being torn down. On unmount the
 * listeners are removed and any remaining pending invites are flushed.
 *
 * Call this once in a long-lived component (e.g. the Team Links sidebar) so
 * that listeners survive popup open/close cycles.  Consumers that need to
 * schedule or cancel invites should import `spaceInviteScheduler` directly.
 */
export const useSpaceInviteScheduler = (): void => {
	useEffect(() => {
		if (!fg('space-team_linking_invites_fg')) {
			return;
		}

		const onVisibilityChange = () => {
			if (document.visibilityState === 'hidden') {
				spaceInviteScheduler.flushAll();
			}
		};

		const onBeforeUnload = () => {
			spaceInviteScheduler.flushAll();
		};

		document.addEventListener('visibilitychange', onVisibilityChange);
		window.addEventListener('beforeunload', onBeforeUnload);

		return () => {
			document.removeEventListener('visibilitychange', onVisibilityChange);
			window.removeEventListener('beforeunload', onBeforeUnload);
			spaceInviteScheduler.flushAll();
		};
	}, []);
};
