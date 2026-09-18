import React from 'react';

import { bind } from 'bind-event-listener';
// eslint-disable-next-line @atlaskit/platform/prefer-crypto-random-uuid -- Use crypto.randomUUID instead
import { v4 as uuid } from 'uuid';

import type { DocNode } from '@atlaskit/adf-schema/doc';
import type { MentionAttributes } from '@atlaskit/adf-schema/mention';
import type { PortalProviderAPI } from '@atlaskit/editor-common/portal';
import type { ProfilecardProvider } from '@atlaskit/editor-common/provider-factory';
import type { ExtractInjectionAPI } from '@atlaskit/editor-common/types';
import type { Node as PMNode } from '@atlaskit/editor-prosemirror/model';
import { NodeSelection, TextSelection } from '@atlaskit/editor-prosemirror/state';
import { findChildrenByAttr } from '@atlaskit/editor-prosemirror/utils';
import type { EditorView } from '@atlaskit/editor-prosemirror/view';
import { isExperimentEnabled } from '@atlaskit/platform-feature-experiments/is-experiment-enabled';
import { fg } from '@atlaskit/platform-feature-flags/fg';
import { navigateToTeamsApp } from '@atlaskit/teams-app-config/utils/teams-app-navigation/navigate-to-teams-app';
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
					? expVal('platform_editor_reduced_agent_profile_cards', 'isEnabled', false)
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
			'platform_editor_reduced_agent_profile_cards',
			'isEnabled',
			false,
		);
		const clickedNode = isReducedProfileCards ? currentNode : node;

		const activeMention = isReducedProfileCards
			? (() => {
					// Avatar mentions keep their resolved display name in the nested text span.
					// Control mentions preserve the legacy attrs-first fallback.
					const mentionTextElement =
						dom instanceof HTMLElement ? dom.querySelector('.editor-mention-text') : undefined;
					const primitiveText = (
						mentionTextElement ??
						(dom instanceof HTMLElement
							? dom.querySelector('.editor-mention-primitive')
							: undefined)
					)?.textContent?.trim();
					const resolvedText =
						primitiveText && !primitiveText.startsWith('@') ? `@${primitiveText}` : primitiveText;
					return {
						attrs: {
							...currentNode?.attrs,
							text: mentionTextElement
								? resolvedText || currentNode?.attrs?.text || undefined
								: currentNode?.attrs?.text || primitiveText || undefined,
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
						? (agentId: string) => {
								options.onAgentMentionChatClick?.(agentId, agentMentionContext);
								// The mention stays node-selected after the chat opens; collapse the
								// selection to a cursor just after it so it is no longer left selected.
								// Selection-only change, so it does not move focus (EDITOR-8257).
								if (editorView && fg('platform_editor_agent_card_close_on_chat')) {
									const { state } = editorView;
									editorView.dispatch(
										state.tr.setSelection(TextSelection.create(state.doc, state.selection.to)),
									);
								}
							}
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
			if (
				fg('people-teams_migrate-user-profile-card') ||
				isExperimentEnabled('pt_user_profile_card_migration_exp')
			) {
				const userId = expVal('platform_editor_reduced_agent_profile_cards', 'isEnabled', false)
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
							expVal('platform_editor_reduced_agent_profile_cards', 'isEnabled', false)
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
