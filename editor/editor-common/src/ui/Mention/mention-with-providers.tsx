import React, { useLayoutEffect, useRef, useState } from 'react';

import { ResourcedMention } from '@atlaskit/mention/element';
import type { MentionProvider } from '@atlaskit/mention/resource';
import { fg } from '@atlaskit/platform-feature-flags';

import type { ProfilecardProvider } from '../../provider-factory/profile-card-provider';
import type { MentionEventHandlers } from '../EventHandlers';

import ResourcedMentionWithProfilecard from './mention-with-profilecard';

export interface Props {
	id: string;
	text: string;
	accessLevel?: string;
	mentionProvider?: Promise<MentionProvider>;
	profilecardProvider?: Promise<ProfilecardProvider>;
	eventHandlers?: MentionEventHandlers;
	localId?: string;
}

export interface State {
	profilecardProvider: ProfilecardProvider | null;
}

const GENERIC_USER_IDS = ['HipChat', 'all', 'here'];

export const MentionWithProviders = React.memo(
	({
		accessLevel,
		eventHandlers,
		id,
		mentionProvider,
		profilecardProvider: profilecardProviderResolver,
		text,
		localId,
	}: Props) => {
		const [profilecardProvider, setProfilecardProvider] = useState<ProfilecardProvider | null>(
			null,
		);
		const mountedRef = useRef(true);

		useLayoutEffect(() => {
			mountedRef.current = true;
			return () => {
				mountedRef.current = false;
			};
		}, []);

		useLayoutEffect(() => {
			// We are not using async/await here to avoid having an intermediate Promise
			// introduced by the transpiler.
			// This will allow consumer to use a SynchronousPromise.resolve and avoid useless
			// rerendering
			profilecardProviderResolver
				?.then((result) => {
					if (mountedRef.current) {
						setProfilecardProvider(result);
					}
				})
				.catch(() => {
					if (mountedRef.current) {
						setProfilecardProvider(null);
					}
				});
		}, [profilecardProviderResolver]);

		const MentionComponent =
			profilecardProvider && profilecardProviderResolver && GENERIC_USER_IDS.indexOf(id) === -1
				? ResourcedMentionWithProfilecard
				: ResourcedMention;

		const ssrPlaceholderId = fg('cc_mention_ssr_placeholder') ? `mention-${id}` : undefined;

		return (
			<MentionComponent
				id={id}
				text={text}
				accessLevel={accessLevel}
				localId={localId}
				mentionProvider={mentionProvider}
				// Ignored via go/ees005
				// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
				profilecardProvider={profilecardProvider!}
				onClick={eventHandlers?.onClick}
				onMouseEnter={eventHandlers?.onMouseEnter}
				onMouseLeave={eventHandlers?.onMouseLeave}
				ssrPlaceholderId={ssrPlaceholderId}
			/>
		);
	},
);
