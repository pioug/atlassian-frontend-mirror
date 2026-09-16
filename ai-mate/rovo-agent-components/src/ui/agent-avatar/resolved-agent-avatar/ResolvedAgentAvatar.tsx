import React, { Suspense } from 'react';

import { ErrorBoundary } from 'react-error-boundary';
import { graphql, useLazyLoadQuery } from 'react-relay';

import AvatarSkeleton from '@atlaskit/avatar/Skeleton';
import type { SizeType } from '@atlaskit/avatar/types';

// A relative import, not the package's own public subpath: a package can't resolve its own
// name from within itself when building its published type declarations in isolation.
import { AgentAvatar } from '../index';

import type { ResolvedAgentAvatarQuery } from './__generated__/ResolvedAgentAvatarQuery.graphql';

// The fixed partition/resource-owner/resource-type segments of an identity user ARI — only the
// account id itself varies. Matched by prefix rather than via `@atlassian/ari` (an internal
// package this public package can't depend on).
const IDENTITY_USER_ARI_PREFIX = 'ari:cloud:identity::user/';

/** Parses the account id needed for the picture fetch from the identity ARI a caller carries. */
const parseIdentityAccountId = (value?: string | null): string | undefined => {
	const trimmed = value?.trim();
	return trimmed?.startsWith(IDENTITY_USER_ARI_PREFIX)
		? trimmed.slice(IDENTITY_USER_ARI_PREFIX.length)
		: undefined;
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
	return (
		<AgentAvatar imageUrl={picture} name={name} label={name} showBorder={showBorder} size={size} />
	);
};

/**
 * The best avatar available for an agent identity: the real account picture when one can be
 * fetched, otherwise the caller-supplied `fallback`. Works for any identity with an
 * `agentIdentityAccountId` — including the default Rovo agent, now that Rovo is provisioned its
 * own identity account. A `Suspense` skeleton bridges the fetch, and an `ErrorBoundary` keeps a
 * failed or unavailable fetch from ever breaking the caller — it just renders `fallback`.
 */
export const ResolvedAgentAvatar = ({
	agentIdentityAccountId,
	agentName,
	fallback,
	showBorder = false,
	size = 'medium',
}: {
	agentIdentityAccountId?: string | null;
	agentName?: string;
	/** Rendered when there's no account id, no picture on file, or the fetch fails. */
	fallback: React.JSX.Element;
	/** Border/background treatment for the fetched picture, matching `AgentAvatar`'s own prop. */
	showBorder?: boolean;
	size?: SizeType;
}): React.JSX.Element => {
	const accountId = parseIdentityAccountId(agentIdentityAccountId);
	if (!accountId) {
		return fallback;
	}

	return (
		<ErrorBoundary fallback={fallback}>
			<Suspense fallback={<AvatarSkeleton appearance="hexagon" size={size} />}>
				<FetchedAgentAvatar
					accountId={accountId}
					agentName={agentName}
					fallback={fallback}
					showBorder={showBorder}
					size={size}
				/>
			</Suspense>
		</ErrorBoundary>
	);
};
