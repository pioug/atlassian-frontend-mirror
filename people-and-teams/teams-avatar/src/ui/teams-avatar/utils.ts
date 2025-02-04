import { fg } from '@atlaskit/platform-feature-flags';
/**
 * This is a hack to toggle between square and circle icons based on the
 * network response as we want to FG the change in the BE.
 * This func will be removed once the BE is rolled out.
 * Square icon URLs:
 * - https://ptc-directory-sited-static.us-east-1.prod.public.atl-paas.net/teams/avatars/v4/blue_4.svg
 * - https://teams-directory-frontend.stg-east.frontend.public.atl-paas.net/assets/teams/avatars/v4/blue_1.svg
 */
export function isSquareIcon(src?: string): boolean {
	if (!src) {
		return false;
	}

	try {
		const url = new URL(src);
		const host = url.host;
		const path = url.pathname;
		if (
			(host.startsWith('ptc-directory-sited-static') ||
				host.startsWith('teams-directory-frontend')) &&
			path.includes('teams/avatars/v4') &&
			fg('enable-team-avatar-switch')
		) {
			return true;
		}
	} catch {
		// The src wasn't a URL, so it's obviously not the refreshed avatar.
	}
	return false;
}
