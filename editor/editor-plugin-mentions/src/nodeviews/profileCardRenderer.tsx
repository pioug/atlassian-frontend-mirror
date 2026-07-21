import React from 'react';

import { bind } from 'bind-event-listener';
// eslint-disable-next-line @atlaskit/platform/prefer-crypto-random-uuid -- Use crypto.randomUUID instead
import uuid from 'uuid/v4';

import type { MentionAttributes } from '@atlaskit/adf-schema/mention';
import type { DocNode } from '@atlaskit/adf-schema/schema';
import type { PortalProviderAPI } from '@atlaskit/editor-common/portal';
import type { ProfilecardProvider } from '@atlaskit/editor-common/provider-factory';
import type { ExtractInjectionAPI } from '@atlaskit/editor-common/types';
import type { Node as PMNode } from '@atlaskit/editor-prosemirror/model';
import { NodeSelection } from '@atlaskit/editor-prosemirror/state';
import { findChildrenByAttr } from '@atlaskit/editor-prosemirror/utils';
import type { EditorView } from '@atlaskit/editor-prosemirror/view';
import { fg } from '@atlaskit/platform-feature-flags';
import { navigateToTeamsApp } from '@atlaskit/teams-app-config/navigation';
import { expVal } from '@atlaskit/tmp-editor-statsig/expVal';

import type { MentionsPlugin } from '../mentionsPluginType';
import { getAgentMentionParentContext } from '../pm-plugins/agent-mention-context';
import type { MentionPluginOptions } from '../types';
import { isAgentMentionType, ProfileCardComponent } from '../ui/ProfileCardComponent';

export const profileCardRenderer = ({
	dom,
	options,
	portalProviderAPI,
	node,
	api,
	editorView,
}: {
	api: ExtractInjectionAPI<MentionsPlugin> | undefined;
	dom: Node;
	editorView?: EditorView;
	node: PMNode;
	options?: MentionPluginOptions;
	portalProviderAPI: PortalProviderAPI;
}): {
	destroyProfileCard: () => void;
	removeProfileCard: () => void;
	updateNode: (nextNode: PMNode) => void;
} => {
	// Keep a mutable reference to the latest node so the click handler always
	// reads up-to-date attrs
	let currentNode = node;
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
			if (
				selection instanceof NodeSelection
					? expVal('platform_editor_reduced_profile_cards', 'isEnabled', false)
						? selection.node.sameMarkup(currentNode)
						: selection.node === node
					: false
			) {
				return;
			}
			removeProfileCard?.();
		});
	};

	const renderEditorProfileCard = (): void => {
		const isReducedProfileCards = expVal(
			'platform_editor_reduced_profile_cards',
			'isEnabled',
			false,
		);
		const clickedNode = isReducedProfileCards ? currentNode : node;

		const activeMention = isReducedProfileCards
			? (() => {
					// Read the display name from the DOM element at click time — this is
					// always up-to-date even when node.attrs.text is absent
					const primitiveText =
						dom instanceof HTMLElement
							? dom.querySelector('.editor-mention-primitive')?.textContent?.trim()
							: undefined;
					return {
						attrs: {
							...currentNode?.attrs,
							text: currentNode?.attrs?.text || primitiveText || undefined,
						} as MentionAttributes,
					};
				})()
			: { attrs: node.attrs as MentionAttributes };

		// Build agent mention context at click time by finding the parent block of this mention
		// in the live document.
		let agentMentionContext: DocNode | undefined;
		if (
			options?.onAgentMentionChatClick &&
			editorView &&
			fg('platform_editor_agent_mentions_drop_one_fixes')
		) {
			const localId = clickedNode.attrs?.localId as string | undefined;
			if (localId) {
				const found = findChildrenByAttr(
					editorView.state.doc,
					(attrs) => attrs?.localId === localId,
				)[0];
				if (found) {
					const parentBlock = editorView.state.doc.resolve(found.pos).parent;
					agentMentionContext = getAgentMentionParentContext(parentBlock, localId);
				}
			}
		}

		renderProfileCardPopup((referenceElement) => (
			<ProfileCardComponent
				activeMention={activeMention}
				profilecardProvider={options?.profilecardProvider}
				onAgentMentionChatClick={
					options?.onAgentMentionChatClick && fg('platform_editor_agent_mentions_drop_one_fixes')
						? (agentId: string) => options.onAgentMentionChatClick?.(agentId, agentMentionContext)
						: undefined
				}
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
				const userId = expVal('platform_editor_reduced_profile_cards', 'isEnabled', false)
					? currentNode.attrs?.id
					: node.attrs?.id;
				if (!userId) {
					return;
				}

				navigatingToProfile = false;
				options?.profilecardProvider?.then((provider) => {
					if (!expVal('platform_editor_agent_mentions', 'isEnabled', false)) {
						renderDefaultProfileCard(userId, provider);
						return;
					}

					if (
						isAgentMentionType(
							expVal('platform_editor_reduced_profile_cards', 'isEnabled', false)
								? currentNode.attrs?.userType
								: node.attrs?.userType,
						)
					) {
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
		updateNode: (nextNode: PMNode): void => {
			currentNode = nextNode;
		},
	};
};
