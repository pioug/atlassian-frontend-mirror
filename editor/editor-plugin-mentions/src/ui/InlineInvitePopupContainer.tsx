/**
 * @jsxRuntime classic
 * @jsx jsx
 * @jsxFrag React.Fragment
 */
import React, { useCallback, useEffect, useRef, useState } from 'react';

import { jsx } from '@compiled/react';

import type { ExtractInjectionAPI } from '@atlaskit/editor-common/types';
import type { Node as PMNode } from '@atlaskit/editor-prosemirror/model';
import type { EditorView } from '@atlaskit/editor-prosemirror/view';
import type { MentionProvider } from '@atlaskit/mention/resource';
import type {
	InlineInvitePopupResult,
	MentionDisabledState,
	MentionDisabledStateInput,
} from '@atlaskit/mention/types';

import type { MentionsPlugin } from '../mentionsPluginType';

interface Props {
	api: ExtractInjectionAPI<MentionsPlugin> | undefined;
	editorView: EditorView;
	mentionProvider: Promise<MentionProvider> | undefined;
}

type ProviderWithPopup = MentionProvider & {
	InlineInvitePopup?: React.ComponentType<{
		anchorElement: HTMLElement | null;
		onDismiss: () => void;
		onInviteComplete: (result: InlineInvitePopupResult) => void;
		onReady: (show: ((email: string) => void) | null) => void;
	}>;
	showInlineInvitePopup?: (email: string, localId: string) => void;
};

type PendingMention = { email: string; localId: string };

const findMentionRange = (doc: PMNode, localId: string): { from: number; to: number } | null => {
	let range: { from: number; to: number } | null = null;
	doc.descendants((node, pos) => {
		if (range) {
			return false;
		}
		if (node.type.name === 'mention' && node.attrs.localId === localId) {
			range = { from: pos, to: pos + node.nodeSize };
			return false;
		}
		return true;
	});
	return range;
};

export const InlineInvitePopupContainer = ({
	mentionProvider,
	api,
	editorView,
}: Props): JSX.Element | null => {
	const [provider, setProvider] = useState<ProviderWithPopup | null>(null);
	const [anchorElement, setAnchorElement] = useState<HTMLElement | null>(null);
	const pendingMentionRef = useRef<PendingMention | null>(null);

	useEffect(() => {
		if (!mentionProvider) {
			return;
		}

		let isMounted = true;
		let cleanupProvider: (() => void) | undefined;

		mentionProvider
			.then((resolvedProvider) => {
				if (!isMounted) {
					return;
				}

				const providerWithPopup = resolvedProvider as ProviderWithPopup;
				const originalGetMentionDisabledState =
					providerWithPopup.getMentionDisabledState?.bind(providerWithPopup);

				providerWithPopup.getMentionDisabledState = (
					mention: MentionDisabledStateInput,
				): MentionDisabledState | undefined => {
					if (pendingMentionRef.current?.localId === mention.id) {
						return { disabled: true };
					}
					return originalGetMentionDisabledState?.(mention);
				};

				cleanupProvider = () => {
					if (originalGetMentionDisabledState) {
						providerWithPopup.getMentionDisabledState = originalGetMentionDisabledState;
					} else {
						delete providerWithPopup.getMentionDisabledState;
					}
				};

				setProvider(providerWithPopup);
			})
			.catch(() => {});

		return () => {
			isMounted = false;
			cleanupProvider?.();
			setProvider(null);
		};
	}, [mentionProvider]);

	const removePendingMention = useCallback(() => {
		const pending = pendingMentionRef.current;
		if (pending && api?.core?.actions?.execute) {
			api.core.actions.execute(({ tr }) => {
				const range = findMentionRange(tr.doc, pending.localId);
				return range ? tr.delete(range.from, range.to) : null;
			});
		}
		pendingMentionRef.current = null;
		setAnchorElement(null);
	}, [api]);

	const handleDismiss = useCallback(() => {
		removePendingMention();
	}, [removePendingMention]);

	const handleInviteComplete = useCallback(
		(result: InlineInvitePopupResult) => {
			const pending = pendingMentionRef.current;
			if (!pending) {
				return;
			}

			const invitedUser = result.invited[0] ?? result.requested[0];
			if (!invitedUser || !api?.core?.actions?.execute || !api?.mention?.commands?.insertMention) {
				return;
			}

			const { id: userId, email } = invitedUser;

			api.core.actions.execute(({ tr }) => {
				const range = findMentionRange(tr.doc, pending.localId);
				return range ? tr.delete(range.from, range.to) : null;
			});
			api.core.actions.execute(
				api.mention.commands.insertMention({
					id: userId,
					name: email,
					userType: 'DEFAULT',
					accessLevel: 'CONTAINER',
				}),
			);

			pendingMentionRef.current = null;
			setAnchorElement(null);
		},
		[api],
	);

	const handleReady = useCallback(
		(show: ((email: string) => void) | null) => {
			if (!provider) {
				return;
			}
			if (show) {
				provider.showInlineInvitePopup = (email: string, localId: string) => {
					pendingMentionRef.current = { email, localId };
					setTimeout(() => {
						const range = findMentionRange(editorView.state.doc, localId);
						const dom = range ? editorView.nodeDOM(range.from) : null;
						setAnchorElement(dom instanceof HTMLElement ? dom : null);
						show(email);
					}, 0);
				};
			} else {
				delete provider.showInlineInvitePopup;
			}
		},
		[provider, editorView],
	);

	if (
		!provider?.InlineInvitePopup ||
		!api?.mention?.commands?.insertMention ||
		!api?.core?.actions?.execute
	) {
		return null;
	}

	const PopupComponent = provider.InlineInvitePopup;
	return (
		<PopupComponent
			anchorElement={anchorElement}
			onInviteComplete={handleInviteComplete}
			onDismiss={handleDismiss}
			onReady={handleReady}
		/>
	);
};
