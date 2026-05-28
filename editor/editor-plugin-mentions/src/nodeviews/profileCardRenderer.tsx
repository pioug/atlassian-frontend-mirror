import React from 'react';

import { bind } from 'bind-event-listener';
// eslint-disable-next-line @atlaskit/platform/prefer-crypto-random-uuid -- Use crypto.randomUUID instead
import uuid from 'uuid/v4';

import type { PortalProviderAPI } from '@atlaskit/editor-common/portal';
import type { ProfilecardProvider } from '@atlaskit/editor-common/provider-factory';
import type { ExtractInjectionAPI } from '@atlaskit/editor-common/types';
import type { Node as PMNode } from '@atlaskit/editor-prosemirror/model';
import { NodeSelection } from '@atlaskit/editor-prosemirror/state';
import { fg } from '@atlaskit/platform-feature-flags';
import { navigateToTeamsApp } from '@atlaskit/teams-app-config/navigation';
import { expVal } from '@atlaskit/tmp-editor-statsig/expVal';

import type { MentionsPlugin } from '../mentionsPluginType';
import type { MentionPluginOptions } from '../types';
import { isAgentMentionType, ProfileCardComponent } from '../ui/ProfileCardComponent';

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

	const renderProfileCardPopup = (
		renderProfileCard: (referenceElement: HTMLElement) => JSX.Element,
	): void => {
		if (!(dom instanceof HTMLElement) || renderingProfileCard) {
			return;
		}

		const referenceElement = dom;
		referenceElement.setAttribute('aria-expanded', 'true');
		renderingProfileCard = true;
		portalProviderAPI.render(() => renderProfileCard(referenceElement), referenceElement, key);
		cleanupSelection = api?.selection?.sharedState.onChange(({ nextSharedState }) => {
			const selection = nextSharedState?.selection;
			if (selection instanceof NodeSelection ? selection.node === node : false) {
				return;
			}
			removeProfileCard?.();
		});
	};

	const renderEditorProfileCard = (): void => {
		renderProfileCardPopup((referenceElement) => (
			<ProfileCardComponent
				activeMention={node}
				profilecardProvider={options?.profilecardProvider}
				dom={referenceElement}
				closeComponent={removeProfileCard}
			/>
		));
	};

	const renderUserProfileCard = ({
		userId,
		cloudId,
		renderUserMentionCard,
	}: {
		cloudId: string;
		renderUserMentionCard: ProfilecardProvider['renderUserMentionCard'];
		userId: string;
	}): boolean => {
		if (!renderUserMentionCard) {
			return false;
		}

		renderProfileCardPopup((referenceElement) => (
			<>{renderUserMentionCard({ userId, cloudId, children: null, referenceElement })}</>
		));
		return true;
	};

	const navigateToProfile = (userId: string, cloudId: string): void => {
		if (navigatingToProfile) {
			return;
		}
		navigatingToProfile = true;
		const { href, target } = navigateToTeamsApp({
			type: 'USER',
			payload: { userId },
			cloudId,
		});
		window.open(href, target, 'noopener,noreferrer');
	};

	const renderDefaultProfileCard = (userId: string, provider: ProfilecardProvider): void => {
		if (
			renderUserProfileCard({
				userId,
				cloudId: provider.cloudId,
				renderUserMentionCard: provider.renderUserMentionCard,
			})
		) {
			return;
		}

		navigateToProfile(userId, provider.cloudId);
	};

	const listenerCleanup = bind(dom, {
		type: 'click',
		listener: () => {
			if (fg('people-teams_migrate-user-profile-card')) {
				const userId = node.attrs?.id;
				if (!userId) {
					return;
				}

				navigatingToProfile = false;
				options?.profilecardProvider?.then((provider) => {
					if (!expVal('platform_editor_agent_mentions', 'isEnabled', false)) {
						renderDefaultProfileCard(userId, provider);
						return;
					}

					if (isAgentMentionType(node.attrs?.userType)) {
						renderEditorProfileCard();
					} else {
						renderDefaultProfileCard(userId, provider);
					}
				});
				return;
			}

			if (options?.profilecardProvider) {
				renderEditorProfileCard();
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
