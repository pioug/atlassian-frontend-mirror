import React from 'react';

import { bind } from 'bind-event-listener';
// eslint-disable-next-line @atlaskit/platform/prefer-crypto-random-uuid -- Use crypto.randomUUID instead
import uuid from 'uuid/v4';

import type { PortalProviderAPI } from '@atlaskit/editor-common/portal';
import type { ExtractInjectionAPI } from '@atlaskit/editor-common/types';
import type { Node as PMNode } from '@atlaskit/editor-prosemirror/model';
import { NodeSelection } from '@atlaskit/editor-prosemirror/state';
import { fg } from '@atlaskit/platform-feature-flags';
import { navigateToTeamsApp } from '@atlaskit/teams-app-config/navigation';

import type { MentionsPlugin } from '../mentionsPluginType';
import type { MentionPluginOptions } from '../types';
import { ProfileCardComponent } from '../ui/ProfileCardComponent';

export const profileCardRenderer = ({
	dom,
	options,
	portalProviderAPI,
	node,
	api,
}: {
	api: ExtractInjectionAPI<MentionsPlugin> | undefined;
	dom: Node;
	node: PMNode;
	options?: MentionPluginOptions;
	portalProviderAPI: PortalProviderAPI;
}): {
	destroyProfileCard: () => void;
	removeProfileCard: () => void;
} => {
	let renderingProfileCard = false;
	let navigatingToProfile = false;
	// eslint-disable-next-line @atlaskit/platform/prefer-crypto-random-uuid -- Use crypto.randomUUID instead
	const key = uuid();
	let cleanupSelection: (() => void) | undefined;

	const removeProfileCard = (): void => {
		if (dom instanceof HTMLElement) {
			dom.setAttribute('aria-expanded', 'false');
		}
		portalProviderAPI.remove(key);
		renderingProfileCard = false;
		cleanupSelection?.();
	};

	const listenerCleanup = bind(dom, {
		type: 'click',
		listener: () => {
			if (fg('people-teams_migrate-user-profile-card')) {
				const userId = node.attrs?.id;
				if (userId) {
					navigatingToProfile = false;
					options?.profilecardProvider?.then((provider) => {
						// If a consumer (e.g. Confluence) has supplied a custom profile card
						// renderer, render it into the portal instead of navigating away. The
						// consumer owns its own popup/positioning behavior - subsequent clicks
						// while the card is already open are no-ops here so the card's own
						// outside-click / toggle logic can take over.
						if (provider.renderUserMentionCard) {
							if (dom instanceof HTMLElement && !renderingProfileCard) {
								dom.setAttribute('aria-expanded', 'true');
								renderingProfileCard = true;
								portalProviderAPI.render(
									() => (
										<>
											{provider.renderUserMentionCard?.({
												userId,
												cloudId: provider.cloudId,
												children: null,
												referenceElement: dom,
											})}
										</>
									),
									dom,
									key,
								);
								cleanupSelection = api?.selection?.sharedState.onChange(
									({ nextSharedState }) => {
										const selection = nextSharedState?.selection;
										if (selection instanceof NodeSelection ? selection.node === node : false) {
											return;
										}
										removeProfileCard?.();
									},
								);
							}
							return;
						}

						if (navigatingToProfile) {
							return;
						}
						navigatingToProfile = true;
						const { href, target } = navigateToTeamsApp({
							type: 'USER',
							payload: { userId },
							cloudId: provider.cloudId,
						});
						window.open(href, target, 'noopener,noreferrer');
					});
				}
				return;
			}
			if (dom instanceof HTMLElement && options?.profilecardProvider && !renderingProfileCard) {
				dom.setAttribute('aria-expanded', 'true');
				renderingProfileCard = true;
				portalProviderAPI.render(
					() => (
						<ProfileCardComponent
							activeMention={node}
							profilecardProvider={options?.profilecardProvider}
							dom={dom}
							closeComponent={removeProfileCard}
						/>
					),
					dom,
					key,
				);
				// If we change the selection we should also remove the profile card. The "deselectNode"
				// should usually catch this, but it's possible (ie. on triple click) for this not to be called
				// which means the profile card gets stuck open until you click + change selection
				cleanupSelection = api?.selection?.sharedState.onChange(({ nextSharedState }) => {
					const selection = nextSharedState?.selection;
					if (selection instanceof NodeSelection ? selection.node === node : false) {
						return;
					}
					removeProfileCard?.();
				});
			}
		},
	});

	return {
		destroyProfileCard: (): void => {
			listenerCleanup();
			removeProfileCard?.();
		},
		removeProfileCard,
	};
};
