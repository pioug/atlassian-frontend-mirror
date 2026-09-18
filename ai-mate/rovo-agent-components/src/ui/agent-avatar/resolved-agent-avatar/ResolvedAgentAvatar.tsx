import React, { Suspense } from 'react';

import { ErrorBoundary } from 'react-error-boundary';
import { graphql, useLazyLoadQuery } from 'react-relay';

import Avatar from '@atlaskit/avatar/avatar';
import { AVATAR_SIZES } from '@atlaskit/avatar/avatar-sizes';
import AvatarSkeleton from '@atlaskit/avatar/Skeleton';
import type { SizeType } from '@atlaskit/avatar/types';
import { cssMap } from '@atlaskit/css';
import { Box } from '@atlaskit/primitives/compiled/box';
import { token } from '@atlaskit/tokens';

import type { ResolvedAgentAvatarQuery } from './__generated__/ResolvedAgentAvatarQuery.graphql';

const styles = cssMap({
	// Matches AgentAvatar's own `showBorder` treatment: a background behind the picture so a
	// transparent corner doesn't show whatever sits behind it.
	showBorder: {
		display: 'flex',
		alignItems: 'center',
		justifyContent: 'center',
		backgroundColor: token('elevation.surface'),
	},
});

// The fixed partition/resource-owner/resource-type segments of an identity user ARI — only the
// account id itself varies. Matched by prefix rather than via `@atlassian/ari` (an internal
// package this public package can't depend on).
const IDENTITY_USER_ARI_PREFIX = 'ari:cloud:identity::user/';

/**
 * Parses the account id needed for the picture fetch from whatever identity a caller carries —
 * either the bare account id, or the full identity ARI (callers that already have one on hand
 * don't need to strip it first).
 */
const parseIdentityAccountId = (value?: string | null): string | undefined => {
	const trimmed = value?.trim();
	if (!trimmed) {
		return undefined;
	}
	return trimmed.startsWith(IDENTITY_USER_ARI_PREFIX)
		? trimmed.slice(IDENTITY_USER_ARI_PREFIX.length)
		: trimmed;
};

const FetchedAgentAvatar = ({
	accountId,
	agentName,
	fallback,
	showBorder,
	size,
}: {
	accountId: string;
	agentName?: string;
	fallback: React.JSX.Element;
	showBorder: boolean;
	size: SizeType;
}): React.JSX.Element => {
	const data = useLazyLoadQuery<ResolvedAgentAvatarQuery>(
		graphql`
			query ResolvedAgentAvatarQuery($accountId: ID!) {
				user(accountId: $accountId) {
					name
					picture
				}
			}
		`,
		{ accountId },
		{ fetchPolicy: 'store-or-network' },
	);

	const picture = data.user?.picture?.trim();
	if (!picture) {
		return fallback;
	}

	const name = data.user?.name?.trim() || agentName;
	if (!showBorder) {
		return <Avatar appearance="hexagon" src={picture} name={name} label={name} size={size} />;
	}

	return (
		<Box
			testId="resolved-agent-avatar-border"
			xcss={styles.showBorder}
			style={{
				// eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop, @atlaskit/ui-styling-standard/no-imported-style-values
				height: AVATAR_SIZES[size],
				// eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop, @atlaskit/ui-styling-standard/no-imported-style-values
				width: AVATAR_SIZES[size],
			}}
		>
			<Avatar appearance="hexagon" src={picture} name={name} label={name} size={size} />
		</Box>
	);
};

/**
 * The best avatar available for an agent identity: the real account picture when one can be
 * fetched, otherwise `fallback`. Works for any identity with an `agentIdentityAccountId` —
 * including the default Rovo agent, now that Rovo is provisioned its own identity account. A
 * `Suspense` skeleton bridges the fetch, and an `ErrorBoundary` keeps a failed or unavailable
 * fetch from ever breaking the caller — it just renders `fallback`.
 */
export const ResolvedAgentAvatar = ({
	agentIdentityAccountId,
	agentName,
	fallback,
	showBorder = false,
	size = 'medium',
}: {
	/** Either the bare account id or the full identity ARI — whichever the caller already has. */
	agentIdentityAccountId?: string | null;
	agentName?: string;
	/**
	 * Rendered when there's no account id, no picture on file, or the fetch fails. Defaults to a
	 * generic hexagon `Avatar` (renders its own agent icon with no `src`) — pass an explicit
	 * `fallback` only when the caller has something more specific to show (e.g. its own
	 * already-known picture, or an `agentNamedId` for a generated illustration).
	 */
	fallback?: React.JSX.Element;
	/** Border/background treatment for the fetched picture, matching `AgentAvatar`'s own prop. */
	showBorder?: boolean;
	size?: SizeType;
}): React.JSX.Element => {
	const resolvedFallback = fallback ?? <Avatar appearance="hexagon" name={agentName} size={size} />;
	const accountId = parseIdentityAccountId(agentIdentityAccountId);
	if (!accountId) {
		return resolvedFallback;
	}

	return (
		<ErrorBoundary fallback={resolvedFallback}>
			<Suspense fallback={<AvatarSkeleton appearance="hexagon" size={size} />}>
				<FetchedAgentAvatar
					accountId={accountId}
					agentName={agentName}
					fallback={resolvedFallback}
					showBorder={showBorder}
					size={size}
				/>
			</Suspense>
		</ErrorBoundary>
	);
};
