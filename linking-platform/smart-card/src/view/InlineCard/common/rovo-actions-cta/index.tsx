/**
 * @jsxRuntime classic
 * @jsx jsx
 */

import React, { useCallback, useMemo } from 'react';

import { useIntl } from 'react-intl';

import { cssMap, jsx } from '@atlaskit/css';
import { extractSmartLinkProvider } from '@atlaskit/link-extractors/extract-smart-link-provider';
import { fg } from '@atlaskit/platform-feature-flags/fg';
import { Box, Text } from '@atlaskit/primitives/compiled';
import { token } from '@atlaskit/tokens';

import extractRovoChatAction from '../../../../extractors/flexible/actions/extract-rovo-chat-action';
import { getExtensionKey } from '../../../../state/getExtensionKey';
import useInvokeClientAction from '../../../../state/hooks/use-invoke-client-action';
import type { RovoInteractionSource } from '../../../../state/hooks/use-invoke-client-action/types';
import useRovoChat from '../../../../state/hooks/use-rovo-chat';
import useRovoConfig from '../../../../state/hooks/use-rovo-config';
import { useSmartCardState } from '../../../../state/store';
import type { InternalCardActionOptions as CardActionOptions } from '../../../Card/types';
import { getPromptAction, RovoChatPromptKey } from '../../../common/rovo-chat-utils';
import { ActionButton } from '../action-button';
import { OneClickChatSpotlightLoader } from '../one-click-chat-spotlight/async';

const styles = cssMap({
	text: {
		paddingLeft: token('space.075'),
		display: 'inline-flex',
		alignItems: 'center',
		verticalAlign: 'middle',
		marginTop: token('space.negative.025'),
	},
});

// Keep the master implementation intact while the spotlight rollout is disabled.
export const InlineRovoActionButton = (props: {
	actionOptions?: CardActionOptions;
	testId?: string;
	url?: string;
}): JSX.Element | null =>
	fg('platform_sl_one_click_chat_spotlight_v2_fg') ? (
		<InlineRovoActionButtonWithSpotlight {...props} />
	) : (
		<InlineRovoActionButtonLegacy {...props} />
	);

const InlineRovoActionButtonLegacy = ({
	testId,
	url,
	actionOptions,
}: {
	actionOptions?: CardActionOptions;
	testId?: string;
	url?: string;
}): JSX.Element | null => {
	const { sendPromptMessage, isRovoChatEnabled } = useRovoChat();
	const intl = useIntl();
	const cardState = useSmartCardState(url ?? '');
	const extensionKey = getExtensionKey(cardState.details);
	const rovoConfig = useRovoConfig();

	const rovoChatAction = useMemo(() => {
		return (
			cardState.details &&
			extractRovoChatAction({ response: cardState.details, actionOptions, rovoConfig })
		);
	}, [cardState.details, rovoConfig, actionOptions]);

	const provider = useMemo(() => {
		return cardState.details && extractSmartLinkProvider(cardState.details);
	}, [cardState.details]);

	const invoke = useInvokeClientAction({});

	const promptKey = useMemo(() => {
		if (
			extensionKey === 'google-object-provider' &&
			cardState.details?.data?.['@type']?.includes('schema:SpreadsheetDigitalDocument')
		) {
			return;
		}

		switch (extensionKey) {
			case 'google-object-provider':
				if (cardState.details?.data?.['@type']?.includes('schema:PresentationDigitalDocument')) {
					return RovoChatPromptKey.SUMMARIZE_PRESENTATION;
				}
				return RovoChatPromptKey.SUMMARIZE_DOCUMENT;
			case 'onedrive-object-provider':
				return RovoChatPromptKey.SUMMARIZE_DOCUMENT;
			case 'github-object-provider':
			case 'gitlab-object-provider':
				return RovoChatPromptKey.EXPLAIN_CODE;
			case 'slack-object-provider':
			case 'ms-teams-object-provider':
				return RovoChatPromptKey.CATCH_UP;
			case 'salesforce-object-provider':
				return RovoChatPromptKey.SALESFORCE_PREP;
		}
	}, [extensionKey, cardState]);

	const {
		data: promptData,
		content,
		icon,
	} = promptKey
		? getPromptAction({
				promptKey,
				intl,
				url,
				iconSize: 'small',
				provider: provider?.text,
			}) || {}
		: {};

	const handleClick = useCallback(
		(event: React.MouseEvent<HTMLElement>) => {
			event.preventDefault();
			event.stopPropagation();

			if (isRovoChatEnabled && promptData && rovoChatAction?.invokeAction) {
				invoke({
					...rovoChatAction?.invokeAction,
					actionFn: async () => sendPromptMessage(promptData),
					prompt: promptKey,
				});
			}
		},
		[sendPromptMessage, isRovoChatEnabled, promptData, rovoChatAction, promptKey, invoke],
	);

	return promptData && content ? (
		<ActionButton onClick={handleClick} testId={testId}>
			{icon}
			<Box xcss={styles.text}>
				<Text size="small">{content}</Text>
			</Box>
		</ActionButton>
	) : null;
};

const InlineRovoActionButtonWithSpotlight = ({
	testId,
	url,
	actionOptions,
}: {
	actionOptions?: CardActionOptions;
	testId?: string;
	url?: string;
}): JSX.Element | null => {
	const { sendPromptMessage, isRovoChatEnabled } = useRovoChat();
	const intl = useIntl();
	const cardState = useSmartCardState(url ?? '');
	const extensionKey = getExtensionKey(cardState.details);
	const rovoConfig = useRovoConfig();

	const rovoChatAction = useMemo(() => {
		return (
			cardState.details &&
			extractRovoChatAction({ response: cardState.details, actionOptions, rovoConfig })
		);
	}, [cardState.details, rovoConfig, actionOptions]);

	const provider = useMemo(() => {
		return cardState.details && extractSmartLinkProvider(cardState.details);
	}, [cardState.details]);

	const invoke = useInvokeClientAction({});

	const promptKey = useMemo(() => {
		if (
			extensionKey === 'google-object-provider' &&
			cardState.details?.data?.['@type']?.includes('schema:SpreadsheetDigitalDocument')
		) {
			return;
		}

		switch (extensionKey) {
			case 'google-object-provider':
				if (cardState.details?.data?.['@type']?.includes('schema:PresentationDigitalDocument')) {
					return RovoChatPromptKey.SUMMARIZE_PRESENTATION;
				}
				return RovoChatPromptKey.SUMMARIZE_DOCUMENT;
			case 'onedrive-object-provider':
				return RovoChatPromptKey.SUMMARIZE_DOCUMENT;
			case 'github-object-provider':
			case 'gitlab-object-provider':
				return RovoChatPromptKey.EXPLAIN_CODE;
			case 'slack-object-provider':
			case 'ms-teams-object-provider':
				return RovoChatPromptKey.CATCH_UP;
			case 'salesforce-object-provider':
				return RovoChatPromptKey.SALESFORCE_PREP;
		}
	}, [extensionKey, cardState]);

	const {
		data: promptData,
		content,
		icon,
	} = promptKey
		? getPromptAction({
				promptKey,
				intl,
				url,
				iconSize: 'small',
				provider: provider?.text,
			}) || {}
		: {};

	const invokePrompt = useCallback(
		(interactionSource: RovoInteractionSource = 'inlineAction') => {
			if (isRovoChatEnabled && promptData && rovoChatAction?.invokeAction) {
				invoke({
					...rovoChatAction.invokeAction,
					interactionSource,
					actionFn: async () => sendPromptMessage(promptData),
					prompt: promptKey,
				});
			}
		},
		[sendPromptMessage, isRovoChatEnabled, promptData, rovoChatAction, promptKey, invoke],
	);

	const handleClick = useCallback(
		(event: React.MouseEvent<HTMLElement>) => {
			event.preventDefault();
			event.stopPropagation();
			invokePrompt();
		},
		[invokePrompt],
	);

	const button =
		promptData && content ? (
			<ActionButton onClick={handleClick} testId={testId}>
				{icon}
				<Box xcss={styles.text}>
					<Text size="small">{content}</Text>
				</Box>
			</ActionButton>
		) : null;

	return button && isRovoChatEnabled && rovoChatAction?.invokeAction ? (
		<OneClickChatSpotlightLoader
			key={url}
			url={url}
			actionOptions={actionOptions}
			onInvoke={() => invokePrompt('spotlightCta')}
		>
			{button}
		</OneClickChatSpotlightLoader>
	) : (
		button
	);
};
