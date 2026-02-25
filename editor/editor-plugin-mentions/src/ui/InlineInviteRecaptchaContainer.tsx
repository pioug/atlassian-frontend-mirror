/**
 * @jsxRuntime classic
 * @jsx jsx
 * @jsxFrag React.Fragment
 */
import React, { useCallback, useEffect, useState } from 'react';

import { jsx } from '@compiled/react';

import type { ExtractInjectionAPI } from '@atlaskit/editor-common/types';
import type { MentionProvider } from '@atlaskit/mention/resource';

import type { MentionsPlugin } from '../mentionsPluginType';
import {
	mentionPlaceholderPluginKey,
	MENTION_PLACEHOLDER_ACTIONS,
} from '../pm-plugins/mentionPlaceholder';
import { MENTION_SOURCE } from '../ui/type-ahead/analytics';

interface Props {
	api: ExtractInjectionAPI<MentionsPlugin> | undefined;
	mentionProvider: Promise<MentionProvider> | undefined;
}

type ProviderWithRecaptcha = MentionProvider & {
	InlineInviteRecaptcha?: React.ComponentType<{
		analyticsSource: string;
		onClose: () => void;
		onReady: (showRecaptcha: ((email: string) => void) | null) => void;
		onSuccess: (userId: string, email: string) => void;
	}>;
	showInlineInviteRecaptcha?: (email: string) => void;
};

/**
 * Container that renders the recaptcha component from the mention provider and manages handleSuccess.
 * Does NOT pass email - the provider's component uses useInlineInviteRecaptcha hook internally
 * and wires showRecaptcha to the provider. When user clicks invite item, type-ahead calls
 * mentionProvider.showInlineInviteRecaptcha(email) which passes email to the component.
 */
export const InlineInviteRecaptchaContainer = ({ mentionProvider, api }: Props) => {
	const [provider, setProvider] = useState<ProviderWithRecaptcha | null>(null);

	useEffect(() => {
		if (!mentionProvider) {
			return;
		}

		let isMounted = true;

		mentionProvider
			.then((resolvedProvider) => {
				if (!isMounted) {
					return;
				}
				setProvider(resolvedProvider as ProviderWithRecaptcha);
			})
			.catch(() => {
				// Silently handle promise rejection
			});

		return () => {
			isMounted = false;
			setProvider(null);
		};
	}, [mentionProvider]);

	const handleSuccess = useCallback(
		(userId: string, email: string) => {
			if (!api?.mention?.commands?.insertMention || !api?.core?.actions?.execute) {
				return;
			}

			const name = email.split('@')[0] || email;

			api.core.actions.execute(
				api.mention.commands.insertMention({
					id: userId,
					name,
					userType: 'DEFAULT',
					accessLevel: 'CONTAINER',
				}),
			);
			api.core.actions.execute(({ tr }) => {
				tr.setMeta(mentionPlaceholderPluginKey, {
					action: MENTION_PLACEHOLDER_ACTIONS.HIDE_PLACEHOLDER,
				});
				return tr;
			});
		},
		[api],
	);

	const handleClose = useCallback(() => {
		if (!api?.core?.actions?.execute) {
			return;
		}
		api.core.actions.execute(({ tr }) => {
			tr.setMeta(mentionPlaceholderPluginKey, {
				action: MENTION_PLACEHOLDER_ACTIONS.HIDE_PLACEHOLDER,
			});
			return tr;
		});
	}, [api]);

	const handleReady = useCallback(
		(showRecaptcha: ((email: string) => void) | null) => {
			if (provider) {
				if (showRecaptcha) {
					provider.showInlineInviteRecaptcha = showRecaptcha;
				} else {
					delete provider.showInlineInviteRecaptcha;
				}
			}
		},
		[provider],
	);

	if (
		!provider?.InlineInviteRecaptcha ||
		!api?.mention?.commands?.insertMention ||
		!api?.core?.actions?.execute
	) {
		return null;
	}

	const RecaptchaComponent = provider.InlineInviteRecaptcha;
	return (
		<RecaptchaComponent
			analyticsSource={MENTION_SOURCE}
			onSuccess={handleSuccess}
			onClose={handleClose}
			onReady={handleReady}
		/>
	);
};
